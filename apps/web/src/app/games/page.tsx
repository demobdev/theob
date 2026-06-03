"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { Tv, MapPin, Smartphone } from "lucide-react";
import AppStoreBadges from "@/components/common/AppStoreBadges";
import SportsTicker from "@/components/sports/SportsTicker";
import Link from "next/link";

export default function GamesPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />

      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/leather_black.jpg"
            fill
            className="object-cover opacity-20"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
            The Game Day Hub
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
            Never Wonder What&apos;s On.
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
            Live schedules, fight nights, and TV maps are built for the app — the fastest way to see what&apos;s playing at The Owner&apos;s Box before you head in.
          </p>

          <div className="flex flex-col items-center gap-6 p-8 md:p-10 rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black">
              <Smartphone className="h-7 w-7" />
            </div>
            <p className="text-white font-black uppercase tracking-widest text-sm">
              Download the app for live schedules
            </p>
            <p className="text-gray-400 text-sm font-medium max-w-md">
              Fight nights, NFL Sunday Ticket matchups, and wall-to-wall TV maps — updated for Greenville.
            </p>
            <AppStoreBadges direction="row" className="justify-center" />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <Tv className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-sm font-black uppercase tracking-widest">30+ HD Screens</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <MapPin className="h-5 w-5 text-[#D4AF37]" />
              <Link
                href="/locations"
                className="text-sm font-black uppercase tracking-widest hover:text-[#D4AF37]"
              >
                Greenville Location
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-y border-white/5 bg-black/40">
        <div className="container mx-auto px-4 mb-4 text-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
            Today&apos;s ticker (preview)
          </p>
        </div>
        <SportsTicker />
      </section>

      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
                Game Day Protocols
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-white font-black uppercase tracking-widest mb-2">
                      Prime Seating
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Arrive 45 minutes before kickoff for the best seats. MVP members can request reservations for groups of 6 or more.
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium italic">
                  Full date filters and TV assignments are in the mobile app — web shows a lightweight preview only.
                </p>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="/images/food/jumbo_wings.png"
                fill
                className="object-cover opacity-60"
                alt="Game day wings"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/50 gap-6">
                <h3 className="text-white text-2xl font-black uppercase tracking-tight">
                  Get the full schedule
                </h3>
                <AppStoreBadges direction="col" className="items-center" />
                <Link href="/menu">
                  <button
                    type="button"
                    className="px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs"
                  >
                    Order for Game Day
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
