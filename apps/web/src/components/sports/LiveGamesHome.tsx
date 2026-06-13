"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { ChevronDown } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

type GameDoc = NonNullable<
  ReturnType<typeof useQuery<typeof api.sports_queries.getTodayGames>>
>[number];

const SPORT_LABELS: Record<string, string> = {
  ALL: "All Sports",
  NFL: "NFL",
  NCAAF: "College Football",
  NBA: "NBA",
  MLB: "MLB",
  NHL: "NHL",
  GOLF: "PGA Tour",
  UFC: "UFC",
  NASCAR: "NASCAR",
  F1: "Formula 1",
  CRICKET: "Cricket",
};

const SPORT_ORDER = [
  "NBA",
  "NFL",
  "MLB",
  "NHL",
  "NCAAF",
  "GOLF",
  "UFC",
  "NASCAR",
  "F1",
  "CRICKET",
] as const;

function sportLabel(sport: string): string {
  return SPORT_LABELS[sport] ?? sport;
}

function isDisplayableGame(game: GameDoc): boolean {
  if (game.awayTeam?.logoUrl && game.homeTeam?.logoUrl) return true;
  if (game.tournamentName) return true;
  return false;
}

function emptyStateMessage(sport: string): string {
  const label = sportLabel(sport);
  return `Nothing on the board for ${label} right now. Check another sport or scroll the ticker below.`;
}

/** Spread live cards across sports so one league doesn't dominate. */
function diversifyLiveGames(games: GameDoc[], maxPerSport = 2): GameDoc[] {
  const bySport = new Map<string, GameDoc[]>();
  for (const game of games) {
    const list = bySport.get(game.sport) ?? [];
    if (list.length < maxPerSport) {
      list.push(game);
      bySport.set(game.sport, list);
    }
  }

  const sports = Array.from(bySport.keys());
  const result: GameDoc[] = [];
  let round = 0;
  while (result.length < 10) {
    let added = false;
    for (const s of sports) {
      const game = bySport.get(s)?.[round];
      if (game) {
        result.push(game);
        added = true;
      }
    }
    if (!added) break;
    round += 1;
  }
  return result;
}

