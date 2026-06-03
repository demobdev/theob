/** Category header band images (fallback — no full-viewport parallax) */

export function categoryHeroImage(categoryName: string): string {
  const n = categoryName.toLowerCase();
  if (n.includes("appetizer")) return "/images/menu/crispy_calamari.png";
  if (n.includes("salad")) return "/images/menu/chopped_salad.png";
  if (n.includes("sandwich")) return "/images/menu/crabcake_sandwich.png";
  if (n.includes("wing")) return "/images/menu/jumbo_wings.png";
  if (n.includes("entr") || n.includes("steak") || n.includes("main"))
    return "/images/menu/rib_eye.png";
  if (n.includes("pizza")) return "/images/menu/meat_lover_pizza.png";
  if (n.includes("brunch")) return "/images/menu/chicken_waffles.png";
  if (n.includes("drink") || n.includes("beer")) return "/images/menu/cheese_pizza.png";
  return "/images/menu/jumbo_wings.png";
}
