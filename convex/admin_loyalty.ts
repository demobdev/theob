import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

// --- RECEIPT MODERATION ---

export const getPendingReceipts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("receipt_submissions")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();
  },
});

export const approveReceipt = mutation({
  args: { 
    submissionId: v.id("receipt_submissions"),
    pointsToAward: v.number()
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");
    if (submission.status !== "pending") throw new Error("Already processed");

    // 1. Update submission status
    await ctx.db.patch(args.submissionId, {
      status: "approved",
      pointsAwarded: args.pointsToAward,
      processedAt: new Date().toISOString()
    });

    // 2. Add points to user profile
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", submission.userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        points: (profile.points || 0) + args.pointsToAward,
        lifetimePoints: (profile.lifetimePoints || 0) + args.pointsToAward,
        lastPointsUpdate: new Date().toISOString()
      });

      // 3. Log to ledger
      await ctx.db.insert("points_ledger", {
        userId: submission.userId,
        points: args.pointsToAward,
        type: "earned",
        reason: `Receipt Approved: $${submission.amount}`,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true };
  },
});

export const rejectReceipt = mutation({
  args: { 
    submissionId: v.id("receipt_submissions"),
    reason: v.string()
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) throw new Error("Submission not found");

    await ctx.db.patch(args.submissionId, {
      status: "rejected",
      rejectionReason: args.reason,
      processedAt: new Date().toISOString()
    });

    return { success: true };
  },
});

// --- MEMBER MANAGEMENT ---

export const searchMembers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    
    // In a production app, we would search by phone/email/name.
    // For now, we'll fetch all and filter client-side or use a simple prefix match if indexed.
    const all = await ctx.db.query("user_profiles").collect();
    
    if (!args.searchTerm) return all.slice(0, 50);

    const term = args.searchTerm.toLowerCase();
    return all.filter(p => 
      p.userId.toLowerCase().includes(term) || 
      (p.phone && p.phone.includes(term))
    ).slice(0, 50);
  },
});

export const adjustPoints = mutation({
  args: {
    userId: v.string(),
    points: v.number(),
    reason: v.string()
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, {
      points: (profile.points || 0) + args.points,
      lifetimePoints: (profile.lifetimePoints || 0) + (args.points > 0 ? args.points : 0),
      lastPointsUpdate: new Date().toISOString()
    });

    await ctx.db.insert("points_ledger", {
      userId: args.userId,
      points: args.points,
      type: args.points > 0 ? "bonus" : "adjustment",
      reason: args.reason,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  },
});

// --- REWARD DEFINITIONS ---

export const updateReward = mutation({
  args: {
    rewardId: v.id("reward_definitions"),
    updates: v.any()
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.rewardId, args.updates);
    return { success: true };
  },
});
