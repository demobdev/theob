import { UpcomingGame, SportKey, GameStatus } from "../types";

/**
 * Normalizes Sportradar Game Statuses to our internal enum
 */
export function mapStatus(srStatus: string): GameStatus {
  const statusMap: Record<string, GameStatus> = {
    "scheduled": "scheduled",
    "created": "scheduled",
    "inprogress": "inprogress",
    "live": "inprogress",
    "in_progress": "inprogress",
    "complete": "closed",
    "closed": "closed",
    "final": "closed",
    "f/ot": "closed",
    "f/so": "closed",
    "cancelled": "cancelled",
    "canceled": "cancelled",
    "postponed": "postponed",
    "delayed": "postponed",
  };

  return statusMap[srStatus.toLowerCase()] || "scheduled";
}

/**
 * Normalizes Sportradar game objects into our internal UpcomingGame shape.
 * Note: Payload structure varies slightly between NFL/NCAAF and NBA/NHL.
 */
/**
 * Maps Sportradar team aliases to ESPN CDN-working slugs.
 * MLB Sportradar aliases (e.g. "NYY") don't always match ESPN slugs (e.g. "nyyankees").
 * This provides reliable logo URLs.
 */
// Sportradar alias → ESPN CDN slug lookup tables
// These cover both the primary alias and alternate aliases Sportradar might return
const MLB_ALIAS_TO_ESPN: Record<string, string> = {
  ARI: "ari", AZ: "ari",  ATL: "atl", BAL: "bal", BOS: "bos", CHC: "chc",
  CWS: "chw", CIN: "cin", CLE: "cle", COL: "col", DET: "det",
  HOU: "hou", KC: "kc", LAA: "laa", LAD: "lad", MIA: "mia",
  MIL: "mil", MIN: "min", NYM: "nym", NYY: "nyy", OAK: "oak", ATH: "oak",
  PHI: "phi", PIT: "pit", SD: "sd", SF: "sf", SEA: "sea",
  STL: "stl", TB: "tb", TEX: "tex", TOR: "tor", WSH: "wsh",
  CHW: "chw", SDP: "sd", SFG: "sf", TBR: "tb", KCR: "kc",
};

const NHL_ALIAS_TO_ESPN: Record<string, string> = {
  ANA: "ana", ARI: "ari", BOS: "bos", BUF: "buf", CGY: "cgy",
  CAR: "car", CHI: "chi", COL: "col", CBJ: "cbj", DAL: "dal",
  DET: "det", EDM: "edm", FLA: "fla", LA: "lak", LAK: "lak", MIN: "min",
  MTL: "mtl", NSH: "nsh", NJ: "njd", NJD: "njd", NYI: "nyi", NYR: "nyr",
  OTT: "ott", PHI: "phi", PIT: "pit", SJ: "sjs", SJS: "sjs", SEA: "sea",
  STL: "stl", TB: "tbl", TBL: "tbl", TOR: "tor", VAN: "van", VGK: "vgk",
  WSH: "wsh", WPG: "wpg",
};

const NBA_ALIAS_TO_ESPN: Record<string, string> = {
  ATL: "atl", BOS: "bos", BKN: "bkn", BRK: "bkn", CHA: "cha", CHI: "chi",
  CLE: "cle", DAL: "dal", DEN: "den", DET: "det",
  // Golden State — Sportradar uses "GS" but ESPN uses "gsw"
  GS: "gsw", GSW: "gsw",
  HOU: "hou", IND: "ind", LAC: "lac",
  // Lakers — Sportradar uses "LA" and sometimes "LAL"
  LA: "lal", LAL: "lal",
  MEM: "mem", MIA: "mia", MIL: "mil", MIN: "min",
  NO: "no", NOP: "no",
  NY: "ny", NYK: "ny",
  OKC: "okc", ORL: "orl", PHI: "phi", PHX: "phx",
  POR: "por", SAC: "sac", SA: "sa", SAS: "sa", TOR: "tor",
  UTA: "utah", UTAH: "utah", WAS: "wsh", WSH: "wsh",
};

function getEspnLogoUrl(sport: SportKey, alias?: string): string | null {
  if (!alias) return null;
  const upper = alias.toUpperCase();

  let espnSlug: string | undefined;
  if (sport === "MLB") espnSlug = MLB_ALIAS_TO_ESPN[upper];
  else if (sport === "NHL") espnSlug = NHL_ALIAS_TO_ESPN[upper];
  else if (sport === "NBA") espnSlug = NBA_ALIAS_TO_ESPN[upper];
  else if (sport === "NFL") espnSlug = upper.toLowerCase();

  // Fall back to lowercased alias if no explicit mapping
  const slug = espnSlug ?? alias.toLowerCase();
  return `https://a.espncdn.com/i/teamlogos/${sport.toLowerCase()}/500/${slug}.png`;
}

