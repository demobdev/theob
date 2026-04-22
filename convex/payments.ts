import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Helper: get authed Clerk user ID server-side ─────────────────────────────
const getUserId = async (ctx: any): Promise<string | null> => {
  return (await ctx.auth.getUserIdentity())?.subject ?? null;
};

/**
 * Returns all tokenized cards saved for the authenticated user.
 * Used by SavedCardsScreen to display the user's wallet.
 */
export const getPaymentMethods = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("payment_methods")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

/**
 * Saves a tokenized card reference returned from the GeniuS/Xenial gateway.
 * This mutation must ONLY be called AFTER tokenization has occurred client-side.
 * Raw card numbers must never be passed to this function.
 *
 * If isDefault: true, existing default cards are unset first.
 */
export const savePaymentMethod = mutation({
  args: {
    gatewayToken: v.string(),
    brand:        v.string(),
    last4:        v.string(),
    expMonth:     v.string(),
    expYear:      v.string(),
    isDefault:    v.boolean(),
    billingZip:   v.optional(v.string()),
    nickname:     v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject ?? null;
    if (!userId) return { success: false, error: "NOT_AUTHENTICATED" };

    // If this new card is being set as default, clear previous default
    if (args.isDefault) {
      const existing = await ctx.db
        .query("payment_methods")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();
      for (const card of existing) {
        if (card.isDefault) {
          await ctx.db.patch(card._id, { isDefault: false });
        }
      }
    }

    await ctx.db.insert("payment_methods", {
      userId,
      gatewayToken: args.gatewayToken,
      brand:        args.brand,
      last4:        args.last4,
      expMonth:     args.expMonth,
      expYear:      args.expYear,
      isDefault:    args.isDefault,
      billingZip:   args.billingZip,
      nickname:     args.nickname,
      createdAt:    new Date().toISOString(),
    });

    return { success: true };
  },
});

/**
 * Removes a saved card by ID.
 * Verifies ownership before deletion.
 */
export const removePaymentMethod = mutation({
  args: { cardId: v.id("payment_methods") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.cardId);
    if (!card || card.userId !== userId) {
      throw new Error("Card not found or unauthorized");
    }

    await ctx.db.delete(args.cardId);
  },
});

/**
 * Sets a card as the user's default payment method.
 * Clears isDefault on all other cards for this user.
 */
export const setDefaultPaymentMethod = mutation({
  args: { cardId: v.id("payment_methods") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const allCards = await ctx.db
      .query("payment_methods")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    for (const card of allCards) {
      await ctx.db.patch(card._id, { isDefault: card._id === args.cardId });
    }
  },
});
