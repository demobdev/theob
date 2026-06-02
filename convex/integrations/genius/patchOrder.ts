import { internalMutation } from "../../_generated/server";
import { v } from "convex/values";

export const recordPosSync = internalMutation({
  args: {
    orderId: v.id("orders"),
    posOrderId: v.optional(v.string()),
    posStatus: v.optional(v.string()),
    posSyncError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, string> = {
      posLastSyncedAt: new Date().toISOString(),
    };
    if (args.posOrderId !== undefined) patch.posOrderId = args.posOrderId;
    if (args.posStatus !== undefined) patch.posStatus = args.posStatus;
    if (args.posSyncError !== undefined) patch.posSyncError = args.posSyncError;
    await ctx.db.patch(args.orderId, patch);
  },
});
