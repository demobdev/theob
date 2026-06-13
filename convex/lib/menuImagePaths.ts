/** Slug → public path under /images/food (shared by seed sync + upload script). */
const SLUG_ALIASES: Record<string, string> = {
  crab_cake: "crabcake_sandwich",
  "bud-light": "bud_light",
};

export function normalizeImageSlug(image: string): string {
  const trimmed = image.trim();
  if (trimmed.startsWith("/")) {
    const match = trimmed.match(/\/images\/food\/([^/]+)\.(png|jpe?g|webp)$/i);
    if (match) return match[1]!;
  }
  return trimmed.replace(/\.(png|jpe?g|webp)$/i, "");
}

export function resolveFoodImageSlug(slug: string): string {
  const key = normalizeImageSlug(slug);
  return SLUG_ALIASES[key] ?? key;
}

export function foodImagePublicPath(slug: string): string {
  return `/images/food/${resolveFoodImageSlug(slug)}.png`;
}
