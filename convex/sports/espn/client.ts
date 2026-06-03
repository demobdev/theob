import type { SportKey } from "../types";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

/** OB sport → ESPN scoreboard path segments (see ESPN_MIGRATION.md). */
export const ESPN_PATHS: Record<
  SportKey,
  { sport: string; league: string; label: string }
> = {
  NFL: { sport: "football", league: "nfl", label: "NFL" },
  NCAAF: { sport: "football", league: "college-football", label: "College Football" },
  NBA: { sport: "basketball", league: "nba", label: "NBA" },
  MLB: { sport: "baseball", league: "mlb", label: "MLB" },
  NHL: { sport: "hockey", league: "nhl", label: "NHL" },
  GOLF: { sport: "golf", league: "pga", label: "PGA Tour" },
  UFC: { sport: "mma", league: "ufc", label: "UFC" },
};

export type EspnScoreboardResponse = {
  events?: unknown[];
};

/**
 * Fetch ESPN scoreboard for a calendar day.
 * @param ymd - `YYYY-MM-DD` (converted to ESPN `dates=YYYYMMDD`)
 */
export async function fetchEspnScoreboard(
  sportKey: SportKey,
  ymd: string,
): Promise<EspnScoreboardResponse> {
  const path = ESPN_PATHS[sportKey];
  const datesParam = ymd.replace(/-/g, "");
  const url = `${ESPN_BASE}/${path.sport}/${path.league}/scoreboard?dates=${datesParam}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`ESPN ${sportKey} ${ymd}: HTTP ${res.status}`);
  }

  return (await res.json()) as EspnScoreboardResponse;
}
