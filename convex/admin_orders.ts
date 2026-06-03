import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { requireAdmin } from "./lib/requireAdmin";

export const getLiveOrders = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    
    // Fetch orders from the last 24 hours
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    
    return await ctx.db
      .query("orders")
      .filter((q) => q.gte(q.field("_creationTime"), new Date(yesterday).getTime()))
      .order("desc")
      .collect();
  },
});

export const updateOrderStatus = mutation({
  args: { orderId: v.id("orders"), status: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    const previousStatus = order.status;
    await ctx.db.patch(args.orderId, { status: args.status });

    if (
      args.status === "ready" &&
      previousStatus !== "ready" &&
      order.userId
    ) {
      await ctx.scheduler.runAfter(
        0,
        internal.pushNotifications.sendOrderReadyPush,
        { userId: order.userId, orderId: args.orderId },
      );
    }

    return { success: true };
  },
});
