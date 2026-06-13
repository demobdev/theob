import { mutation } from "./_generated/server";
import { v } from "convex/values";

const REMOVED_DRINK_NAMES = [
  "Coca-Cola Fountain",
  "Diet Coke Fountain",
  "Coke Zero Fountain",
  "Sprite Fountain",
  "Coca-Cola Bottle (20oz)",
  "Diet Coke Bottle (20oz)",
  "Sprite Bottle (20oz)",
] as const;

const REMOVED_DRINK_IMAGE_KEYS = new Set([
  "coca_cola",
  "diet_coke",
  "coke_zero",
  "sprite",
  "bottled_coke",
  "bottled_diet_coke",
  "bottled_sprite",
]);

const FOUNTAIN_DRINK_NAMES = ["Fountain Soda", "Fountain Drink"] as const;

const PEPSI_FLAVOR_MODIFIER = {
  name: "Flavor",
  type: "single_select" as const,
  required: true,
  options: [
    { name: "Pepsi", priceExtra: 0, defaultSelected: true },
    { name: "Diet Pepsi", priceExtra: 0 },
    { name: "Mountain Dew", priceExtra: 0 },
    { name: "Starbucks Frappuccino", priceExtra: 0 },
  ],
};

/**
 * One-time launch cleanup: remove Coke/Sprite SKUs and align Fountain Soda to Pepsi.
 * Run: npx convex run menuCleanup:removeCokeDrinks
 */
export const removeCokeDrinks = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    let deleted = 0;

    for (const product of products) {
      const isNamedCokeSku = REMOVED_DRINK_NAMES.includes(
        product.name as (typeof REMOVED_DRINK_NAMES)[number],
      );
      const isCokeImageSku =
        product.image != null && REMOVED_DRINK_IMAGE_KEYS.has(product.image);

      if (isNamedCokeSku || isCokeImageSku) {
        await ctx.db.delete(product._id);
        deleted++;
      }
    }

    const fountain = products.find(
      (p) =>
        FOUNTAIN_DRINK_NAMES.includes(
          p.name as (typeof FOUNTAIN_DRINK_NAMES)[number],
        ) && !REMOVED_DRINK_NAMES.includes(p.name as (typeof REMOVED_DRINK_NAMES)[number]),
    );
    if (fountain) {
      const otherMods =
        fountain.modifiers?.filter((m) => m.name !== "Flavor") ?? [];
      await ctx.db.patch(fountain._id, {
        name: "Fountain Drink",
        description: "Pepsi fountain lineup. Free refills.",
        isFeatured: true,
        image: "soda",
        modifiers: [PEPSI_FLAVOR_MODIFIER, ...otherMods],
      });
    } else {
      const drinksCat = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("name"), "Drinks"))
        .first();
      if (drinksCat) {
        await ctx.db.insert("products", {
          name: "Fountain Drink",
          description: "Pepsi fountain lineup. Free refills.",
          price: 3.5,
          pointsWorth: 3,
          categoryId: drinksCat._id,
          image: "soda",
          isFeatured: true,
          modifiers: [PEPSI_FLAVOR_MODIFIER],
        });
      }
    }

    return `Removed ${deleted} Coke/Sprite drink product(s); Fountain Drink updated.`;
  },
});
