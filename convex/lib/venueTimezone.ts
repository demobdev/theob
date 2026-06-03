/**
 * Venue calendar boundaries for Greenville (America/New_York).
 * Live Games date pills, filtering, and card labels use this timezone — not UTC or device local.
 */
export const VENUE_TIMEZONE = "America/New_York";

export function getVenueCalendarDate(
  iso: string | Date,
  timeZone: string = VENUE_TIMEZONE,
): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function addCalendarDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}
