import { internalQuery } from "../../_generated/server";
import { v } from "convex/values";

export const getOrder = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    return await ctx.db.get(orderId);
  },
});