export function normalizeGame(game: any, sport: SportKey, league: string): UpcomingGame {
  // 1. Resolve Home/Away teams
  let home = game.home;
  let away = game.away;

  if (!home || !away) {
    home = game.competitors?.find((c: any) => c.qualifier === "home" || c.home_away === "home");
    away = game.competitors?.find((c: any) => c.qualifier === "away" || c.home_away === "away");
  }

  // 2. Resolve startsAt
  const startTime = game.scheduled || game.start_time || game.starts_at;

  // 3. Probable pitcher extraction (MLB daily-games.xsd: home.probable_pitcher)
  function extractPitcher(team: any) {
    const p = team?.probable_pitcher ?? team?.starting_pitcher;
    if (!p) return null;
    return {
      fullName: p.full_name ?? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim(),
      wins: p.win ?? undefined,
      losses: p.loss ?? undefined,
      era: p.era != null ? parseFloat(p.era) : undefined,
    };
  }

  // 4. Weather (common.xsd: weatherType → forecast conditionsType)
  const wx = game.weather?.forecast ?? game.weather?.current_conditions;
  const weather = wx ? {
    tempF: wx.temp_f != null ? Number(wx.temp_f) : null,
    condition: wx.condition ?? null,
    humidity: wx.humidity != null ? Number(wx.humidity) : null,
    windSpeedMph: wx.wind?.speed_mph != null ? Number(wx.wind.speed_mph) : null,
    windDirection: wx.wind?.direction ?? null,
  } : undefined;

  // 5. Broadcast — the schedule has game.broadcast.network (string) or game.broadcasts[]
  const broadcastNetwork =
    game.broadcast?.network ??
    game.broadcasts?.broadcast?.[0]?.network ??
    game.broadcasts?.[0]?.network ??
    null;

  // Score: MLB puts runs on home/away objects; NHL/NBA put home_points/away_points at game root
  const homeScoreRaw = game.home_points ?? home?.points ?? home?.runs ?? null;
  const awayScoreRaw = game.away_points ?? away?.points ?? away?.runs ?? null;

  return {
    id: crypto.randomUUID(),
    externalId: game.id,
    sport,
    league,
    status: (function() {
      const mapped = mapStatus(game.status);
      const isFuture = startTime && new Date(startTime) > new Date();
      // If a game is in the future but Sportradar Trial says it's closed, force it to scheduled.
      if (mapped === "closed" && isFuture) return "scheduled";
      return mapped;
    })(),
    startsAt: startTime,
    dayNight: game.day_night as "D" | "N" | null ?? null,
    doubleHeader: game.double_header ?? null,
    broadcast: broadcastNetwork,
    attendance: game.attendance ? Number(game.attendance) : null,
    weather,
    homeTeam: {
      id: home?.id || "",
      name: home?.name || home?.alias || home?.abbr || "Home Team",
      abbr: home?.alias || home?.abbr || home?.name?.substring(0, 3).toUpperCase(),
      logoUrl: getEspnLogoUrl(sport, home?.alias || home?.abbr),
      wins: home?.win ?? null,
      losses: home?.loss ?? null,
      runs: homeScoreRaw,
      hits: home?.hits ?? null,
      errors: home?.errors ?? null,
      score: homeScoreRaw,
      probablePitcher: extractPitcher(home),
    },
    awayTeam: {
      id: away?.id || "",
      name: away?.name || away?.alias || away?.abbr || "Away Team",
      abbr: away?.alias || away?.abbr || away?.name?.substring(0, 3).toUpperCase(),
      logoUrl: getEspnLogoUrl(sport, away?.alias || away?.abbr),
      wins: away?.win ?? null,
      losses: away?.loss ?? null,
      runs: awayScoreRaw,
      hits: away?.hits ?? null,
      errors: away?.errors ?? null,
      score: awayScoreRaw,
      probablePitcher: extractPitcher(away),
    },
    venue: game.venue ? {
      name: game.venue.name,
      city: game.venue.city,
      state: game.venue.state,
      capacity: game.venue.capacity ? Number(game.venue.capacity) : null,
      surface: game.venue.surface ?? null,
      stadiumType: game.venue.stadium_type ?? null,
      fieldOrientation: game.venue.field_orientation ?? null,
    } : undefined,
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Normalizes Sportradar Golf Tournament objects into our internal UpcomingGame shape.
 * Schema ref: Golf_v3/schedule-v3.0.xsd + common-v3.0.xsd
 *
 * Tournament attributes: id, name, start_date, end_date, status, purse, winning_share
 * Venue attributes: id, name, city, state
 * Course attributes: id, name, par, yardage (nested under venue)
 */
export function normalizeGolfTournament(tournament: any): UpcomingGame {
  // Course name comes from venue.course[0] or venue.course (if single object)
  const courses = tournament.venue?.course;
  const primaryCourse = Array.isArray(courses) ? courses[0] : courses;

  return {
    id: crypto.randomUUID(),
    externalId: tournament.id,
    sport: "GOLF",
    league: "PGA Tour",
    status: mapStatus(tournament.status || "scheduled"),
    startsAt: tournament.start_date,
    tournamentName: tournament.name,
    venue: tournament.venue ? {
      name: primaryCourse?.name ?? tournament.venue.name, // Course name is more useful than venue name
      city: tournament.venue.city,
      state: tournament.venue.state,
    } : undefined,
    // Store purse and end_date in extended fields for the UI
    editorialNote: tournament.end_date
      ? `${new Date(tournament.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(tournament.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : undefined,
    lastSyncedAt: new Date().toISOString(),
  };
}
