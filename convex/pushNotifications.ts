import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getUserId } from "./loyalty";
import type { Doc } from "./_generated/dataModel";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

type ExpoPushResult = { ok: boolean; tickets?: unknown; error?: string };
type SendPushResult = {
  sent: number;
  skipped?: string;
  ok?: boolean;
  tickets?: unknown;
  error?: string;
};

/** Optional Convex env: EXPO_ACCESS_TOKEN — improves rate limits; not required for dev. */

export const registerPushToken = mutation({
  args: {
    token: v.string(),
    platform: v.union(v.literal("ios"), v.literal("android")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("push_tokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        userId,
        platform: args.platform,
        updatedAt: now,
      });
      return { success: true, tokenId: existing._id };
    }

    const tokenId = await ctx.db.insert("push_tokens", {
      userId,
      token: args.token,
      platform: args.platform,
      updatedAt: now,
    });
    return { success: true, tokenId };
  },
});

export const removePushToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return { success: false, error: "NOT_AUTHENTICATED" };

    const existing = await ctx.db
      .query("push_tokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (existing && existing.userId === userId) {
      await ctx.db.delete(existing._id);
    }
    return { success: true };
  },
});

export const getTokensForUser = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("push_tokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(20);
  },
});

export const getMarketingOptIn = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    return profile?.marketingOptIn ?? false;
  },
});

export const sendExpoPush = internalAction({
  args: {
    messages: v.array(
      v.object({
        to: v.string(),
        title: v.string(),
        body: v.string(),
        data: v.optional(v.record(v.string(), v.string())),
      }),
    ),
  },
  handler: async (_ctx, args) => {
    if (args.messages.length === 0) return { ok: true, tickets: [] };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const accessToken = process.env.EXPO_ACCESS_TOKEN;
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(
        args.messages.map((message) => ({
          to: message.to,
          title: message.title,
          body: message.body,
          data: message.data,
          sound: "default",
          priority: "high",
        })),
      ),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Expo push failed:", response.status, text);
      return { ok: false, error: text };
    }

    const tickets: unknown = await response.json();
    return { ok: true, tickets };
  },
});

export const sendPushToUser = internalAction({
  args: {
    userId: v.string(),
    title: v.string(),
    body: v.string(),
    data: v.optional(v.record(v.string(), v.string())),
    requireMarketingOptIn: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<SendPushResult> => {
    if (args.requireMarketingOptIn) {
      const optedIn: boolean = await ctx.runQuery(
        internal.pushNotifications.getMarketingOptIn,
        { userId: args.userId },
      );
      if (!optedIn) return { sent: 0, skipped: "marketing_opt_out" };
    }

    const tokens: Doc<"push_tokens">[] = await ctx.runMutation(
      internal.pushNotifications.getTokensForUser,
      { userId: args.userId },
    );
    if (tokens.length === 0) return { sent: 0, skipped: "no_tokens" };

    const result: ExpoPushResult = await ctx.runAction(
      internal.pushNotifications.sendExpoPush,
      {
        messages: tokens.map((row) => ({
          to: row.token,
          title: args.title,
          body: args.body,
          data: args.data,
        })),
      },
    );

    return { sent: tokens.length, ...result };
  },
});

export const sendOrderReadyPush = internalAction({
  args: {
    userId: v.string(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args): Promise<SendPushResult> => {
    return await ctx.runAction(internal.pushNotifications.sendPushToUser, {
      userId: args.userId,
      title: "Your order is ready!",
      body: "Head to the counter or stay in your car — we're bringing it out.",
      data: {
        orderId: args.orderId,
        type: "order_ready",
      },
      requireMarketingOptIn: false,
    });
  },
});
