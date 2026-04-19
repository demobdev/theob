import { mutation } from "./_generated/server";

export const seedRewards = mutation({
  args: {},
  handler: async (ctx) => {
    const rewards = [
      { title: "Free Fountain Drink", pointsCost: 25, rewardType: "free_item", category: "Tier 1 — Easy Wins", isActive: true },
      { title: "Free Fries or Side", pointsCost: 50, rewardType: "free_item", category: "Tier 1 — Easy Wins", isActive: true },
      { title: "Free Classic Caesar", pointsCost: 75, rewardType: "free_item", category: "Tier 2 — Small Food Reward", isActive: true },
      { title: "Free Brunch Side Bundle", pointsCost: 75, rewardType: "free_item", category: "Tier 2 — Small Food Reward", isActive: true },
      { title: "$5 Off Direct Order", pointsCost: 100, rewardType: "discount", category: "Tier 3 — Strong Mid-Tier", isActive: true },
      { title: "Free Queso & Chorizo", pointsCost: 125, rewardType: "free_item", category: "Tier 3 — Strong Mid-Tier", isActive: true },
      { title: "Free Crispy Calamari", pointsCost: 125, rewardType: "free_item", category: "Tier 3 — Strong Mid-Tier", isActive: true },
      { title: "Free Bar Chicken Sandwich", pointsCost: 150, rewardType: "free_item", category: "Tier 4 — Appetizer / Sandwich Tier", isActive: true },
      { title: "Free Chicago Sandwich", pointsCost: 150, rewardType: "free_item", category: "Tier 4 — Appetizer / Sandwich Tier", isActive: true },
      { title: "Free Breakfast Sandwich", pointsCost: 150, rewardType: "free_item", category: "Tier 4 — Appetizer / Sandwich Tier", isActive: true },
      { title: "$10 Off ($25+ Order)", pointsCost: 200, rewardType: "discount", category: "Tier 5 — Premium Casual Tier", isActive: true },
      { title: "Free Jumbo Wings (6ct)", pointsCost: 200, rewardType: "free_item", category: "Tier 5 — Premium Casual Tier", isActive: true },
      { title: "Free Cheese Pizza", pointsCost: 250, rewardType: "free_item", category: "Tier 6 — Party / Shareable Tier", isActive: true },
      { title: "Free Jumbo Wings (12ct)", pointsCost: 250, rewardType: "free_item", category: "Tier 6 — Party / Shareable Tier", isActive: true },
      { title: "Free Premium Pizza", pointsCost: 300, rewardType: "free_item", category: "Tier 7 — High Value / Promo Tier", isActive: true },
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
