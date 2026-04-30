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
  UserPlus,
  Star,
  Gift,
  History,
  Info,
  ExternalLink,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState("receipts");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
        {activeTab === "members" && (
          <MemberDirectory 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            onViewProfile={(id: string) => setSelectedMemberId(id)} 
          />
        )}
        {activeTab === "rewards" && <RewardDefinitions />}
      </div>

      {/* Profile Modal */}
      {selectedMemberId && (
        <GuestProfileModal 
          userId={selectedMemberId} 
          onClose={() => setSelectedMemberId(null)} 
        />
      )}
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

function MemberDirectory({ searchTerm, setSearchTerm, onViewProfile }: any) {
  const members = useQuery(api.admin_loyalty.searchMembers, { searchTerm });

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
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161618]">
              {members?.map((m) => (
                <tr key={m._id} className="hover:bg-[#111] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border border-[#222]">
                        <Users size={14} className={m.isVIP ? "text-[#FFA500]" : "text-gray-400"} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-xs">{m.userId.substring(0, 15)}...</p>
                        <p className="text-gray-600 text-[10px] font-bold uppercase">{m.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[#FFA500] font-black text-sm tracking-tighter">{m.points || 0}</span>
                      <span className="text-gray-600 text-[8px] font-bold uppercase">Bal</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {m.isVIP ? (
                      <span className="bg-orange-900/20 text-[#FFA500] text-[8px] font-black px-2 py-0.5 rounded uppercase border border-orange-500/30">
                        {m.vipLevel || "LEGEND"}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-[8px] font-bold uppercase">MEMBER</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onViewProfile(m.userId)}
                      className="text-[10px] font-black uppercase text-[#FFA500] hover:underline flex items-center gap-1 ml-auto"
                    >
                      View Profile <ChevronRight size={12} />
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

function GuestProfileModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const members = useQuery(api.admin_loyalty.searchMembers, { searchTerm: userId });
  const orders = useQuery(api.admin_orders.getMemberOrders, { userId });
  const toggleVIP = useMutation(api.admin_loyalty.toggleVIP);
  const adjustPoints = useMutation(api.admin_loyalty.adjustPoints);
  
  const profile = members?.find(m => m.userId === userId);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#050505] border border-[#1a1a1a] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="p-8 border-b border-[#1a1a1a] bg-[#0a0a0a] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-[#161618] rounded-2xl flex items-center justify-center border border-[#222] shadow-inner">
                <Users size={32} className={profile.isVIP ? "text-[#FFA500]" : "text-gray-600"} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{profile.userId.substring(0, 16)}...</h2>
                <p className="text-[#FFA500] text-[10px] font-black uppercase tracking-[0.2em]">{profile.phone || "NO PHONE ATTACHED"}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Lifetime Spend</span>
                <span className="text-white font-black text-xl tracking-tighter">{profile.lifetimePoints || 0} <span className="text-xs text-gray-600 uppercase">PTS</span></span>
             </div>
             <div className="h-10 w-px bg-[#1a1a1a]" />
             <div className="flex flex-col items-end">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Current Balance</span>
                <span className="text-[#FFA500] font-black text-xl tracking-tighter">{profile.points || 0} <span className="text-xs text-orange-900 uppercase">PTS</span></span>
             </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-[#0f0f11] px-8 py-4 border-b border-[#1a1a1a] flex flex-wrap items-center gap-4">
           <button 
            onClick={() => toggleVIP({ userId, isVIP: !profile.isVIP, vipLevel: "LEGEND" })}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all",
              profile.isVIP ? "bg-orange-500 text-black border-orange-400" : "bg-black text-gray-500 border-[#222] hover:border-[#FFA500]/50"
            )}
           >
              <Star size={12} fill={profile.isVIP ? "black" : "transparent"} />
              {profile.isVIP ? "MEMBER IS LEGEND" : "MAKE LEGEND"}
           </button>

           <button 
            onClick={() => {
              const amount = prompt("Send points reward (e.g. 500 for Free App):");
              if (amount) adjustPoints({ userId, points: parseInt(amount), reason: "Admin Gifted Reward" });
            }}
            className="px-4 py-2 bg-black border border-[#222] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:border-green-500/50 transition-all"
           >
              <Gift size={12} className="text-green-500" />
              SEND REWARD
           </button>

           <div className="flex-1" />

           <button className="text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              BAN USER
           </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left: User Details */}
           <div className="space-y-6">
              <div>
                 <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Info size={12} /> Account Details
                 </h4>
                 <div className="bg-[#0a0a0a] border border-[#161618] rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between">
                       <span className="text-gray-600 text-[10px] font-bold uppercase">Member Since</span>
                       <span className="text-white text-xs font-bold">{new Date(profile._creationTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-600 text-[10px] font-bold uppercase">Birthday</span>
                       <span className="text-white text-xs font-bold">{profile.birthMonth || "???"} {profile.birthDay || "???"}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-600 text-[10px] font-bold uppercase">Vehicle</span>
                       <span className="text-white text-xs font-bold uppercase">{profile.vehicle?.color} {profile.vehicle?.make}</span>
                    </div>
                 </div>
              </div>

              <div>
                 <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <ShieldCheck size={12} /> Compliance
                 </h4>
                 <div className="bg-[#0a0a0a] border border-[#161618] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", profile.marketingOptIn ? "bg-green-500" : "bg-red-500")} />
                       <span className="text-gray-400 text-[10px] font-bold uppercase">Marketing Emails</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className={cn("w-2 h-2 rounded-full", profile.smsConsent ? "bg-green-500" : "bg-red-500")} />
                       <span className="text-gray-400 text-[10px] font-bold uppercase">SMS Notifications</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Order History */}
           <div className="lg:col-span-2">
              <h4 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <History size={12} /> Order History
              </h4>
              <div className="space-y-3">
                 {orders?.length === 0 ? (
                   <div className="bg-[#0a0a0a] border border-dashed border-[#1a1a1a] rounded-2xl py-20 text-center">
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No orders found</p>
                   </div>
                 ) : (
                   orders?.map((order) => (
                     <div key={order._id} className="bg-[#0a0a0a] border border-[#161618] rounded-2xl p-4 flex items-center justify-between hover:border-[#222] transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-[#161618] rounded-xl flex items-center justify-center border border-[#222]">
                              <ShoppingBag size={16} className="text-[#FFA500]" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="text-white font-bold text-xs">ORDER #{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                                 <span className="text-gray-600 text-[9px] font-bold uppercase tracking-widest">{new Date(order._creationTime).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-500 text-[10px] font-bold uppercase mt-0.5">{order.items.length} items • {order.destination}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-white font-black text-sm tracking-tighter">${order.total.toFixed(2)}</p>
                           <p className="text-green-500 text-[8px] font-black uppercase tracking-widest">{order.status}</p>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black border-t border-[#1a1a1a] flex justify-end">
           <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#161618] text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#222] transition-colors"
           >
              Close Profile
           </button>
        </div>

      </div>
    </div>
  );
}
