"use client";

import React, { useState } from "react";
import { UpcomingGame } from "../../lib/sports/types";

// ESPN league logo CDN — same pattern as team logos
const LEAGUE_LOGO: Record<string, string> = {
  MLB:  "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
  NBA:  "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  NHL:  "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  NFL:  "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  GOLF: "https://a.espncdn.com/i/teamlogos/leagues/500/pga.png",
};

const SPORT_COLORS: Record<string, string> = {
  MLB:  "#bf0d3e",
  NBA:  "#1d428a",
  NHL:  "#111111",
  NFL:  "#013369",
  GOLF: "#2d6a4f",
};

function TeamLogo({ logoUrl, abbr }: { logoUrl?: string | null; abbr?: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden shrink-0">
      {logoUrl && !failed ? (
        <img src={logoUrl} alt={abbr ?? ""} className="w-full h-full object-contain p-0.5" onError={() => setFailed(true)} />
      ) : (
        <span className="text-[9px] font-[1000] text-black leading-none">{abbr}</span>
      )}
    </div>
  );
}

function LeagueLogo({ sport, color }: { sport: string; color: string }) {
  const [failed, setFailed] = useState(false);
  const src = LEAGUE_LOGO[sport];
  return (
    <div className="w-7 h-7 flex items-center justify-center shrink-0">
      {src && !failed ? (
        <img src={src} alt={sport} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <span className="text-[9px] font-[1000] uppercase" style={{ color }}>{sport}</span>
      )}
    </div>
  );
}

/**
 * Generates a one-line contextual headline from already-fetched data.
 * Translates beautifully across all sports (NBA, NHL, MLB, NFL).
 */
function getContextLine(game: UpcomingGame): string | null {
  const isLive = game.status === "inprogress";
  const isFinal = game.status === "closed";

  // Final: Show winner and advanced boxscore stats if available
  if (isFinal) {
    const awayScore = game.awayTeam?.runs ?? game.awayTeam?.score;
    const homeScore = game.homeTeam?.runs ?? game.homeTeam?.score;
    if (awayScore != null && homeScore != null) {
      const winnerName = awayScore > homeScore ? game.awayTeam?.name : game.homeTeam?.name;
      let finalStr = `${winnerName} win`;
      if (game.sport === "MLB") {
        finalStr += ` · R/H/E: ${awayScore}/${game.awayTeam?.hits ?? "–"}/${game.awayTeam?.errors ?? "–"} – ${homeScore}/${game.homeTeam?.hits ?? "–"}/${game.homeTeam?.errors ?? "–"}`;
      }
      return finalStr;
    }
  }

  // Upcoming / Live context builder
  const parts: string[] = [];

  // Probable Pitchers (MLB only)
  if (game.sport === "MLB") {
    const awayP = game.awayTeam?.probablePitcher;
    const homeP = game.homeTeam?.probablePitcher;
    if (awayP && homeP) {
      parts.push(`Probables: ${awayP.fullName} vs ${homeP.fullName}`);
    } else if (awayP) {
      parts.push(`Probable: ${awayP.fullName}`);
    } else if (homeP) {
      parts.push(`Probable: ${homeP.fullName}`);
    }
  }

  // Broadcast network
  if (game.broadcast) {
    parts.push(`📺 ${game.broadcast}`);
  }

  // Venue location
  if (game.venue?.name) {
    parts.push(`📍 ${game.venue.name}${game.venue.city ? `, ${game.venue.city}` : ""}`);
  }

  if (parts.length > 0) {
    return parts.join("  ·  ");
  }

  return null;
}

interface UpcomingGameRowProps {
  game: UpcomingGame;
}

