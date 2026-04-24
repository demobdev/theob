"use client";

import Image from "next/image";
import { QrCode, Zap, Trophy, Star, Clock } from "lucide-react";
import Link from "next/link";

const appFeatures = [
  { icon: Zap, text: "Reorder favorites in a few taps" },
  { icon: Star, text: "Earn points automatically on every order" },
  { icon: Trophy, text: "See what’s on TV and what’s coming up" },
  { icon: Clock, text: "Join the Roster for $5 off your first order" },
];

export default function AppPromoBanner() {
  return (
    <section className="relative overflow-hidden bg-black py-24 noise-overlay border-y border-white/5">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
          
          {/* LEFT: Rewards Card Mockup Area */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-lg">
                {/* Main Leather Card */}
                <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-8 md:p-10 aspect-[1.6/1] noise-overlay">
                    <div 
                        className="absolute inset-0 opacity-80 pointer-events-none leather-bg"
                    />
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-white font-black text-xl md:text-2xl tracking-tight uppercase">ROSTER MEMBER</h3>
                                <p className="text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1">Active Status</p>
                            </div>
                            <div className="w-12 h-12 md:w-14 md:h-14 relative">
                                <Image src="/loading-icon.png" fill className="object-contain" alt="OB Logo" />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">1,250</p>
                                <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2">Available Points</p>
                            </div>
                            <button className="bg-[#D4AF37] text-black px-6 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-lg flex items-center gap-3 active:scale-95 transition-transform gold-glow">
                                <QrCode size={20} className="text-black/90" />
                                SCAN
                            </button>
                        </div>
                        
                        <div className="space-y-4 pt-4">
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[65%] h-full gold-gradient rounded-full" />
                            </div>
                            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">350 PTS UNTIL YOUR NEXT FREE PIZZA</p>
                        </div>
                    </div>
                </div>
                
                {/* Floating "$5 OFF" Promo Card */}
                <div className="absolute -bottom-20 -right-12 lg:-right-20 w-72 h-44 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 hidden md:block rotate-3 hover:rotate-0 transition-all duration-500 group z-20">
                    <div className="absolute inset-0 z-0">
                        <Image src="/images/food/wings.png" fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt="Wings" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    </div>
                    
                    <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                        <div className="bg-[#D4AF37] text-black text-[8px] font-black px-2 py-0.5 rounded-sm inline-block uppercase tracking-widest w-fit mb-2">New Reward</div>
                        <h4 className="text-white font-black text-lg leading-tight uppercase">
                            $5 OFF <br /> 
                            <span className="text-[#D4AF37]">The Owner's Wings</span>
                        </h4>
                        <p className="text-gray-400 text-[9px] font-bold mt-1 uppercase tracking-widest">Roster Exclusive • First Order Only</p>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: Content Area */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-6 block">
              The Owner’s Box in Your Pocket
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.05] uppercase mb-8">
              Order, Earn, and <br />
              <span className="gold-text-gradient">Dominate Game Day.</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Our app is built for the regulars. It’s the fastest way to get your favorites and the only way to earn points on every bite.
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

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                <Image 
                  src="/apple-app-store.svg" 
                  alt="Download on the App Store" 
                  width={160}
                  height={52}
                  className="h-[52px] w-auto"
                />
              </Link>
              <Link href="#" className="transition-transform hover:scale-105 active:scale-95">
                <Image 
                  src="/google-play.svg" 
                  alt="Get it on Google Play" 
                  width={160}
                  height={52}
                  className="h-[52px] w-auto"
                />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
