/**
 * Program upcoming bar events here — same idea as editing menuData or a blog post list.
 * Set `published: false` to hide an event without deleting it.
 */
export type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  time?: string;
  tag?: string;
  href?: string;
  image?: string;
  published?: boolean;
};

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "world-cup-usa-aus",
    title: "World Cup Watch Party: USA vs Australia",
    description: "Every screen, every angle. Pull up early for the 3 PM ET kickoff — wings, cold drinks, and USA chants.",
    date: "2026-06-19",
    time: "3:00 PM",
    tag: "⚽ World Cup",
    image: "/images/world-cup-watch-party.JPEG",
    published: false,
  },
  {
    id: "mlb-sunday-brunch",
    title: "Sunday Brunch & Baseball",
    description: "Brunch specials from 10 AM – 2 PM, mimosas, and every afternoon MLB game on the board.",
    date: "2026-06-22",
    time: "10:00 AM",
    tag: "Weekly",
    image: "/images/atmosphere/big-wall-left-1.jpg",
  },
  {
    id: "ufc-fight-night",
    title: "UFC Fight Night Watch Party",
    description: "Main card on every wall. Wing buckets and drink specials all night.",
    date: "2026-06-28",
    time: "7:00 PM",
    tag: "Watch Party",
    image: "/images/atmosphere/wide-view-from-right.jpg",
  },
  {
    id: "trivia-thursday",
    title: "Trivia Night",
    description: "Teams of up to six. Prizes, pizza specials, and cold pours between rounds.",
    date: "2026-07-03",
    time: "7:30 PM",
    tag: "Weekly",
  },
  {
    id: "mls-weekend",
    title: "MLS Weekend Kickoff",
    description: "Early matches, late matches, and a seat for every kickoff on the wall.",
    date: "2026-07-05",
    time: "12:30 PM",
    tag: "Soccer",
    image: "/images/atmosphere/cinematic-dtl-1.jpg",
  },
  {
    id: "fantasy-draft",
    title: "Fantasy Draft Night",
    description: "Reserve a table, plug in your league, and draft with the room behind you.",
    date: "2026-07-12",
    time: "6:00 PM",
    tag: "Groups",
    href: "/locations#contact",
  },
  {
    id: "live-music-friday",
    title: "Live Music on the Patio",
    description: "Local sets, craft cocktails, and late-night bites while the room stays loud.",
    date: "2026-07-18",
    time: "8:00 PM",
    tag: "Live Music",
    image: "/images/food/official/late-night-fun.jpg",
  },
  {
    id: "college-football-kickoff",
    title: "College Football Kickoff",
    description: "Opening weekend on every screen. Book a table early for your crew.",
    date: "2026-08-30",
    time: "11:00 AM",
    tag: "Watch Party",
    image: "/images/atmosphere/dtl-1.jpg",
    href: "/locations#contact",
  },
];

export function parseEventDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function monthKeyFromDate(date: string): string {
  const parsed = parseEventDate(date);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthTabLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });
}

export function formatEventDay(date: string): {
  weekday: string;
  day: string;
  month: string;
} {
  const parsed = parseEventDate(date);
  return {
    weekday: parsed.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    day: String(parsed.getDate()),
    month: parsed.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

export function getPublishedUpcomingEvents(now = new Date()): UpcomingEvent[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return UPCOMING_EVENTS.filter((event) => event.published !== false)
    .filter((event) => parseEventDate(event.date) >= startOfToday)
    .sort(
      (left, right) =>
        parseEventDate(left.date).getTime() - parseEventDate(right.date).getTime(),
    );
}

export function getUpcomingEventMonthKeys(events: UpcomingEvent[]): string[] {
  const keys = new Set<string>();
  for (const event of events) {
    keys.add(monthKeyFromDate(event.date));
  }
  return Array.from(keys).sort();
}

export function getDefaultMonthKey(monthKeys: string[], now = new Date()): string | null {
  if (monthKeys.length === 0) return null;

  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  return monthKeys.find((key) => key >= currentKey) ?? monthKeys[0];
}

export function getEventsForMonth(
  events: UpcomingEvent[],
  monthKey: string,
): UpcomingEvent[] {
  return events.filter((event) => monthKeyFromDate(event.date) === monthKey);
}
