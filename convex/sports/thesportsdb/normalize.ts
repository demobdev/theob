/**
 * TheSportsDB → UpcomingGame normalizer
 */
import { UpcomingGame, SportKey } from "../types";

function mapTSDBStatus(status: string | null): "scheduled" | "inprogress" | "closed" | "cancelled" | "postponed" {
  if (!status) return "scheduled";
  const s = status.toLowerCase();
  if (s.includes("progress") || s === "live") return "inprogress";
  if (s.includes("finish") || s === "ft" || s.includes("final")) return "closed";
  if (s.includes("post") || s.includes("cancel")) return "postponed";
  return "scheduled";
}

export function normalizeTheSportsDBEvent(event: any, sport: SportKey): UpcomingGame | null {
  // Skip events without proper team data
  if (!event.strHomeTeam || !event.strAwayTeam) return null;

  // Date + time: TheSportsDB provides dateEvent (YYYY-MM-DD) and strTime (HH:MM:SS)
  const startTime = event.dateEvent && event.strTime
    ? `${event.dateEvent}T${event.strTime}Z`
    : event.dateEvent ?? null;

  const homeScore = event.intHomeScore != null ? Number(event.intHomeScore) : null;
  const awayScore = event.intAwayScore != null ? Number(event.intAwayScore) : null;
  const isFinished = homeScore !== null && awayScore !== null;

  return {
    id: crypto.randomUUID(),
    externalId: event.idEvent ?? undefined,
    sport,
    league: event.strLeague ?? sport,
    status: isFinished ? "closed" : mapTSDBStatus(event.strStatus),
    startsAt: startTime,
    broadcast: event.strTVStation ?? null,
    homeTeam: {
      id: event.idHomeTeam ?? "",
      name: event.strHomeTeam,
      abbr: event.strHomeTeam.substring(0, 3).toUpperCase(),
      // TheSportsDB provides badge URLs directly
      logoUrl: event.strHomeTeamBadge ?? null,
      wins: null,
      losses: null,
      score: homeScore,
      runs: homeScore,
      hits: null,
      errors: null,
      probablePitcher: null,
    },
    awayTeam: {
      id: event.idAwayTeam ?? "",
      name: event.strAwayTeam,
      abbr: event.strAwayTeam.substring(0, 3).toUpperCase(),
      logoUrl: event.strAwayTeamBadge ?? null,
      wins: null,
      losses: null,
      score: awayScore,
      runs: awayScore,
      hits: null,
      errors: null,
      probablePitcher: null,
    },
    venue: event.strVenue ? {
      name: event.strVenue,
      city: event.strCity ?? null,
    } : undefined,
    lastSyncedAt: new Date().toISOString(),
  };
}
