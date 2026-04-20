import { mutation } from "./_generated/server";
import { v } from "convex/values";

// This is the primary seeding mutation.
export default mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Clear existing (optional - careful!)
    const existingCats = await ctx.db.query("categories").collect();
    for (const cat of existingCats) {
      await ctx.db.delete(cat._id);
    }
    const existingProducts = await ctx.db.query("products").collect();
    for (const prod of existingProducts) {
      await ctx.db.delete(prod._id);
    }

    // 2. Define Categories
    const categories = [
      { name: "Appetizers", icon: "fast-food", order: 1 },
      { name: "Salads", icon: "leaf", order: 2 },
      { name: "Sandwiches", icon: "bread", order: 3 },
      { name: "Entrées", icon: "restaurant", order: 4 },
      { name: "Pizza", icon: "pizza", order: 5 },
      { name: "Brunch", icon: "egg", order: 6 },
    ];

    const categoryIds: Record<string, any> = {};

    for (const cat of categories) {
      const id = await ctx.db.insert("categories", cat);
      categoryIds[cat.name] = id;
    }

    // 3. Define Products (A subset of menuData.ts)
    const productsData = [
      {
        name: "Crab Dip",
        description: "Lump crabmeat, cream sauce, grilled pita chips",
        price: 14.99,
        categoryName: "Appetizers",
        isFeatured: true,
        image: "crab_dip",
      },
      {
        name: "Crispy Fried Shrimp",
        description: "Served with tartar & sweet & sour sauce",
        price: 12.99,
        categoryName: "Appetizers",
        isFeatured: false,
        image: "fried_shrimp",
      },
      {
        name: "Classic Caesar",
        description: "Romaine, croutons, parmesan.",
        price: 10.99,
        categoryName: "Salads",
        isFeatured: false,
        image: "caesar_salad",
      },
      {
        name: "The Bar Chicken",
        description: "Grilled or crispy fried chicken with buffalo sauce, ranch & smoked bacon",
        price: 15.99,
        categoryName: "Sandwiches",
        isFeatured: true,
        image: "bar_chicken",
      },
      {
        name: "Classic Philly",
        description: "Shaved prime rib, grilled pepper-onion & cheese sauce",
        price: 16.99,
        categoryName: "Sandwiches",
        isFeatured: true,
        image: "philly",
      },
      {
        name: "Rib Eye Steak",
        description: "14oz seared rib eye, truffle fries & slaw",
        price: 34.99,
        categoryName: "Entrées",
        isFeatured: true,
        image: "rib_eye",
      },
      {
        name: "Classic Neapolitan",
        description: "Fresh mozzarella, basil & tomatoes",
        price: 18.99,
        categoryName: "Pizza",
        isFeatured: true,
        image: "neapolitan_pizza",
      },
      {
        name: "Short Rib Hash",
        description: "Braised short rib, roasted potatoes, peppers, onions, sunny egg",
        price: 22.99,
        categoryName: "Brunch",
        isFeatured: false,
        image: "short_rib_hash",
      },
      {
        name: "Classic Modern Logo B",
        description: "Signature branding icon",
        price: 0.00,
        categoryName: "Appetizers",
        isFeatured: false,
        image: "logo_b",
      }
    ];

    for (const prod of productsData) {
      await ctx.db.insert("products", {
        name: prod.name,
        description: prod.description,
        price: prod.price,
        categoryId: categoryIds[prod.categoryName],
        image: prod.image,
        isFeatured: prod.isFeatured,
      });
    }

    // 4. Seed Mock Games with Explicit IDs
    const games = [
      {
        externalId: "mock_1",
        sport: "MLB",
        league: "MLB",
        status: "inprogress",
        startsAt: new Date().toISOString(),
        homeTeam: { id: "bal", name: "Orioles", abbr: "BAL", score: 4 },
        awayTeam: { id: "nyy", name: "Yankees", abbr: "NYY", score: 2 },
        isPrimeTime: true,
        broadcast: "ESPN",
        isFeatured: true,
        tvZone: "ZONE A",
      },
      {
        externalId: "mock_2",
        sport: "NBA",
        league: "NBA",
        status: "upcoming",
        startsAt: new Date(Date.now() + 3600000).toISOString(),
        homeTeam: { id: "lal", name: "Lakers", abbr: "LAL" },
        awayTeam: { id: "bos", name: "Celtics", abbr: "BOS" },
        isPrimeTime: true,
        broadcast: "TNT",
        isFeatured: true,
        tvZone: "ZONE B",
      }
    ];

    for (const game of games) {
      await ctx.db.insert("upcoming_games", game);
    }

    return "Menu and Games Seeded Successfully!";
  },
});
