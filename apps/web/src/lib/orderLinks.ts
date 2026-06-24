import { HEARTLAND_ORDER_URL } from "@/lib/heartlandLinks";

/** Internal path — server redirect avoids malformed client env URLs. */
export const ORDER_PAGE_PATH = "/order";

/** Heartland online ordering destination (used by /order redirect). */
export function getHeartlandOrderUrl(): string {
  return HEARTLAND_ORDER_URL;
}

/** Use for all in-site “Order” buttons and links. */
export function getOrderPagePath(): string {
  return ORDER_PAGE_PATH;
}

/** DoorDash delivery — override with NEXT_PUBLIC_DOORDASH_STORE_URL if needed. */
export const DOORDASH_STORE_URL =
  "https://www.doordash.com/store/the-owners-box-greenville-46961901/112144748/";

export function getDoorDashStoreUrl(): string {
  return process.env.NEXT_PUBLIC_DOORDASH_STORE_URL ?? DOORDASH_STORE_URL;
}
