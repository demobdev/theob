import { mutation } from "./_generated/server";

/**
 * Adds missing menu items to the existing seeded categories.
 * Run AFTER seedMenu:populate.
 */
export const addExtras = mutation({
  args: {},
  handler: async (ctx) => {
    // Get existing categories
    const cats = await ctx.db.query("categories").collect();
    const catMap: Record<string, any> = {};
    for (const c of cats) catMap[c.name] = c._id;

    // --- Shared modifiers ---
    const sideChoice = {
      name: "Side Choice", type: "single_select", required: true,
      options: [
        { name: "Seasoned Fries", priceExtra: 0, defaultSelected: true },
        { name: "Side Salad", priceExtra: 0 },
        { name: "Truffle Fries", priceExtra: 3.00 },
        { name: "Sweet Potato Fries", priceExtra: 2.00 },
      ]
    };
    const steakTemp = {
      name: "Steak Temperature", type: "single_select", required: true,
      options: [
        { name: "Rare", priceExtra: 0 },
        { name: "Medium Rare", priceExtra: 0, defaultSelected: true },
        { name: "Medium", priceExtra: 0 },
        { name: "Medium Well", priceExtra: 0 },
        { name: "Well Done", priceExtra: 0 },
      ]
    };
    const wingSauces = {
      name: "Signature Sauce", type: "single_select", required: true,
      options: [
        { name: "Classic Buffalo", priceExtra: 0 },
        { name: "Honey Garlic", priceExtra: 0 },
        { name: "Garlic Parm", priceExtra: 0 },
        { name: "Lemon Pepper", priceExtra: 0 },
        { name: "Korean BBQ", priceExtra: 0 },
        { name: "Sweet Chili", priceExtra: 0 },
        { name: "Dry Rub", priceExtra: 0 },
      ]
    };
    const wingDressing = {
      name: "Dressing", type: "single_select", required: true,
      options: [
        { name: "Ranch", priceExtra: 0, defaultSelected: true },
        { name: "Blue Cheese", priceExtra: 0 },
        { name: "No Dressing", priceExtra: 0 },
      ]
    };
    const pizzaToppings = {
      name: "Add Toppings", type: "multi_select", required: false,
      options: [
        { name: "Extra Cheese", priceExtra: 2.00 },
        { name: "Pepperoni", priceExtra: 2.50 },
        { name: "Italian Sausage", priceExtra: 2.50 },
        { name: "Mushrooms", priceExtra: 1.50 },
        { name: "Onions", priceExtra: 1.00 },
        { name: "Green Peppers", priceExtra: 1.00 },
        { name: "Black Olives", priceExtra: 1.00 },
        { name: "Jalapeños", priceExtra: 1.00 },
        { name: "Bacon", priceExtra: 3.00 },
        { name: "Ham", priceExtra: 2.50 },
        { name: "Chicken", priceExtra: 3.00 },
        { name: "Anchovies", priceExtra: 1.50 },
      ]
    };
    const pizzaCrust = {
      name: "Crust", type: "single_select", required: true,
      options: [
        { name: "Regular", priceExtra: 0, defaultSelected: true },
        { name: "Thin Crust", priceExtra: 0 },
        { name: "Gluten Free", priceExtra: 3.00 },
      ]
    };
    const eggStyle = {
      name: "Egg Style", type: "single_select", required: true,
      options: [
        { name: "Scrambled", priceExtra: 0 },
        { name: "Sunny Side Up", priceExtra: 0, defaultSelected: true },
        { name: "Over Easy", priceExtra: 0 },
        { name: "Over Medium", priceExtra: 0 },
      ]
    };
    const saladProteins = {
      name: "Add Protein", type: "single_select", required: false,
      options: [
        { name: "No Protein", priceExtra: 0, defaultSelected: true },
        { name: "Grilled Chicken", priceExtra: 6.00 },
        { name: "Grilled Shrimp", priceExtra: 8.00 },
        { name: "Grilled Salmon", priceExtra: 10.00 },
        { name: "Steak Tips", priceExtra: 12.00 },
      ]
    };

    // ==========================================
    // WINGS — Boneless & Cauliflower options
    // ==========================================
    await ctx.db.insert("products", {
      name: "Boneless Wings",
      description: "Crispy boneless tenders · celery & carrots · ranch or blue cheese.",
      price: 13.99,
      pointsWorth: 14,
      categoryId: catMap["Jumbo Wings"],
      image: "boneless_wings",
      isFeatured: true,
      modifiers: [
        {
          name: "Pack Size", type: "single_select", required: true,
          options: [
            { name: "8 Pack", priceExtra: 0 },
            { name: "16 Pack", priceExtra: 10.00 },
            { name: "24 Pack", priceExtra: 19.00 },
          ]
        },
        wingSauces, wingDressing,
      ]
    });
    await ctx.db.insert("products", {
      name: "Cauliflower Wings",
      description: "Crispy cauliflower · celery & carrots · ranch or blue cheese.",
      price: 13.99,
      pointsWorth: 14,
      categoryId: catMap["Jumbo Wings"],
      image: "cauliflower_wings",
      isFeatured: false,
      modifiers: [
        {
          name: "Pack Size", type: "single_select", required: true,
          options: [
            { name: "8 Pack", priceExtra: 0 },
            { name: "16 Pack", priceExtra: 10.00 },
          ]
        },
        wingSauces, wingDressing,
      ]
    });

    // ==========================================
    // APPETIZERS — Missing items
    // ==========================================
    await ctx.db.insert("products", {
      name: "Crispy Calamari",
      description: "Lightly breaded and fried to perfection, served with marinara & lemon aioli.",
      price: 14.00,
      pointsWorth: 14,
      categoryId: catMap["Appetizers"],
      image: "crispy_calamari",
      isFeatured: false,
      modifiers: [
        {
          name: "Dipping Sauce", type: "single_select", required: true,
          options: [
            { name: "Marinara", priceExtra: 0, defaultSelected: true },
            { name: "Lemon Aioli", priceExtra: 0 },
            { name: "Both", priceExtra: 0 },
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Crab Cake Platter",
      description: "Lump crabmeat on truffle mashed, arugula, tomatoes & caper sauce.",
      price: 24.00,
      pointsWorth: 24,
      categoryId: catMap["Appetizers"],
      image: "crabcake_sandwich",
      isFeatured: true,
    });
    await ctx.db.insert("products", {
      name: "Spicy Bang-Bang Shrimp",
      description: "Fried onions, peppers and tartar sauce.",
      price: 15.00,
      pointsWorth: 15,
      categoryId: catMap["Appetizers"],
      image: "spicy_bang_bang",
      isFeatured: false,
      modifiers: [
        {
          name: "Heat Level", type: "single_select", required: true,
          options: [
            { name: "Medium", priceExtra: 0, defaultSelected: true },
            { name: "Hot", priceExtra: 0 },
            { name: "Extra Hot", priceExtra: 0 },
            { name: "Mild", priceExtra: 0 },
          ]
        }
      ]
    });

    // ==========================================
    // STEAKS — Missing items
    // ==========================================
    await ctx.db.insert("products", {
      name: "NY Strip",
      description: "10oz NY strip, truffle fries and grilled mushrooms.",
      price: 32.00,
      pointsWorth: 32,
      categoryId: catMap["Steaks & Mains"],
      image: "ny_strip",
      isFeatured: false,
      modifiers: [
        steakTemp,
        {
          name: "Add-Ons", type: "multi_select", required: false,
          options: [
            { name: "Grilled Mushrooms", priceExtra: 0, defaultSelected: true },
            { name: "Truffle Fries", priceExtra: 0, defaultSelected: true },
            { name: "Garlic Butter", priceExtra: 2.00 },
            { name: "Oscar Style (crab & béarnaise)", priceExtra: 8.00 },
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Coho Salmon",
      description: "6oz Chilean salmon, truffle mashed, caper sauce.",
      price: 28.00,
      pointsWorth: 28,
      categoryId: catMap["Steaks & Mains"],
      image: "coho_salmon",
      isFeatured: false,
      modifiers: [
        {
          name: "Preparation", type: "single_select", required: true,
          options: [
            { name: "Grilled", priceExtra: 0, defaultSelected: true },
            { name: "Blackened", priceExtra: 0 },
            { name: "Pan Seared", priceExtra: 0 },
          ]
        },
        {
          name: "Add-Ons", type: "multi_select", required: false,
          options: [
            { name: "Truffle Mashed", priceExtra: 0, defaultSelected: true },
            { name: "Caper Sauce", priceExtra: 0, defaultSelected: true },
            { name: "Extra Lemon", priceExtra: 0 },
          ]
        }
      ]
    });

    // ==========================================
    // PIZZA — Full lineup
    // ==========================================
    await ctx.db.insert("products", {
      name: "Classic Neapolitan",
      description: "Fresh mozzarella, traditional mozzarella, basil & tomatoes.",
      price: 18.00,
      pointsWorth: 18,
      categoryId: catMap["Pizza"],
      image: "neapolitan_pizza",
      isFeatured: false,
      modifiers: [
        pizzaCrust,
        {
          name: "Ingredients", type: "multi_select", required: false,
          options: [
            { name: "Fresh Mozzarella", priceExtra: 0, defaultSelected: true },
            { name: "Basil", priceExtra: 0, defaultSelected: true },
            { name: "Tomatoes", priceExtra: 0, defaultSelected: true },
          ]
        },
        pizzaToppings,
      ]
    });
    await ctx.db.insert("products", {
      name: "Supreme Pizza",
      description: "Pepperoni, mushrooms, sausage, tomatoes, mozzarella.",
      price: 22.00,
      pointsWorth: 22,
      categoryId: catMap["Pizza"],
      image: "supreme_pizza",
      isFeatured: false,
      modifiers: [
        pizzaCrust,
        {
          name: "Ingredients", type: "multi_select", required: false,
          options: [
            { name: "Pepperoni", priceExtra: 0, defaultSelected: true },
            { name: "Mushrooms", priceExtra: 0, defaultSelected: true },
            { name: "Sausage", priceExtra: 0, defaultSelected: true },
            { name: "Tomatoes", priceExtra: 0, defaultSelected: true },
            { name: "Mozzarella", priceExtra: 0, defaultSelected: true },
          ]
        },
        pizzaToppings,
      ]
    });
    await ctx.db.insert("products", {
      name: "Chicken Alfredo Pizza",
      description: "Chicken, Alfredo sauce, mozzarella, parmesan & olive oil.",
      price: 22.00,
      pointsWorth: 22,
      categoryId: catMap["Pizza"],
      image: "chicken_alfredo_pizza",
      isFeatured: false,
      modifiers: [
        pizzaCrust,
        {
          name: "Ingredients", type: "multi_select", required: false,
          options: [
            { name: "Grilled Chicken", priceExtra: 0, defaultSelected: true },
            { name: "Alfredo Sauce", priceExtra: 0, defaultSelected: true },
            { name: "Mozzarella", priceExtra: 0, defaultSelected: true },
            { name: "Parmesan", priceExtra: 0, defaultSelected: true },
          ]
        },
        pizzaToppings,
      ]
    });
    await ctx.db.insert("products", {
      name: "Ham & Pineapple",
      description: "Ham, pineapple, mozzarella, classic tomato sauce.",
      price: 20.00,
      pointsWorth: 20,
      categoryId: catMap["Pizza"],
      image: "ham_pineapple",
      isFeatured: false,
      modifiers: [
        pizzaCrust,
        {
          name: "Ingredients", type: "multi_select", required: false,
          options: [
            { name: "Ham", priceExtra: 0, defaultSelected: true },
            { name: "Pineapple", priceExtra: 0, defaultSelected: true },
            { name: "Mozzarella", priceExtra: 0, defaultSelected: true },
          ]
        },
        pizzaToppings,
      ]
    });

    // ==========================================
    // BRUNCH — Missing items
    // ==========================================
    await ctx.db.insert("products", {
      name: "Crispy Chicken & Waffles",
      description: "Buttermilk fried chicken, Belgian waffle, maple hot sauce.",
      price: 18.00,
      pointsWorth: 18,
      categoryId: catMap["Weekend Brunch"],
      image: "chicken_waffles",
      isFeatured: true,
      modifiers: [
        {
          name: "Heat Level", type: "single_select", required: true,
          options: [
            { name: "Classic Maple", priceExtra: 0, defaultSelected: true },
            { name: "Maple Hot Sauce", priceExtra: 0 },
            { name: "Extra Spicy", priceExtra: 0 },
          ]
        },
        {
          name: "Chicken Style", type: "single_select", required: true,
          options: [
            { name: "Crispy Fried", priceExtra: 0, defaultSelected: true },
            { name: "Grilled", priceExtra: 0 },
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Short Rib Hash",
      description: "Braised short rib, roasted potatoes, peppers, onions, sunny egg.",
      price: 18.00,
      pointsWorth: 18,
      categoryId: catMap["Weekend Brunch"],
      image: "short_rib_hash",
      isFeatured: false,
      modifiers: [
        eggStyle,
        {
          name: "Ingredients", type: "multi_select", required: false,
          options: [
            { name: "Short Rib", priceExtra: 0, defaultSelected: true },
            { name: "Peppers", priceExtra: 0, defaultSelected: true },
            { name: "Onions", priceExtra: 0, defaultSelected: true },
            { name: "Hot Sauce", priceExtra: 0 },
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Steak & Eggs",
      description: "Grilled steak, two eggs any style, breakfast potatoes.",
      price: 22.00,
      pointsWorth: 22,
      categoryId: catMap["Weekend Brunch"],
      image: "steak_and_eggs",
      isFeatured: false,
      modifiers: [steakTemp, eggStyle]
    });
    await ctx.db.insert("products", {
      name: "The OB Pancakes",
      description: "Fluffy buttermilk pancakes, maple syrup, whipped butter.",
      price: 12.00,
      pointsWorth: 12,
      categoryId: catMap["Weekend Brunch"],
      image: "pancakes",
      isFeatured: false,
      modifiers: [
        {
          name: "Add-Ons", type: "multi_select", required: false,
          options: [
            { name: "Blueberries", priceExtra: 2.00 },
            { name: "Strawberries", priceExtra: 2.00 },
            { name: "Chocolate Chips", priceExtra: 1.50 },
            { name: "Whipped Cream", priceExtra: 1.00 },
            { name: "Side of Bacon", priceExtra: 4.00 },
          ]
        }
      ]
    });

    return "Extra menu items added successfully.";
  }
});
