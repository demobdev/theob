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
      "Weekend Brunch",
      "Drinks"
    ];

    let catMap: Record<string, any> = {};
    for (let i = 0; i < catKeys.length; i++) {
       const catId = await ctx.db.insert("categories", {
         name: catKeys[i],
         order: i,
       });
       catMap[catKeys[i]] = catId;
    }

    // --- Helpers for Reusable Modifiers ---
    const sideChoice = {
      name: "Side Choice",
      type: "single_select",
      required: true,
      options: [
        { name: "Seasoned Fries", priceExtra: 0, defaultSelected: true },
        { name: "Side Salad", priceExtra: 0 },
        { name: "Truffle Fries", priceExtra: 3.00 },
        { name: "Sweet Potato Fries", priceExtra: 2.00 },
        { name: "Breakfast Potatoes", priceExtra: 0 }
      ]
    };

    const ingredientMod = (items: string[]) => ({
      name: "Ingredients",
      type: "multi_select",
      required: false,
      options: items.map(name => ({ name, priceExtra: 0, defaultSelected: true }))
    });

    const steakTemp = {
      name: "Steak Temperature",
      type: "single_select",
      required: true,
      options: [
        { name: "Rare", priceExtra: 0 },
        { name: "Medium Rare", priceExtra: 0 },
        { name: "Medium", priceExtra: 0 },
        { name: "Medium Well", priceExtra: 0 },
        { name: "Well Done", priceExtra: 0 }
      ]
    };

    const pizzaToppings = {
      name: "Add Toppings",
      type: "multi_select",
      required: false,
      options: [
        { name: "Extra Cheese", priceExtra: 2.00 },
        { name: "Pepperoni", priceExtra: 2.50 },
        { name: "Italian Sausage", priceExtra: 2.50 },
        { name: "Mushrooms", priceExtra: 1.50 },
        { name: "Onions", priceExtra: 1.00 },
        { name: "Green Peppers", priceExtra: 1.00 },
        { name: "Black Olives", priceExtra: 1.00 },
        { name: "Jalapeños", priceExtra: 1.00 },
        { name: "Bacon", priceExtra: 3.00 }
      ]
    };

    // ==========================================
    // 1. APPETIZERS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Crab Dip",
      description: "Lump crabmeat, cream sauce, grilled pita chips.",
      price: 18.00,
      pointsWorth: 18,
      categoryId: catMap["Appetizers"],
      image: "crab_dip",
      isFeatured: true,
      modifiers: [
        {
          name: "Dipping Choice",
          type: "single_select",
          required: true,
          options: [
            { name: "Regular Pita Chips", priceExtra: 0, defaultSelected: true },
            { name: "Extra Pita Chips", priceExtra: 2.00 }
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Crispy Fried Shrimp",
      description: "Crispy fried shrimp with your choice of signature sauces.",
      price: 14.00,
      pointsWorth: 14,
      categoryId: catMap["Appetizers"],
      image: "fried_shrimp",
      isFeatured: false,
      modifiers: [
        {
          name: "Sauce Choice",
          type: "multi_select",
          required: true,
          options: [
            { name: "Tartar Sauce", priceExtra: 0 },
            { name: "Sweet & Sour Sauce", priceExtra: 0 },
            { name: "Cocktail Sauce", priceExtra: 0 }
          ]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Queso & Chorizo",
      description: "Chorizo, mexican style cheese dip and fried corn chips.",
      price: 12.00,
      pointsWorth: 12,
      categoryId: catMap["Appetizers"],
      image: "queso_chorizo",
      isFeatured: false
    });
    await ctx.db.insert("products", {
      name: "Spicy Bang-Bang Shrimp",
      description: "Fried onions, peppers and tartar sauce.",
      price: 15.00,
      pointsWorth: 15,
      categoryId: catMap["Appetizers"],
      image: "spicy_bang_bang",
      isFeatured: false
    });
    await ctx.db.insert("products", {
      name: "Loaded Short Rib Nachos",
      description: "Shredded ribs, Mexican cheese, jalapeño & tomatoes.",
      price: 16.00,
      pointsWorth: 16,
      categoryId: catMap["Appetizers"],
      image: "short_rib_nachos",
      isFeatured: true,
      modifiers: [
        {
          name: "Add Extras",
          type: "multi_select",
          required: false,
          options: [
            { name: "Extra Short Rib", priceExtra: 5.00 },
            { name: "Extra Mexican Cheese", priceExtra: 2.00 },
            { name: "Extra Jalapeños", priceExtra: 1.00 }
          ]
        },
        ingredientMod(["Jalapeños", "Tomatoes", "Mexican Cheese", "Short Rib"])
      ]
    });

    // ==========================================
    // 2. SALADS
    // ==========================================
    const saladProteins = {
      name: "Add Protein",
      type: "single_select",
      required: false,
      options: [
        { name: "No Protein", priceExtra: 0, defaultSelected: true },
        { name: "Grilled Chicken", priceExtra: 6.00 },
        { name: "Crispy Chicken", priceExtra: 6.00 },
        { name: "Grilled Shrimp", priceExtra: 8.00 },
        { name: "Grilled Salmon", priceExtra: 10.00 },
        { name: "Steak Tips", priceExtra: 12.00 }
      ]
    };

    await ctx.db.insert("products", {
      name: "Classic Caesar Salad",
      description: "Romaine, croutons, parmesan, caesar dressing.",
      price: 12.00,
      pointsWorth: 12,
      categoryId: catMap["Salads"],
      image: "caesar_salad",
      isFeatured: false,
      modifiers: [
        saladProteins,
        ingredientMod(["Croutons", "Parmesan", "Dressing"])
      ]
    });
    await ctx.db.insert("products", {
      name: "Chopped House Salad",
      description: "Bacon, tomatoes, cucumber, blue cheese & iceburg lettuce.",
      price: 14.00,
      pointsWorth: 14,
      categoryId: catMap["Salads"],
      image: "chopped_salad",
      isFeatured: false,
      modifiers: [
        saladProteins,
        ingredientMod(["Bacon", "Tomatoes", "Cucumber", "Blue Cheese", "Lettuce"])
      ]
    });
    await ctx.db.insert("products", {
      name: "Fried Goat Cheese & Arugula",
      description: "Goat cheese balls, arugula, balsamic glazed, pecans & ranch dressing.",
      price: 16.00,
      categoryId: catMap["Salads"],
      image: "goat_cheese_salad",
      isFeatured: false,
      modifiers: [
        saladProteins,
        ingredientMod(["Goat Cheese", "Arugula", "Pecans", "Ranch Dressing"])
      ]
    });

    // ==========================================
    // 3. SANDWICHES
    // ==========================================
    await ctx.db.insert("products", {
      name: "Chicago",
      description: "Yellow mustard, onions, bright pickle relish, pickle, tomatoes, sport peppers.",
      price: 14.00,
      categoryId: catMap["Sandwiches"],
      image: "chicago_dog",
      isFeatured: false,
      modifiers: [
        sideChoice,
        ingredientMod(["Mustard", "Onions", "Relish", "Pickle", "Tomatoes", "Sport Peppers"])
      ]
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
          options: [{ name: "Grilled", priceExtra: 0, defaultSelected: true }, { name: "Crispy Fried", priceExtra: 0 }]
        },
        sideChoice,
        ingredientMod(["Buffalo Sauce", "Ranch", "Bacon"])
      ]
    });
    await ctx.db.insert("products", {
      name: "Crab Cake",
      description: "Lump crabmeat served on toasted bun, arugula, tomatoes & tartar sauce.",
      price: 19.00,
      categoryId: catMap["Sandwiches"],
      image: "crab_cake",
      isFeatured: false,
      modifiers: [
        sideChoice,
        ingredientMod(["Arugula", "Tomatoes", "Tartar Sauce"])
      ]
    });
    await ctx.db.insert("products", {
      name: "Classic Philly",
      description: "Shaved prime rib or grilled chicken, grilled pepper - onion & cheese sauce.",
      price: 17.00,
      categoryId: catMap["Sandwiches"],
      image: "philly",
      isFeatured: true,
      modifiers: [
        {
          name: "Meat Choice",
          type: "single_select",
          required: true,
          options: [{ name: "Shaved Prime Rib", priceExtra: 0, defaultSelected: true }, { name: "Grilled Chicken", priceExtra: 0 }]
        },
        sideChoice,
        ingredientMod(["Peppers", "Onions", "Cheese Sauce"])
      ]
    });

    // ==========================================
    // 4. JUMBO WINGS
    // ==========================================
    const wingSauces = {
      name: "Signature Sauce",
      type: "single_select",
      required: true,
      options: [
        { name: "Classic Buffalo", priceExtra: 0 },
        { name: "Honey Garlic", priceExtra: 0 },
        { name: "Garlic Parm", priceExtra: 0 },
        { name: "Lemon Pepper", priceExtra: 0 },
        { name: "Korean BBQ", priceExtra: 0 },
        { name: "Dry Rub", priceExtra: 0 }
      ]
    };

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
            { name: "6 Pack", priceExtra: 0 },
            { name: "12 Pack", priceExtra: 10.00 },
            { name: "18 Pack", priceExtra: 19.00 }
          ]
        },
        wingSauces,
        {
          name: "Dressing Choice",
          type: "single_select",
          required: true,
          options: [
            { name: "Ranch", priceExtra: 0, defaultSelected: true },
            { name: "Blue Cheese", priceExtra: 0 },
            { name: "No Dressing", priceExtra: 0 }
          ]
        },
        ingredientMod(["Celery & Carrots"])
      ]
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
      modifiers: [steakTemp, ingredientMod(["Truffle Fries", "Slaw"])]
    });
    await ctx.db.insert("products", {
      name: "Picanha Steak",
      description: "8oz Grilled Brazilian cut, chimichurri sauce & truffle fries.",
      price: 28.00,
      categoryId: catMap["Steaks & Mains"],
      image: "picanha_steak",
      isFeatured: false,
      modifiers: [steakTemp, ingredientMod(["Chimichurri", "Truffle Fries"])]
    });

    // ==========================================
    // 6. PIZZA
    // ==========================================
    await ctx.db.insert("products", {
      name: "Build Your Own Pizza",
      description: "Start with mozzarella and our signature tomato sauce.",
      price: 15.00,
      categoryId: catMap["Pizza"],
      image: "cheese_pizza",
      isFeatured: true,
      modifiers: [
        {
          name: "Crust",
          type: "single_select",
          required: true,
          options: [{ name: "Regular", priceExtra: 0, defaultSelected: true }, { name: "Thin Crust", priceExtra: 0 }, { name: "Gluten Free", priceExtra: 3.00 }]
        },
        ingredientMod(["Mozzarella", "Tomato Sauce"]),
        pizzaToppings
      ]
    });
    await ctx.db.insert("products", {
      name: "Meat Lover Pizza",
      description: "Pepperoni, Italian sausage, bacon & ham.",
      price: 22.00,
      categoryId: catMap["Pizza"],
      image: "meat_lover_pizza",
      isFeatured: true,
      modifiers: [pizzaToppings, ingredientMod(["Ham", "Bacon", "Sausage", "Pepperoni"])]
    });

    // ==========================================
    // 7. BRUNCH
    // ==========================================
    const eggStyle = {
      name: "Egg Style",
      type: "single_select",
      required: true,
      options: [
        { name: "Scrambled", priceExtra: 0 },
        { name: "Sunny Side Up", priceExtra: 0 },
        { name: "Over Easy", priceExtra: 0 },
        { name: "Over Medium", priceExtra: 0 },
        { name: "Poached", priceExtra: 0 }
      ]
    };

    await ctx.db.insert("products", {
      name: "Classic Two-Egg Breakfast",
      description: "Two eggs any style, bacon or sausage, breakfast potatoes, toast.",
      price: 14.00,
      categoryId: catMap["Weekend Brunch"],
      image: "egg_breakfast",
      isFeatured: false,
      modifiers: [
        eggStyle,
        {
          name: "Meat Choice",
          type: "single_select",
          required: true,
          options: [{ name: "Bacon", priceExtra: 0, defaultSelected: true }, { name: "Sausage", priceExtra: 0 }, { name: "Turkey Bacon", priceExtra: 1.00 }]
        },
        sideChoice,
        ingredientMod(["Breakfast Potatoes", "Toast"])
      ]
    });

    // ==========================================
    // 8. DRINKS
    // ==========================================
    await ctx.db.insert("products", {
      name: "Draft Bud Light",
      description: "Stadium standard.",
      price: 6.00,
      pointsWorth: 6,
      categoryId: catMap["Drinks"],
      image: "beer",
      isFeatured: true,
      disclaimer: "DINE-IN ONLY: Alcohol cannot be taken to-go or curbside.",
      modifiers: [
        {
          name: "Size",
          type: "single_select",
          required: true,
          options: [{ name: "16oz Pint", priceExtra: 0, defaultSelected: true }, { name: "22oz Tall", priceExtra: 2.50 }]
        }
      ]
    });
    await ctx.db.insert("products", {
      name: "Fountain Soda",
      description: "Coke products. Free refills.",
      price: 3.50,
      pointsWorth: 3,
      categoryId: catMap["Drinks"],
      image: "soda",
      isFeatured: false,
      modifiers: [
        {
          name: "Flavor",
          type: "single_select",
          required: true,
          options: [
            { name: "Coke", priceExtra: 0 },
            { name: "Diet Coke", priceExtra: 0 },
            { name: "Sprite", priceExtra: 0 },
            { name: "Dr Pepper", priceExtra: 0 },
            { name: "Fanta Orange", priceExtra: 0 }
          ]
        },
        {
          name: "Ice Preference",
          type: "single_select",
          required: true,
          options: [{ name: "Regular Ice", priceExtra: 0, defaultSelected: true }, { name: "Light Ice", priceExtra: 0 }, { name: "No Ice", priceExtra: 0 }]
        }
      ]
    });

    return "Seeded Robust Menu with Pre-Selected Ingredients successfully.";
  }
});
