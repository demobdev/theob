import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Helper to get the local date string (YYYY-MM-DD) for a given UTC ISO string and timezone.
 * Defaults to Eastern Time (America/New_York).
 */
function getLocalDateString(utcString: string, timeZone: string = 'America/New_York') {
  const date = new Date(utcString);
  try {
    const parts = new Intl.DateTimeFormat('en-US', { 
      timeZone, 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  } catch (e) {
    // Fallback to ET if timezone is invalid
    const parts = new Intl.DateTimeFormat('en-US', { 
      timeZone: 'America/New_York', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).formatToParts(date);
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  }
}

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
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let games: any[] = [];

    // Prioritize querying by exact date range if provided
    if (args.targetDate) {
        // Query a wide UTC window (-1 day to +2 days) to guarantee we catch the local day
        const targetDateObj = new Date(args.targetDate + "T12:00:00Z"); // Noon UTC
        const startWindow = new Date(targetDateObj.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const endWindow = new Date(targetDateObj.getTime() + 48 * 60 * 60 * 1000).toISOString();

        let q = ctx.db.query("upcoming_games")
            .withIndex("by_startsAt", (q) => 
                q.gte("startsAt", startWindow).lt("startsAt", endWindow)
            );
        const wideGames = await q.order("asc").collect();
        
        // Post-filter to exact Local Date
        games = wideGames.filter(g => getLocalDateString(g.startsAt, args.timezone) === args.targetDate);
        
        // Post-filter by sport
        if (args.sportFilter && args.sportFilter !== "All") {
            games = games.filter(g => g.sport === args.sportFilter);
        }
        
        // Limit
        games = games.slice(0, args.limit ?? 200);
    } else {
        // If no date provided, query by sport or everything, ascending from now
        const nowStr = new Date().toISOString();
        if (args.sportFilter && args.sportFilter !== "All") {
            games = await ctx.db.query("upcoming_games")
                .withIndex("by_sport", (q) => q.eq("sport", args.sportFilter!))
                .filter(q => q.gte(q.field("startsAt"), nowStr))
                .take(args.limit ?? 200);
            
            // Re-sort ascending
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
 */
export const getGamesForDate = query({
  args: {
    targetDate: v.string(), // e.g. "2026-04-24"
    startUtc: v.optional(v.string()), // e.g. "2026-04-24T07:00:00.000Z" (local midnight in UTC)
    endUtc: v.optional(v.string()),
    sportFilter: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let games: any[] = [];
    
    if (args.startUtc && args.endUtc) {
      // 1. Client-Side Windowing (Timezone-Aware Bounds)
      games = await ctx.db.query("upcoming_games")
        .withIndex("by_startsAt", (q) =>
          q.gte("startsAt", args.startUtc!).lt("startsAt", args.endUtc!)
        )
        .order("asc")
        .collect();
        
      // Secondary filter to ensure no boundary leaks if the UTC window was slightly off
      games = games.filter(g => getLocalDateString(g.startsAt, args.timezone) === args.targetDate);
    } else {
      // 2. Server-Side Windowing
      const targetDateObj = new Date(args.targetDate + "T12:00:00Z");
      const windowStart = new Date(targetDateObj.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const windowEnd = new Date(targetDateObj.getTime() + 48 * 60 * 60 * 1000).toISOString();
  
      games = await ctx.db.query("upcoming_games")
        .withIndex("by_startsAt", (q) =>
          q.gte("startsAt", windowStart).lt("startsAt", windowEnd)
        )
        .order("asc")
        .collect();
  
      games = games.filter((g: any) => getLocalDateString(g.startsAt, args.timezone) === args.targetDate);
    }

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
 */
export const getTodayGames = query({
  args: {
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tz = args.timezone || 'America/New_York';
    const todayStr = getLocalDateString(new Date().toISOString(), tz);
    
    // Query a wide window to catch today's games in the target timezone
    const now = new Date();
    const startWindow = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const endWindow = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

    const games = await ctx.db
      .query("upcoming_games")
      .withIndex("by_startsAt", (q) =>
        q.gte("startsAt", startWindow).lt("startsAt", endWindow)
      )
      .order("asc")
      .collect();

    // Post-filter to the exact local day
    return games.filter((g) => getLocalDateString(g.startsAt, tz) === todayStr);
  },
});


/**
 * Returns yesterday's closed games with final scores.
 * Used by the homepage carousel to show recent results.
 */
export const getYesterdayGames = query({
  args: {
    sportFilter: v.optional(v.string()),
    timezone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tz = args.timezone ?? 'America/New_York';
    const now = new Date();
    // Calculate "yesterday" in local time by subtracting 24h
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const ydStr = getLocalDateString(yesterday.toISOString(), tz);

    const targetDateObj = new Date(ydStr + "T12:00:00Z");
    const windowStart = new Date(targetDateObj.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const windowEnd = new Date(targetDateObj.getTime() + 48 * 60 * 60 * 1000).toISOString();

    let games = await ctx.db.query("upcoming_games")
      .withIndex("by_startsAt", (q) =>
        q.gte("startsAt", windowStart).lt("startsAt", windowEnd)
      )
      .order("asc")
      .collect();

    // Strict local post-filter and closed check
    games = games.filter((g: any) => g.status === "closed" && getLocalDateString(g.startsAt, tz) === ydStr);

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

