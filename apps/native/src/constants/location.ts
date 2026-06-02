/** Greenville single-store — keep in sync with convex/lib/locations.ts */
export const GREENVILLE = {
  id: "greenville_01",
  name: "Greenville",
  fullAddress: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
  minPrepMinutes: 20,
  maxPrepMinutes: 30,
  scheduleLeadMinutes: 30,
  kitchenOpenHour: 11,
  kitchenCloseHour: 22,
} as const;

export function formatAsapWindow(now = new Date()): string {
  const start = new Date(
    now.getTime() + GREENVILLE.minPrepMinutes * 60_000,
  );
  const end = new Date(
    now.getTime() + GREENVILLE.maxPrepMinutes * 60_000,
  );
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `Today, ${fmt(start)} - ${fmt(end)}`;
}

export function estimatedReadyAtIso(now = new Date()): string {
  return new Date(
    now.getTime() + GREENVILLE.maxPrepMinutes * 60_000,
  ).toISOString();
}
