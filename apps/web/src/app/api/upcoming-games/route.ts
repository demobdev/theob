import { NextRequest, NextResponse } from "next/server";
import { SportKey, GamesApiResponse, UpcomingGame } from "../../../lib/sports/types";
import { sportradarFetch } from "../../../lib/sports/sportradar/client";
import { normalizeGame, normalizeGolfTournament } from "../../../lib/sports/sportradar/normalize";

const ACCESS_LEVEL = process.env.SPORTRADAR_ACCESS_LEVEL || "trial";

/**
 * Resolves Sportradar daily schedule endpoints.
 * Example MLB: /mlb/trial/v7/en/games/2024/04/16/schedule.json
 */
function getDailyScheduleEndpoint(sport: SportKey, date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  
  const vMap: Record<string, string> = {
    MLB: "v7",
    NBA: "v8",
    NHL: "v7",
    NFL: "v7",
  };
  
  const version = vMap[sport] || "v7";
  const league = sport.toLowerCase();
  
  return `/${league}/${ACCESS_LEVEL}/${version}/en/games/${y}/${m}/${d}/schedule.json`;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const dateBucket = searchParams.get("dateBucket") ?? "today";
    const sport = (searchParams.get("sport") ?? "ALL") as SportKey | "ALL";
    const team = searchParams.get("team");
    
    // 1. Resolve target date
    let targetDate = new Date();
    if (dateBucket === "tomorrow") {
      targetDate.setDate(targetDate.getDate() + 1);
    } else if (dateBucket !== "today" && dateBucket.includes("-")) {
      targetDate = new Date(dateBucket + "T12:00:00"); // noon UTC to avoid timezone shifts
    }

    // 2. Handle Golf separately — it's a season schedule of tournaments, not daily games
    if (sport === "GOLF") {
      const year = targetDate.getFullYear();
      // Correct Sportradar Golf v3 endpoint: /golf/{access_level}/v3/en/{tour}/{year}/schedule.json
      // The response wraps data as: { tour: { season: { tournament: [...] } } }
      const GOLF_TOURS = ["pga"]; // could also add: dpw, lpga, champions
      const allTournaments: UpcomingGame[] = [];

      for (const tour of GOLF_TOURS) {
        try {
          const golfData = await sportradarFetch<any>(
            `/golf/${ACCESS_LEVEL}/v3/en/tours/${tour}/${year}/schedule.json`,
            "GOLF"
          );
          // Real schema: golfData.tour.season.tournament[]
          const rawTournaments = golfData?.tour?.season?.tournament ?? 
                                 golfData?.season?.tournament ??          // fallback shape
                                 golfData?.tournaments ?? [];             // another fallback

          const normalized = rawTournaments
            .map((t: any) => normalizeGolfTournament(t))
            .filter((t: UpcomingGame) => {
              if (!t.startsAt) return false;
              const start = new Date(t.startsAt);
              const rangeStart = new Date(targetDate.getTime() - 7 * 24 * 60 * 60 * 1000);
              const rangeEnd = new Date(targetDate.getTime() + 14 * 24 * 60 * 60 * 1000);
              return start >= rangeStart && start <= rangeEnd;
            });

          allTournaments.push(...normalized);
        } catch (err) {
          console.error(`Golf (${tour}) fetch failed:`, err);
        }
      }

      return NextResponse.json({
        filters: { dateBucket, sport, team: null },
        featured: allTournaments.slice(0, 1).map(t => ({ ...t, isFeatured: true, editorialNote: "Featured Tournament" })),
        games: allTournaments.slice(1),
      } as GamesApiResponse);
    }

    // 3. Determine which sports to fetch for non-Golf requests
    const sportsToFetch: SportKey[] = sport === "ALL" 
      ? ["MLB", "NHL", "NBA"] 
      : [sport as SportKey];

    let allNormalizedGames: UpcomingGame[] = [];

    // 4. Fetch and normalize team sports
    for (const s of sportsToFetch) {
      if (s === "GOLF" || s === "NFL") continue; 
      
      const endpoint = getDailyScheduleEndpoint(s, targetDate);
      const data = await sportradarFetch<any>(endpoint, s);
      
      if (data && data.games) {
        const normalized = data.games.map((g: any) => normalizeGame(g, s, s));
        allNormalizedGames = [...allNormalizedGames, ...normalized];
      }
    }

    // 5. Post-process (Filter, Sort, Feature)
    const now = new Date();
    let filteredGames = allNormalizedGames.filter(g => {
      const startTime = new Date(g.startsAt);
      return startTime > new Date(now.getTime() - 4 * 60 * 60 * 1000);
    });

    if (team) {
      filteredGames = filteredGames.filter(g => 
        g.homeTeam?.id === team || g.awayTeam?.id === team ||
        g.homeTeam?.name.toLowerCase().includes(team.toLowerCase()) ||
        g.awayTeam?.name.toLowerCase().includes(team.toLowerCase())
      );
    }

    filteredGames.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    // 5b. Smart featured selection:
    //   - ALL live/inprogress games get featured cards
    //   - Then: best upcoming game per sport (first by time), up to 8 total
    const liveGames = filteredGames.filter(g => g.status === "inprogress");
    const finalGames = filteredGames.filter(g => g.status === "closed");
    const upcomingGames = filteredGames.filter(g => g.status === "scheduled");

    // Pick the first upcoming game per sport
    const seenSports = new Set<string>();
    const bestPerSport: UpcomingGame[] = [];
    for (const g of upcomingGames) {
      if (!seenSports.has(g.sport)) {
        seenSports.add(g.sport);
        bestPerSport.push(g);
      }
    }

    // Featured = live first, then best-per-sport upcoming, then recent finals, cap at 8
    const featuredPool = [...liveGames, ...bestPerSport, ...finalGames].slice(0, 8);

    const editorialLabels: Record<number, string> = {
      0: "Primetime Matchup",
      1: "Don't Miss",
      2: "Tonight's Action",
      3: "On The Board",
    };

    const featured = featuredPool.map((g, idx) => ({
      ...g,
      isFeatured: true,
      featuredRank: idx + 1,
      editorialNote: g.status === "inprogress" ? "🔴 Live Now" : g.status === "closed" ? "Final Score" : editorialLabels[idx] ?? "Upcoming",
    }));

    // Remaining = everything NOT in featured
    const featuredIds = new Set(featured.map(g => g.externalId));
    const remaining = filteredGames.filter(g => !featuredIds.has(g.externalId));

    const response: GamesApiResponse = {
      filters: { dateBucket, sport, team: team || null },
      featured,
      games: remaining
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching upcoming games", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming games" },
      { status: 500 }
    );
  }
}
