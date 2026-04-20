import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Recursively clean undefined values out of the nested object to satisfy Convex schema types
function cleanUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        cleaned[key] = cleanUndefined(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

export const upsertGames = mutation({
  args: {
    games: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    let upsertedCount = 0;
    
    for (const rawGame of args.games) {
      // Find existing game by externalId
      const existing = await ctx.db
        .query("upcoming_games")
        .withIndex("by_externalId", (q) => q.eq("externalId", rawGame.externalId))
        .first();

      const game = cleanUndefined(rawGame);
      if (game.id) delete game.id;

      if (existing) {
        await ctx.db.patch(existing._id, game);
      } else {
        await ctx.db.insert("upcoming_games", game);
      }
      upsertedCount++;
    }
    
    return upsertedCount;
  },
});
export const deleteStaleGames = mutation({
  args: {
    olderThan: v.string(), // ISO string
  },
  handler: async (ctx, args) => {
    const staleGames = await ctx.db
      .query("upcoming_games")
      .withIndex("by_startsAt", (q) => q.lt("startsAt", args.olderThan))
      .collect();
    
    for (const game of staleGames) {
      await ctx.db.delete(game._id);
    }
    
    return staleGames.length;
  },
});
