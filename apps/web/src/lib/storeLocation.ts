/** Greenville store — keep in sync with convex/lib/locations.ts */

export const OB_COORDS = {
  lat: 34.8289,
  lng: -82.3235,
} as const;

export const OB_ADDRESS = {
  name: "The Owner's Box",
  line1: "1757 Woodruff Rd. STE A",
  city: "Greenville",
  state: "SC",
  zip: "29607",
  full: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
  phone: "(864) 555-0123",
} as const;

export const OB_MAP_ZOOM = 15;

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
