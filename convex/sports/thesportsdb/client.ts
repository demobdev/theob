/**
 * TheSportsDB Fallback Client (Last Resort)
 * 
 * Free V1 API — no auth required, key = "123"
 * Unlimited requests. Good logo coverage.
 * https://www.thesportsdb.com/api/v1/json/123/
 */

const TSDB_BASE = "https://www.thesportsdb.com/api/v1/json/123";

// Sport name mapping for TheSportsDB
const SPORT_NAME_MAP: Record<string, string> = {
  NBA: "Basketball",
  NHL: "Ice Hockey",
  MLB: "Baseball",
  NFL: "American Football",
};

/**
 * Fetches events for a given sport on a specific date.
 * @param sport - Internal sport key (NBA, NHL, MLB, NFL)
 * @param date - Date string in YYYY-MM-DD format
 */
export async function fetchTheSportsDBEvents(
  sport: string,
  date: string // YYYY-MM-DD
): Promise<any[]> {
  const sportName = SPORT_NAME_MAP[sport.toUpperCase()];
  if (!sportName) return [];

  const url = `${TSDB_BASE}/eventsday.php?d=${date}&s=${encodeURIComponent(sportName)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TheSportsDB error ${response.status}`);
    }
    const data = await response.json() as any;
    return data.events ?? [];
  } catch (err: any) {
    console.error(`[TheSportsDB] Failed to fetch ${sport} events for ${date}:`, err.message);
    return [];
  }
}
