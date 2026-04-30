import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("store_settings").first();
    if (!settings) {
      // Return defaults if not seeded yet
      return {
        status: "open",
        currentWaitTimeMinutes: 15,
        emergencyStop: false,
        lastUpdated: new Date().toISOString(),
      };
    }
    return settings;
  },
});

export const updateSettings = mutation({
  args: {
    status: v.optional(v.string()),
    currentWaitTimeMinutes: v.optional(v.number()),
    emergencyStop: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const settings = await ctx.db.query("store_settings").first();
    const update = {
      ...args,
      lastUpdated: new Date().toISOString(),
    };

    if (!settings) {
      await ctx.db.insert("store_settings", {
        status: "open",
        currentWaitTimeMinutes: 15,
        emergencyStop: false,
        ...update,
      });
    } else {
      await ctx.db.patch(settings._id, update);
    }
    
    return { success: true };
  },
});
