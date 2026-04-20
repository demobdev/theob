import { mutation } from "./_generated/server";

export const populate = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear out existing
    const existingCats = await ctx.db.query("categories").collect();
    for (const cat of existingCats) await ctx.db.delete(cat._id);
    
    const existingProds = await ctx.db.query("products").collect();
    for (const prod of existingProds) await ctx.db.delete(prod._id);

    // Insert new Categories based on the PDF Menu
    const catKeys = [
      "Appetizers", 
      "Salads", 
      "Sandwiches", 
      "Jumbo Wings", 
      "Steaks & Mains", 
      "Pizza", 
      "Weekend Brunch"
    ];

    let catMap: Record<string, any> = {};
    for (let i = 0; i < catKeys.length; i++) {
       const catId = await ctx.db.insert("categories", {
         name: catKeys[i],
         order: i,
       });
       catMap[catKeys[i]] = catId;
    }

    // ==========================================
    // 1. APPETIZERS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Crab Dip",
      description: "Lump crabmeat, cream sauce, grilled pita chips.",
      price: 18.00,
      categoryId: catMap["Appetizers"],
      image: "crab_dip",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Crispy Fried Shrimp",
      description: "Crispy fried shrimp, tartar & sweet & sour sauce.",
      price: 14.00,
      categoryId: catMap["Appetizers"],
      image: "fried_shrimp",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Queso & Chorizo",
      description: "Chorizo, mexican style cheese dip and fried corn chips.",
      price: 12.00,
      categoryId: catMap["Appetizers"],
      image: "queso_chorizo",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Spicy Bang-Bang Shrimp",
      description: "Fried onions, peppers and tartar sauce.",
      price: 15.00,
      categoryId: catMap["Appetizers"],
      image: "spicy_bang_bang",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Crispy Calamari",
      description: "Fresh crispy calamari served with signature dipping sauce.",
      price: 14.00,
      categoryId: catMap["Appetizers"],
      image: "crispy_calamari",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Loaded Short Rib Nachos",
      description: "Shreed ribs, Mexican cheese, jalapeño & tomatoes.",
      price: 16.00,
      categoryId: catMap["Appetizers"],
      image: "short_rib_nachos",
      isFeatured: true,
    });

    // ==========================================
    // 2. SALADS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Classic Caesar Salad",
      description: "Add chicken +6, shrimp +8, salmon +10, steak +12.",
      price: 12.00,
      categoryId: catMap["Salads"],
      image: "caesar_salad",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Chopped House Salad",
      description: "Bacon, tomatoes, cucumber, blue cheese & iceburg lettuce.",
      price: 14.00,
      categoryId: catMap["Salads"],
      image: "chopped_salad",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Fried Goat Cheese & Arugula",
      description: "Goat cheese balls, arugula, balsamic glazed, pecans & ranch dressing.",
      price: 16.00,
      categoryId: catMap["Salads"],
      image: "goat_cheese_salad",
      isFeatured: false,
    });

    // ==========================================
    // 3. SANDWICHES
    // ==========================================
    await ctx.db.insert("products", {
      name: "Chicago Dog",
      description: "Yellow mustard, onions, bright pickle relish, pickle, tomatoes, sport peppers. Served with fries or side salad.",
      price: 14.00,
      categoryId: catMap["Sandwiches"],
      image: "chicago_dog",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "The Bar Chicken",
      description: "Choice of grilled or crispy fried chicken with buffalo sauce, ranch & smoked bacon.",
      price: 16.00,
      categoryId: catMap["Sandwiches"],
      image: "bar_chicken",
      isFeatured: true,
      modifiers: [
        {
          name: "Preparation",
          type: "single_select",
          required: true,
          options: [
            { name: "Grilled", priceExtra: 0 },
            { name: "Crispy Fried", priceExtra: 0 }
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Crab Cake Sandwich",
      description: "Lump crabmeat served on toasted bun, arugula, tomatoes & tartar sauce.",
      price: 22.00,
      categoryId: catMap["Sandwiches"],
      image: "crabcake_sandwich",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Classic Philly",
      description: "Shaved prime rib or grilled chicken, grilled pepper - onion & cheese sauce.",
      price: 17.00,
      categoryId: catMap["Sandwiches"],
      image: "philly",
      isFeatured: true,
    });

    // ==========================================
    // 4. JUMBO WINGS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Jumbo Wings",
      description: "Grilled or crispy · celery & carrots · ranch or blue cheese.",
      price: 11.99,
      categoryId: catMap["Jumbo Wings"],
      image: "jumbo_wings",
      isFeatured: true,
      modifiers: [
        {
          name: "Pack Size",
          type: "single_select",
          required: true,
          options: [
            { name: "6 Pack Jumbo Wings", priceExtra: 0 },
            { name: "10 Pack Jumbo Wings", priceExtra: 4.00 },
            { name: "30 Pack Jumbo Wings", priceExtra: 31.00 }
          ]
        },
        {
          name: "Signature Sauce",
          type: "single_select",
          required: true,
          options: [
            { name: "Classic Buffalo", priceExtra: 0 },
            { name: "Honey Garlic", priceExtra: 0 },
            { name: "Garlic Parm", priceExtra: 0 },
            { name: "Lemon Pepper", priceExtra: 0 },
            { name: "Korean BBQ", priceExtra: 0 },
            { name: "Sweet Chili", priceExtra: 0 }
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Cauliflower Wings",
      description: "Vegetarian cauliflower wings spun in your choice of signature sauces.",
      price: 13.00,
      categoryId: catMap["Jumbo Wings"],
      image: "cauliflower_wings",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Boneless Wings (12)",
      description: "Crispy boneless wings tossed in your choice of signature sauces.",
      price: 16.00,
      categoryId: catMap["Jumbo Wings"],
      image: "boneless_wings",
      isFeatured: false,
    });

    // ==========================================
    // 5. STEAKS & MAINS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Rib Eye Steak",
      description: "14oz seared rib eye, truffle fries & slaw.",
      price: 36.00,
      categoryId: catMap["Steaks & Mains"],
      image: "rib_eye",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Coho Salmon",
      description: "6oz Chilean salmon, truffle mashed, capers sauce.",
      price: 26.00,
      categoryId: catMap["Steaks & Mains"],
      image: "coho_salmon",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Picanha Steak",
      description: "8oz Grilled Brazilian cut, chimichurri sauce & truffle fries.",
      price: 28.00,
      categoryId: catMap["Steaks & Mains"],
      image: "picanha_steak",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "NY Strip",
      description: "10oz NY strip, truflle fries and grilled mushroom.",
      price: 32.00,
      categoryId: catMap["Steaks & Mains"],
      image: "ny_strip",
      isFeatured: false,
    });

    // ==========================================
    // 6. PIZZA
    // ==========================================
    await ctx.db.insert("products", {
      name: "Classic Neapolitan",
      description: "Fresh mozzarella, traditional mozzarella, basil & tomatoes.",
      price: 18.00,
      categoryId: catMap["Pizza"],
      image: "neapolitan_pizza",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Cheese Pizza",
      description: "Mozzarella, basil & tomatoes.",
      price: 15.00,
      categoryId: catMap["Pizza"],
      image: "cheese_pizza",
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Meat Lover Pizza",
      description: "Pepperoni, Italian sausage, bacon & ham.",
      price: 22.00,
      categoryId: catMap["Pizza"],
      image: "meat_lover_pizza",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Supreme Pizza",
      description: "Pepperoni, mushrooms, sausage, tomatoes, mozzarella.",
      price: 21.00,
      categoryId: catMap["Pizza"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Ham & Pineapple",
      description: "Grilled ham & pineaple sliced over mozzarella.",
      price: 20.00,
      categoryId: catMap["Pizza"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Chicken Alfredo Pizza",
      description: "Chicken, Alfredo sauce, mozarella, parmesan & olive oil.",
      price: 22.00,
      categoryId: catMap["Pizza"],
      isFeatured: false,
    });

    // ==========================================
    // 7. BRUNCH
    // ==========================================
    await ctx.db.insert("products", {
      name: "Classic Two-Egg Breakfast",
      description: "Two eggs any style, bacon or sausage, breakfast potatoes, toast.",
      price: 14.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Buttermilk Pancakes",
      description: "Maple syrup, whipped butter. Add blueberries or chocolate chips.",
      price: 12.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Short Rib Hash",
      description: "Braised short rib, roasted potatoes, peppers, onions, sunny egg.",
      price: 18.00,
      categoryId: catMap["Weekend Brunch"],
      image: "short_rib_hash",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Breakfast Skillet",
      description: "Scrambled eggs, potatoes, peppers, onions, bacon or sausage, cheddar.",
      price: 16.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Veggie Omelet",
      description: "Mushrooms, spinach, tomatoes, onions, goat cheese.",
      price: 14.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Steak & Eggs",
      description: "Grilled steak, two eggs any style, breakfast potatoes.",
      price: 24.00,
      categoryId: catMap["Weekend Brunch"],
      image: "steak_and_eggs",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Crispy Chicken & Waffles",
      description: "Buttermilk fried chicken, Belgian waffle, maple hot sauce.",
      price: 18.00,
      categoryId: catMap["Weekend Brunch"],
      image: "chicken_waffles",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Salmon Avocado Toast",
      description: "Grilled salmon, smashed avocado, arugula.",
      price: 20.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });
    await ctx.db.insert("products", {
      name: "Breakfast Sandwich",
      description: "Scrambled eggs, bacon or sausage, American cheese, brioche.",
      price: 12.00,
      categoryId: catMap["Weekend Brunch"],
      isFeatured: false,
    });

    return "Seeded Complete PDF Menu successfully.";
  }
});
