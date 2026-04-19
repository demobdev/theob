"use client";

import React, { useState, useEffect, useRef } from "react";
import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { SportKey, GamesApiResponse, UpcomingGame } from "../../lib/sports/types";
import { isSportInSeason, LEAGUES } from "../../lib/sports/leagues";
import { UpcomingGameCard } from "./upcoming-game-card";
import { UpcomingGameRow } from "./upcoming-game-row";
import { TheobLogo } from "./logo";
import { GameModal } from "./game-modal";

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
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [selectedGame, setSelectedGame] = useState<UpcomingGame | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dateStripRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 5;

  // Sync theme with document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

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

  // Scroll date strip to keep active day visible on mobile
  useEffect(() => {
    if (dateStripRef.current) {
      const activeBtn = dateStripRef.current.querySelector('[data-active="true"]') as HTMLElement;
      activeBtn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [dateBucket]);


  return (
    <div>
      {/* Game Detail Modal */}
      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />

      <section className="w-full max-w-6xl mx-auto px-4 py-16 relative transition-colors duration-500 bg-white dark:bg-black text-black dark:text-white min-h-screen">
        
        {/* Theme Toggle */}
        <div className="absolute top-8 right-8 z-[60]">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl hover:scale-110 transition-all group"
            title="Switch Theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5 text-neutral-800" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-x-0 top-0 bottom-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center flex-col gap-6 rounded-3xl">
            <img src="/loading-icon.png" alt="Loading" className="w-24 h-24 object-contain animate-logo-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent-color)] animate-pulse">Syncing Matchups...</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 pt-8">
          <TheobLogo theme={theme} className="h-24 md:h-32 mb-12" />
          <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-[var(--accent-color)] mb-4">
            Upcoming Games
          </h2>
          <div className="max-w-xl text-neutral-500 dark:text-neutral-400 text-sm font-bold uppercase tracking-tight leading-relaxed">
            <p className="mb-2">Score front-row seats to the biggest games, fights, races, and more every night of the week.</p>
            <p className="italic text-[var(--accent-color)] text-xs">Call the Owners Box to make sure your favorite game is playing!</p>
          </div>
        </div>

        <div className="space-y-8 mb-16">
          {/* Date Selector — scrollable strip on mobile */}
          <div className="flex justify-center">
            <div
              ref={dateStripRef}
              className="flex overflow-x-auto no-scrollbar border-4 border-[var(--accent-color)] rounded-sm bg-white dark:bg-neutral-900 shadow-[8px_8px_0px_var(--accent-glow)] snap-x snap-mandatory"
            >
              {days.map((day) => (
                <button
                  key={day.value}
                  data-active={dateBucket === day.value}
                  onClick={() => setDateBucket(day.value)}
                  className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[110px] py-4 px-2 border-r last:border-0 border-[var(--accent-color)]/20 transition-all snap-start shrink-0 ${
                    dateBucket === day.value
                      ? "active-plaid text-white"
                      : "text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className={`text-xs md:text-base font-black tracking-tight ${dateBucket === day.value ? "text-white" : ""}`}>{day.label}</span>
                  <span className={`text-[9px] md:text-[10px] font-bold opacity-80 ${dateBucket === day.value ? "text-white" : "text-neutral-500"}`}>{day.subLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sport Filters */}
          <div className="flex items-center gap-4 w-full justify-center">
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
            <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-neutral-800">
              {(["ALL", "NFL", "NBA", "MLB", "NHL", "GOLF"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSport(s)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    sport === s
                      ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  }`}
                >
                  {s === "ALL" ? "All Sports" : s}
                </button>
              ))}
            </div>
            <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
          </div>
        </div>

        {/* Content Area */}
        <div className={loading ? "opacity-30 blur-[4px] transition-all" : "transition-all"}>
          <div className="space-y-12">

            {/* ── Featured Carousel ── */}
            {data?.featured && data.featured.length > 0 && (
              <div className="relative">
                {/* Carousel track (hidden scrollbar) */}
                <div
                  ref={carouselRef}
                  className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2"
                >
                  {data.featured.map((game) => (
                    <div
                      key={game.id}
                      className="snap-center shrink-0 w-full max-w-2xl mx-auto cursor-pointer"
                      onClick={() => setSelectedGame(game)}
                    >
                      <UpcomingGameCard game={game} />
                    </div>
                  ))}
                </div>

                {/* Nav arrows (only if >1 card) */}
                {totalFeatured > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                      onClick={prevCard}
                      disabled={carouselIndex === 0}
                      className="p-2 rounded-full border-2 border-[var(--accent-color)]/30 hover:border-[var(--accent-color)] disabled:opacity-20 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-[var(--accent-color)]" />
                    </button>
                    <div className="flex gap-2">
                      {data.featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === carouselIndex ? "bg-[var(--accent-color)] w-6" : "bg-neutral-300 dark:bg-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextCard}
                      disabled={carouselIndex === totalFeatured - 1}
                      className="p-2 rounded-full border-2 border-[var(--accent-color)]/30 hover:border-[var(--accent-color)] disabled:opacity-20 transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-[var(--accent-color)]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Schedule List ── */}
            {allGames.length > 0 && (() => {
              const isAll = sport === "ALL";

              const SPORT_META: Record<string, { emoji: string; color: string; label: string }> = {
                MLB:  { emoji: "⚾", color: "#bf0d3e", label: "MLB Baseball" },
                NBA:  { emoji: "🏀", color: "#1d428a", label: "NBA Basketball" },
                NHL:  { emoji: "🏒", color: "#000000", label: "NHL Hockey" },
                NFL:  { emoji: "🏈", color: "#013369", label: "NFL Football" },
                GOLF: { emoji: "⛳", color: "#2d6a4f", label: "PGA Golf" },
              };

              if (isAll) {
                // Group by sport
                const grouped = allGames.reduce<Record<string, UpcomingGame[]>>((acc, g) => {
                  if (!acc[g.sport]) acc[g.sport] = [];
                  acc[g.sport].push(g);
                  return acc;
                }, {});

                const sportOrder = ["MLB", "NBA", "NHL", "NFL", "GOLF"];
                const sortedSports = sportOrder.filter(s => grouped[s]);

                return (
                  <div className="space-y-10">
                    {sortedSports.map(s => {
                      const meta = SPORT_META[s] ?? { emoji: "🏆", color: "#f59e0b", label: s };
                      const games = grouped[s];
                      return (
                        <div key={s}>
                          {/* Sport section header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full text-base" style={{ backgroundColor: meta.color + "18" }}>
                              {meta.emoji}
                            </div>
                            <span className="text-xs font-[1000] uppercase tracking-[0.2em]" style={{ color: meta.color }}>
                              {meta.label}
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: meta.color + "30" }} />
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                              {games.length} {games.length === 1 ? "game" : "games"}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {games.map(game => (
                              <div key={game.id} className="cursor-pointer" onClick={() => setSelectedGame(game)}>
                                <UpcomingGameRow game={game} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              // Single sport — paginated flat list
              return (
                <div>
                  <div className="space-y-1.5">
                    {pagedGames.map((game) => (
                      <div key={game.id} className="cursor-pointer" onClick={() => setSelectedGame(game)}>
                        <UpcomingGameRow game={game} />
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-sm border-2 border-[var(--accent-color)]/30 hover:border-[var(--accent-color)] disabled:opacity-20 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 text-[var(--accent-color)]" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        const show = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                        if (!show) {
                          if (page === currentPage - 2 || page === currentPage + 2)
                            return <span key={page} className="text-neutral-500 text-xs px-1">…</span>;
                          return null;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 text-xs font-[1000] rounded-sm border-2 transition-all ${
                              page === currentPage
                                ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-white"
                                : "border-[var(--accent-color)]/20 hover:border-[var(--accent-color)] text-neutral-500 hover:text-[var(--accent-color)]"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-sm border-2 border-[var(--accent-color)]/30 hover:border-[var(--accent-color)] disabled:opacity-20 transition-all"
                      >
                        <ChevronRight className="w-4 h-4 text-[var(--accent-color)]" />
                      </button>
                    </div>
                  )}

                  <p className="text-center text-[10px] text-neutral-400 dark:text-neutral-600 font-bold uppercase tracking-widest mt-4">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, allGames.length)} of {allGames.length} games
                  </p>
                </div>
              );
            })()}

            {/* Empty State */}
            {!loading && (!data || (data.games.length === 0 && data.featured.length === 0)) && (
              <div className="text-center py-24 border-4 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl">
                <div className="mb-4 text-4xl grayscale opacity-20">{sport !== "ALL" && !isSportInSeason(sport) ? "🏌️‍♂️" : "🏟️"}</div>
                {sport !== "ALL" && !isSportInSeason(sport as SportKey) ? (
                  <>
                    <h3 className="text-xl font-black text-[var(--accent-color)] dark:text-[var(--accent-color)] mb-2 uppercase tracking-tight">{LEAGUES[sport as SportKey]?.label || sport} Off-Season</h3>
                    <p className="text-neutral-400 dark:text-neutral-600 text-[10px] max-w-sm mx-auto font-black uppercase tracking-[0.2em] leading-relaxed">
                      This sport is currently out of season. Check back closer to opening day for the best matchups at the Owners Box!
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-black text-neutral-400 dark:text-neutral-600 mb-2">No Games Scheduled</h3>
                    <p className="text-neutral-400 dark:text-neutral-600 text-[10px] max-w-xs mx-auto font-black uppercase tracking-[0.2em]">
                      Check back later for the next big matchup at the Owners Box!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
