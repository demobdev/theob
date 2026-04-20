import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

// Fetch current points and profile
export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

// Ensure user profile exists
export const ensureUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) return existing;

    const profileId = await ctx.db.insert("user_profiles", {
      userId,
      points: 0,
      lifetimePoints: 0,
      lastPointsUpdate: new Date().toISOString(),
    });

    return await ctx.db.get(profileId);
  },
});

// Fetch point transaction history
export const getPointsHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("points_ledger")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 20);
  },
});

// Fetch active reward definitions
export const getRewardDefinitions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("reward_definitions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Redeem points for a reward
export const redeemReward = mutation({
  args: { rewardId: v.id("reward_definitions") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const reward = await ctx.db.get(args.rewardId);
    if (!reward) throw new Error("Reward not found");

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile || profile.points < reward.pointsCost) {
      throw new Error("Insufficient points");
    }

    // Deduct points
    await ctx.db.patch(profile._id, {
      points: profile.points - reward.pointsCost,
      lastPointsUpdate: new Date().toISOString(),
    });

    // Log the transaction
    await ctx.db.insert("points_ledger", {
      userId,
      points: -reward.pointsCost,
      type: "redeemed",
      reason: `Redeemed: ${reward.title}`,
      createdAt: new Date().toISOString(),
    });

    return { success: true, newBalance: profile.points - reward.pointsCost };
  },
});
