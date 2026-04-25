import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns truly live games, excluding stale "inprogress" records
 * that haven't been synced in over 6 hours (likely finished).
 */
export const getLiveGames = query({
  args: {},
  handler: async (ctx) => {
    const allInProgress = await ctx.db
      .query("upcoming_games")
      .filter((q) => q.eq(q.field("status"), "inprogress"))
      .collect();

    // Staleness guard: exclude games synced >6 hours ago
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    return allInProgress.filter(
      (g) => !g.lastSyncedAt || g.lastSyncedAt > sixHoursAgo
    );
  },
});

/**
 * Returns upcoming/scheduled games with optional date and sport filters.
 * Only returns games that haven't started yet (status != closed/inprogress).
 */
export const getUpcomingGames = query({
  args: {
    limit: v.optional(v.number()),
    targetDate: v.optional(v.string()), // e.g. "2026-04-19"
    sportFilter: v.optional(v.string()), // e.g. "All", "MLB", "NBA"
  },
  handler: async (ctx, args) => {
    let games: any[] = [];

    // Prioritize querying by exact date range if provided
    if (args.targetDate) {
        // Assume US Eastern time for boundaries: adds 4 hours to UTC (roughly handles EST/EDT crossover)
        // e.g. "2026-04-19" -> >= "2026-04-19T04:00:00Z" and < "2026-04-20T04:00:00Z"
        const startBounds = args.targetDate + "T04:00:00";
        
        const nextDay = new Date(args.targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = nextDay.toISOString().split('T')[0] + "T04:00:00";

        let q = ctx.db.query("upcoming_games")
            .withIndex("by_startsAt", (q) => 
                q.gte("startsAt", startBounds).lt("startsAt", nextDayStr)
            );
        games = await q.order("asc").take(args.limit ?? 200);
        
        // Post-filter by sport
        if (args.sportFilter && args.sportFilter !== "All") {
            games = games.filter(g => g.sport === args.sportFilter);
        }
    } else {
        // If no date provided, query by sport or everything, ascending from now
        const nowStr = new Date().toISOString();
        if (args.sportFilter && args.sportFilter !== "All") {
            games = await ctx.db.query("upcoming_games")
                .withIndex("by_sport", (q) => q.eq("sport", args.sportFilter!))
                .filter(q => q.gte(q.field("startsAt"), nowStr))
                .take(args.limit ?? 200);
            
            // Re-sort ascending (Convex doesn't sort by anything but insertion order on by_sport index easily unless collected)
            games.sort((a: any, b: any) => a.startsAt.localeCompare(b.startsAt));
        } else {
            games = await ctx.db.query("upcoming_games")
                .withIndex("by_startsAt", (q) => q.gte("startsAt", nowStr))
                .order("asc")
                .take(args.limit ?? 200);
        }
    }

    return games;
  },
});

/**
 * Returns ALL games for a given date regardless of status.
 * Powers the Games Page / War Room list to show completed, live, and upcoming games.
 *
 * Uses a timezone-aware window: games stored in UTC by TheSportsDB/API-Sports
 * may be listed as the NEXT UTC day for ET evening games.
 * We capture a wide window: [targetDate-1 T04:00Z, targetDate+2 T04:00Z]
 * then post-filter to games whose local date (ET offset -4h) matches targetDate.
 */
export const getGamesForDate = query({
  args: {
    targetDate: v.string(), // e.g. "2026-04-24"
    sportFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Wide UTC window: capture games stored anywhere from day-before midnight to day+2 morning
    // This handles ET games that appear as next-day UTC
    const dayStart = args.targetDate + "T00:00:00Z"; // midnight UTC of the date
    const dayEnd   = args.targetDate + "T28:00:00Z"; // 28 hours later catches all ET games

    let games = await ctx.db.query("upcoming_games")
      .withIndex("by_startsAt", (q) =>
        q.gte("startsAt", dayStart).lt("startsAt", dayEnd)
      )
      .order("asc")
      .collect();

    // Post-filter by sport
    if (args.sportFilter && args.sportFilter !== "All") {
      games = games.filter((g: any) => g.sport === args.sportFilter);
    }

    return games;
  },
});

/**
 * Returns today's games for the homepage ticker — live, closed (with scores), and upcoming.
 * Also includes last night's finished games so the carousel always has content.
 *
 * Uses a wide UTC window to handle ET evening games stored as next-day UTC by APIs.
 */
export const getTodayGames = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    // Wide window: today 00:00Z through 28 hours later
    // Captures 8pm ET games stored as next-day UTC (00:00-03:59Z)
    const windowStart = todayStr + "T00:00:00Z";
    const windowEnd   = todayStr + "T28:00:00Z";

    return await ctx.db.query("upcoming_games")
      .withIndex("by_startsAt", (q) =>
        q.gte("startsAt", windowStart).lt("startsAt", windowEnd)
      )
      .order("asc")
      .collect();
  },
});


/**
 * Returns yesterday's closed games with final scores.
 * Used by the homepage carousel to show recent results.
 */
