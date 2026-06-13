"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { Tv, MapPin, Smartphone } from "lucide-react";
import AppComingSoonBadges from "@/components/common/AppComingSoonBadges";
import SportsTicker from "@/components/sports/SportsTicker";
import Link from "next/link";

export default function GamesPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />

      <section className="relative pt-28 sm:pt-32 pb-0 overflow-hidden min-h-[min(85vh,720px)] flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/leather_black.jpg"
            fill
            className="object-cover opacity-25"
            alt=""
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-10 sm:py-14">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 sm:mb-6 block">
              The Game Day Hub
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 sm:mb-8">
              Never Wonder What&apos;s On.
            </h1>
            <p className="text-gray-400 text-base sm:text-lg font-medium leading-relaxed">
              Live schedules, fight nights, and TV maps are coming to our mobile apps — the fastest way to see what&apos;s playing at The Owner&apos;s Box before you head in.
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 overflow-hidden">
              <div className="flex flex-col items-center md:items-start gap-5 p-8 md:p-10">
                <div className="h-14 w-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black shrink-0">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-white font-black uppercase tracking-widest text-sm mb-2">
                    Apps launching soon
                  </p>
                  <p className="text-gray-400 text-sm font-medium">
                    Fight nights, NFL Sunday Ticket matchups, and wall-to-wall TV maps — built for Greenville.
                  </p>
                </div>
                <AppComingSoonBadges direction="row" className="justify-center md:justify-start" />
              </div>

              <div className="relative min-h-[200px] md:min-h-[280px]">
                <Image
                  src="/images/food/jumbo_wings.png"
                  fill
                  className="object-cover"
                  alt="Game day wings at The Owner's Box"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0A0A0A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[200px]">
                  <p className="text-white text-xs font-black uppercase tracking-widest">
                    Get the full schedule in the app
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <div className="flex items-center gap-3 px-5 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
              <Tv className="h-5 w-5 text-[#D4AF37]" />
              <span className="text-sm font-black uppercase tracking-widest">14 HD Screens</span>
            </div>
            <div className="flex items-center gap-3 px-5 sm:px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white">
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

      <div className="border-t border-white/5">
        <SportsTicker />
      </div>

      <section className="py-20 sm:py-24 bg-black/40">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-8 text-center md:text-left">
            Game Day at The Box
          </h2>
          <div className="flex gap-6">
            <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6 text-black" />
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-2">
                Prime Seating
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Arrive early for the best seats — especially for big matchups and fight nights. First come, first served.
              </p>
              <p className="text-gray-600 text-xs font-medium mt-6">
                Full schedules and TV assignments launch with our mobile apps soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
