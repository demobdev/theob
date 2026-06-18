const MENU_IMAGE_KEYS = new Set([
  "boneless_wings",
  "cheese_pizza",
  "queso_chorizo",
  "spicy_bang_bang",
  "crispy_calamari",
  "chopped_salad",
  "goat_cheese_salad",
  "chicago_dog",
  "crabcake_sandwich",
  "cauliflower_wings",
  "crab_dip",
  "fried_shrimp",
  "bar_chicken",
  "philly",
  "rib_eye",
  "coho_salmon",
  "picanha_steak",
  "ny_strip",
  "short_rib_hash",
  "neapolitan_pizza",
  "caesar_salad",
  "jumbo_wings",
  "meat_lover_pizza",
  "short_rib_nachos",
  "steak_and_eggs",
  "chicken_waffles",
  "supreme_pizza",
  "ham_pineapple",
  "chicken_alfredo_pizza",
  "egg_breakfast",
  "pancakes",
  "breakfast_skillet",
  "beer",
  "soda",
  "cocktail",
  "bud_light",
  "coca_cola",
  "diet_coke",
  "coke_zero",
  "sprite",
  "bottled_coke",
  "bottled_diet_coke",
  "bottled_sprite",
]);

/** Real photography overrides for menu slugs (checked before default .png paths). */
export const REAL_IMAGE_OVERRIDES: Record<string, string> = {
  crab_dip: "/images/food/official/crab-dip.png",
  crab_cake: "/images/food/official/crab-dip.png",
  crabcake_sandwich: "/images/food/official/crab-dip.png",
  jumbo_wings: "/images/food/buffalo-wings.png",
  wings: "/images/food/buffalo-wings.png",
  boneless_wings: "/images/food/garlic-parm-wings.png",
  cauliflower_wings: "/images/food/lemon-pepper-wings-2.png",
  spicy_bang_bang: "/images/food/official/bang-bang-shrimp-3.png",
  bang_bang_shrimp: "/images/food/official/bang-bang-shrimp-3.png",
  fried_shrimp: "/images/food/official/bang-bang-shrimp.jpg",
  crispy_calamari: "/images/food/official/bang-bang-shrimp-3.png",
  queso_chorizo: "/images/food/official/crab-dip.png",
  short_rib_nachos: "/images/food/official/bang-bang-shrimp-3.png",
  philly: "/images/food/official/philly-cheesesteak-1.png",
  bar_chicken: "/images/food/official/philly-cheesesteak-1.png",
  chicago_dog: "/images/food/official/philly-cheesesteak-1.png",
  neapolitan_pizza: "/images/food/official/classic-neopolitan.png",
  cheese_pizza: "/images/food/official/featured-pizza.png",
  meat_lover_pizza: "/images/food/official/featured-pizza.png",
  supreme_pizza: "/images/food/official/buffalo-pizza.jpg",
  chicken_alfredo_pizza: "/images/food/official/featured-pizza.png",
  ham_pineapple: "/images/food/official/buffalo-pizza.jpg",
  buffalo_pizza: "/images/food/official/buffalo-pizza.jpg",
  rib_eye: "/images/food/official/lamb-gyro.jpg",
  picanha_steak: "/images/food/official/lamb-gyro.jpg",
  ny_strip: "/images/food/official/lamb-gyro.jpg",
  coho_salmon: "/images/food/official/lamb-gyro.jpg",
  caesar_salad: "/images/food/official/hand-fry-dipped.jpg",
  chopped_salad: "/images/food/official/hand-fry-dipped.jpg",
  goat_cheese_salad: "/images/food/official/hand-fry-dipped.jpg",
  short_rib_hash: "/images/food/official/scratch-made.png",
  chicken_waffles: "/images/food/official/scratch-made.png",
  steak_and_eggs: "/images/food/official/scratch-made.png",
  egg_breakfast: "/images/food/official/scratch-made.png",
  pancakes: "/images/food/official/scratch-made.png",
  breakfast_skillet: "/images/food/official/scratch-made.png",
  beer: "/images/food/official/beer-classic.jpg",
  cocktail: "/images/drinks/espresso-martini-2.jpg",
};

const DRINK_LIKE = new Set([
  "beer",
  "soda",
  "cocktail",
  "bud_light",
  "bud-light",
  "coca_cola",
  "diet_coke",
  "coke_zero",
  "sprite",
  "bottled_coke",
  "bottled_diet_coke",
  "bottled_sprite",
]);

export function isDrinkImageKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.toLowerCase();
  return (
    DRINK_LIKE.has(k) ||
    k.includes("beer") ||
    k.includes("drink") ||
    k.includes("coke") ||
    k.includes("sprite") ||
    k.includes("soda")
  );
}

/** Resolve Convex product.image slug or URL to a public path */
export function resolveProductImageSrc(
  image: string | undefined | null,
): string | null {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/")) return image;

  const key = image.replace(/\.(png|jpe?g|webp)$/i, "");
  const aliases: Record<string, string> = {
    crab_cake: "crabcake_sandwich",
    "bud-light": "bud_light",
  };
  const resolved = aliases[key] ?? key;

  if (REAL_IMAGE_OVERRIDES[resolved]) {
    return REAL_IMAGE_OVERRIDES[resolved];
  }

  if (MENU_IMAGE_KEYS.has(resolved) || aliases[key]) {
    return `/images/food/${resolved}.png`;
  }
  if (resolved === "logo_b") {
    return "/loading-icon.png";
  }
  return `/images/food/${resolved}.png`;
}

export function productImageAspect(
  image: string | undefined | null,
  categoryName?: string,
): "square" | "portrait" {
  const key = image?.replace(/\.(png|jpe?g|webp)$/i, "") ?? "";
  if (isDrinkImageKey(key)) return "square";
  const cat = categoryName?.toLowerCase() ?? "";
  if (cat.includes("drink") || cat.includes("beer")) return "square";
  return "portrait";
}
