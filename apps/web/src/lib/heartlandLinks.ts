/** Heartland POS online ordering — override via NEXT_PUBLIC_HEARTLAND_ORDER_URL. */
export const HEARTLAND_SUBDOMAIN =
  process.env.NEXT_PUBLIC_HEARTLAND_SUBDOMAIN ?? "ownersbox";

export const HEARTLAND_ORDER_URL =
  process.env.NEXT_PUBLIC_HEARTLAND_ORDER_URL ??
  "https://ownersbox.hrpos.heartland.us";

export const HEARTLAND_API_URL =
  process.env.NEXT_PUBLIC_HEARTLAND_API_URL ??
  `https://${HEARTLAND_SUBDOMAIN}.retail.heartland.us/api/`;

export const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";
