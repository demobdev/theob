import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

export const getSportsAdminOverview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const games = await ctx.db.query("upcoming_games").collect();
    
    // Simple health check: if we have games and none are more than 2 days old, it's healthy
    const recentGame = games.find(g => new Date(g.startsAt) > new Date());
    
    return {
      games: games.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).slice(0, 50),
      syncHealth: recentGame ? "healthy" : "stale",
      lastSync: new Date().toISOString() // In a real app, store this in a 'system_state' table
    };
  },
});



export const overrideHeadliner = mutation({
  args: { gameId: v.id("upcoming_games"), isPrimeTime: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const targetGame = await ctx.db.get(args.gameId);
    if (!targetGame) throw new Error("Game not found");

    // If setting a new primetime, clear existing ones for the SAME SPORT and SAME DAY
    // to ensure unique headliner per sport/day combo if desired, or just let them stack.
    // For now, let's just make it day-specific.
    if (args.isPrimeTime) {
      const dayStart = targetGame.startsAt.split('T')[0];
      const existing = await ctx.db
        .query("upcoming_games")
        .withIndex("by_startsAt", (q) => q.gte("startsAt", `${dayStart}T00:00:00Z`).lte("startsAt", `${dayStart}T23:59:59Z`))
        .filter((q) => q.eq(q.field("isPrimeTime"), true))
        .collect();
      
      for (const game of existing) {
        // Only clear if same sport (optional - user can decide if they want multiple sports in carousel)
        // Let's clear if same sport to keep one "Headliner" per sport per day.
        if (game.sport === targetGame.sport) {
            await ctx.db.patch(game._id, { isPrimeTime: false });
        }
      }
    }

    await ctx.db.patch(args.gameId, { isPrimeTime: args.isPrimeTime });
    return { success: true };
  },
});

export const toggleFeatured = mutation({
  args: { gameId: v.id("upcoming_games"), isFeatured: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.gameId, { isFeatured: args.isFeatured });
    return { success: true };
  },
});

export const updateGameEditorial = mutation({
  args: { 
    gameId: v.id("upcoming_games"), 
    tvZone: v.optional(v.string()),
    editorialNote: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.gameId, { 
      tvZone: args.tvZone,
      editorialNote: args.editorialNote
    });
    return { success: true };
  },
});
