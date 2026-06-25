import { REAL_IMAGE_OVERRIDES } from "./productImage";

/** Category header band images — real photography where available. */

const CATEGORY_HERO_IMAGES: Record<string, string> = {
  appetizer: "/images/food/official/crab-dip.png",
  salad: "/images/food/official/hand-fry-dipped.jpg",
  sandwich: "/images/food/official/philly-cheesesteak-1.png",
  wing: "/images/food/buffalo-wings.png",
  steak: "/images/food/official/ribeye-steak.jpg",
  main: "/images/food/official/ribeye-steak.jpg",
  pizza: "/images/food/official/classic-neopolitan.png",
  brunch: "/images/food/official/scratch-made.png",
  drink: "/images/food/official/beer-classic.jpg",
  beer: "/images/food/official/beer-classic.jpg",
};

export function categoryHeroImage(categoryName: string): string {
  const n = categoryName.toLowerCase();

  if (n.includes("appetizer")) return CATEGORY_HERO_IMAGES.appetizer;
  if (n.includes("salad")) return CATEGORY_HERO_IMAGES.salad;
  if (n.includes("sandwich")) return CATEGORY_HERO_IMAGES.sandwich;
  if (n.includes("wing")) return CATEGORY_HERO_IMAGES.wing;
  if (n.includes("entr") || n.includes("steak") || n.includes("main"))
    return CATEGORY_HERO_IMAGES.steak;
  if (n.includes("pizza")) return CATEGORY_HERO_IMAGES.pizza;
  if (n.includes("brunch")) return CATEGORY_HERO_IMAGES.brunch;
  if (n.includes("drink") || n.includes("beer")) return CATEGORY_HERO_IMAGES.drink;

  return REAL_IMAGE_OVERRIDES.jumbo_wings ?? CATEGORY_HERO_IMAGES.wing;
}
