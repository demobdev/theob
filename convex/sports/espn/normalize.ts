import type { GameStatus, SportKey, TeamInfo, UpcomingGame } from "../types";
import { getEspnLogoUrl } from "./logos";
import { ESPN_PATHS } from "./client";

function mapEspnStatus(statusType: { state?: string; name?: string } | undefined): GameStatus {
  const state = statusType?.state?.toLowerCase();
  const name = statusType?.name?.toLowerCase() ?? "";

  if (state === "in" || name.includes("in_progress") || name.includes("halftime")) {
    return "inprogress";
  }
  if (
    state === "post" ||
    name.includes("final") ||
    name.includes("complete") ||
    name.includes("full_time")
  ) {
    return "closed";
  }
  if (name.includes("cancel")) return "cancelled";
  if (name.includes("postpone") || name.includes("delay")) return "postponed";
  return "scheduled";
}

function parseRecordSummary(competitor: {
  records?: Array<{ summary?: string }>;
}): { wins?: number; losses?: number } {
  const summary = competitor.records?.[0]?.summary;
  if (!summary) return {};
  const match = summary.match(/(\d+)-(\d+)/);
  if (!match) return {};
  return { wins: Number(match[1]), losses: Number(match[2]) };
}

function normalizeCompetitor(
  competitor: {
    id?: string;
    homeAway?: string;
    score?: string;
    team?: {
      id?: string;
      displayName?: string;
      abbreviation?: string;
      shortDisplayName?: string;
    };
    records?: Array<{ summary?: string }>;
  },
  sport: SportKey,
): TeamInfo {
  const abbr = competitor.team?.abbreviation ?? competitor.team?.shortDisplayName ?? null;
  const score = competitor.score != null ? Number(competitor.score) : null;
  const record = parseRecordSummary(competitor);

  return {
    id: competitor.team?.id ?? competitor.id ?? "",
    name: competitor.team?.displayName ?? "TBD",
    abbr,
    logoUrl: getEspnLogoUrl(sport, abbr),
    wins: record.wins ?? null,
    losses: record.losses ?? null,
    score,
    runs: sport === "MLB" ? score : null,
  };
}

function extractBroadcast(competition: {
  broadcasts?: Array<{ names?: string[]; shortName?: string }>;
}): string | null {
  const names = competition.broadcasts
    ?.flatMap((b) => b.names ?? (b.shortName ? [b.shortName] : []))
    .filter(Boolean);
  if (!names?.length) return null;
  return [...new Set(names)].join(", ");
}

type EspnCompetitor = Parameters<typeof normalizeCompetitor>[0];

type EspnTeamEvent = {
  id: string;
  date: string;
  name?: string;
  competitions?: Array<{
    id?: string;
    date?: string;
    status?: { type?: { state?: string; name?: string } };
    competitors?: EspnCompetitor[];
    venue?: {
      fullName?: string;
      address?: { city?: string; state?: string };
    };
    broadcasts?: Array<{ names?: string[]; shortName?: string }>;
    attendance?: number;
  }>;
};

/**
 * Team-sport event (NFL, NBA, MLB, NHL, NCAAF).
 */
export function normalizeEspnEvent(
  event: EspnTeamEvent,
  sportKey: SportKey,
): UpcomingGame | null {
  const competition = event.competitions?.[0];
  if (!competition?.competitors?.length) return null;

  const homeRaw = competition.competitors.find((c) => c.homeAway === "home");
  const awayRaw = competition.competitors.find((c) => c.homeAway === "away");
  if (!homeRaw || !awayRaw) return null;

  const startsAt = competition.date ?? event.date;
  const config = ESPN_PATHS[sportKey];
  let status = mapEspnStatus(competition.status?.type);
  if (status === "closed" && startsAt && new Date(startsAt) > new Date()) {
    status = "scheduled";
  }

  return {
    id: crypto.randomUUID(),
    externalId: `espn-${event.id}`,
    sport: sportKey,
    league: config.label,
    status,
    startsAt,
    homeTeam: normalizeCompetitor(homeRaw, sportKey),
    awayTeam: normalizeCompetitor(awayRaw, sportKey),
    broadcast: extractBroadcast(competition),
    attendance: competition.attendance ?? null,
    venue: competition.venue
      ? {
          name: competition.venue.fullName ?? null,
          city: competition.venue.address?.city ?? null,
          state: competition.venue.address?.state ?? null,
        }
      : undefined,
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Golf events use tournament-style scoreboard entries.
 */
export function normalizeEspnGolfEvent(event: {
  id: string;
  date: string;
  name?: string;
  status?: { type?: { state?: string; name?: string } };
}): UpcomingGame {
  return {
    id: crypto.randomUUID(),
    externalId: `espn-${event.id}`,
    sport: "GOLF",
    league: "PGA Tour",
    status: mapEspnStatus(event.status?.type),
    startsAt: event.date,
    tournamentName: event.name ?? "PGA Tour",
    lastSyncedAt: new Date().toISOString(),
  };
}

export function normalizeEspnScoreboard(
  payload: { events?: unknown[] },
  sportKey: SportKey,
): UpcomingGame[] {
  const events = payload.events ?? [];
  const games: UpcomingGame[] = [];

  for (const raw of events) {
    const event = raw as {
      id: string;
      date: string;
      name?: string;
      competitions?: unknown[];
      status?: { type?: { state?: string; name?: string } };
    };
    if (!event?.id || !event?.date) continue;

    if (sportKey === "GOLF") {
      games.push(normalizeEspnGolfEvent(event));
      continue;
    }

    const normalized = normalizeEspnEvent(event as EspnTeamEvent, sportKey);
    if (normalized) games.push(normalized);
  }

  return games;
}
