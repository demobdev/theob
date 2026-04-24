/**
 * API-Sports → UpcomingGame normalizer
 *
 * Maps the API-Sports game response format to our internal UpcomingGame schema.
 * API-Sports basketball/hockey/baseball/football share a similar structure.
 */
import { UpcomingGame, SportKey } from "../types";

function mapApiSportsStatus(status: string): "scheduled" | "inprogress" | "closed" | "cancelled" | "postponed" {
  const s = (status || "").toLowerCase();
  if (["ns", "tbd"].includes(s)) return "scheduled";
  if (["live", "1h", "2h", "ht", "et", "bt", "p", "q1", "q2", "q3", "q4", "ot", "p1", "p2", "p3", "inprogress"].includes(s)) return "inprogress";
  if (["ft", "aet", "pen", "finished", "after ot", "after et", "aot"].includes(s)) return "closed";
  if (["pst", "cancelled", "canc"].includes(s)) return "postponed";
  if (["abd", "awd", "wo"].includes(s)) return "cancelled";
  return "scheduled";
}

function getApiSportsLogoUrl(teamId: number, sport: SportKey): string {
  const sportPaths: Record<string, string> = {
    NBA: "basketball",
    NHL: "hockey",
    MLB: "baseball",
    NFL: "american-football",
  };
  const path = sportPaths[sport] ?? "basketball";
  return `https://media.api-sports.io/${path}/teams/${teamId}.png`;
}

export function normalizeApiSportsGame(game: any, sport: SportKey): UpcomingGame {
  const home = game.teams?.home;
  const away = game.teams?.away;
  const scores = game.scores;

  // Resolve scores based on sport structure
  const homeScore = scores?.home?.total ?? scores?.home?.points ?? null;
  const awayScore = scores?.away?.total ?? scores?.away?.points ?? null;

  // Start time: game.date or game.time combined with game.date
  const startTime = game.date ?? null;

  const statusShort = game.status?.short ?? game.status?.long ?? "NS";
  const mappedStatus = mapApiSportsStatus(statusShort);

  return {
    id: crypto.randomUUID(),
    externalId: String(game.id),
    sport,
    league: sport,
    status: mappedStatus,
    startsAt: startTime,
    broadcast: game.league?.name ?? null,
    homeTeam: {
      id: String(home?.id ?? ""),
      name: home?.name ?? "Home",
      abbr: (home?.name ?? "HOM").substring(0, 3).toUpperCase(),
      logoUrl: home?.id ? getApiSportsLogoUrl(home.id, sport) : null,
      wins: null,
      losses: null,
      score: homeScore,
      runs: homeScore,
      hits: null,
      errors: null,
      probablePitcher: null,
    },
    awayTeam: {
      id: String(away?.id ?? ""),
      name: away?.name ?? "Away",
      abbr: (away?.name ?? "AWY").substring(0, 3).toUpperCase(),
      logoUrl: away?.id ? getApiSportsLogoUrl(away.id, sport) : null,
      wins: null,
      losses: null,
      score: awayScore,
      runs: awayScore,
      hits: null,
      errors: null,
      probablePitcher: null,
    },
    venue: game.venue ? {
      name: game.venue.name ?? null,
      city: game.venue.city ?? null,
    } : undefined,
    lastSyncedAt: new Date().toISOString(),
  };
}
