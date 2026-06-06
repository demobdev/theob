/** Heartland Retail ordering — subdomain is account-specific (Hector may update). */
export const HEARTLAND_SUBDOMAIN =
  process.env.NEXT_PUBLIC_HEARTLAND_SUBDOMAIN ?? "theownersbox";

export const HEARTLAND_ORDER_URL =
  process.env.NEXT_PUBLIC_HEARTLAND_ORDER_URL ??
  `https://${HEARTLAND_SUBDOMAIN}.retail.heartland.us`;

export const HEARTLAND_API_URL =
  process.env.NEXT_PUBLIC_HEARTLAND_API_URL ??
  `https://${HEARTLAND_SUBDOMAIN}.retail.heartland.us/api/`;

export const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";
