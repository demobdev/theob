/**
 * Fallback Sync Orchestrator
 * 
 * Waterfall: Sportradar → API-Sports → TheSportsDB
 * 
 * Each source is tried in order. If one fails (quota exceeded, missing key,
 * network error), we automatically fall back to the next.
 */

import { SportKey } from "./types";
import { LEAGUES } from "./leagues";
import { sportradarFetch, buildDailyScheduleUrl, buildGolfScheduleUrl } from "./sportradar/client";
import { normalizeGame, normalizeGolfTournament } from "./sportradar/normalize";
import { fetchApiSportsGamesForDate } from "./apisports/client";
import { normalizeApiSportsGame } from "./apisports/normalize";
import { fetchTheSportsDBEvents } from "./thesportsdb/client";
import { normalizeTheSportsDBEvent } from "./thesportsdb/normalize";
import { UpcomingGame } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Syncs a single sport for a single date using the 3-source waterfall.
 * Returns the normalized games, regardless of which source succeeded.
 */
export async function syncSportForDate(
  sport: SportKey,
  year: number,
  month: number,
  day: number
): Promise<{ games: UpcomingGame[]; source: string }> {
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const config = LEAGUES[sport];

  // ── SOURCE 1: Sportradar ──────────────────────────────────────────────────
  try {
    let normalizedGames: UpcomingGame[] = [];

    if (sport === "GOLF") {
      const endpoint = buildGolfScheduleUrl(config.sportradarLeagueKey, config.apiVersion, year);
      const payload = await sportradarFetch<any>(endpoint, sport);
      const tournaments = payload.tournaments || [];
      normalizedGames = tournaments.map(normalizeGolfTournament);
    } else {
      const endpoint = buildDailyScheduleUrl(
        config.sportradarLeagueKey,
        config.apiVersion,
        year, month, day
      );
      const payload = await sportradarFetch<any>(endpoint, sport);
      const rawGames = payload.games || [];
      normalizedGames = rawGames.map((g: any) => normalizeGame(g, sport, config.label));
    }

    console.log(`[Sportradar ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
    return { games: normalizedGames, source: "sportradar" };

  } catch (srErr: any) {
    console.warn(`[Sportradar ✗] ${sport} ${dateStr}: ${srErr.message} → Trying API-Sports...`);
  }

  // ── SOURCE 2: API-Sports ──────────────────────────────────────────────────
  if (sport !== "GOLF") { // API-Sports doesn't have Golf
    try {
      await sleep(300); // small buffer between sources
      const rawGames = await fetchApiSportsGamesForDate(sport, dateStr);
      const normalizedGames = rawGames.map((g: any) => normalizeApiSportsGame(g, sport));

      console.log(`[API-Sports ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
      return { games: normalizedGames, source: "apisports" };

    } catch (asErr: any) {
      console.warn(`[API-Sports ✗] ${sport} ${dateStr}: ${asErr.message} → Trying TheSportsDB...`);
    }
  }

  // ── SOURCE 3: TheSportsDB (Last Resort) ───────────────────────────────────
  if (sport !== "GOLF") {
    try {
      await sleep(300);
      const rawEvents = await fetchTheSportsDBEvents(sport, dateStr);
      const normalizedGames = rawEvents
        .map((e: any) => normalizeTheSportsDBEvent(e, sport))
        .filter((g): g is UpcomingGame => g !== null);

      console.log(`[TheSportsDB ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
      return { games: normalizedGames, source: "thesportsdb" };

    } catch (tsdbErr: any) {
      console.error(`[TheSportsDB ✗] ${sport} ${dateStr}: All sources failed. ${tsdbErr.message}`);
    }
  }

  // All sources failed — return empty rather than crash the whole sync
  console.error(`[ALL SOURCES FAILED] ${sport} ${dateStr}`);
  return { games: [], source: "none" };
}

/**
 * Syncs all sports for the next N days using the redundant waterfall.
 */
export async function syncUpcomingWeekWithFallback(
  ctx: any,
  api: any,
  daysToSync: number = 8
): Promise<{ synced: number; errors: string[]; sourceReport: Record<string, string> }> {
  let totalSynced = 0;
  const errors: string[] = [];
  const sourceReport: Record<string, string> = {}; // sport-date → source used
  const now = new Date();

  const sports = Object.keys(LEAGUES) as SportKey[];

  for (let i = 0; i < daysToSync; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + i);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    console.log(`\n=== Syncing ${dateStr} ===`);

    for (const sport of sports) {
      try {
        const { games, source } = await syncSportForDate(sport, year, month, day);
        sourceReport[`${sport}-${dateStr}`] = source;

        if (games.length > 0) {
          const chunkSize = 100;
          for (let j = 0; j < games.length; j += chunkSize) {
            const chunk = games.slice(j, j + chunkSize);
            await ctx.runMutation(api.sports_mutations.upsertGames, { games: chunk });
          }
          totalSynced += games.length;
        }

        // Rate limit buffer between sports
        await sleep(1200);

      } catch (err: any) {
        const msg = `${sport} (${dateStr}): ${err.message}`;
        errors.push(msg);
        console.error(`[Sync Error] ${msg}`);
        await sleep(1200);
      }
    }
  }

  return { synced: totalSynced, errors, sourceReport };
}
