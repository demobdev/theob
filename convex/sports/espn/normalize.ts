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
}): { wins?: number; losses?: number; draws?: number } {
  const summary = competitor.records?.[0]?.summary;
  if (!summary) return {};
  const match = summary.match(/(\d+)-(\d+)(?:-(\d+))?/);
  if (!match) return {};
  return {
    wins: Number(match[1]),
    losses: Number(match[2]),
    draws: match[3] != null ? Number(match[3]) : undefined,
  };
}

function extractEspnLogoUrl(team?: {
  logos?: Array<{ href?: string }>;
  logo?: string;
  flag?: { href?: string };
}): string | null {
  return team?.logos?.[0]?.href ?? team?.logo ?? team?.flag?.href ?? null;
}

function toSmallLogoUrl(logoUrl: string | null | undefined): string | null {
  if (!logoUrl) return null;
  return logoUrl.replace("/500/", "/100/");
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
      logos?: Array<{ href?: string }>;
      logo?: string;
      flag?: { href?: string };
    };
    athlete?: {
      id?: string;
      displayName?: string;
      fullName?: string;
      abbreviation?: string;
      shortName?: string;
    };
    records?: Array<{ summary?: string }>;
  },
  sport: SportKey,
): TeamInfo {
  const entity = competitor.team ?? competitor.athlete;
  const abbr =
    entity?.abbreviation ??
    (entity as { shortDisplayName?: string })?.shortDisplayName ??
    (entity as { shortName?: string })?.shortName ??
    null;
  const score = competitor.score != null ? Number(competitor.score) : null;
  const record = parseRecordSummary(competitor);
  const apiLogo = extractEspnLogoUrl(competitor.team);
  const logoUrl = apiLogo ?? getEspnLogoUrl(sport, abbr);

  return {
    id: entity?.id ?? competitor.id ?? "",
    name:
      entity?.displayName ??
      (entity as { fullName?: string })?.fullName ??
      "TBD",
    abbr,
    logoUrl,
    logoUrlSmall: toSmallLogoUrl(logoUrl),
    wins: record.wins ?? null,
    losses: record.losses ?? null,
    draws: record.draws ?? null,
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
  status?: { type?: { state?: string; name?: string } };
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

  let homeRaw = competition.competitors.find((c) => c.homeAway === "home");
  let awayRaw = competition.competitors.find((c) => c.homeAway === "away");

  // Individual-style events may omit home/away (ported from admin-dashboard transform).
  if ((!homeRaw || !awayRaw) && competition.competitors.length >= 2) {
    homeRaw = homeRaw ?? competition.competitors[0];
    awayRaw = awayRaw ?? competition.competitors[1];
  }

  if (!homeRaw || !awayRaw) return null;

  const startsAt = competition.date ?? event.date;
  const config = ESPN_PATHS[sportKey];
  const statusSource = competition.status?.type ?? event.status?.type;
  let status = mapEspnStatus(statusSource);
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
