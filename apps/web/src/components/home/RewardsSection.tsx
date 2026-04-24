import React from "react";
import { Shield, Award, Crown } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Roster Member",
    requirement: "Join for Free",
    benefits: ["$5 off your first order", "Earn 1pt per $1 spent", "Birthday rewards", "App-only specials"],
    icon: Shield,
    color: "border-gray-500/20",
    glow: "",
  },
  {
    name: "MVP",
    requirement: "Spend $250 / year",
    benefits: ["1.25x points on every order", "Early access to new items", "Reserved seating for big games", "Exclusive MVP events"],
    icon: Award,
    color: "border-[#D4AF37]/40",
    glow: "gold-glow",
    featured: true,
  },
  {
    name: "Hall of Fame",
    requirement: "Spend $1000 / year",
    benefits: ["2x points on every order", "Personal game-day concierge", "Annual Hall of Fame dinner", "Custom OB jersey"],
    icon: Crown,
    color: "border-[#D4AF37]",
    glow: "gold-glow shadow-[0_0_30px_rgba(212,175,55,0.15)]",
  },
];

const RewardsSection = () => {
  return (
    <section id="rewards" className="bg-[#0A0A0A] py-24 noise-overlay overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
            Loyalty Reimagined
          </span>
          <h2 className="text-white text-4xl sm:text-5xl font-black uppercase tracking-tight mb-6">
            Rewards That Actually Reward You.
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            No complicated math. No points that expire before you can use them. Just a straightforward path to free food and better game-day experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative premium-card p-10 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-2 ${tier.color} ${tier.glow}`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black">
                  Most Popular
                </div>
              )}
              
              <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-8 ${tier.featured ? "gold-gradient" : "bg-white/5"}`}>
                <tier.icon className={`h-10 w-10 ${tier.featured ? "text-black" : "text-[#D4AF37]"}`} />
              </div>

              <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2">
                {tier.name}
              </h3>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-8">
                {tier.requirement}
              </p>

              <ul className="space-y-4 mb-10 flex-1">
                {tier.benefits.map((benefit) => (
                  <li key={benefit} className="text-gray-400 text-sm font-medium">
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link href="/rewards" className="w-full">
                <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${tier.featured ? "gold-gradient text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"}`}>
                  Join the Roster
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 sm:p-12 rounded-[32px] leather-bg border border-white/10 relative group">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="max-w-2xl text-center lg:text-left">
                <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-4">
                  Check Your Points
                </h3>
                <p className="text-gray-400 font-medium">
                  Already a member? Sign in to see your current points balance, active rewards, and progress toward your next free pizza.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all">
                    Sign In
                  </button>
                </Link>
                <Link href="/app" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                    Download App
                  </button>
                </Link>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
