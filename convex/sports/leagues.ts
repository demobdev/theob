import { SportKey } from "./types";

export interface LeagueConfig {
  sport: string;
  key: SportKey;
  label: string;
  sportradarLeagueKey: string;
  apiVersion: string;
}

export const LEAGUES: Record<SportKey, LeagueConfig> = {
  NFL: {
    sport: "football",
    key: "NFL",
    label: "NFL",
    sportradarLeagueKey: "nfl",
    apiVersion: "v7",
  },
  NCAAF: {
    sport: "football",
    key: "NCAAF",
    label: "College Football",
    sportradarLeagueKey: "ncaafb",
    apiVersion: "v7",
  },
  NBA: {
    sport: "basketball",
    key: "NBA",
    label: "NBA",
    sportradarLeagueKey: "nba",
    apiVersion: "v7",
  },
  MLB: {
    sport: "baseball",
    key: "MLB",
    label: "MLB",
    sportradarLeagueKey: "mlb",
    apiVersion: "v7",
  },
  NHL: {
    sport: "hockey",
    key: "NHL",
    label: "NHL",
    sportradarLeagueKey: "nhl",
    apiVersion: "v7",
  },
  SOCCER: {
    sport: "soccer",
    key: "SOCCER",
    label: "MLS",
    sportradarLeagueKey: "mls",
    apiVersion: "v7",
  },
  WNBA: {
    sport: "basketball",
    key: "WNBA",
    label: "WNBA",
    sportradarLeagueKey: "wnba", // placeholder
    apiVersion: "v7",
  },
  F1: {
    sport: "racing",
    key: "F1",
    label: "Formula 1",
    sportradarLeagueKey: "f1", // placeholder
    apiVersion: "v7",
  },
  GOLF: {
    sport: "golf",
    key: "GOLF",
    label: "PGA Tour",
    sportradarLeagueKey: "pga", // placeholder
    apiVersion: "v7",
  },
  TENNIS: {
    sport: "tennis",
    key: "TENNIS",
    label: "ATP/WTA",
    sportradarLeagueKey: "atp", // placeholder
    apiVersion: "v7",
  },
} as const;

/**
 * Checks if a given sport is generally "in-season" based on standard US calendars.
 * Used to show better empty states (e.g., "NFL is in the Off-Season" vs "No Games Scheduled").
 */
export function isSportInSeason(sport: SportKey, date: Date = new Date()): boolean {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec

  switch (sport) {
    case "NFL":
    case "NCAAF":
      // Football: August (7) through February (1)
      return month >= 7 || month <= 1;
      
    case "NBA":
    case "NHL":
      // Basketball/Hockey: October (9) through June (5)
      return month >= 9 || month <= 5;
      
    case "MLB":
    case "SOCCER":
      // Baseball/Soccer: Late Feb (1) through early Nov (10)
      return month >= 1 && month <= 10;
      
    case "WNBA":
      // WNBA: May (4) through October (9)
      return month >= 4 && month <= 9;

    case "F1":
    case "GOLF":
    case "TENNIS":
      // These are generally active for most of the year (Feb-Nov)
      return month >= 1 && month <= 10;

    default:
      return true;
  }
}
