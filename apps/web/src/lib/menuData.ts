export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  imageKey?: string; // used to link to AI generated images
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuData: MenuCategory[] = [
  {
    id: "appetizers",
    title: "Appetizers & Shares",
    items: [
      { id: "app-1", name: "Crab Dip", description: "Lump crabmeat, cream sauce, grilled pita chips", imageKey: "crab_dip" },
      { id: "app-2", name: "Crispy Fried Shrimp", description: "Served with tartar & sweet & sour sauce", imageKey: "fried_shrimp" },
      { id: "app-3", name: "Queso & Chorizo", description: "Chorizo, Mexican style cheese dip, and fried corn chips" },
      { id: "app-4", name: "Spicy Bang-Bang Shrimp", description: "Fried onions, peppers, and tartar sauce", imageKey: "bang_bang_shrimp" },
      { id: "app-5", name: "Crispy Calamari", description: "Lightly breaded and fried to perfection" },
      { id: "app-6", name: "Loaded Short Rib Nachos", description: "Shredded ribs, Mexican cheese, jalapeño & tomatoes" },
      { id: "app-7", name: "The Owner's Wings", description: "Jumbo, Boneless, or Cauliflower. Buffalo, Honey Garlic, Garlic Parm, Lemon Pepper, Korean BBQ, or Sweet Chili.", imageKey: "wings" },
      { id: "app-8", name: "Crab Cake Platter", description: "Lump crabmeat served on truffle mashed, arugula, tomatoes & caper sauce" },
    ],
  },
  {
    id: "salads",
    title: "Fresh Salads",
    items: [
      { id: "sal-1", name: "Classic Caesar", description: "Romaine, croutons, parmesan. (Add chicken, shrimp, salmon, or steak)" },
      { id: "sal-2", name: "Chopped House Salad", description: "Bacon, tomatoes, cucumber, blue cheese & iceberg lettuce" },
      { id: "sal-3", name: "Fried Goat Cheese & Arugula", description: "Goat cheese balls, arugula, balsamic glaze, pecans & ranch dressing" },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwiches & Burgers",
    items: [
      { id: "snd-1", name: "Chicago Hot Dog", description: "Yellow mustard, onions, bright pickle relish, pickle, tomatoes, sport peppers" },
      { id: "snd-2", name: "The Bar Chicken", description: "Grilled or crispy fried chicken with buffalo sauce, ranch & smoked bacon", imageKey: "chicken_sandwich" },
      { id: "snd-3", name: "Crab Cake Sandwich", description: "Lump crabmeat served on a toasted bun with arugula, tomatoes & tartar sauce" },
      { id: "snd-4", name: "Classic Philly", description: "Shaved prime rib or grilled chicken, grilled pepper-onion & cheese sauce", imageKey: "philly" },
    ],
  },
  {
    id: "entrees",
    title: "Steaks & Entrées",
    items: [
      { id: "ent-1", name: "Rib Eye Steak", description: "14oz seared rib eye, truffle fries & slaw", imageKey: "rib_eye" },
      { id: "ent-2", name: "NY Strip", description: "10oz NY strip, truffle fries and grilled mushrooms" },
      { id: "ent-3", name: "Picanha Steak", description: "8oz Grilled Brazilian cut, chimichurri sauce & truffle fries" },
      { id: "ent-4", name: "Coho Salmon", description: "6oz Chilean salmon, truffle mashed, caper sauce" },
    ],
  },
  {
    id: "pizza",
    title: "Artisan Pizza",
    items: [
      { id: "piz-1", name: "Classic Neapolitan", description: "Fresh mozzarella, traditional mozzarella, basil & tomatoes", imageKey: "neapolitan_pizza" },
      { id: "piz-2", name: "Meat Lover", description: "Pepperoni, Italian sausage, bacon & ham" },
      { id: "piz-3", name: "Supreme Pizza", description: "Pepperoni, mushrooms, sausage, tomatoes, mozzarella" },
      { id: "piz-4", name: "Chicken Alfredo Pizza", description: "Chicken, Alfredo sauce, mozzarella, parmesan & olive oil" },
    ],
  },
  {
    id: "brunch",
    title: "Weekend Brunch (Sat & Sun 9AM - 2PM)",
    items: [
      { id: "brn-1", name: "Short Rib Hash", description: "Braised short rib, roasted potatoes, peppers, onions, sunny egg", imageKey: "short_rib_hash" },
      { id: "brn-2", name: "Crispy Chicken & Waffles", description: "Buttermilk fried chicken, Belgian waffle, maple hot sauce", imageKey: "chicken_waffles" },
      { id: "brn-3", name: "Steak & Eggs", description: "Grilled steak, two eggs any style, breakfast potatoes" },
      { id: "brn-4", name: "Salmon Avocado Toast", description: "Grilled salmon, smashed avocado, arugula" },
      { id: "brn-5", name: "The Owner's Brunch Options", description: "Pancakes, French Toast, Skillets, and Omelets available." },
    ],
  }
];
