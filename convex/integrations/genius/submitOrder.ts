import { internalAction } from "../../_generated/server";
import { v } from "convex/values";
import { internal } from "../../_generated/api";
import { mapConvexOrderToGeniusPayload } from "./mapOrder";

/**
 * Submits an OB order to Genius/Xenial POS.
 * Until integrator credentials exist, logs payload and records sync state for admin.
 */
export const submitToPos = internalAction({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.runQuery(internal.integrations.genius.queries.getOrder, {
      orderId,
    });
    if (!order) {
      await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
        orderId,
        posSyncError: "Order not found",
      });
      return;
    }

    const payload = mapConvexOrderToGeniusPayload(order);
    if (!payload) {
      await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
        orderId,
        posSyncError: "Order is not a Greenville pickup type (use partner apps for delivery)",
      });
      return;
    }

    const baseUrl = process.env.GENIUS_API_BASE_URL;
    const token = process.env.GENIUS_INTEGRATOR_TOKEN;

    if (!baseUrl || !token) {
      console.log("[Genius POS stub] Would submit order:", JSON.stringify(payload, null, 2));
      await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
        orderId,
        posOrderId: `stub-${orderId}`,
        posStatus: "stub_pending",
        posSyncError:
          "GENIUS_API_BASE_URL and GENIUS_INTEGRATOR_TOKEN not set — mock sync only",
      });
      return;
    }

    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
          orderId,
          posSyncError: `Genius HTTP ${res.status}: ${text.slice(0, 500)}`,
        });
        return;
      }

      const body = (await res.json()) as { id?: string; status?: string };
      await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
        orderId,
        posOrderId: body.id ?? `genius-${orderId}`,
        posStatus: body.status ?? "submitted",
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      await ctx.runMutation(internal.integrations.genius.patchOrder.recordPosSync, {
        orderId,
        posSyncError: message,
      });
    }
  },
});
