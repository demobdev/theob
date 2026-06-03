/**
 * Greenville bar venue timezone — matches convex/lib/venueTimezone.ts
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

function anchorForCalendarDay(ymd: string): Date {
  return new Date(`${ymd}T17:00:00Z`);
}

export function formatVenueWeekdayShort(
  ymd: string,
  timeZone: string = VENUE_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
  })
    .format(anchorForCalendarDay(ymd))
    .toUpperCase();
}

export function formatVenueMonthDay(
  ymd: string,
  timeZone: string = VENUE_TIMEZONE,
): string {
  const anchor = anchorForCalendarDay(ymd);
  const month = new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
  })
    .format(anchor)
    .toUpperCase();
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "numeric",
  }).format(anchor);
  return `${month} ${day}`;
}

export function formatVenueTime(
  iso: string,
  timeZone: string = VENUE_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatVenueDateShort(
  iso: string,
  timeZone: string = VENUE_TIMEZONE,
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  })
    .format(new Date(iso))
    .toUpperCase();
}

export type VenueDayPill = {
  id: string;
  label: string;
  subLabel: string;
  fullDate: string;
};

export function getVenueNext7Days(
  timeZone: string = VENUE_TIMEZONE,
): VenueDayPill[] {
  const today = getVenueCalendarDate(new Date(), timeZone);
  const days: VenueDayPill[] = [];
  for (let i = 0; i < 7; i++) {
    const fullDate = addCalendarDays(today, i);
    days.push({
      id: fullDate,
      label: i === 0 ? "TODAY" : formatVenueWeekdayShort(fullDate, timeZone),
      subLabel: formatVenueMonthDay(fullDate, timeZone),
      fullDate,
    });
  }
  return days;
}

const UFC_PILL_WINDOW_DAYS = 14;
const UFC_HERO_WINDOW_DAYS = 14;

export function isUfcInUpcomingWindow(
  startsAt: string,
  status: string | undefined,
  windowDays: number = UFC_PILL_WINDOW_DAYS,
): boolean {
  if (status === "closed") return false;
  const now = Date.now();
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const t = new Date(startsAt).getTime();
  return t >= now - 12 * 60 * 60 * 1000 && t <= now + windowMs;
}

export { UFC_PILL_WINDOW_DAYS, UFC_HERO_WINDOW_DAYS };
