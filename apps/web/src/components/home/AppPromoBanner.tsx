"use client";

import Image from "next/image";
import { Zap, Trophy, Star, Smartphone } from "lucide-react";
import AppComingSoonBadges from "@/components/common/AppComingSoonBadges";

const appFeatures = [
  { icon: Zap, text: "Reorder favorites in a few taps — coming in the app" },
  { icon: Star, text: "Live game schedules on every screen" },
  { icon: Trophy, text: "See what's on TV and what's coming up" },
  { icon: Smartphone, text: "Mobile apps launching soon" },
];

export default function AppPromoBanner() {
  return (
    <section className="relative overflow-hidden bg-black py-24 noise-overlay border-y border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
          {/* LEFT: App card mockup + floating promo card */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-lg">
              {/* Main leather card */}
              <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-8 md:p-10 aspect-[1.6/1] noise-overlay">
                <div className="absolute inset-0 opacity-80 pointer-events-none leather-bg" />

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-black text-xl md:text-2xl tracking-tight uppercase">
                        Mobile Apps
                      </h3>
                      <p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1">
                        Launching Soon
                      </p>
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 relative">
                      <Image src="/loading-icon.png" fill className="object-contain" alt="OB Logo" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        iOS
                      </p>
                      <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2">
                        + Android
                      </p>
                    </div>
                    <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] px-6 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg flex items-center gap-3">
                      <Smartphone size={20} />
                      Soon
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full gold-gradient rounded-full animate-pulse" />
                    </div>
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      Live schedules · Faster reorder · Full experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating promo card — hover to straighten & zoom */}
              <div className="absolute -bottom-20 -right-12 lg:-right-20 w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 hidden md:block rotate-3 hover:rotate-0 transition-all duration-500 group z-20 cursor-default">
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/images/food/jumbo_wings.png"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Game day wings"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                </div>

                <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                  <span className="inline-block w-fit rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
                    Coming Soon
                  </span>
                  <h4 className="text-white font-black text-lg leading-tight uppercase">
                    Apps Launching Soon
                  </h4>
                  <p className="text-gray-400 text-[9px] font-medium mt-1 leading-snug">
                    Live schedules, faster reorder, and the full Owner&apos;s Box experience — right from your phone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Content area */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-6 block">
              The Owner&apos;s Box in Your Pocket
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] uppercase mb-8">
              Game Day, <br />
              <span className="gold-text-gradient">In Your Pocket.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Our mobile apps are on the way. Until then, browse the menu here and use Order Takeout or DoorDash from the header.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {appFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors">
                    <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-white text-sm font-bold uppercase tracking-wide">{feature.text}</span>
                </li>
              ))}
            </ul>

            <AppComingSoonBadges direction="row" className="justify-center lg:justify-start" />
          </div>
        </div>
      </div>
    </section>
  );
}
