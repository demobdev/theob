"use client";

import React, { useEffect, useState } from "react";
import { X, MapPin, Clock, Trophy } from "lucide-react";
import { UpcomingGame } from "../../lib/sports/types";

interface GameModalProps {
  game: UpcomingGame | null;
  onClose: () => void;
}

function TeamLogo({ logoUrl, name, abbr }: { logoUrl?: string | null; name?: string; abbr?: string | null }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-3 shadow-xl border-2 border-neutral-100 dark:border-neutral-700 shrink-0">
      {logoUrl && !failed ? (
        <img src={logoUrl} alt={name ?? abbr ?? ""} className="w-full h-full object-contain" onError={() => setFailed(true)} />
      ) : (
        <span className="text-black font-black text-xl">{abbr}</span>
      )}
    </div>
  );
}

function InfoCell({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 py-4 px-3 text-center">
      <div className="text-[var(--accent-color)] mb-0.5">{icon}</div>
      <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">{label}</span>
      <span className="text-xs font-[1000] text-black dark:text-white">{value}</span>
      {sub && <span className="text-[9px] text-neutral-400">{sub}</span>}
    </div>
  );
}

export function GameModal({ game, onClose }: GameModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!game) return null;

  const formattedDate = new Date(game.startsAt).toLocaleString(undefined, {
    weekday: "long", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit"
  });
  const timeOnly = new Date(game.startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });

  const statusLabel: Record<string, { label: string; color: string }> = {
    scheduled: { label: "Upcoming", color: "text-[var(--accent-color)]" },
    inprogress: { label: "🔴 Live Now", color: "text-green-400" },
    closed: { label: "Final", color: "text-neutral-400" },
    cancelled: { label: "Cancelled", color: "text-red-400" },
    postponed: { label: "Postponed", color: "text-yellow-400" },
  };
  const st = statusLabel[game.status] ?? { label: game.status, color: "text-neutral-400" };

  const isTournament = !!game.tournamentName;
  const isMLB = game.sport === "MLB";
  const dayNightLabel = game.dayNight === "D" ? "☀️ Day Game" : game.dayNight === "N" ? "🌙 Night Game" : null;

  const conditionEmoji = (c?: string | null) => {
    if (!c) return "🌡️";
    const l = c.toLowerCase();
    if (l.includes("sunny") || l.includes("clear")) return "☀️";
    if (l.includes("cloud")) return "⛅";
    if (l.includes("rain") || l.includes("shower")) return "🌧️";
    if (l.includes("storm")) return "⛈️";
    if (l.includes("fog")) return "🌫️";
    return "🌡️";
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border-4 border-[var(--accent-color)] rounded-sm shadow-[16px_16px_0px_var(--accent-glow)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[var(--accent-color)] text-white text-[10px] font-[1000] px-3 py-1 rounded-sm uppercase tracking-[0.25em]">
              {game.league}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${st.color}`}>{st.label}</span>
            {dayNightLabel && (
              <span className="text-[10px] font-bold text-neutral-400">{dayNightLabel}</span>
            )}
            {game.doubleHeader && (
              <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-sm border border-yellow-500/20">DH</span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group ml-2 shrink-0">
            <X className="w-5 h-5 text-neutral-400 group-hover:text-[var(--accent-color)] transition-colors" />
          </button>
        </div>

        {/* Matchup Section */}
        {!isTournament ? (
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-center gap-6">

              {/* Away Team */}
              <div className="flex flex-col items-center gap-2 text-center flex-1">
                <TeamLogo logoUrl={game.awayTeam?.logoUrl} name={game.awayTeam?.name} abbr={game.awayTeam?.abbr} />
                <div>
                  <p className="font-[1000] uppercase text-sm text-black dark:text-white tracking-tight leading-tight">{game.awayTeam?.name}</p>
                  {(game.awayTeam?.wins != null || game.awayTeam?.losses != null) && (
                    <p className="text-xs text-[var(--accent-color)] font-bold mt-0.5">
                      {game.awayTeam.wins ?? "–"}–{game.awayTeam.losses ?? "–"}
                    </p>
                  )}
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">Visitor</p>
                </div>
                {/* Probable pitcher */}
                {isMLB && game.awayTeam?.probablePitcher && (
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-sm px-3 py-2 text-center w-full">
                    <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Probable</p>
                    <p className="text-xs font-[1000] text-black dark:text-white leading-tight mt-0.5">{game.awayTeam.probablePitcher.fullName}</p>
                    {game.awayTeam.probablePitcher.era != null && (
                      <p className="text-[9px] text-neutral-400">
                        {game.awayTeam.probablePitcher.wins ?? "–"}–{game.awayTeam.probablePitcher.losses ?? "–"} • {game.awayTeam.probablePitcher.era.toFixed(2)} ERA
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Center @ */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[var(--accent-color)] text-3xl font-[1000] italic opacity-25">@</span>
              </div>

              {/* Home Team */}
              <div className="flex flex-col items-center gap-2 text-center flex-1">
                <TeamLogo logoUrl={game.homeTeam?.logoUrl} name={game.homeTeam?.name} abbr={game.homeTeam?.abbr} />
                <div>
                  <p className="font-[1000] uppercase text-sm text-black dark:text-white tracking-tight leading-tight">{game.homeTeam?.name}</p>
                  {(game.homeTeam?.wins != null || game.homeTeam?.losses != null) && (
                    <p className="text-xs text-[var(--accent-color)] font-bold mt-0.5">
                      {game.homeTeam.wins ?? "–"}–{game.homeTeam.losses ?? "–"}
                    </p>
                  )}
                  <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">Home</p>
                </div>
                {/* Probable pitcher */}
                {isMLB && game.homeTeam?.probablePitcher && (
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-sm px-3 py-2 text-center w-full">
                    <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Probable</p>
                    <p className="text-xs font-[1000] text-black dark:text-white leading-tight mt-0.5">{game.homeTeam.probablePitcher.fullName}</p>
                    {game.homeTeam.probablePitcher.era != null && (
                      <p className="text-[9px] text-neutral-400">
                        {game.homeTeam.probablePitcher.wins ?? "–"}–{game.homeTeam.probablePitcher.losses ?? "–"} • {game.homeTeam.probablePitcher.era.toFixed(2)} ERA
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Golf/Tournament */
          <div className="py-8 px-6 text-center">
            <p className="text-4xl mb-3">⛳</p>
            <h3 className="text-xl font-[1000] italic uppercase text-black dark:text-white">{game.tournamentName}</h3>
            {game.editorialNote && <p className="text-sm text-[var(--accent-color)] font-bold mt-1">{game.editorialNote}</p>}
          </div>
        )}

        {/* Info Grid */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 mt-4 grid grid-cols-2 divide-x divide-y divide-neutral-100 dark:divide-neutral-800">
          <InfoCell
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Game Time"
            value={timeOnly}
            sub={new Date(game.startsAt).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          />
          <InfoCell
            icon={<MapPin className="w-3.5 h-3.5" />}
            label="Venue"
            value={game.venue?.name ?? "TBD"}
            sub={game.venue?.city ? `${game.venue.city}${game.venue.state ? `, ${game.venue.state}` : ""}${game.venue.capacity ? ` · ${game.venue.capacity.toLocaleString()} cap` : ""}` : undefined}
          />

          {game.weather?.tempF != null && (
            <InfoCell
              icon={<span className="text-sm">{conditionEmoji(game.weather.condition)}</span>}
              label="Weather"
              value={`${game.weather.tempF}°F · ${game.weather.condition ?? ""}`}
              sub={game.weather.windSpeedMph != null ? `Wind ${game.weather.windSpeedMph} mph ${game.weather.windDirection ?? ""}` : undefined}
            />
          )}
          {game.venue?.surface && (
            <InfoCell
              icon={<span className="text-sm">🏟️</span>}
              label="Surface"
              value={game.venue.surface.charAt(0).toUpperCase() + game.venue.surface.slice(1)}
              sub={game.venue.stadiumType ?? undefined}
            />
          )}
          {game.attendance != null && (
            <InfoCell
              icon={<span className="text-sm">👥</span>}
              label="Attendance"
              value={game.attendance.toLocaleString()}
            />
          )}
        </div>

        {/* CTA */}
        <div className="bg-[var(--accent-color)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-white" />
            <span className="text-white text-[10px] font-[1000] uppercase tracking-widest">The Owner's Box Has This Game</span>
          </div>
          <span className="text-white text-[10px] font-black italic uppercase">Reserve Your Spot →</span>
        </div>
      </div>
    </div>
  );
}
