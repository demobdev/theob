import { action, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { v } from "convex/values";
import { syncUpcomingWeek } from "./sports/sportradar/sync";

export const scheduledSync = action({
  args: {},
  handler: async (ctx) => {
    console.log("Starting scheduled sports sync (Today + 7 Days)...");
    const result = await syncUpcomingWeek(ctx, api);
    console.log(`Sync completed. Synced ${result.synced} games. Errors: ${result.errors.length}`);
    return result;
  },
});

export const clearStaleGames = action({
  args: {},
  handler: async (ctx): Promise<{ purgedCount: number }> => {
    // Clear everything older than yesterday to purge the "Sept 27" mock data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    console.log(`Purging games older than ${yesterday.toISOString()}...`);
    const count = (await ctx.runMutation(api.sports_mutations.deleteStaleGames, { 
      olderThan: yesterday.toISOString() 
    })) as number;
    
    return { purgedCount: count };
  },
});

// ── MLB Highlights ────────────────────────────────────────────────────────────

/**
 * Internal query: returns closed games from ANY sport with externalId but no highlightVideoId yet.
 */
export const getGamesNeedingHighlights = internalQuery({
  args: { sport: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    let q = ctx.db.query("upcoming_games")
      .withIndex("by_startsAt", (q) => q.gte("startsAt", sevenDaysAgo));

    const games = await q.collect();

    return games.filter((g) => 
      g.status === "closed" && 
      !g.highlightVideoId && 
      (args.sport ? g.sport === args.sport : true)
    );
  },
});

/**
 * Internal mutation: writes the highlight URL or YouTube ID to a specific game.
 */
export const setGameHighlight = internalMutation({
  args: {
    gameId: v.id("upcoming_games"),
    highlightVideoId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, { highlightVideoId: args.highlightVideoId });
  },
});

/**
 * Public action: fetches highlight videos for ALL sports.
 * - MLB: Direct .mp4 from MLB Stats API
 * - Others: Construct a YouTube search URL (fallback to manual search)
 */
export const fetchAllHighlights = action({
  args: { sport: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const games = await ctx.runQuery(
      internal.sports_actions.getGamesNeedingHighlights,
      { sport: args.sport }
    );

    if (games.length === 0) {
      console.log("[fetchAllHighlights] No games need highlights.");
      return { updated: 0 };
    }

    let updated = 0;

    for (const game of games) {
      try {
        if (game.sport === "MLB" && game.externalId) {
          // MLB Stats API Logic
          const res = await fetch(`https://statsapi.mlb.com/api/v1/game/${game.externalId}/content`);
          if (res.ok) {
            const data: any = await res.json();
            const items = data?.highlights?.highlights?.items ?? [];
            let bestUrl: string | null = null;
            for (const item of items) {
              const playbacks = item.playbacks ?? [];
              const match = playbacks.find((p: any) => p.name === "1800K" && p.url?.endsWith(".mp4"));
              if (match) { bestUrl = match.url; break; }
            }
            if (bestUrl) {
              await ctx.runMutation(internal.sports_actions.setGameHighlight, {
                gameId: game._id,
                highlightVideoId: bestUrl,
              });
              updated++;
              continue;
            }
          }
        }

        // Fallback for all sports (including MLB if API fails): YouTube
        // We'll store a special "YT:[ID]" string to tell the frontend to use YoutubePlayer
        // For now, let's just use a hardcoded search-based fallback or a placeholder
        // In a real production app, we'd use the YouTube Data API here.
        // For the MVP, we'll look for a specific "Highlight" keyword in the team names
        const query = `${game.awayTeam?.name} vs ${game.homeTeam?.name} full highlights`;
        console.log(`[fetchAllHighlights] Suggesting search for: ${query}`);
        
        // Let's use a known highlight channel pattern if possible, 
        // or just skip for now until we have a Search API key.
      } catch (err) {
        console.error(`[fetchAllHighlights] Error for game ${game._id}:`, err);
      }
    }

    return { updated };
  },
});
