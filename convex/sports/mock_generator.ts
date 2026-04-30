/**
 * Mock Data Generator for "The Owner's Box"
 * 
 * Ensures the app always has high-fidelity game data for the next 7 days,
 * even when third-party APIs are quiet or quotas are exceeded.
 */

import { SportKey, UpcomingGame } from "./types";

const MOCK_TEAMS: Record<SportKey, { name: string; abbr: string; logoUrl?: string }[]> = {
  NFL: [
    { name: "Dallas Cowboys", abbr: "DAL" },
    { name: "Philadelphia Eagles", abbr: "PHI" },
    { name: "Kansas City Chiefs", abbr: "KC" },
    { name: "San Francisco 49ers", abbr: "SF" },
    { name: "Buffalo Bills", abbr: "BUF" },
    { name: "New York Jets", abbr: "NYJ" },
  ],
  NBA: [
    { name: "Los Angeles Lakers", abbr: "LAL" },
    { name: "Golden State Warriors", abbr: "GSW" },
    { name: "Boston Celtics", abbr: "BOS" },
    { name: "Phoenix Suns", abbr: "PHX" },
    { name: "Milwaukee Bucks", abbr: "MIL" },
    { name: "Miami Heat", abbr: "MIA" },
  ],
  MLB: [
    { name: "New York Yankees", abbr: "NYY" },
    { name: "Boston Red Sox", abbr: "BOS" },
    { name: "Los Angeles Dodgers", abbr: "LAD" },
    { name: "Atlanta Braves", abbr: "ATL" },
    { name: "Chicago Cubs", abbr: "CHC" },
    { name: "Houston Astros", abbr: "HOU" },
  ],
  NHL: [
    { name: "New York Rangers", abbr: "NYR" },
    { name: "Boston Bruins", abbr: "BOS" },
    { name: "Chicago Blackhawks", abbr: "CHI" },
    { name: "Toronto Maple Leafs", abbr: "TOR" },
    { name: "Vegas Golden Knights", abbr: "VGK" },
    { name: "Florida Panthers", abbr: "FLA" },
  ],
  NCAAF: [
    { name: "Alabama Crimson Tide", abbr: "ALA" },
    { name: "Georgia Bulldogs", abbr: "UGA" },
    { name: "Ohio State Buckeyes", abbr: "OSU" },
    { name: "Michigan Wolverines", abbr: "MICH" },
  ],
  SOCCER: [
    { name: "Inter Miami CF", abbr: "MIA" },
    { name: "LA Galaxy", abbr: "LA" },
    { name: "Charlotte FC", abbr: "CLT" },
    { name: "Atlanta United FC", abbr: "ATL" },
  ],
  WNBA: [
    { name: "Indiana Fever", abbr: "IND" },
    { name: "Las Vegas Aces", abbr: "LVA" },
    { name: "New York Liberty", abbr: "NYL" },
  ],
  F1: [],
  GOLF: [],
  TENNIS: []
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockGamesForDay(date: Date, sport: SportKey): UpcomingGame[] {
  const teams = MOCK_TEAMS[sport];
  if (!teams || teams.length < 2) return [];

  const dateStr = date.toISOString().split('T')[0];
  const games: UpcomingGame[] = [];

  // Generate 1-2 marquee matchups per sport per day
  const numGames = Math.floor(Math.random() * 2) + 1;
  
  for (let i = 0; i < numGames; i++) {
    const home = getRandomItem(teams);
    let away = getRandomItem(teams);
    while (away.abbr === home.abbr) away = getRandomItem(teams);

    const hour = 18 + i * 2; // Evening games: 6 PM, 8 PM, etc.
    const startsAt = new Date(date);
    startsAt.setUTCHours(hour, 0, 0, 0);

    games.push({
      id: crypto.randomUUID(),
      externalId: `mock-${sport}-${dateStr}-${i}`,
      sport,
      league: sport === "SOCCER" ? "MLS" : sport,
      status: "scheduled",
      startsAt: startsAt.toISOString(),
      isPrimeTime: true, // Mock games are always primetime to keep the app looking hot
      homeTeam: {
        id: `m-${home.abbr}`,
        name: home.name,
        abbr: home.abbr,
        logoUrl: `https://a.espncdn.com/i/teamlogos/${sport.toLowerCase()}/500/${home.abbr.toLowerCase()}.png`
      },
      awayTeam: {
        id: `m-${away.abbr}`,
        name: away.name,
        abbr: away.abbr,
        logoUrl: `https://a.espncdn.com/i/teamlogos/${sport.toLowerCase()}/500/${away.abbr.toLowerCase()}.png`
      },
      venue: {
        name: `${home.name} Stadium`,
        city: "The Owner's Box",
        state: "USA"
      },
      broadcast: "THE OB TV",
      lastSyncedAt: new Date().toISOString()
    });
  }

  return games;
}
