"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { 
  ShoppingBag, 
  Receipt, 
  Users, 
  Zap, 
  ArrowUpRight, 
  TrendingUp,
  CreditCard,
  Plus,
  Settings,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const StatCard = ({ title, value, icon: Icon, description, trend, trendColor }: any) => (
  <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#222] transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-[#161618] rounded-lg">
        <Icon size={20} className="text-[#FFA500]" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor}`}>
          <TrendingUp size={12} />
          {trend}
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-gray-500 text-[10px] font-black tracking-widest uppercase">{title}</h3>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      {description && <p className="text-gray-600 text-[11px] font-medium">{description}</p>}
    </div>
  </div>
);

  const stats = useQuery(api.admin.getAdminStats);
  const repairImages = useMutation(api.admin_products.backfillProductImages);
  const [repairStatus, setRepairStatus] = useState<string | null>(null);

  if (!stats) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-[#111] rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-[#111] rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">COMMAND CENTER</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2 flex items-center gap-2">
            Operational Overview <span className="w-1 h-1 bg-[#FFA500] rounded-full animate-pulse" /> Live Now
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Server Time</p>
          <p className="text-white font-bold text-sm">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Orders Today" 
          value={stats.ordersCount} 
          icon={ShoppingBag} 
          description="Across all locations"
          trend="+12%" 
          trendColor="text-green-500"
        />
        <StatCard 
          title="Revenue Today" 
          value={`$${stats.revenueToday.toFixed(2)}`} 
          icon={CreditCard} 
          description="Net sales volume"
        />
        <StatCard 
          title="Pending Receipts" 
          value={stats.pendingReceiptsCount} 
          icon={Receipt} 
          description="Requires moderation"
          trend={stats.pendingReceiptsCount > 5 ? "Action Required" : "Stable"}
          trendColor={stats.pendingReceiptsCount > 5 ? "text-orange-500" : "text-gray-500"}
        />
        <StatCard 
          title="Points Flow" 
          value={stats.pointsIssued} 
          icon={Zap} 
          description={`Issued vs ${stats.pointsRedeemed} redeemed`}
        />
      </div>

      {/* Activity Section Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-8">
            <h3 className="text-sm font-black tracking-widest text-white uppercase mb-6 flex items-center gap-2">
              Real-Time Activity <ArrowUpRight size={14} className="text-[#666]" />
            </h3>
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
               <div className="w-12 h-12 bg-[#161618] rounded-full flex items-center justify-center">
                  <Users size={20} className="text-gray-700" />
               </div>
               <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Connect POS for live order stream</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Link href="/admin/loyalty" className="group bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#FFA500]/50 transition-all">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#161618] rounded-lg group-hover:bg-[#FFA500]/10 transition-colors">
                      <Receipt size={20} className="text-gray-400 group-hover:text-[#FFA500]" />
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm">Moderate Receipts</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Loyalty Queue</p>
                   </div>
                </div>
             </Link>
             <Link href="/admin/menu" className="group bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#FFA500]/50 transition-all">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-[#161618] rounded-lg group-hover:bg-[#FFA500]/10 transition-colors">
                      <ShoppingBag size={20} className="text-gray-400 group-hover:text-[#FFA500]" />
                   </div>
                   <div>
                      <h4 className="text-white font-bold text-sm">Update Menu</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Inventory & Pricing</p>
                   </div>
                </div>
             </Link>
          </div>
        </div>

        <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-8">
           <h3 className="text-sm font-black tracking-widest text-white uppercase mb-6 flex items-center gap-2">
             Quick Fixes <Settings size={14} className="text-[#666]" />
           </h3>
           <button 
            onClick={async () => {
              setRepairStatus("Repairing...");
              try {
                const result = await repairImages();
                setRepairStatus(`Fixed ${result.updatedCount} images!`);
              } catch (e) {
                setRepairStatus("Failed to repair");
              }
              setTimeout(() => setRepairStatus(null), 3000);
            }}
            disabled={!!repairStatus}
            className="w-full flex items-center gap-4 p-4 bg-[#161618] border border-[#222] rounded-lg hover:border-[#FFA500]/50 transition-all text-left"
           >
              <div className="p-2 bg-[#0f0f11] rounded-md">
                 {repairStatus?.includes("Fixed") ? <CheckCircle2 size={16} className="text-green-500" /> : <ImageIcon size={16} className="text-gray-400" />}
              </div>
              <div>
                 <p className="text-white font-bold text-xs">{repairStatus || "Repair Image Links"}</p>
                 <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">Sync database with local assets</p>
              </div>
           </button>
        </div>

        <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-8">
          <h3 className="text-sm font-black tracking-widest text-white uppercase mb-6 flex items-center gap-2">
            System Alerts <span className="text-[#E31837] text-[10px]">•</span>
          </h3>
          <div className="space-y-4">
             <div className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-lg">
                <p className="text-orange-500 text-[10px] font-black uppercase mb-1">Loyalty</p>
                <p className="text-gray-300 text-xs font-bold leading-tight">
                   {stats.pendingReceiptsCount} receipt submissions are awaiting review.
                </p>
             </div>
             <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-[10px] font-black uppercase mb-1">Sports Data</p>
                <p className="text-gray-300 text-xs font-bold leading-tight">
                   Schedule sync completed successfully at 8:00 AM.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
