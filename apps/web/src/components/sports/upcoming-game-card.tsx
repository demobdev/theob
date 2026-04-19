"use client";

import React, { useState } from "react";
import { UpcomingGame } from "../../lib/sports/types";

function TeamLogo({ logoUrl, name, abbr }: { logoUrl?: string | null; name?: string; abbr?: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-3 md:p-5 shadow-2xl border-4 border-neutral-100 dark:border-neutral-800 transition-transform group-hover:scale-105 duration-500 shrink-0">
      {logoUrl && !failed ? (
        <img src={logoUrl} alt={name ?? abbr ?? ""} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <span className="text-black font-black text-xl">{abbr}</span>
      )}
    </div>
  );
}

interface UpcomingGameCardProps {
  game: UpcomingGame;
}

export function UpcomingGameCard({ game }: UpcomingGameCardProps) {
  const isLive = game.status === "inprogress";
  const isFinal = game.status === "closed";
  const hasScore = game.awayTeam?.runs != null || game.homeTeam?.runs != null;
  const isTournament = !!game.tournamentName;

  const formattedTime = new Date(game.startsAt).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
  });

  const awayScore = game.awayTeam?.runs ?? game.awayTeam?.score;
  const homeScore = game.homeTeam?.runs ?? game.homeTeam?.score;

  // Who's winning?
  const awayWinning = (awayScore ?? -1) > (homeScore ?? -1);
  const homeWinning = (homeScore ?? -1) > (awayScore ?? -1);
  const tied = awayScore != null && homeScore != null && awayScore === homeScore;

  return (
    <div className="bg-white dark:bg-neutral-900 border-4 border-[var(--accent-color)] rounded-sm shadow-[12px_12px_0px_var(--accent-glow)] relative overflow-hidden group max-w-2xl w-full transition-all duration-500">

      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4">
        <div className="flex items-center gap-2">
          <span className="bg-[var(--accent-color)] text-white text-[10px] font-[1000] px-3 py-1 rounded-sm uppercase tracking-[0.2em]">
            {game.league}
          </span>
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-[1000] text-green-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Live
            </span>
          )}
          {isFinal && (
            <span className="text-[10px] font-[1000] text-neutral-400 uppercase tracking-widest">Final</span>
          )}
        </div>
        <span className="text-[var(--accent-color)] text-[10px] font-[1000] uppercase tracking-[0.2em]">
          {isFinal ? "Game Over" : isLive ? "In Progress" : game.editorialNote || "Featured Matchup"}
        </span>
      </div>

      {isTournament ? (
        <div className="flex flex-col items-center py-10 px-8">
          <span className="text-5xl mb-4">⛳</span>
          <h3 className="text-2xl font-[1000] italic uppercase tracking-tighter text-black dark:text-white mb-1">{game.tournamentName}</h3>
          {game.editorialNote && <p className="text-[var(--accent-color)] text-sm font-bold">{game.editorialNote}</p>}
        </div>
      ) : (
        <>
          {/* Scoreboard or Matchup */}
          {(isLive || isFinal) && hasScore ? (
            /* SCORE VIEW — Final or Live */
            <div className="flex items-center justify-center gap-2 md:gap-6 px-4 md:px-8 py-4 md:py-6">
              {/* Away */}
              <div className="flex flex-col items-center gap-3 flex-1 text-center">
                <TeamLogo logoUrl={game.awayTeam?.logoUrl} name={game.awayTeam?.name} abbr={game.awayTeam?.abbr} />
                <div>
                  <p className={`text-sm font-[1000] uppercase tracking-tight leading-tight ${awayWinning ? "text-black dark:text-white" : "text-neutral-400"}`}>
                    {game.awayTeam?.name}
                  </p>
                  {game.awayTeam?.wins != null && (
                    <p className="text-[10px] text-neutral-400 font-bold">{game.awayTeam.wins}–{game.awayTeam.losses}</p>
                  )}
                </div>
              </div>

              {/* Score Center */}
              <div className="flex flex-col items-center shrink-0 min-w-[80px] md:min-w-[120px]">
                <div className="flex items-baseline gap-4">
                  <span className={`text-4xl md:text-6xl font-[1000] tabular-nums leading-none ${awayWinning ? "text-black dark:text-white" : "text-neutral-300 dark:text-neutral-600"}`}>
                    {awayScore ?? "–"}
                  </span>
                  <span className="text-xl md:text-2xl text-neutral-300 dark:text-neutral-700 font-black">–</span>
                  <span className={`text-4xl md:text-6xl font-[1000] tabular-nums leading-none ${homeWinning ? "text-black dark:text-white" : "text-neutral-300 dark:text-neutral-600"}`}>
                    {homeScore ?? "–"}
                  </span>
                </div>
                {tied && <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Tied</p>}
                {/* MLB R/H/E */}
                {game.sport === "MLB" && isFinal && (game.awayTeam?.hits != null || game.homeTeam?.hits != null) && (
                  <div className="mt-3 flex gap-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    <div className="flex flex-col items-center gap-0.5">
                      <span>R</span>
                      <span className="tabular-nums text-black dark:text-white font-[1000]">{awayScore ?? "–"}/{homeScore ?? "–"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span>H</span>
                      <span className="tabular-nums text-black dark:text-white font-[1000]">{game.awayTeam?.hits ?? "–"}/{game.homeTeam?.hits ?? "–"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <span>E</span>
                      <span className="tabular-nums text-black dark:text-white font-[1000]">{game.awayTeam?.errors ?? "–"}/{game.homeTeam?.errors ?? "–"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Home */}
              <div className="flex flex-col items-center gap-3 flex-1 text-center">
                <TeamLogo logoUrl={game.homeTeam?.logoUrl} name={game.homeTeam?.name} abbr={game.homeTeam?.abbr} />
                <div>
                  <p className={`text-sm font-[1000] uppercase tracking-tight leading-tight ${homeWinning ? "text-black dark:text-white" : "text-neutral-400"}`}>
                    {game.homeTeam?.name}
                  </p>
                  {game.homeTeam?.wins != null && (
                    <p className="text-[10px] text-neutral-400 font-bold">{game.homeTeam.wins}–{game.homeTeam.losses}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* UPCOMING VIEW — pre-game */
            <div className="flex items-center justify-around px-3 md:px-8 py-4 md:py-6 gap-2 md:gap-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <TeamLogo logoUrl={game.awayTeam?.logoUrl} name={game.awayTeam?.name} abbr={game.awayTeam?.abbr} />
                <div>
                  <p className="text-[10px] md:text-sm font-[1000] uppercase tracking-tight text-black dark:text-white leading-tight">{game.awayTeam?.name}</p>
                  {game.awayTeam?.wins != null && (
                    <p className="text-[10px] text-neutral-400 font-bold">{game.awayTeam.wins}–{game.awayTeam.losses}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-3xl md:text-5xl font-[1000] text-[var(--accent-color)] leading-none">
                  {new Date(game.startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })}
                </span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
                  {new Date(game.startsAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </span>
                {game.sport === "MLB" && game.dayNight && (
                  <span className="text-[10px] text-neutral-400 mt-1">{game.dayNight === "D" ? "☀️ Day" : "🌙 Night"}</span>
                )}
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <TeamLogo logoUrl={game.homeTeam?.logoUrl} name={game.homeTeam?.name} abbr={game.homeTeam?.abbr} />
                <div>
                  <p className="text-[10px] md:text-sm font-[1000] uppercase tracking-tight text-black dark:text-white leading-tight">{game.homeTeam?.name}</p>
                  {game.homeTeam?.wins != null && (
                    <p className="text-[10px] text-neutral-400 font-bold">{game.homeTeam.wins}–{game.homeTeam.losses}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
        {game.venue?.name ? (
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate">
            📍 {game.venue.name}{game.venue.city ? `, ${game.venue.city}` : ""}
          </span>
        ) : (
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{formattedTime}</span>
        )}
        <span className="text-[10px] font-bold text-neutral-300 dark:text-neutral-700 uppercase tracking-widest shrink-0 ml-2">
          Tap for details →
        </span>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] plaid-pattern -rotate-45 pointer-events-none" />
    </div>
  );
}
