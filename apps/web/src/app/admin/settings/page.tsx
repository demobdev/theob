"use client";

import { useUser } from "@clerk/nextjs";
import { Shield, User, Mail, Smartphone, Globe, Lock } from "lucide-react";

export default function AdminSettingsPage() {
  const { user } = useUser();

  return (
    <div className="p-8 space-y-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Settings</h1>
        <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2">
          Manage Admin Identity & Preferences
        </p>
      </div>

      <div className="space-y-6">
         {/* Profile Card */}
         <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <div className="p-8 border-b border-[#1a1a1a] flex items-center gap-6">
               <div className="w-20 h-20 bg-[#161618] rounded-full border border-[#222] flex items-center justify-center overflow-hidden">
                  <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white tracking-tighter">{user?.fullName || "ADMIN USER"}</h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                     <Shield size={12} className="text-[#FFA500]" /> SYSTEM ADMINISTRATOR
                  </p>
               </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div>
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Clerk User ID</p>
                     <p className="text-white font-mono text-xs bg-[#161618] p-2 rounded border border-[#222]">{user?.id}</p>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Primary Email</p>
                     <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Mail size={14} className="text-gray-600" />
                        {user?.primaryEmailAddress?.emailAddress}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
                     <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Lock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Access Verified</span>
                     </div>
                     <p className="text-gray-300 text-xs font-medium leading-relaxed">
                        Your account has full administrative privileges over the loyalty, menu, and order systems.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Placeholders */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-8 opacity-40 grayscale pointer-events-none">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Smartphone size={14} /> SMS NOTIFICATIONS
               </h3>
               <p className="text-gray-600 text-xs italic">Feature coming in Phase 3...</p>
            </div>
            <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-8 opacity-40 grayscale pointer-events-none">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe size={14} /> INTEGRATIONS
               </h3>
               <p className="text-gray-600 text-xs italic">Genesis/Xenial POS Sandbox...</p>
            </div>
         </div>
      </div>
    </div>
  );
}
