/**
 * Sportradar API Client
 * 
 * Handles authenticated requests to Sportradar endpoints.
 * Recommended to be called from server-side only.
 */

const SPORTRADAR_API_KEY = process.env.SPORTRADAR_API_KEY;
const ACCESS_LEVEL = process.env.SPORTRADAR_ACCESS_LEVEL || "trial";

/**
 * Resolves the API key based on the sport context.
 */
function resolveApiKey(sport?: string): string | undefined {
  if (!sport) return SPORTRADAR_API_KEY;

  const keyMap: Record<string, string | undefined> = {
    NFL: process.env.SPORTRADAR_NFL_KEY,
    NCAAF: process.env.SPORTRADAR_NCAAF_KEY,
    NBA: process.env.SPORTRADAR_NBA_KEY,
    MLB: process.env.SPORTRADAR_MLB_KEY,
    NHL: process.env.SPORTRADAR_NHL_KEY,
    GOLF: process.env.SPORTRADAR_GOLF_KEY,
  };

  return keyMap[sport.toUpperCase()] || SPORTRADAR_API_KEY;
}

export async function sportradarFetch<T>(endpoint: string, sport?: string): Promise<T> {
  const apiKey = resolveApiKey(sport);

  if (!apiKey) {
    throw new Error(`Missing API key for ${sport || 'global'} Sportradar access`);
  }

  // Base URL pattern: https://api.sportradar.com/{league}/{access_level}/{version}/{language_code}/...
  // Most endpoints start with this prefix.
  const baseUrl = "https://api.sportradar.com";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Sportradar API Error [${response.status}]:`, errorBody);
    throw new Error(`Sportradar API error ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper to build standard schedule endpoints
 */
export function buildScheduleUrl(
  leagueKey: string,
  version: string,
  year: number,
  seasonType: string = "REG",
  format: string = "json"
) {
  return `/${leagueKey}/${ACCESS_LEVEL}/${version}/en/games/${year}/${seasonType}/schedule.${format}`;
}

/**
 * Helper to build Daily Schedule endpoints (preferred for Trial keys)
 */
export function buildDailyScheduleUrl(
  leagueKey: string,
  version: string,
  year: number,
  month: number,
  day: number,
  format: string = "json"
) {
  // Format month and day to be 2 digits
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `/${leagueKey}/${ACCESS_LEVEL}/${version}/en/games/${year}/${mm}/${dd}/schedule.${format}`;
}

/**
 * Helper to build Golf tournament schedule endpoints
 */
export function buildGolfScheduleUrl(
  tour: string,
  version: string,
  year: number,
  format: string = "json"
) {
  return `/golf/${ACCESS_LEVEL}/${version}/en/${tour}/${year}/tournaments/schedule.${format}`;
}
