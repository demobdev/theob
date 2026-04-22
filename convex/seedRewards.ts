import { mutation } from "./_generated/server";

export const seedRewards = mutation({
  args: {},
  handler: async (ctx) => {
    const rewards = [
      { title: "$5 Off The Owner's Wings", pointsCost: 0, rewardType: "discount", category: "Promotions", isActive: true },
      { title: "Free Fountain Drink", pointsCost: 25, rewardType: "free_item", category: "Tier 1 — Easy Wins", isActive: true },
      { title: "Free Fries or Side", pointsCost: 50, rewardType: "free_item", category: "Tier 1 — Easy Wins", isActive: true },
      { title: "Free Bar Sandwich", pointsCost: 125, rewardType: "free_item", category: "Tier 2 — The Staples", isActive: true },
      { title: "Free Entree Salad", pointsCost: 125, rewardType: "free_item", category: "Tier 2 — The Staples", isActive: true },
      { title: "Free Craft Pasta", pointsCost: 125, rewardType: "free_item", category: "Tier 2 — The Staples", isActive: true },
      { title: "Free 14\" Premium Pizza", pointsCost: 300, rewardType: "free_item", category: "Tier 3 — The Heavy Hitters", isActive: true },
      { title: "Free Jumbo Wings (12ct)", pointsCost: 300, rewardType: "free_item", category: "Tier 3 — The Heavy Hitters", isActive: true },
      { title: "The Owners Box Yeti", pointsCost: 1000, rewardType: "merch", category: "Tier 4 — Legend Status", isActive: true },
    ];

    // Clear existing rewards first to avoid duplicates during dev
    const existing = await ctx.db.query("reward_definitions").collect();
    for (const r of existing) {
      await ctx.db.delete(r._id);
    }

    for (const reward of rewards) {
      await ctx.db.insert("reward_definitions", reward);
    }

    return { success: true, count: rewards.length };
  },
});
