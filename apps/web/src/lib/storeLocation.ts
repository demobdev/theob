/** Greenville store — keep in sync with convex/lib/locations.ts and Google Business Profile */

export const OB_COORDS = {
  lat: 34.8200749,
  lng: -82.2714396,
} as const;

export const OB_ADDRESS = {
  name: "The Owner's Box Bar & Grill",
  line1: "1757 Woodruff Rd. STE A",
  city: "Greenville",
  state: "SC",
  zip: "29607",
  full: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
  phone: "(864) 732-6963",
  phoneTel: "+18647326963",
} as const;

/** Display + schema hours — verify against Google Business Profile when they change. */
export const OB_HOURS = {
  lines: [
    "Mon · Wed · Fri: 4 PM – Midnight",
    "Thu · Sat: 11:30 AM – Midnight",
    "Sun: 10 AM – Midnight",
  ],
  brunch: "Sunday Brunch: 10 AM – 2 PM",
  schema: [
    { days: ["Monday", "Wednesday", "Friday"], opens: "16:00", closes: "00:00" },
    { days: ["Thursday", "Saturday"], opens: "11:30", closes: "00:00" },
    { days: ["Sunday"], opens: "10:00", closes: "00:00" },
  ],
} as const;

export const OB_AMENITIES = [
  "Wall-to-wall sports screens",
  "Kids menu",
  "Wi-Fi",
  "Dogs allowed outside",
  "Takeout",
  "Delivery via DoorDash",
] as const;

export const OB_MAP_ZOOM = 17;

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Simple drive estimate: ~2 min per mile, minimum 5 minutes */
export function estimateDriveMinutes(distanceMiles: number): number {
  return Math.max(5, Math.round(distanceMiles * 2));
}

export function formatDistanceAndDrive(distanceMiles: number): string {
  const miles =
    distanceMiles < 0.1
      ? "< 0.1 mi"
      : distanceMiles < 10
        ? `${distanceMiles.toFixed(1)} mi`
        : `${Math.round(distanceMiles)} mi`;
  const mins = estimateDriveMinutes(distanceMiles);
  return `${miles} · About ${mins} min drive`;
}
