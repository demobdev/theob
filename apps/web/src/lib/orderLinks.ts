/** Heartland online ordering — set NEXT_PUBLIC_HEARTLAND_ORDER_URL in .env.local */

export function getHeartlandOrderUrl(): string {
  return process.env.NEXT_PUBLIC_HEARTLAND_ORDER_URL ?? "#";
}

/** DoorDash store page — set NEXT_PUBLIC_DOORDASH_STORE_URL in .env.local */

export function getDoorDashStoreUrl(): string {
  return process.env.NEXT_PUBLIC_DOORDASH_STORE_URL ?? "#";
}
