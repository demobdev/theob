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
]);

const DRINK_LIKE = new Set(["beer", "soda", "cocktail", "bud_light", "bud-light"]);

export function isDrinkImageKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.toLowerCase();
  return DRINK_LIKE.has(k) || k.includes("beer") || k.includes("drink");
}

/** Resolve Convex product.image slug or URL to a public path */
export function resolveProductImageSrc(
  image: string | undefined | null,
): string | null {
  if (!image) return null;
  if (image.startsWith("http") || image.startsWith("/")) return image;

  const key = image.replace(/\.(png|jpe?g|webp)$/i, "");
  if (MENU_IMAGE_KEYS.has(key)) {
    return `/images/food/${key}.png`;
  }
  return `/images/food/${key}.png`;
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
