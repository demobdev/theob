import { action } from "./_generated/server";
import { api } from "./_generated/api";
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
