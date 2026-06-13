"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import FooterHero from "@/components/home/FooterHero";
import Hero from "@/components/home/Hero";
import Menu from "@/components/home/Menu";
import SportsTicker from "@/components/sports/SportsTicker";
import LiveGamesHome from "@/components/sports/LiveGamesHome";
import AppPromoBanner from "@/components/home/AppPromoBanner";

export default function Home() {
  const [sportFilter, setSportFilter] = useState("ALL");

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      <Hero />
      <LiveGamesHome sport={sportFilter} onSportChange={setSportFilter} />
      <div className="relative z-10">
        <SportsTicker sportFilter={sportFilter} />
      </div>
      <Menu />
      <AppPromoBanner />
      <FooterHero />
      <Footer />
    </main>
  );
}
