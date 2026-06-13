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

      <section className="relative pt-28 sm:pt-32 pb-0 overflow-hidden flex flex-col">
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

        <div className="container mx-auto px-4 relative z-10 py-10 sm:py-14">
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

          <div className="max-w-3xl mx-auto w-full">
            <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/30 min-h-[280px] sm:min-h-[320px]">
              <Image
                src="/sports-feature.jpg"
                fill
                className="object-cover object-center scale-105"
                alt="Guests watching sports at The Owner's Box"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/50" />

              <div className="relative z-10 flex flex-col items-center gap-5 p-8 md:p-12 text-center">
                <div className="h-14 w-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black shrink-0">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-widest text-sm mb-2">
                    Apps launching soon
                  </p>
                  <p className="text-gray-300 text-sm font-medium max-w-md mx-auto leading-relaxed">
                    Fight nights, NFL Sunday Ticket matchups, and wall-to-wall TV maps — built for Greenville.
                  </p>
                </div>
                <AppComingSoonBadges direction="row" className="justify-center" />
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
                Visit Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5">
        <SportsTicker />
      </div>

      <Footer />
    </main>
  );
}
