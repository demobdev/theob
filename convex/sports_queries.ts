import { query } from "./_generated/server";
import { v } from "convex/values";

export const getLiveGames = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("upcoming_games")
      .filter((q) => q.eq(q.field("status"), "inprogress"))
      .collect();
  },
});

export const getUpcomingGames = query({
  args: {
    limit: v.optional(v.number()),
    targetDate: v.optional(v.string()), // e.g. "2026-04-19"
    sportFilter: v.optional(v.string()), // e.g. "All", "MLB", "NBA"
  },
  handler: async (ctx, args) => {
    let games = [];

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
            games.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
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
