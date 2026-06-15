import { HEARTLAND_ORDER_URL } from "@/lib/heartlandLinks";

/** Heartland online ordering — override via NEXT_PUBLIC_HEARTLAND_ORDER_URL in .env.local */

export function getHeartlandOrderUrl(): string {
  return HEARTLAND_ORDER_URL;
}

/** DoorDash store page — set NEXT_PUBLIC_DOORDASH_STORE_URL in .env.local */

export function getDoorDashStoreUrl(): string {
  return process.env.NEXT_PUBLIC_DOORDASH_STORE_URL ?? "#";
}
