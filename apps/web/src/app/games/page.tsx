"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { Tv, MapPin, Smartphone } from "lucide-react";
import AppComingSoonBadges from "@/components/common/AppComingSoonBadges";
import SportsTicker from "@/components/sports/SportsTicker";
import LiveGamesHome from "@/components/sports/LiveGamesHome";
import Link from "next/link";

export default function GamesPage() {
  const [sportFilter, setSportFilter] = useState("ALL");

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />

      {/* Compact hero — matches menu page height */}
      <section className="relative border-b border-[#D4AF37]/15 overflow-hidden">
        <div className="grid grid-cols-12 h-[160px] sm:h-[200px] md:h-[240px]">
          <div className="col-span-4 md:col-span-3 relative">
            <Image
              src="/sports-feature.jpg"
              fill
              className="object-cover object-center"
              alt="Guests watching sports at The Owner's Box"
              priority
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/80" />
          </div>
          <div className="col-span-8 md:col-span-9 grid grid-cols-3">
            {[
              { src: "/images/food/buffalo-wings.png", alt: "Game day wings" },
              { src: "/hero.png", alt: "The Owner's Box bar" },
              { src: "/images/food/beer.png", alt: "Cold drinks" },
            ].map((photo) => (
              <div key={photo.src} className="relative overflow-hidden">
                <Image
                  src={photo.src}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  alt={photo.alt}
                  sizes="(max-width: 768px) 22vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="container mx-auto px-4 pb-5 md:pb-6 pt-12 md:pt-16">
            <div className="min-w-0">
              <div className="h-px w-12 bg-[#D4AF37] mb-2.5" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                Never Wonder What&apos;s On
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mt-2">
                Game Day Hub · Wall-to-Wall Sports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App promo + quick links — tile surface instead of leather */}
      <section className="relative surface-tile border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60 pointer-events-none" />
        <div className="container mx-auto px-4 py-10 sm:py-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
              Live schedules, fight nights, and TV maps are coming to our mobile apps — the fastest way to see what&apos;s playing before you head in.
            </p>
          </div>

          <div className="max-w-2xl mx-auto w-full mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/25 min-h-[200px] sm:min-h-[220px]">
              <Image
                src="/images/hero-bg.png"
                fill
                className="object-cover object-center"
                alt="The Owner's Box game day atmosphere"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A]/40" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8">
                <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-black shrink-0">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-white font-black uppercase tracking-widest text-xs mb-1">
                    Apps launching soon
                  </p>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    Fight nights, NFL Sunday Ticket matchups, and wall-to-wall TV maps — built for Greenville.
                  </p>
                </div>
                <AppComingSoonBadges direction="row" className="justify-center sm:justify-end shrink-0" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <Tv className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-xs font-black uppercase tracking-widest">Wall-to-Wall Sports</span>
            </div>
            <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              <Link
                href="/locations"
                className="text-xs font-black uppercase tracking-widest hover:text-[#D4AF37]"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LiveGamesHome sport={sportFilter} onSportChange={setSportFilter} />

      <div className="border-t border-white/5">
        <SportsTicker sportFilter={sportFilter} />
      </div>

      <Footer />
    </main>
  );
}
