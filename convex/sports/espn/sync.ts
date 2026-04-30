import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";
import { fetchEspnScoreboard, EspnSport, EspnLeague } from "./client";
import { transformEspnGame } from "./transform";

import { SportKey } from "../types";

const LEAGUES: { sport: EspnSport; league: EspnLeague; sportKey: SportKey }[] = [
  { sport: "football", league: "nfl", sportKey: "NFL" },
  { sport: "basketball", league: "nba", sportKey: "NBA" },
  { sport: "baseball", league: "mlb", sportKey: "MLB" },
  { sport: "hockey", league: "nhl", sportKey: "NHL" },
  { sport: "football", league: "college-football", sportKey: "NCAAF" },
  { sport: "soccer", league: "usa.1", sportKey: "SOCCER" },
  { sport: "soccer", league: "eng.1", sportKey: "SOCCER" },
  { sport: "basketball", league: "wnba", sportKey: "WNBA" },
  { sport: "racing", league: "f1", sportKey: "F1" },
  { sport: "golf", league: "pga", sportKey: "GOLF" },
  { sport: "tennis", league: "atp", sportKey: "TENNIS" },
  { sport: "tennis", league: "wta", sportKey: "TENNIS" },
];

export async function syncEspnGames(ctx: ActionCtx) {
  let synced = 0;
  const errors: string[] = [];

  // Generate an array of the next 7 days in YYYYMMDD format
  const datesToFetch: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    datesToFetch.push(`${year}${month}${day}`);
  }

  for (const { sport, league, sportKey } of LEAGUES) {
    for (const dateStr of datesToFetch) {
      try {
        console.log(`[ESPN Sync] Fetching ${league.toUpperCase()} for ${dateStr}...`);
        const data = await fetchEspnScoreboard(sport, league, dateStr);
        const events = data.events || [];
        const batch: any[] = [];
        let gameCount = 0;
        for (const event of events) {
          try {
            const transformed = transformEspnGame(event, sportKey, league);
            
            // Automatically flag the first 2 games of every sport/date as PrimeTime
            // unless they are already over. This keeps the carousel full.
            const isUpcoming = transformed.status === "upcoming" || transformed.status === "live";
            const gameWithFlags = {
                ...transformed,
                isPrimeTime: isUpcoming && gameCount < 2 ? true : undefined
            };
            
            batch.push(gameWithFlags);
            gameCount++;
          } catch (err: any) {
            console.error(`[ESPN Sync] Error transforming event ${event.id}:`, err.message);
            errors.push(`${league}: ${err.message}`);
          }
        }
  
        if (batch.length > 0) {
          await ctx.runMutation(api.sports_mutations.upsertGames, { games: batch });
          synced += batch.length;
        }
      } catch (err: any) {
        console.error(`[ESPN Sync] Error fetching ${league} for ${dateStr}:`, err.message);
        errors.push(`${league}: ${err.message}`);
      }
    }
  }

  return { synced, errors };
}
