/**
 * API-Sports Client (api-sports.io)
 * 
 * Free fallback for NBA, NHL, MLB, NFL when Sportradar fails or hits quota.
 * Free plan: 100 requests/day.
 * Key header: x-apisports-key
 */

const API_SPORTS_KEY = process.env.API_SPORTS_KEY;
const API_SPORTS_BASE = "https://v3.football.api-sports.io";

// API-Sports league IDs for each sport
// Note: API-Sports is primarily football but has a separate endpoint structure per sport
// We use api-sports.io which has basketball, hockey, baseball, american-football endpoints
export const API_SPORTS_LEAGUES: Record<string, { leagueId: number; season: number; baseUrl: string }> = {
  NBA: { leagueId: 12,  season: 2024, baseUrl: "https://v1.basketball.api-sports.io" },
  NHL: { leagueId: 57,  season: 2024, baseUrl: "https://v1.hockey.api-sports.io" },
  MLB: { leagueId: 1,   season: 2025, baseUrl: "https://v1.baseball.api-sports.io" },
  NFL: { leagueId: 1,   season: 2024, baseUrl: "https://v1.american-football.api-sports.io" },
};

export async function apiSportsFetch<T>(
  sport: string,
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  if (!API_SPORTS_KEY) {
    throw new Error("API_SPORTS_KEY is not configured");
  }

  const config = API_SPORTS_LEAGUES[sport.toUpperCase()];
  if (!config) {
    throw new Error(`No API-Sports config for sport: ${sport}`);
  }

  const url = new URL(`${config.baseUrl}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-apisports-key": API_SPORTS_KEY,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API-Sports [${sport}] error ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = await response.json() as any;

  // API-Sports returns errors in the body even with 200 status
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`API-Sports [${sport}] API error: ${JSON.stringify(data.errors)}`);
  }

  return data as T;
}

/**
 * Fetch games for a given sport and date.
 * Returns raw API-Sports game array.
 */
export async function fetchApiSportsGamesForDate(
  sport: string,
  date: string // YYYY-MM-DD
): Promise<any[]> {
  const config = API_SPORTS_LEAGUES[sport.toUpperCase()];
  if (!config) return [];

  const data = await apiSportsFetch<any>(sport, "/games", {
    league: config.leagueId,
    season: config.season,
    date,
  });

  return data.response ?? [];
}
