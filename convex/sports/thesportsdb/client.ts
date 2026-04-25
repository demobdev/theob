/**
 * TheSportsDB Fallback Client (Last Resort)
 *
 * Free V1 API — no auth required, key = "123"
 * Unlimited requests. Good logo coverage.
 * https://www.thesportsdb.com/api/v1/json/123/
 *
 * IMPORTANT: We query by LEAGUE ID, not sport name.
 * Querying by sport returns ALL international leagues (Olimpia Milano, etc).
 * Querying by league ID locks to exactly NBA/NHL/MLB/NFL.
 */

const TSDB_BASE = "https://www.thesportsdb.com/api/v1/json/123";

/**
 * TheSportsDB league IDs for US major leagues.
 * Find league IDs at: https://www.thesportsdb.com/league/
 */
const TSDB_LEAGUE_IDS: Record<string, number> = {
  NBA:   4387,  // NBA
  NHL:   4380,  // NHL
  MLB:   4424,  // MLB
  NFL:   4391,  // NFL
  NCAAF: 4479,  // NCAA College Football
};

/**
 * Known US major-league team names to whitelist.
 * If TheSportsDB ever returns an international team, we filter it out.
 */
const US_MAJOR_LEAGUE_KEYWORDS = [
  // NBA franchises
  "lakers","celtics","warriors","bulls","heat","nets","knicks","sixers","76ers",
  "bucks","raptors","spurs","rockets","mavericks","clippers","nuggets","suns",
  "jazz","blazers","kings","timberwolves","thunder","pelicans","magic","pistons",
  "cavaliers","hornets","hawks","wizards","grizzlies","pacers","trail blazers",
  // NHL franchises
  "bruins","rangers","maple leafs","canadiens","blackhawks","penguins","flyers",
  "capitals","lightning","panthers","red wings","oilers","flames","canucks",
  "avalanche","blues","stars","golden knights","kraken","coyotes","blue jackets",
  "wild","sabres","senators","hurricanes","devils","islanders","ducks","sharks",
  // MLB franchises
  "yankees","red sox","dodgers","cubs","cardinals","giants","braves","mets",
  "phillies","nationals","astros","athletics","mariners","rangers","angels",
  "blue jays","orioles","rays","white sox","twins","royals","tigers","indians",
  "guardians","brewers","reds","pirates","rockies","padres","diamondbacks","marlins",
  // NFL franchises
  "patriots","chiefs","bills","dolphins","ravens","bengals","browns","steelers",
  "texans","colts","jaguars","titans","broncos","raiders","chargers","seahawks",
  "cowboys","eagles","giants","commanders","bears","lions","packers","vikings",
  "saints","falcons","panthers","buccaneers","rams","49ers","cardinals","falcons",
];

function isUSMajorLeagueTeam(teamName: string): boolean {
  if (!teamName) return false;
  const lower = teamName.toLowerCase();
  return US_MAJOR_LEAGUE_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Fetches events for a given US major league on a specific date.
 * Uses league ID filtering to avoid returning international games.
 *
 * @param sport - Internal sport key (NBA, NHL, MLB, NFL)
 * @param date  - Date string in YYYY-MM-DD format
 */
export async function fetchTheSportsDBEvents(
  sport: string,
  date: string // YYYY-MM-DD
): Promise<any[]> {
  const leagueId = TSDB_LEAGUE_IDS[sport.toUpperCase()];
  if (!leagueId) return [];

  // Use the league-specific endpoint — strictly returns games from that league only
  const url = `${TSDB_BASE}/eventsday.php?d=${date}&l=${leagueId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`TheSportsDB error ${response.status}`);
    }
    const data = await response.json() as any;
    const events: any[] = data.events ?? [];

    // Extra safety: filter out any non-US teams that sneak through
    const filtered = events.filter(
      (e) => isUSMajorLeagueTeam(e.strHomeTeam) || isUSMajorLeagueTeam(e.strAwayTeam)
    );

    if (filtered.length < events.length) {
      console.warn(
        `[TheSportsDB] Filtered ${events.length - filtered.length} non-US games from ${sport} ${date}`
      );
    }

    return filtered;
  } catch (err: any) {
    console.error(`[TheSportsDB] Failed to fetch ${sport} events for ${date}:`, err.message);
    return [];
  }
}
