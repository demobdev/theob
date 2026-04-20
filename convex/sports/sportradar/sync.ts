import { LEAGUES } from "../leagues";
import { sportradarFetch, buildDailyScheduleUrl, buildGolfScheduleUrl } from "./client";
import { normalizeGame, normalizeGolfTournament } from "./normalize";
import { UpcomingGame, SportKey } from "../types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Syncs upcoming games for the next 7 days across all leagues.
 * Optimized for trial keys with 1 req/sec limit.
 */
export async function syncUpcomingWeek(ctx: any, api: any): Promise<{ synced: number; errors: string[] }> {
  let totalSynced = 0;
  const errors: string[] = [];
  
  // We sync today + next 7 days
  const daysToSync = 8;
  const now = new Date();

  for (let i = 0; i < daysToSync; i++) {
    const targetDate = new Date();
    targetDate.setDate(now.getDate() + i);
    
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1; // 1-indexed
    const day = targetDate.getDate();

    console.log(`--- Syncing games for ${year}-${month}-${day} ---`);

    for (const leagueKey of Object.keys(LEAGUES) as SportKey[]) {
      try {
        const config = LEAGUES[leagueKey];
        let normalizedGames: UpcomingGame[] = [];

        if (leagueKey === "GOLF") {
          // Golf is different - season schedule is fine, only sync it once a week
          if (i > 0) continue; 
          const endpoint = buildGolfScheduleUrl(config.sportradarLeagueKey, config.apiVersion, year);
          const payload = await sportradarFetch<any>(endpoint, leagueKey);
          const tournaments = payload.tournaments || [];
          normalizedGames = tournaments.map(normalizeGolfTournament);
        } else {
          const endpoint = buildDailyScheduleUrl(config.sportradarLeagueKey, config.apiVersion, year, month, day);
          const payload = await sportradarFetch<any>(endpoint, leagueKey);
          const rawGames = payload.games || [];
          normalizedGames = rawGames.map((g: any) => normalizeGame(g, leagueKey, config.label));
        }
        
        if (normalizedGames.length > 0) {
          const chunkSize = 100;
          for (let j = 0; j < normalizedGames.length; j += chunkSize) {
            const chunk = normalizedGames.slice(j, j + chunkSize);
            await ctx.runMutation(api.sports_mutations.upsertGames, { games: chunk });
          }
        }
        
        totalSynced += normalizedGames.length;
        console.log(`Synced ${normalizedGames.length} ${leagueKey} games for ${month}/${day}`);
        
        // RATE LIMIT: trial keys allow 1 req / sec
        await sleep(1200); 
        
      } catch (err: any) {
        console.error(`Failed ${leagueKey} sync for date ${month}/${day}:`, err.message);
        errors.push(`${leagueKey} (${month}/${day}): ${err.message}`);
        // Even on error, wait a bit
        await sleep(1200);
      }
    }
  }

  return { synced: totalSynced, errors };
}

/**
 * Legacy season-wide sync (kept for compatibility if needed)
 */
export async function syncAllLeagues(ctx: any, api: any): Promise<{ synced: number; errors: string[] }> {
  // Redirecting to the more efficient weekly sync for now
  return syncUpcomingWeek(ctx, api);
}
