"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { 
  Users, 
  Receipt, 
  Trophy, 
  Search, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState("receipts");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "receipts", name: "Receipt Queue", icon: Receipt },
    { id: "members", name: "Member Directory", icon: Users },
    { id: "rewards", name: "Reward Tiers", icon: Trophy },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">LOYALTY OS</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2">
            Manage Members, Moderation & Rewards
          </p>
        </div>
        
        <div className="flex bg-[#0f0f11] border border-[#1a1a1a] p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all text-xs font-bold uppercase tracking-wider",
                activeTab === tab.id 
                  ? "bg-[#161618] text-[#FFA500] shadow-xl" 
                  : "text-gray-500 hover:text-white"
              )}
            >
              <tab.icon size={14} />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        {activeTab === "receipts" && <ReceiptQueue />}
        {activeTab === "members" && <MemberDirectory searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        {activeTab === "rewards" && <RewardDefinitions />}
      </div>
    </div>
  );
}

function ReceiptQueue() {
  const receipts = useQuery(api.admin_loyalty.getPendingReceipts);
  const approve = useMutation(api.admin_loyalty.approveReceipt);
  const reject = useMutation(api.admin_loyalty.rejectReceipt);

  if (!receipts) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 bg-[#111] rounded-xl" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Submissions ({receipts.length})</h3>
      </div>
      
      {receipts.length === 0 ? (
        <div className="bg-[#0f0f11] border border-dashed border-[#222] rounded-xl py-20 flex flex-col items-center justify-center text-center">
           <CheckCircle2 size={40} className="text-gray-800 mb-4" />
           <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Queue is clear</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {receipts.map((r) => (
            <div key={r._id} className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#222] transition-colors">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-20 h-20 bg-[#161618] rounded-lg overflow-hidden border border-[#222]">
                   <img src={r.imageUrl} alt="Receipt" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-black text-xl">${r.amount.toFixed(2)}</span>
                    <span className="bg-orange-900/20 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded uppercase">+{Math.floor(r.amount * 10)} PTS</span>
                  </div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">User: {r.userId.substring(0, 12)}...</p>
                  <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest italic">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => reject({ submissionId: r._id, reason: "Incomplete receipt image" })}
                  className="px-6 py-3 bg-[#161618] text-red-500 font-black text-[10px] uppercase tracking-widest rounded-lg border border-red-900/20 hover:bg-red-900/10 transition-colors"
                 >
                   Reject
                 </button>
                 <button 
                  onClick={() => approve({ submissionId: r._id, pointsToAward: Math.floor(r.amount * 10) })}
                  className="px-6 py-3 bg-[#FFA500] text-black font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-colors"
                 >
                   Approve
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MemberDirectory({ searchTerm, setSearchTerm }: any) {
  const members = useQuery(api.admin_loyalty.searchMembers, { searchTerm });
  const adjust = useMutation(api.admin_loyalty.adjustPoints);

  return (
    <div className="space-y-6">
       <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH MEMBERS BY NAME, PHONE, OR ID..."
            className="w-full bg-[#0f0f11] border border-[#1a1a1a] rounded-xl py-4 pl-12 pr-4 text-white text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#FFA500] transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
       </div>

       <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Member</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Points</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Lifetime</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161618]">
              {members?.map((m) => (
                <tr key={m._id} className="hover:bg-[#111] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-[#222]">
                        <Users size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-xs">{m.userId.substring(0, 15)}...</p>
                        <p className="text-gray-600 text-[10px] font-bold uppercase">{m.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-[#FFA500] font-black text-sm tracking-tighter">{m.points || 0}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-gray-400 font-bold text-xs tracking-tighter">{m.lifetimePoints || 0}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        const pts = prompt("Adjust points (negative for deduction):");
                        if (pts) adjust({ userId: m.userId, points: parseInt(pts), reason: "Manual Admin Adjustment" });
                      }}
                      className="text-[10px] font-black uppercase text-[#FFA500] hover:underline"
                    >
                      Adjust
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

function RewardDefinitions() {
  const rewards = useQuery(api.loyalty.getRewardDefinitions);
  const update = useMutation(api.admin_loyalty.updateReward);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {rewards?.map((reward) => (
         <div key={reward._id} className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-6 hover:border-[#222] transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className="bg-[#161618] p-2 rounded-lg">
                  <Trophy size={18} className="text-[#FFA500]" />
               </div>
               <div className="flex items-center gap-2">
                 <span className={cn(
                   "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                   reward.isActive ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500"
                 )}>
                   {reward.isActive ? "Active" : "Archived"}
                 </span>
               </div>
            </div>

            <h3 className="text-white font-black text-lg tracking-tighter mb-1">{reward.title}</h3>
            <p className="text-gray-500 text-[11px] font-medium leading-relaxed mb-4">{reward.category} • {reward.rewardType}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#161618]">
               <div>
                  <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">COST</p>
                  <p className="text-white font-black text-xl tracking-tighter">{reward.pointsCost} <span className="text-[10px] text-gray-500">PTS</span></p>
               </div>
               <button 
                onClick={() => {
                  const newCost = prompt("Enter new points cost:", reward.pointsCost.toString());
                  if (newCost) update({ rewardId: reward._id, updates: { pointsCost: parseInt(newCost) } });
                }}
                className="p-2 bg-[#161618] border border-[#222] rounded-lg text-gray-400 hover:text-white transition-colors"
               >
                  <MoreHorizontal size={16} />
               </button>
            </div>
         </div>
       ))}
    </div>
  );
}
