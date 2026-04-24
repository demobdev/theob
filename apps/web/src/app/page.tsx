"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import FooterHero from "@/components/home/FooterHero";
import Hero from "@/components/home/Hero";
import Menu from "@/components/home/Menu";
import SportsTicker from "@/components/sports/SportsTicker";
import AppPromoBanner from "@/components/home/AppPromoBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import RewardsSection from "@/components/home/RewardsSection";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      <Hero />
      <FeaturesSection />
      <div className="relative z-10">
        <SportsTicker />
      </div>
      <AppPromoBanner />
      <Menu />
      <RewardsSection />
      <Testimonials />
      <FooterHero />
      <Footer />
    </main>
  );
}
