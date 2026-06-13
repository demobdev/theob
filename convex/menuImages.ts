import {
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";

export const listProductsForImageSync = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("products"),
      name: v.string(),
      image: v.optional(v.string()),
    }),
  ),
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.map((p) => ({
      _id: p._id,
      name: p.name,
      image: p.image,
    }));
  },
});

export const setProductImageFromStorage = internalMutation({
  args: {
    productId: v.id("products"),
    storageId: v.id("_storage"),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Failed to resolve storage URL");
    }
    await ctx.db.patch(args.productId, { image: imageUrl });
    return imageUrl;
  },
});

export const generateUploadUrlInternal = internalMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

/** Callable with deploy-key admin auth (upload scripts). */
export const seedGenerateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Admin authentication required");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

/** Callable with deploy-key admin auth (upload scripts). */
export const seedAttachProductImage = mutation({
  args: {
    productId: v.id("products"),
    storageId: v.id("_storage"),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Admin authentication required");
    }
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) {
      throw new Error("Failed to resolve storage URL");
    }
    await ctx.db.patch(args.productId, { image: imageUrl });
    return imageUrl;
  },
});
