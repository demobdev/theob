import { mutation, query } from "./_generated/server";
console.log("LOYALTY MODULE LOADED");
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

// Submit a receipt for manual approval
export const submitReceipt = mutation({
  args: {
    imageUrl: v.string(),
    amount: v.number(),
    receiptDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const submissionId = await ctx.db.insert("receipt_submissions", {
      userId,
      imageUrl: args.imageUrl,
      amount: args.amount,
      receiptDate: args.receiptDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return { success: true, submissionId };
  },
});

// Sync full user profile details (called from Account or Login)
export const syncUserProfile = mutation({
  args: {
    phone: v.optional(v.string()),
    birthMonth: v.optional(v.string()),
    birthDay: v.optional(v.string()),
    smsConsent: v.optional(v.boolean()),
    marketingOptIn: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return { success: false, error: "NOT_AUTHENTICATED" };

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      phone: args.phone,
      birthMonth: args.birthMonth,
      birthDay: args.birthDay,
      smsConsent: args.smsConsent,
      marketingOptIn: args.marketingOptIn,
    });

    return { success: true };
  },
});

// Specific mutation for curbside vehicle persistence
export const updateUserVehicle = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      vehicle: {
        make: args.make,
        model: args.model,
        color: args.color,
      },
    });

    return { success: true };
  },
});

// Logic to grant points on birthday (once per year)
export const checkBirthdayReward = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return { success: false, reason: "No user" };

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!profile || !profile.birthMonth || !profile.birthDay) {
      return { success: false, reason: "Incomplete profile" };
    }

    const today = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = months[today.getMonth()];
    const currentDay = today.getDate().toString();
    const currentYear = today.getFullYear();

    // Check if it's their birthday today
    if (profile.birthMonth === currentMonth && profile.birthDay === currentDay) {
      // Ensure we haven't already granted it this year
      if (profile.lastBirthdayRewardYear !== currentYear) {
        const rewardPoints = 150; // Enough for a Tier 2 staple

        await ctx.db.patch(profile._id, {
          points: profile.points + rewardPoints,
          lifetimePoints: (profile.lifetimePoints || 0) + rewardPoints,
          lastBirthdayRewardYear: currentYear,
          lastPointsUpdate: today.toISOString(),
        });

        // Log it
        await ctx.db.insert("points_ledger", {
          userId,
          points: rewardPoints,
          type: "earning",
          reason: `Happy Birthday! Bonus points granted for ${currentYear}.`,
          createdAt: today.toISOString(),
        });

        return { success: true, pointsAwarded: rewardPoints };
      }
    }

    return { success: false, reason: "Not birthday or already granted" };
  },
});

// Fetch all available rewards and special promos for the cart
export const getAvailableRewards = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    
    // Base Promo: Owner's Wings (Always show for now, or check first order)
    const basePromos = [
      {
        _id: "promo_wings",
        title: "FREE OWNER'S WINGS",
        description: "CLAIM ON YOUR FIRST PURCHASE",
        rewardType: "free_item",
        category: "Promos",
        pointsCost: 0,
        image: "jumbo_wings",
        isPromo: true,
        unlocked: true,
      }
    ];

    if (!userId) return basePromos;

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    const points = profile?.points || 0;

    const definitions = await ctx.db
      .query("reward_definitions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const userRewards = definitions.map(d => ({
      ...d,
      unlocked: points >= d.pointsCost,
      isPromo: false
    }));

    return [...basePromos, ...userRewards];
  },
});