function formatStartTime(startsAt: string): string {
  return new Date(startsAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
}

function GameRow({
  game,
  live,
}: {
  game: GameDoc;
  live?: boolean;
}) {
  const awayLogo = game.awayTeam?.logoUrl;
  const homeLogo = game.homeTeam?.logoUrl;

  if (!awayLogo || !homeLogo) {
    if (!game.tournamentName) return null;

    return (
      <div
        className={cn(
          "flex flex-col gap-2 px-5 py-4 rounded-2xl border bg-black/40 backdrop-blur-sm min-w-[260px]",
          live ? "border-red-500/40 bg-red-950/20" : "border-white/10",
        )}
      >
        <span className="text-[#D4AF37] font-black text-[9px] uppercase tracking-widest">
          {game.sport}
        </span>
        <p className="text-white font-black text-sm uppercase tracking-tight leading-snug">
          {game.tournamentName}
        </p>
        {game.venue?.name && (
          <p className="text-gray-500 text-[10px] font-medium">{game.venue.name}</p>
        )}
        {live ? (
          <span className="flex items-center gap-1.5 text-red-500 font-black uppercase text-[9px] tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Live
          </span>
        ) : (
          <span className="text-[#D4AF37] font-black uppercase text-[9px] tracking-widest">
            {formatStartTime(game.startsAt)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 rounded-2xl border bg-black/40 backdrop-blur-sm min-w-[280px]",
        live ? "border-red-500/40 bg-red-950/20" : "border-white/10",
      )}
    >
      <span className="text-[#D4AF37] font-black text-[9px] uppercase tracking-widest shrink-0">
        {game.sport}
      </span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-6 w-6 relative shrink-0">
          <Image src={awayLogo} fill className="object-contain" alt="" sizes="24px" />
        </div>
        <span className="text-white font-black text-xs uppercase truncate">
          {game.awayTeam?.abbr ?? "TBD"}
        </span>
        {game.status !== "scheduled" && (
          <span className="text-white font-black text-xs">{game.awayTeam?.score ?? 0}</span>
        )}
        <span className="text-gray-600 text-[10px]">@</span>
        {game.status !== "scheduled" && (
          <span className="text-white font-black text-xs">{game.homeTeam?.score ?? 0}</span>
        )}
        <span className="text-white font-black text-xs uppercase truncate">
          {game.homeTeam?.abbr ?? "TBD"}
        </span>
        <div className="h-6 w-6 relative shrink-0">
          <Image src={homeLogo} fill className="object-contain" alt="" sizes="24px" />
        </div>
      </div>
      {live ? (
        <span className="flex items-center gap-1.5 text-red-500 font-black uppercase text-[9px] tracking-widest shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </span>
      ) : game.status === "closed" ? (
        <span className="text-gray-500 font-black uppercase text-[9px] tracking-widest shrink-0">
          Final
        </span>
      ) : (
        <span className="text-[#D4AF37] font-black uppercase text-[9px] tracking-widest shrink-0">
          {formatStartTime(game.startsAt)}
        </span>
      )}
    </div>
  );
}

type LiveGamesHomeProps = {
  sport: string;
  onSportChange: (sport: string) => void;
};

export default function LiveGamesHome({ sport, onSportChange }: LiveGamesHomeProps) {
  const liveGames = useQuery(api.sports_queries.getLiveGames);
  const todayGames = useQuery(api.sports_queries.getTodayGames);

  const sportOptions = useMemo(() => {
    const inData = new Set((todayGames ?? []).map((g) => g.sport));
    const ordered = SPORT_ORDER.filter((s) => inData.has(s));
    const extras = Array.from(inData).filter(
      (s) => !SPORT_ORDER.includes(s as (typeof SPORT_ORDER)[number]),
    );
    return ["ALL", ...ordered, ...extras.sort()];
  }, [todayGames]);

  const filteredLive = useMemo(() => {
    const live = (liveGames ?? []).filter(isDisplayableGame);
    if (sport === "ALL") return diversifyLiveGames(live);
    return live.filter((g) => g.sport === sport);
  }, [liveGames, sport]);

  const filteredUpcoming = useMemo(() => {
    const today = todayGames ?? [];
    const forSport = sport === "ALL" ? today : today.filter((g) => g.sport === sport);
    return forSport
      .filter((g) => g.status === "scheduled" || g.status === "postponed")
      .filter(isDisplayableGame)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .slice(0, 8);
  }, [todayGames, sport]);

  const hasAnyToday = (todayGames?.length ?? 0) > 0;
  const hasAnyLive = (liveGames?.length ?? 0) > 0;
  const showLiveSection = filteredLive.length > 0;
  const showUpcomingSection = filteredUpcoming.length > 0;

  if (!hasAnyToday && !hasAnyLive) return null;

  const upcomingIsPrimary = !showLiveSection && showUpcomingSection;

  return (
    <section className="py-16 border-y border-white/5 bg-[#050505]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3 block">
              Game Day Now
            </span>
            <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tight">
              What&apos;s On Today
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-3 max-w-xl">
              {showLiveSection
                ? "Live scores on our 14 HD screens — plus what's coming up next."
                : "Tonight's matchups on our 14 HD screens. Pick a sport to focus the board."}
            </p>
          </div>

          <div className="relative shrink-0 w-full sm:w-auto sm:min-w-[220px]">
            <label htmlFor="live-sport-filter" className="sr-only">
              Filter by sport
            </label>
            <select
              id="live-sport-filter"
              value={sport}
              onChange={(e) => onSportChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-black px-4 py-3 pr-10 text-[11px] font-black uppercase tracking-widest text-white focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
            >
              {sportOptions.map((option) => (
                <option key={option} value={option} className="bg-[#121212]">
                  {sportLabel(option)}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]"
              aria-hidden
            />
          </div>
        </div>

        {showLiveSection && (
          <div className="mb-8">
            <p className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {filteredLive.map((game) => (
                <GameRow key={game._id} game={game} live />
              ))}
            </div>
          </div>
        )}

        {showUpcomingSection && (
          <div>
            <p
              className={cn(
                "font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2",
                upcomingIsPrimary ? "text-[#D4AF37]" : "text-gray-400",
              )}
            >
              {!upcomingIsPrimary && <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
              {upcomingIsPrimary ? "Upcoming" : "Also Coming Up"}
            </p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {filteredUpcoming.map((game) => (
                <GameRow key={game._id} game={game} />
              ))}
            </div>
          </div>
        )}

        {!showLiveSection && !showUpcomingSection && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-6">
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              {sport === "ALL"
                ? "Nothing on our boards for this filter right now. Scroll the ticker below for today's scores."
                : emptyStateMessage(sport)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
