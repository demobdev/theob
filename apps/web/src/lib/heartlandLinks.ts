import { sanitizePublicUrl } from "@/lib/envUrl";

const DEFAULT_HEARTLAND_SUBDOMAIN = "ownersbox";
const DEFAULT_HEARTLAND_ORDER_URL = "https://ownersbox.hrpos.heartland.us";
const DEFAULT_HEARTLAND_API_URL = "https://theownersbox.retail.heartland.us/api";

/** Heartland POS online ordering — override via NEXT_PUBLIC_HEARTLAND_ORDER_URL. */
export const HEARTLAND_SUBDOMAIN =
  process.env.NEXT_PUBLIC_HEARTLAND_SUBDOMAIN?.trim().replace(/^["']+|["']+$/g, "") ||
  DEFAULT_HEARTLAND_SUBDOMAIN;

export const HEARTLAND_ORDER_URL = sanitizePublicUrl(
  process.env.NEXT_PUBLIC_HEARTLAND_ORDER_URL,
  DEFAULT_HEARTLAND_ORDER_URL,
);

export const HEARTLAND_API_URL = sanitizePublicUrl(
  process.env.NEXT_PUBLIC_HEARTLAND_API_URL,
  DEFAULT_HEARTLAND_API_URL,
);

export const HERO_VIDEO_URL =
  process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "/hero.mp4";
