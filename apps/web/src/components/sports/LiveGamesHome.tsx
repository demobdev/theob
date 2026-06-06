"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { cn } from "@/lib/utils";

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

  const upcoming =
    todayGames?.filter((g) => g.status === "scheduled").slice(0, 8) ?? [];
  const hasLive = (liveGames?.length ?? 0) > 0;
  const hasUpcoming = upcoming.length > 0;

  if (!hasLive && !hasUpcoming) return null;

  return (
    <section className="py-16 border-y border-white/5 bg-[#050505]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.25em] text-xs mb-3 block">
              Game Day Now
            </span>
            <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tight">
              What&apos;s On Today
            </h2>
            <p className="text-gray-500 text-sm font-medium mt-3 max-w-xl">
              Live scores and today&apos;s schedule — synced for Greenville. Pull up a seat and catch the action on our 14 HD screens.
            </p>
          </div>
          <Link
            href="/games"
            className="text-[#D4AF37] font-black uppercase tracking-widest text-xs hover:underline shrink-0"
          >
            Full TV Schedule →
          </Link>
        </div>

        {hasLive && (
          <div className="mb-8">
            <p className="text-red-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Live Now
            </p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {liveGames!.map((game) => (
                <GameRow key={game._id} game={game} live />
              ))}
            </div>
          </div>
        )}

        {hasUpcoming && (
          <div>
            <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
              Coming Up Today
            </p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {upcoming.map((game) => (
                <GameRow key={game._id} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
