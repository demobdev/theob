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
      if (REMOVED_DRINK_NAMES.includes(product.name as (typeof REMOVED_DRINK_NAMES)[number])) {
        await ctx.db.delete(product._id);
        deleted++;
      }
    }

    const fountain = products.find((p) => p.name === "Fountain Soda");
    if (fountain) {
      const flavorMod = fountain.modifiers?.find((m) => m.name === "Flavor");
      const otherMods = fountain.modifiers?.filter((m) => m.name !== "Flavor") ?? [];
      await ctx.db.patch(fountain._id, {
        description: "Pepsi products. Free refills.",
        isFeatured: true,
        modifiers: [PEPSI_FLAVOR_MODIFIER, ...otherMods],
      });
    }

    return `Removed ${deleted} Coke/Sprite drink product(s); updated Fountain Soda.`;
  },
});
