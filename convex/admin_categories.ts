import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/requireAdmin";

export const getAdminCategories = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("categories")
      .collect();
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    updates: v.object({
      name: v.optional(v.string()),
      icon: v.optional(v.string()),
      order: v.optional(v.number()),
      pointMultiplier: v.optional(v.number()),
      isVisible: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.categoryId, args.updates);
    return { success: true };
  },
});

export const reorderCategories = mutation({
  args: {
    orderings: v.array(v.object({
      id: v.id("categories"),
      order: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    for (const item of args.orderings) {
      await ctx.db.patch(item.id, { order: item.order });
    }
    return { success: true };
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Check if category has products
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
    
    if (products.length > 0) {
      throw new Error("Cannot delete category with active products. Move products first.");
    }

    await ctx.db.delete(args.categoryId);
    return { success: true };
  },
});
