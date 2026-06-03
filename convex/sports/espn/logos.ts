import type { SportKey } from "../types";

const MLB_ALIAS_TO_ESPN: Record<string, string> = {
  ARI: "ari", AZ: "ari", ATL: "atl", BAL: "bal", BOS: "bos", CHC: "chc",
  CWS: "chw", CHW: "chw", CIN: "cin", CLE: "cle", COL: "col", DET: "det",
  HOU: "hou", KC: "kc", LAA: "laa", LAD: "lad", MIA: "mia",
  MIL: "mil", MIN: "min", NYM: "nym", NYY: "nyy", OAK: "oak", ATH: "oak",
  PHI: "phi", PIT: "pit", SD: "sd", SF: "sf", SEA: "sea",
  STL: "stl", TB: "tb", TEX: "tex", TOR: "tor", WSH: "wsh",
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
  GS: "gsw", GSW: "gsw",
  HOU: "hou", IND: "ind", LAC: "lac", LA: "lal", LAL: "lal",
  MEM: "mem", MIA: "mia", MIL: "mil", MIN: "min",
  NO: "no", NOP: "no", NY: "ny", NYK: "ny",
  OKC: "okc", ORL: "orl", PHI: "phi", PHX: "phx",
  POR: "por", SAC: "sac", SA: "sa", SAS: "sa", TOR: "tor",
  UTA: "utah", UTAH: "utah", WAS: "wsh", WSH: "wsh",
};

export function getEspnLogoUrl(sport: SportKey, abbr?: string | null): string | null {
  if (!abbr) return null;
  const upper = abbr.toUpperCase();

  let espnSlug: string | undefined;
  if (sport === "MLB") espnSlug = MLB_ALIAS_TO_ESPN[upper];
  else if (sport === "NHL") espnSlug = NHL_ALIAS_TO_ESPN[upper];
  else if (sport === "NBA") espnSlug = NBA_ALIAS_TO_ESPN[upper];
  else if (sport === "NFL" || sport === "NCAAF") espnSlug = upper.toLowerCase();

  const slug = espnSlug ?? abbr.toLowerCase();
  const folder =
    sport === "NFL" || sport === "NCAAF"
      ? "nfl"
      : sport === "NBA"
        ? "nba"
        : sport === "MLB"
          ? "mlb"
          : sport === "NHL"
            ? "nhl"
            : sport.toLowerCase();

  return `https://a.espncdn.com/i/teamlogos/${folder}/500/${slug}.png`;
}
