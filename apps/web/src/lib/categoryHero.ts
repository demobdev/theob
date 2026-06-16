/** Category header band images (fallback — no full-viewport parallax) */

export function categoryHeroImage(categoryName: string): string {
  const n = categoryName.toLowerCase();
  if (n.includes("appetizer")) return "/images/food/official/crab-dip.png";
  if (n.includes("salad")) return "/images/food/official/featured-pizza.png";
  if (n.includes("sandwich")) return "/images/food/official/philly-cheesesteak-1.png";
  if (n.includes("wing")) return "/images/food/buffalo-wings.png";
  if (n.includes("entr") || n.includes("steak") || n.includes("main"))
    return "/images/food/official/lamb-gyro.jpg";
  if (n.includes("pizza")) return "/images/food/official/classic-neopolitan.png";
  if (n.includes("brunch")) return "/images/food/official/featured-pizza.png";
  if (n.includes("drink") || n.includes("beer"))
    return "/images/food/official/beer-classic.jpg";
  return "/images/food/buffalo-wings.png";
}
