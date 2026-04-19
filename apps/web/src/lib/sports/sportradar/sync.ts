import { LEAGUES } from "../leagues";
import { sportradarFetch, buildScheduleUrl, buildGolfScheduleUrl } from "./client";
import { normalizeGame, normalizeGolfTournament } from "./normalize";
import { UpcomingGame, SportKey } from "../types";

/**
 * Syncs upcoming games for all supported leagues.
 * In a real production app, this would be a Cron job or Serverless Function.
 */
export async function syncAllLeagues(): Promise<{ synced: number; errors: string[] }> {
  let totalSynced = 0;
  const errors: string[] = [];

  const year = new Date().getFullYear();

  for (const leagueKey of Object.keys(LEAGUES) as SportKey[]) {
    try {
      const config = LEAGUES[leagueKey];
      let normalizedGames: UpcomingGame[] = [];

      if (leagueKey === "GOLF") {
        const endpoint = buildGolfScheduleUrl(config.sportradarLeagueKey, config.apiVersion, year);
        const payload = await sportradarFetch<any>(endpoint, leagueKey);
        const tournaments = payload.tournaments || [];
        normalizedGames = tournaments.map(normalizeGolfTournament);
      } else {
        const endpoint = buildScheduleUrl(config.sportradarLeagueKey, config.apiVersion, year);
        const payload = await sportradarFetch<any>(endpoint, leagueKey);
        const rawGames = payload.games || [];
        normalizedGames = rawGames.map((g: any) => normalizeGame(g, leagueKey, config.label));
      }
      
      // TODO: Upsert into Database
      // await db.from('games_upcoming').upsert(normalizedGames);
      
      totalSynced += normalizedGames.length;
      console.log(`Synced ${normalizedGames.length} events for ${leagueKey}`);
    } catch (err: any) {
      console.error(`Failed to sync ${leagueKey}:`, err.message);
      errors.push(`${leagueKey}: ${err.message}`);
    }
  }

  return { synced: totalSynced, errors };
}
