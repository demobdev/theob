"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import { Shield, Award, Crown, CheckCircle2, QrCode, Smartphone } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Roster Member",
    requirement: "Join for Free",
    benefits: [
      "$5 off your first order",
      "Earn 1pt per $1 spent",
      "Annual Birthday reward",
      "Exclusive App-only specials",
      "Skip the wait on pickup orders"
    ],
    icon: Shield,
    color: "border-gray-500/20",
    bg: "bg-white/5",
    text: "text-gray-400"
  },
  {
    name: "MVP",
    requirement: "Spend $250 / year",
    benefits: [
      "1.25x points on every order",
      "Early access to new menu items",
      "Reserved seating for big games",
      "Exclusive MVP-only events",
      "Free dessert on your anniversary"
    ],
    icon: Award,
    color: "border-[#D4AF37]/40",
    bg: "bg-[#D4AF37]/5",
    text: "text-[#D4AF37]",
    featured: true
  },
  {
    name: "Hall of Fame",
    requirement: "Spend $1000 / year",
    benefits: [
      "2x points on every order",
      "Personal game-day concierge",
      "Annual Hall of Fame private dinner",
      "Custom OB jersey with your name",
      "Unlimited free soda & coffee"
    ],
    icon: Crown,
    color: "border-[#D4AF37]",
    bg: "bg-gradient-to-br from-[#D4AF37]/10 to-transparent",
    text: "text-[#D4AF37]"
  },
];

export default function RewardsPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-6 block">
            The Roster
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-8">
            Loyalty <br /> Reimagined.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Join the most rewarding roster in Greenville. Earn points on every bite, unlock exclusive tiers, and experience game day like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/sign-up" className="w-full sm:w-auto">
               <button className="w-full sm:w-auto px-12 py-5 rounded-2xl gold-gradient text-black font-black uppercase tracking-widest text-lg gold-glow hover:scale-105 transition-all">
                 Join the Roster
               </button>
             </Link>
             <button className="w-full sm:w-auto px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
               Check My Points
             </button>
          </div>
        </div>
      </section>

      {/* Tier Grid */}
      <section className="py-24 noise-overlay">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`relative premium-card p-10 flex flex-col items-center transition-all duration-500 hover:-translate-y-2 ${tier.color} ${tier.bg}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black">
                    Most Popular
                  </div>
                )}
                
                <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-8 bg-black border border-white/10 shadow-2xl`}>
                  <tier.icon className={`h-12 w-12 ${tier.text}`} />
                </div>

                <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-2 text-center">
                  {tier.name}
                </h3>
                <p className={`${tier.text} text-xs font-bold uppercase tracking-widest mb-10 text-center`}>
                  {tier.requirement}
                </p>

                <ul className="space-y-6 mb-12 flex-1 w-full">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-4 text-gray-400 text-sm font-medium group">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${tier.text} opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${tier.featured ? "gold-gradient text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}>
                  {tier.name === "Roster Member" ? "Get Started" : "Learn More"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
              How it Works
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest">Three Simple Steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Smartphone, title: "Download the App", desc: "Available on iOS and Android. Create your account in seconds." },
              { icon: QrCode, title: "Scan & Earn", desc: "Scan your code at the register or order directly in the app to earn points." },
              { icon: Award, title: "Redeem Rewards", desc: "Use your points for free pizza, wings, and exclusive experiences." }
            ].map((step, i) => (
              <div key={i} className="text-center group">
                <div className="h-24 w-24 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:border-[#D4AF37]/50 transition-all rotate-3 group-hover:rotate-0">
                  <step.icon className="h-10 w-10 text-[#D4AF37]" />
                </div>
                <h4 className="text-white text-2xl font-black uppercase tracking-tight mb-4">{step.title}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
