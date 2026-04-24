"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { 
  Gamepad2, 
  Star, 
  Tv, 
  RefreshCcw, 
  Zap, 
  AlertTriangle,
  ChevronRight,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SportsAdminPage() {
  const sportsData = useQuery(api.admin_sports.getSportsAdminOverview);
  const setHeadliner = useMutation(api.admin_sports.overrideHeadliner);
  const toggleFeatured = useMutation(api.admin_sports.toggleFeatured);
  const updateEditorial = useMutation(api.admin_sports.updateGameEditorial);
  const triggerSync = useAction(api.sports_actions.manualSync);
  const purgeStale = useAction(api.sports_actions.purgeStale);

  if (!sportsData) return <div className="p-8 animate-pulse space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-[#111] rounded-lg" />)}</div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">SPORTS OPS</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2">
            Manage War Room Highlights & TV Zones
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-lg px-4 py-2 flex items-center gap-3">
              <div className={cn(
                "w-2 h-2 rounded-full",
                sportsData.syncHealth === "healthy" ? "bg-green-500 animate-pulse" : "bg-red-500"
              )} />
              <div>
                 <p className="text-[9px] font-black uppercase text-gray-600 tracking-widest leading-none">Sync Health</p>
                 <p className="text-white font-bold text-xs mt-1 uppercase">{sportsData.syncHealth}</p>
              </div>
           </div>
           <button 
            onClick={async () => {
              if (confirm("Purge games older than yesterday?")) {
                await purgeStale();
                alert("Stale data purged.");
              }
            }}
            className="bg-[#161618] border border-[#222] px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
           >
              Purge Stale
           </button>
           <button 
            onClick={async () => {
              await triggerSync();
              alert("Sync triggered! It may take a minute to fetch all data.");
            }}
            className="bg-[#FFA500] p-2 rounded-lg text-black hover:bg-orange-400 transition-colors"
            title="Force Sync Now"
           >
              <RefreshCcw size={18} />
           </button>
        </div>
      </div>

      <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Matchup</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">TV Zone</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Controls</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Headliner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161618]">
              {sportsData.games.map((game) => (
                <tr key={game._id} className="hover:bg-[#111] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          <img src={game.awayTeam.logoUrl} className="w-8 h-8 rounded-full bg-[#111] border border-[#222]" />
                          <img src={game.homeTeam.logoUrl} className="w-8 h-8 rounded-full bg-[#111] border border-[#222]" />
                       </div>
                       <div>
                          <p className="text-white font-bold text-sm tracking-tight">{game.awayTeam.abbr} @ {game.homeTeam.abbr}</p>
                          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">{game.sport} • {new Date(game.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                      game.status === "inprogress" ? "bg-red-900/20 text-red-500" : "bg-gray-900/40 text-gray-500"
                    )}>
                       {game.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                     <button 
                      onClick={() => {
                        const zone = prompt("Assign TV Zone (e.g. ZONE A, MAIN JUMBOTRON):", game.tvZone || "");
                        if (zone !== null) updateEditorial({ gameId: game._id, tvZone: zone });
                      }}
                      className="text-gray-500 hover:text-[#FFA500] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1 mx-auto"
                     >
                        <Tv size={12} /> {game.tvZone || "UNASSIGNED"}
                     </button>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleFeatured({ gameId: game._id, isFeatured: !game.isFeatured })}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        game.isFeatured ? "text-[#FFA500] bg-[#FFA500]/10 border border-[#FFA500]/20" : "text-gray-700 hover:text-gray-400"
                      )}
                    >
                      <Star size={16} fill={game.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                     <button 
                      onClick={() => setHeadliner({ gameId: game._id, isPrimeTime: !game.isPrimeTime })}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                        game.isPrimeTime 
                          ? "bg-[#E31837] text-white shadow-lg shadow-red-900/20" 
                          : "bg-[#161618] text-gray-600 hover:text-white border border-[#222]"
                      )}
                     >
                       {game.isPrimeTime ? "HEADLINER" : "SET HEADLINER"}
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
