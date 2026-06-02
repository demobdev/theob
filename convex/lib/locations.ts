/**
 * Single-store config — Greenville MVP.
 * When multi-store launches, move to a `locations` table.
 */

export const GREENVILLE_LOCATION = {
  id: "greenville_01",
  name: "Greenville",
  addressLine1: "1757 Woodruff Rd. STE A",
  city: "Greenville",
  state: "SC",
  zip: "29607",
  fullAddress: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
  phone: "", // store line — fill when ops provides
  timezone: "America/New_York",
  /** Kitchen service window (local hour, 24h) */
  kitchenOpenHour: 11,
  kitchenCloseHour: 22,
  /** Minimum minutes from order time before customer can pick up (ASAP) */
  minPrepMinutes: 20,
  maxPrepMinutes: 30,
  /** Scheduled slots cannot start sooner than this many minutes from now */
  scheduleLeadMinutes: 30,
} as const;

export type StoreLocation = typeof GREENVILLE_LOCATION;
