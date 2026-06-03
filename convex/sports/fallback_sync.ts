/**
 * Fallback Sync Orchestrator
 *
 * Waterfall: ESPN → API-Sports → TheSportsDB
 *
 * ESPN is free (no API key). Sportradar is no longer used in this path.
 */

import { SportKey } from "./types";
import { LEAGUES } from "./leagues";
import { fetchEspnScoreboard } from "./espn/client";
import { normalizeEspnScoreboard } from "./espn/normalize";
import { applyPrimeTimeFlags } from "./espn/sync";
import { fetchApiSportsGamesForDate } from "./apisports/client";
import { normalizeApiSportsGame } from "./apisports/normalize";
import { fetchTheSportsDBEvents } from "./thesportsdb/client";
import { normalizeTheSportsDBEvent } from "./thesportsdb/normalize";
import { UpcomingGame } from "./types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Syncs a single sport for a single date using the redundant waterfall.
 */
export async function syncSportForDate(
  sport: SportKey,
  year: number,
  month: number,
  day: number,
): Promise<{ games: UpcomingGame[]; source: string }> {
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // ── SOURCE 1: ESPN (free, no key) ─────────────────────────────────────────
  try {
    const payload = await fetchEspnScoreboard(sport, dateStr);
    const normalizedGames = applyPrimeTimeFlags(normalizeEspnScoreboard(payload, sport));
    console.log(`[ESPN ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
    return { games: normalizedGames, source: "espn" };
  } catch (espnErr: unknown) {
    const message = espnErr instanceof Error ? espnErr.message : String(espnErr);
    console.warn(`[ESPN ✗] ${sport} ${dateStr}: ${message} → Trying API-Sports...`);
  }

  // ── SOURCE 2: API-Sports ──────────────────────────────────────────────────
  if (sport !== "GOLF") {
    try {
      await sleep(300);
      const rawGames = await fetchApiSportsGamesForDate(sport, dateStr);
      const normalizedGames = rawGames.map((g: unknown) =>
        normalizeApiSportsGame(g, sport),
      );

      console.log(`[API-Sports ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
      return { games: normalizedGames, source: "apisports" };
    } catch (asErr: unknown) {
      const message = asErr instanceof Error ? asErr.message : String(asErr);
      console.warn(`[API-Sports ✗] ${sport} ${dateStr}: ${message} → Trying TheSportsDB...`);
    }
  }

  // ── SOURCE 3: TheSportsDB ─────────────────────────────────────────────────
  if (sport !== "GOLF") {
    try {
      await sleep(300);
      const rawEvents = await fetchTheSportsDBEvents(sport, dateStr);
      const normalizedGames = rawEvents
        .map((e: unknown) => normalizeTheSportsDBEvent(e, sport))
        .filter((g): g is UpcomingGame => g !== null);

      console.log(`[TheSportsDB ✓] ${sport} ${dateStr}: ${normalizedGames.length} games`);
      return { games: normalizedGames, source: "thesportsdb" };
    } catch (tsdbErr: unknown) {
      const message = tsdbErr instanceof Error ? tsdbErr.message : String(tsdbErr);
      console.error(`[TheSportsDB ✗] ${sport} ${dateStr}: All sources failed. ${message}`);
    }
  }

  console.error(`[ALL SOURCES FAILED] ${sport} ${dateStr}`);
  return { games: [], source: "none" };
}

/**
 * Syncs all sports for the next N days using the redundant waterfall.
 */
export async function syncUpcomingWeekWithFallback(
  ctx: any,
  api: any,
  daysToSync: number = 8,
): Promise<{ synced: number; errors: string[]; sourceReport: Record<string, string> }> {
  let totalSynced = 0;
  const errors: string[] = [];
  const sourceReport: Record<string, string> = {};
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

        await sleep(1200);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const msg = `${sport} (${dateStr}): ${message}`;
        errors.push(msg);
        console.error(`[Sync Error] ${msg}`);
        await sleep(1200);
      }
    }
  }

  return { synced: totalSynced, errors, sourceReport };
}
