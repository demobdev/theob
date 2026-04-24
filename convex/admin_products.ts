import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

export const getAdminProducts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("products").collect();
  },
});

export const toggleStockStatus = mutation({
  args: { productId: v.id("products"), isOutOfStock: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, { isOutOfStock: args.isOutOfStock });
    return { success: true };
  },
});

export const updatePrice = mutation({
  args: { productId: v.id("products"), newPrice: v.number() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, { price: args.newPrice });
    return { success: true };
  },
});

export const toggleVisibility = mutation({
  args: { productId: v.id("products"), isVisible: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, { isVisible: args.isVisible });
    return { success: true };
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    updates: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      price: v.optional(v.number()),
      image: v.optional(v.string()),
      categoryId: v.optional(v.id("categories")),
      isFeatured: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.productId, args.updates);
    return { success: true };
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    categoryId: v.id("categories"),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const productId = await ctx.db.insert("products", {
      ...args,
      isVisible: true,
      isOutOfStock: false,
    });
    return productId;
  },
});

export const deleteProduct = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateProductImage = mutation({
  args: { productId: v.id("products"), storageId: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Failed to get image URL");
    
    await ctx.db.patch(args.productId, { image: imageUrl });
    return { imageUrl };
  },
});

export const backfillProductImages = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const products = await ctx.db.query("products").collect();
    
    const mapping: Record<string, string> = {
      "Crab Dip": "/images/food/crab_dip.png",
      "The Owner's Wings": "/images/food/wings.png",
      "Spicy Bang-Bang Shrimp": "/images/food/bang_bang_shrimp.png",
      "The Bar Chicken": "/images/food/chicken_sandwich.png",
      "Classic Philly": "/images/food/philly.png",
      "Crispy Fried Shrimp": "/images/food/fried_shrimp.png",
    };

    let updatedCount = 0;
    for (const product of products) {
      const newImage = mapping[product.name];
      if (newImage && product.image !== newImage) {
        await ctx.db.patch(product._id, { image: newImage });
        updatedCount++;
      }
    }

    return { updatedCount };
  },
});
