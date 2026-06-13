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
  MLB: "MLB",
  NBA: "NBA",
  NHL: "NHL",
  NFL: "NFL",
  NCAAF: "College Football",
  NCAAB: "College Basketball",
  MLS: "MLS",
  SOCCER: "Soccer",
  GOLF: "Golf",
};

function sportLabel(sport: string): string {
  return SPORT_LABELS[sport] ?? sport;
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

  const sportOptions = useMemo(() => {
    const sports = new Set<string>();
    for (const game of [...(liveGames ?? []), ...(todayGames ?? [])]) {
      if (game.sport) sports.add(game.sport);
    }
    const ordered = ["MLB", "NBA", "NHL", "NFL", "MLS", "SOCCER", "NCAAF", "NCAAB", "GOLF"];
    const sorted = [
      ...ordered.filter((s) => sports.has(s)),
      ...Array.from(sports).filter((s) => !ordered.includes(s)).sort(),
    ];
    return ["ALL", ...sorted];
  }, [liveGames, todayGames]);

  const filteredLive = useMemo(() => {
    const live = liveGames ?? [];
    if (sport === "ALL") return diversifyLiveGames(live);
    return live.filter((g) => g.sport === sport);
  }, [liveGames, sport]);

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

          {sportOptions.length > 1 && (
            <div className="relative shrink-0 w-full sm:w-auto sm:min-w-[200px]">
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
          )}
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
            <p className="text-gray-500 text-sm font-medium py-6 px-5 rounded-2xl border border-dashed border-white/10 bg-black/20">
              Nothing live for {sportLabel(sport)} right now. Check the ticker below for scores and start times.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
