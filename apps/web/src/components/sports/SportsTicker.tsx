"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SportsTicker() {
  const games = useQuery(api.sports_queries.getTodayGames);

  if (!games || games.length === 0) return null;

  // Duplicate for seamless loop
  const displayGames = [...games, ...games, ...games];

  return (
    <div className="bg-black border-y border-white/5 py-4 overflow-hidden relative group">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="flex animate-marquee-slow group-hover:pause">
        {displayGames.map((game, i) => (
          <div key={`${game._id}-${i}`} className="flex items-center gap-6 px-10 border-r border-white/5 whitespace-nowrap">
            
            {/* Sport Badge */}
            <span className="text-[#D4AF37] font-black text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[#D4AF37]/30 rounded">
              {game.sport}
            </span>

            {/* Teams & Score */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="h-6 w-6 relative">
                    <Image src={game.awayTeam.logoUrl} fill className="object-contain" alt={game.awayTeam.abbr} />
                 </div>
                 <span className="text-white font-black uppercase text-xs tracking-tighter">{game.awayTeam.abbr}</span>
                 {game.status !== "scheduled" && (
                   <span className="text-white font-black text-xs">{game.awayTeam.score ?? 0}</span>
                 )}
              </div>

              <span className="text-gray-600 font-bold text-[10px]">@</span>

              <div className="flex items-center gap-2">
                 {game.status !== "scheduled" && (
                   <span className="text-white font-black text-xs">{game.homeTeam.score ?? 0}</span>
                 )}
                 <span className="text-white font-black uppercase text-xs tracking-tighter">{game.homeTeam.abbr}</span>
                 <div className="h-6 w-6 relative">
                    <Image src={game.homeTeam.logoUrl} fill className="object-contain" alt={game.homeTeam.abbr} />
                 </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col items-center">
              {game.status === "inprogress" ? (
                <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                   <span className="text-red-600 font-black uppercase text-[9px] tracking-widest">Live</span>
                </div>
              ) : game.status === "closed" ? (
                <span className="text-gray-500 font-black uppercase text-[9px] tracking-widest">Final</span>
              ) : (
                <span className="text-[#D4AF37] font-black uppercase text-[9px] tracking-widest">
                  {new Date(game.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
