export type SportKey = "NFL" | "NCAAF" | "NBA" | "MLB" | "NHL" | "GOLF";

export type GameStatus = "scheduled" | "inprogress" | "closed" | "cancelled" | "postponed";

export interface TeamInfo {
  id: string;
  name: string;
  abbr?: string | null;
  logoUrl?: string | null;
  // Season record (from daily-games.xsd teamType win/loss attributes)
  wins?: number | null;
  losses?: number | null;
  // Live game stats
  runs?: number | null;   // MLB
  hits?: number | null;   // MLB
  errors?: number | null; // MLB
  score?: number | null;  // NBA/NHL/NFL
  // Probable/starting pitcher (MLB)
  probablePitcher?: {
    fullName: string;
    wins?: number;
    losses?: number;
    era?: number;
  } | null;
}

export interface VenueInfo {
  name?: string | null;
  city?: string | null;
  state?: string | null;
  capacity?: number | null;
  surface?: string | null;          // grass, turf, etc.
  stadiumType?: string | null;      // outdoor, retractable, indoor
  fieldOrientation?: string | null; // N, NE, E, etc.
}

export interface WeatherInfo {
  tempF?: number | null;
  condition?: string | null;  // "Sunny", "Partly Cloudy", etc.
  humidity?: number | null;
  windSpeedMph?: number | null;
  windDirection?: string | null;
}

export interface UpcomingGame {
  id: string;           // Internal UUID
  externalId: string;   // Sportradar ID
  sport: SportKey;
  league: string;
  status: GameStatus;
  startsAt: string;     // UTC ISO string
  startsAtLocal?: string | null;
  homeTeam?: TeamInfo;
  awayTeam?: TeamInfo;
  tournamentName?: string;       // Golf
  venue?: VenueInfo;
  weather?: WeatherInfo;         // MLB outdoor games
  broadcast?: string | null;     // e.g. "ESPN", "Apple TV+", "YES"
  dayNight?: "D" | "N" | null;   // Day or Night game
  doubleHeader?: boolean | null; // Is this a doubleheader?
  attendance?: number | null;    // Post-game announced attendance
  isFeatured?: boolean;
  featuredRank?: number | null;
  editorialNote?: string | null;
  lastSyncedAt?: string;
}

export interface GamesApiResponse {
  filters: {
    dateBucket: string;
    sport: SportKey | "ALL";
    team: string | null;
  };
  featured: UpcomingGame[];
  games: UpcomingGame[];
}
