import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Purges games older than N days to reduce storage and get under free plan limits.
 * Only deletes games with status "closed" (completed) that are more than 3 days old.
 */
export const purgeOldGames = mutation({
  args: { daysOld: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysOld = args.daysOld ?? 3;
    const cutoffMs = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    const cutoffIso = new Date(cutoffMs).toISOString();

    // Get all old closed games
    const oldGames = await ctx.db
      .query("upcoming_games")
      .withIndex("by_startsAt", (q) => q.lt("startsAt", cutoffIso))
      .collect();

    // Only delete closed/final games, keep scheduled/in-progress
    const toDelete = oldGames.filter(
      (g: any) => g.status === "closed" || g.status === "final" || g.status === "complete"
    );

    for (const game of toDelete) {
      await ctx.db.delete(game._id);
    }

    return {
      scanned: oldGames.length,
      deleted: toDelete.length,
      cutoffDate: cutoffIso,
    };
  },
});

/**
 * Count total games in the DB to understand storage usage.
 */
export const countGames = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("upcoming_games").collect();
    const byStatus = all.reduce((acc: Record<string, number>, g: any) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    }, {});
    return { total: all.length, byStatus };
  },
});