export const getYesterdayGames = query({
  args: {
    sportFilter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const ydStr = yesterday.toISOString().split("T")[0];

    const windowStart = ydStr + "T00:00:00Z";
    const windowEnd   = ydStr + "T28:00:00Z";

    let games = await ctx.db.query("upcoming_games")
      .withIndex("by_startsAt", (q) =>
        q.gte("startsAt", windowStart).lt("startsAt", windowEnd)
      )
      .order("asc")
      .collect();

    games = games.filter((g: any) => g.status === "closed");

    if (args.sportFilter && args.sportFilter !== "All") {
      games = games.filter((g: any) => g.sport === args.sportFilter);
    }

    return games;
  },
});

export const getHeadlinerGame = query({
  args: {},
  handler: async (ctx) => {
    // Try to find an active PrimeTime game first
    const primeTime = await ctx.db
      .query("upcoming_games")
      .filter((q) => q.eq(q.field("isPrimeTime"), true))
      .order("desc")
      .first();

    if (primeTime) return primeTime;

    // Fallback to any featured game
    return await ctx.db
      .query("upcoming_games")
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("desc")
      .first();
  },
});

/**
 * Scans all games and extracts a deduplicated list of teams grouped by sport.
 * Used by MyTeamsScreen to display logo tiles for team selection.
 * Teams are sourced from homeTeam/awayTeam logoUrl fields populated by Sportradar.
 */
export const getUniqueTeams = query({
  args: {},
  handler: async (ctx) => {
    // Pull recent games — last 500 covers all active teams across sports
    const games = await ctx.db
      .query("upcoming_games")
      .order("desc")
      .take(500);

    // Build deduplication structure: sport -> abbr -> team object
    const sportTeamMap: Record<string, Record<string, { name: string; abbr: string; logoUrl: string }>> = {};

    for (const game of games) {
      const sport = game.sport;
      if (!sport) continue;

      if (!sportTeamMap[sport]) {
        sportTeamMap[sport] = {};
      }

      const teamsToProcess = [game.homeTeam, game.awayTeam];
      for (const team of teamsToProcess) {
        if (!team?.abbr || !team?.logoUrl) continue;
        if (!sportTeamMap[sport][team.abbr]) {
          sportTeamMap[sport][team.abbr] = {
            name: team.name,
            abbr: team.abbr,
            logoUrl: team.logoUrl,
          };
        }
      }
    }

    // Fallback: If NFL is empty (off-season), populate it manually
    if (!sportTeamMap["NFL"] || Object.keys(sportTeamMap["NFL"]).length === 0) {
      sportTeamMap["NFL"] = {};
      const nflTeams = [
        { name: "Arizona Cardinals", abbr: "ARI" },
        { name: "Atlanta Falcons", abbr: "ATL" },
        { name: "Baltimore Ravens", abbr: "BAL" },
        { name: "Buffalo Bills", abbr: "BUF" },
        { name: "Carolina Panthers", abbr: "CAR" },
        { name: "Chicago Bears", abbr: "CHI" },
        { name: "Cincinnati Bengals", abbr: "CIN" },
        { name: "Cleveland Browns", abbr: "CLE" },
        { name: "Dallas Cowboys", abbr: "DAL" },
        { name: "Denver Broncos", abbr: "DEN" },
        { name: "Detroit Lions", abbr: "DET" },
        { name: "Green Bay Packers", abbr: "GB" },
        { name: "Houston Texans", abbr: "HOU" },
        { name: "Indianapolis Colts", abbr: "IND" },
        { name: "Jacksonville Jaguars", abbr: "JAX" },
        { name: "Kansas City Chiefs", abbr: "KC" },
        { name: "Las Vegas Raiders", abbr: "LV" },
        { name: "Los Angeles Chargers", abbr: "LAC" },
        { name: "Los Angeles Rams", abbr: "LAR" },
        { name: "Miami Dolphins", abbr: "MIA" },
        { name: "Minnesota Vikings", abbr: "MIN" },
        { name: "New England Patriots", abbr: "NE" },
        { name: "New Orleans Saints", abbr: "NO" },
        { name: "New York Giants", abbr: "NYG" },
        { name: "New York Jets", abbr: "NYJ" },
        { name: "Philadelphia Eagles", abbr: "PHI" },
        { name: "Pittsburgh Steelers", abbr: "PIT" },
        { name: "San Francisco 49ers", abbr: "SF" },
        { name: "Seattle Seahawks", abbr: "SEA" },
        { name: "Tampa Bay Buccaneers", abbr: "TB" },
        { name: "Tennessee Titans", abbr: "TEN" },
        { name: "Washington Commanders", abbr: "WAS" },
      ];
      
      for (const team of nflTeams) {
        sportTeamMap["NFL"][team.abbr] = {
          name: team.name,
          abbr: team.abbr,
          logoUrl: `https://a.espncdn.com/i/teamlogos/nfl/500/${team.abbr.toLowerCase()}.png`
        };
      }
    }

    // Convert to sorted array format
    const SPORT_ORDER = ["NBA", "NFL", "MLB", "NHL", "NCAAB", "NCAAF", "MLS", "SOCCER"];

    return Object.entries(sportTeamMap)
      .map(([sport, teamsRecord]) => ({
        sport,
        teams: Object.values(teamsRecord).sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }))
      .sort((a, b) => {
        const ai = SPORT_ORDER.indexOf(a.sport);
        const bi = SPORT_ORDER.indexOf(b.sport);
        if (ai === -1 && bi === -1) return a.sport.localeCompare(b.sport);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
  },
});

