"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import UpcomingGamesSection from "@/components/sports/upcoming-games-section";
import Image from "next/image";
import { Tv, MapPin, Calendar, Info } from "lucide-react";

export default function GamesPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/leather_black.jpg" 
            fill 
            className="object-cover opacity-20" 
            alt="Sports Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
            The Game Day Hub
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8">
            Never Wonder <br /> What’s On.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Greenville’s home for the biggest matchups. From NFL Sunday Ticket to the PGA Tour, if it’s on, it’s playing at The Owner’s Box.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <Tv className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-sm font-black uppercase tracking-widest">30+ HD Screens</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <Calendar className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-sm font-black uppercase tracking-widest">Live Schedule</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Schedule Section */}
      <UpcomingGamesSection showFeatured={true} />

      {/* Pro Tips / Info */}
      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
                 Game Day <br /> Protocols
               </h2>
               <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest mb-2">Prime Seating</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Arrive 45 minutes before kickoff for the best seats. MVP members can request reservations for groups of 6 or more.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
                      <Info className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest mb-2">Audio Requests</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        We prioritize audio for the biggest game of the hour, but feel free to ask your server if we can tune into your specific matchup.
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
               <Image 
                src="/images/food/wings.png" 
                fill 
                className="object-cover opacity-60" 
                alt="Wings" 
               />
               <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-black/40">
                  <div>
                    <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-4">The MVP Experience</h3>
                    <p className="text-gray-300 font-medium mb-8 max-w-md mx-auto">
                      Upgrade your game day with early access to seating and exclusive MVP rewards.
                    </p>
                    <button className="px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs">
                      Join the Roster
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
