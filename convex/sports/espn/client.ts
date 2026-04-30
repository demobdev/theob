/**
 * ESPN Hidden API Client
 */

export type EspnSport = "football" | "basketball" | "baseball" | "hockey" | "soccer" | "racing" | "golf" | "tennis";
export type EspnLeague = "nfl" | "nba" | "mlb" | "nhl" | "college-football" | "usa.1" | "eng.1" | "wnba" | "f1" | "pga" | "atp" | "wta";

export async function fetchEspnScoreboard(sport: EspnSport, league: EspnLeague, dateStr?: string) {
  let url = `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;
  if (dateStr) {
    url += `?dates=${dateStr}`;
  }
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`ESPN API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
