import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const placeOrder = mutation({
  args: {
    items: v.array(v.any()),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Calculate points: 1 point per $1 of subtotal
    const pointsAwarded = Math.floor(args.subtotal);

    // Save order
    const orderId = await ctx.db.insert("orders", {
      userId,
      items: args.items,
      subtotal: args.subtotal,
      tax: args.tax,
      total: args.total,
      pointsAwarded,
      status: "completed",
      createdAt: new Date().toISOString(),
    });

    // Update user points
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (profile) {
      await ctx.db.patch(profile._id, {
        points: profile.points + pointsAwarded,
        lifetimePoints: profile.lifetimePoints + pointsAwarded,
        lastPointsUpdate: new Date().toISOString(),
      });
    } else {
      await ctx.db.insert("user_profiles", {
        userId,
        points: pointsAwarded,
        lifetimePoints: pointsAwarded,
        lastPointsUpdate: new Date().toISOString(),
      });
    }

    // Log the transaction
    await ctx.db.insert("points_ledger", {
      userId,
      points: pointsAwarded,
      type: "earned",
      reason: `Order #${orderId.substring(0, 8)}`,
      orderId,
      createdAt: new Date().toISOString(),
    });

    return { success: true, orderId, pointsAwarded };
  },
});

export const getOrderHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});
