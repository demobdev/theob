import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Auth } from "convex/server";
import { internal } from "./_generated/api";
import { GREENVILLE_LOCATION } from "./lib/locations";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

export const placeOrder = mutation({
  args: {
    items: v.array(v.any()),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    destination: v.optional(v.string()),
    fulfillmentMethod: v.optional(v.string()),
    locationId: v.optional(v.string()),
    location: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    pickupTime: v.optional(v.string()),
    estimatedReadyAt: v.optional(v.string()),
    carDetails: v.optional(
      v.object({
        make: v.string(),
        model: v.string(),
        color: v.string(),
      })
    ),
    deliveryAddress: v.optional(
      v.object({
        firstName: v.string(),
        lastName: v.string(),
        address: v.string(),
        apt: v.optional(v.string()),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        instructions: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    if (args.fulfillmentMethod === "delivery_partner") {
      throw new Error(
        "In-app checkout is for Greenville pickup only. Use DoorDash, Uber Eats, or Grubhub for delivery.",
      );
    }

    const phoneDigits = (args.customerPhone ?? "").replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      throw new Error("A valid phone number is required.");
    }

    if (args.fulfillmentMethod === "pickup_curbside") {
      const car = args.carDetails;
      if (!car?.make?.trim() || !car?.model?.trim() || !car?.color?.trim()) {
        throw new Error("Vehicle make, model, and color are required for curbside pickup.");
      }
    }

    // Calculate points: 1 point per $1 of subtotal
    const pointsAwarded = Math.floor(args.subtotal);

    const locationId = args.locationId ?? GREENVILLE_LOCATION.id;
    const location =
      args.location ?? GREENVILLE_LOCATION.fullAddress;

    // Save order
    const orderId = await ctx.db.insert("orders", {
      userId,
      items: args.items,
      subtotal: args.subtotal,
      tax: args.tax,
      total: args.total,
      pointsAwarded,
      destination: args.destination,
      fulfillmentMethod: args.fulfillmentMethod,
      locationId,
      location,
      customerPhone: args.customerPhone,
      pickupTime: args.pickupTime,
      estimatedReadyAt: args.estimatedReadyAt,
      carDetails: args.carDetails,
      deliveryAddress: args.deliveryAddress,
      paymentStatus: "pending",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    await ctx.scheduler.runAfter(
      0,
      internal.integrations.genius.submitOrder.submitToPos,
      { orderId },
    );

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