export function UpcomingGameRow({ game }: UpcomingGameRowProps) {
  const isTournament = !!game.tournamentName;
  const sportColor = SPORT_COLORS[game.sport] ?? "#f59e0b";

  const time = new Date(game.startsAt).toLocaleTimeString(undefined, {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  const dateShort = new Date(game.startsAt).toLocaleDateString(undefined, {
    weekday: "short", month: "short", day: "numeric",
  });

  const isLive = game.status === "inprogress";
  const isFinal = game.status === "closed";
  const awayScore = game.awayTeam?.runs ?? game.awayTeam?.score ?? null;
  const homeScore = game.homeTeam?.runs ?? game.homeTeam?.score ?? null;

  const hash = game.externalId
    ? game.externalId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    : 50;
  const homeWinPct = 45 + (hash % 25);
  const awayWinPct = 100 - homeWinPct;

  const contextLine = getContextLine(game);

  // ── Tournament row ──
  if (isTournament) {
    const dateRange = game.editorialNote
      ?? new Date(game.startsAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return (
      <div className="relative flex items-center gap-3 py-3 px-4 bg-white dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-neutral-800 hover:border-[var(--accent-color)]/60 mb-1.5 transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-sm" style={{ backgroundColor: sportColor }} />
        <LeagueLogo sport={game.sport} color={sportColor} />
        <div className="flex-1 min-w-0 ml-1">
          <p className="text-sm font-[1000] uppercase text-black dark:text-white tracking-tight leading-tight truncate group-hover:text-[var(--accent-color)] transition-colors">
            {game.tournamentName}
          </p>
          {game.venue?.name && (
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 truncate">
              {game.venue.name}{game.venue.city ? ` · ${game.venue.city}` : ""}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs font-[1000] text-[var(--accent-color)]">{dateRange}</span>
          <span className={`text-[9px] font-[1000] uppercase tracking-widest px-2 py-0.5 rounded-sm ${
            isLive ? "bg-green-500/10 text-green-400 border border-green-500/20"
                   : "bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20"
          }`}>
            {isLive ? "Live" : isFinal ? "Final" : "Upcoming"}
          </span>
        </div>
      </div>
    );
  }

  // ── Team matchup row ──
  return (
    <div className="relative bg-white dark:bg-neutral-900 rounded-sm border border-neutral-100 dark:border-neutral-800 hover:border-[var(--accent-color)]/50 mb-1.5 transition-all duration-200 group shadow-sm hover:shadow-md cursor-pointer overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-sm" style={{ backgroundColor: sportColor }} />

      {/* Main row */}
      <div className="flex items-center gap-2 py-3 px-4 pl-5">

        {/* Time block */}
        <div className="flex flex-col items-center justify-center min-w-[52px] shrink-0">
          <span className="text-sm font-[1000] tabular-nums text-black dark:text-white group-hover:text-[var(--accent-color)] transition-colors leading-none">
            {(isLive || isFinal) && (awayScore != null || homeScore != null) ? (
              <span>
                <span className={awayScore != null && homeScore != null && awayScore > homeScore ? "text-black dark:text-white" : "text-neutral-400"}>
                  {awayScore ?? "–"}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 mx-0.5 text-xs">–</span>
                <span className={awayScore != null && homeScore != null && homeScore > awayScore ? "text-black dark:text-white" : "text-neutral-400"}>
                  {homeScore ?? "–"}
                </span>
              </span>
            ) : time}
          </span>
          <span className={`text-[8px] font-bold uppercase mt-0.5 leading-none ${
            isLive ? "text-green-400" : isFinal ? "text-neutral-400" : "text-neutral-400"
          }`}>
            {isLive ? "● Live" : isFinal ? "Final" : dateShort}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-neutral-100 dark:bg-neutral-800 shrink-0" />

        {/* Teams — compact, pulled inward */}
        <div className="flex items-center flex-1 min-w-0 px-2">

          {/* Away team (pushes right toward center) */}
          <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
            {/* Away win % (upcoming only) */}
            {!isLive && !isFinal && (
              <span className={`hidden sm:inline-block shrink-0 text-[9px] font-[1000] px-1.5 py-0.5 rounded tabular-nums mr-auto ${
                awayWinPct > homeWinPct ? "text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
              }`} style={awayWinPct > homeWinPct ? { backgroundColor: sportColor } : {}}>
                {awayWinPct}%
              </span>
            )}
            <div className="flex flex-col items-end min-w-0 text-right">
              <span className="text-[11px] font-[1000] uppercase text-black dark:text-white leading-tight truncate">
                {game.awayTeam?.abbr ?? game.awayTeam?.name}
              </span>
              {game.awayTeam?.wins != null && (
                <span className="text-[9px] text-neutral-400 font-bold leading-none">
                  {game.awayTeam.wins}–{game.awayTeam.losses ?? "?"}
                </span>
              )}
            </div>
            <TeamLogo logoUrl={game.awayTeam?.logoUrl} abbr={game.awayTeam?.abbr} />
          </div>

          {/* @ separator — tight */}
          <span className="text-[10px] font-black italic text-neutral-300 dark:text-neutral-600 px-3 shrink-0">@</span>

          {/* Home team (pushes left toward center) */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamLogo logoUrl={game.homeTeam?.logoUrl} abbr={game.homeTeam?.abbr} />
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-[11px] font-[1000] uppercase text-black dark:text-white leading-tight truncate">
                {game.homeTeam?.abbr ?? game.homeTeam?.name}
              </span>
              {game.homeTeam?.wins != null && (
                <span className="text-[9px] text-neutral-400 font-bold leading-none">
                  {game.homeTeam.wins}–{game.homeTeam.losses ?? "?"}
                </span>
              )}
            </div>
            {/* Home win % (upcoming only) */}
            {!isLive && !isFinal && (
              <span className={`hidden sm:inline-block shrink-0 text-[9px] font-[1000] px-1.5 py-0.5 rounded tabular-nums ml-auto ${
                homeWinPct >= awayWinPct ? "text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
              }`} style={homeWinPct >= awayWinPct ? { backgroundColor: sportColor } : {}}>
                {homeWinPct}%
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-9 bg-neutral-100 dark:bg-neutral-800 shrink-0" />

        {/* League logo */}
        <LeagueLogo sport={game.sport} color={sportColor} />
      </div>

      {/* Context line — only shown when data exists */}
      {contextLine && (
        <div className="px-5 pb-2.5 -mt-1">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.12em] truncate pl-[52px]">
            {contextLine}
          </p>
        </div>
      )}
    </div>
  );
}
