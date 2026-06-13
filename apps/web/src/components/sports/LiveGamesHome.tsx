"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { ChevronDown } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

type GameDoc = NonNullable<
  ReturnType<typeof useQuery<typeof api.sports_queries.getLiveGames>>
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
};

/** Every sport we sync — always shown in the filter, even with no games today. */
const HOME_SPORT_FILTER_OPTIONS = [
  "NFL",
  "NBA",
  "NHL",
  "MLB",
  "NCAAF",
  "UFC",
  "GOLF",
  "NASCAR",
  "F1",
] as const;

function sportLabel(sport: string): string {
  return SPORT_LABELS[sport] ?? sport;
}

function emptyStateMessage(sport: string): string {
  const label = sportLabel(sport);
  const month = new Date().getMonth();

  if (sport === "NFL" || sport === "NCAAF") {
    if (month >= 2 && month <= 6) {
      return `${label} picks up again in the fall. Check the ticker below for what's on our screens today.`;
    }
  }
  if (sport === "NBA" || sport === "NHL") {
    if (month >= 6 && month <= 8) {
      return `${label} returns in October. Nothing on the board for ${label} today — try another sport or scroll the ticker.`;
    }
  }
  if (sport === "MLB") {
    if (month === 11 || month === 0) {
      return `${label} is in the off-season. Check the ticker below for other matchups on our screens.`;
    }
  }

  return `Nothing live or scheduled for ${label} today. Check the ticker below or pick another sport.`;
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
    for (const sport of sports) {
      const game = bySport.get(sport)?.[round];
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

function GameRow({
  game,
  live,
}: {
  game: {
    _id: string;
    sport: string;
    status: string;
    startsAt: string;
    awayTeam?: { abbr?: string; score?: number; logoUrl?: string };
    homeTeam?: { abbr?: string; score?: number; logoUrl?: string };
  };
  live?: boolean;
}) {
  const awayLogo = game.awayTeam?.logoUrl;
  const homeLogo = game.homeTeam?.logoUrl;
  if (!awayLogo || !homeLogo) return null;

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
          <Image src={awayLogo} fill className="object-contain" alt="" />
        </div>
        <span className="text-white font-black text-xs uppercase truncate">{game.awayTeam?.abbr ?? "TBD"}</span>
        {game.status !== "scheduled" && (
          <span className="text-white font-black text-xs">{game.awayTeam?.score ?? 0}</span>
        )}
        <span className="text-gray-600 text-[10px]">@</span>
        {game.status !== "scheduled" && (
          <span className="text-white font-black text-xs">{game.homeTeam?.score ?? 0}</span>
        )}
        <span className="text-white font-black text-xs uppercase truncate">{game.homeTeam?.abbr ?? "TBD"}</span>
        <div className="h-6 w-6 relative shrink-0">
          <Image src={homeLogo} fill className="object-contain" alt="" />
        </div>
      </div>
      {live ? (
        <span className="flex items-center gap-1.5 text-red-500 font-black uppercase text-[9px] tracking-widest shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live
        </span>
      ) : game.status === "closed" ? (
        <span className="text-gray-500 font-black uppercase text-[9px] tracking-widest shrink-0">Final</span>
      ) : (
        <span className="text-[#D4AF37] font-black uppercase text-[9px] tracking-widest shrink-0">
          {new Date(game.startsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>
      )}
    </div>
  );
}

export default function LiveGamesHome() {
  const liveGames = useQuery(api.sports_queries.getLiveGames);
  const todayGames = useQuery(api.sports_queries.getTodayGames);
  const [sport, setSport] = useState("ALL");

  const sportOptions = useMemo(() => ["ALL", ...HOME_SPORT_FILTER_OPTIONS], []);

  const filteredLive = useMemo(() => {
    const live = liveGames ?? [];
    if (sport === "ALL") return diversifyLiveGames(live);
    return live.filter((g) => g.sport === sport);
  }, [liveGames, sport]);

  const filteredToday = useMemo(() => {
    const today = todayGames ?? [];
    const forSport = sport === "ALL" ? today : today.filter((g) => g.sport === sport);
    return forSport
      .filter((g) => g.status !== "inprogress")
      .filter((g) => g.awayTeam?.logoUrl && g.homeTeam?.logoUrl)
      .slice(0, 8);
  }, [todayGames, sport]);

  const liveCountForSport = useMemo(() => {
    if (sport === "ALL") return liveGames?.length ?? 0;
    return (liveGames ?? []).filter((g) => g.sport === sport).length;
  }, [liveGames, sport]);

  const todayCountForSport = useMemo(() => {
    if (sport === "ALL") return todayGames?.length ?? 0;
    return (todayGames ?? []).filter((g) => g.sport === sport).length;
  }, [todayGames, sport]);

  const hasAnyToday = (todayGames?.length ?? 0) > 0;
  const hasAnyLive = (liveGames?.length ?? 0) > 0;

  if (!hasAnyToday && !hasAnyLive) return null;

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
              Live scores on our 14 HD screens. Pick a sport to see what&apos;s on right now — everything else scrolls in the ticker below.
            </p>
          </div>

          <div className="relative shrink-0 w-full sm:w-auto sm:min-w-[220px]">
              <label htmlFor="live-sport-filter" className="sr-only">
                Filter by sport
              </label>
              <select
                id="live-sport-filter"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
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

        <div>
          <p className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Live Now
          </p>

          {filteredLive.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {filteredLive.map((game) => (
                <GameRow key={game._id} game={game} live />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-6">
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                {sport === "ALL"
                  ? "Nothing live across our boards right now. Scroll the ticker below for today's scores and start times."
                  : emptyStateMessage(sport)}
              </p>
              {sport !== "ALL" && todayCountForSport === 0 && liveCountForSport === 0 && (
                <p className="text-gray-600 text-xs font-medium mt-3">
                  We sync scores from ESPN throughout the day — check back closer to game time.
                </p>
              )}
            </div>
          )}

          {filteredLive.length === 0 && filteredToday.length > 0 && (
            <div className="mt-8">
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                {sport === "ALL" ? "On Deck Today" : `${sportLabel(sport)} Today`}
              </p>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {filteredToday.map((game) => (
                  <GameRow key={game._id} game={game} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
