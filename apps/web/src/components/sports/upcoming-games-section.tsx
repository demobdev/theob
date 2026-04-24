"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Tv } from "lucide-react";
import { SportKey, GamesApiResponse, UpcomingGame } from "../../lib/sports/types";
import { isSportInSeason, LEAGUES } from "../../lib/sports/leagues";
import { UpcomingGameCard } from "./upcoming-game-card";
import { UpcomingGameRow } from "./upcoming-game-row";
import { GameModal } from "./game-modal";
import Link from "next/link";
import SportsTicker from "./SportsTicker";

type UpcomingGamesSectionProps = {
  initialDateBucket?: string;
  showFeatured?: boolean;
  defaultSport?: SportKey | "ALL";
};

export default function UpcomingGamesSection({
  initialDateBucket = "today",
  showFeatured = true,
  defaultSport = "ALL",
}: UpcomingGamesSectionProps) {
  const [dateBucket, setDateBucket] = useState<string>(initialDateBucket);
  const [sport, setSport] = useState<SportKey | "ALL">(defaultSport);
  const [data, setData] = useState<GamesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<UpcomingGame | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dateStripRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 5;

  // Generate next 7 days for date picker
  const days = Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      label: i === 0 ? "TODAY" : d.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase(),
      subLabel: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase(),
      value: i === 0 ? "today" : d.toISOString().split("T")[0],
    };
  });

  useEffect(() => {
    async function fetchGames() {
      setLoading(true);
      setCarouselIndex(0);
      try {
        const res = await fetch(`/api/upcoming-games?dateBucket=${dateBucket}&sport=${sport}`);
        if (!res.ok) throw new Error("Failed to fetch games");
        setData(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    }
    fetchGames();
  }, [dateBucket, sport]);

  // Reset page when data changes
  useEffect(() => { setCurrentPage(1); }, [data]);

  // Pagination helpers
  const allGames = data?.games ?? [];
  const totalPages = Math.max(1, Math.ceil(allGames.length / PAGE_SIZE));
  const pagedGames = allGames.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Carousel nav
  const totalFeatured = data?.featured?.length ?? 0;
  const prevCard = () => setCarouselIndex(i => Math.max(0, i - 1));
  const nextCard = () => setCarouselIndex(i => Math.min(totalFeatured - 1, i + 1));

  // Scroll carousel when index changes
  useEffect(() => {
    if (carouselRef.current) {
      const child = carouselRef.current.children[carouselIndex] as HTMLElement;
      child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [carouselIndex]);

  return (
    <section id="games" className="bg-[#0A0A0A] py-24 relative overflow-hidden noise-overlay">
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            Always On
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Never Wonder What’s On.
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
            Live games, prime-time matchups, and every major event on wall-to-wall screens. Check the schedule below or just head in.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
               <Tv className="h-4 w-4 text-[#D4AF37]" />
               Front-Row Seats
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
               <Tv className="h-4 w-4 text-[#D4AF37]" />
               Broadcast Quality
             </div>
          </div>
        </div>
      </div>

      <div className="mb-12 relative z-10">
        <SportsTicker />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Filters & Content Area */}
        <div className="bg-[#121212] rounded-3xl border border-white/5 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
            {/* Date Selector */}
            <div
              ref={dateStripRef}
              className="flex overflow-x-auto no-scrollbar rounded-xl bg-black border border-white/10 p-1 w-full lg:w-auto"
            >
              {days.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setDateBucket(day.value)}
                  className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-4 rounded-lg transition-all ${
                    dateBucket === day.value
                      ? "gold-gradient text-black font-black"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-xs uppercase tracking-tighter">{day.label}</span>
                  <span className="text-[10px] opacity-70">{day.subLabel}</span>
                </button>
              ))}
            </div>

            {/* Sport Filters */}
            <div className="flex gap-1 bg-black p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {(["ALL", "NFL", "NBA", "MLB", "NHL", "GOLF"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSport(s)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    sport === s
                      ? "bg-white/10 text-[#D4AF37]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {s === "ALL" ? "All Sports" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Games List Area */}
          <div className={loading ? "opacity-30 blur-[4px] transition-all" : "transition-all"}>
             {allGames.length > 0 ? (
               <div className="space-y-4">
                 {pagedGames.map((game) => (
                   <div 
                    key={game.id} 
                    className="cursor-pointer group" 
                    onClick={() => setSelectedGame(game)}
                   >
                     <UpcomingGameRow game={game} />
                   </div>
                 ))}
                 
                 {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-10">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 disabled:opacity-20 transition-all text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl border border-white/10 hover:border-[#D4AF37]/50 disabled:opacity-20 transition-all text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
               </div>
             ) : (
               <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/5">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                    No games scheduled for this date.
                  </p>
                  <Link href="/games">
                    <button className="mt-4 text-[#D4AF37] font-bold uppercase tracking-widest text-xs hover:underline">
                      View Full Schedule
                    </button>
                  </Link>
               </div>
             )}
          </div>
        </div>

        {/* Footer Teaser */}
        <div className="mt-12 text-center">
           <p className="text-gray-500 text-sm font-medium italic mb-6">
             *Call The Owner’s Box to confirm specific audio requests for your favorite matchup.
           </p>
           <Link href="/games">
             <button className="px-10 py-4 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] font-black uppercase tracking-widest hover:bg-[#D4AF37]/5 transition-all">
               View All Upcoming Events
             </button>
           </Link>
        </div>
      </div>
    </section>
  );
}
