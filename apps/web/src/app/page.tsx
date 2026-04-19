"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import FooterHero from "@/components/home/FooterHero";
import Hero from "@/components/home/Hero";
import Menu from "@/components/home/Menu";
import UpcomingGamesSection from "@/components/sports/upcoming-games-section";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Header />
      <Hero />
      <Menu />
      {/* We will insert the UpcomingGamesSection from sport-match repo here once migrated */}
      <FooterHero />
      <Footer />
    </main>
  );
}
