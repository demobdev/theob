"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import HeartlandOrderLink from "@/components/common/HeartlandOrderLink";
import { HERO_VIDEO_URL } from "@/lib/heartlandLinks";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      /* autoplay blocked or missing file — gradient fallback shows through */
    });
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero_image_bg.svg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-16">
        <div className="max-w-3xl text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold uppercase tracking-[0.2em] mb-6">
            The Owner&apos;s Favorites
          </span>
          <h1 className="font-montserrat text-white text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            Craft Pizza, <br />
            <span className="gold-text-gradient">Wings & More</span>
            <br /> Game Day Energy
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0">
            The Owner&apos;s Box brings together scratch-made favorites, live sports on 14 HD screens, and a loyalty experience built for regulars. Come in for the game. Stay for the food.
          </p>
          <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0">
            Curbside pickup, dine-in, and delivery are available online. You can also find us on DoorDash.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <HeartlandOrderLink className="w-full sm:w-auto">
              <span className="inline-flex w-full sm:w-auto justify-center px-10 py-5 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-lg gold-glow hover:scale-105 transition-all active:scale-95 cursor-pointer">
                Order Online
              </span>
            </HeartlandOrderLink>
            <Link href="/locations" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Visit Greenville
              </button>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-transparent border border-white/20 text-white/90 font-black uppercase tracking-widest text-lg hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
              >
                Browse Menu
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-[#D4AF37] py-6 overflow-hidden mt-auto">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Live Games</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">14 HD Screens</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Curbside Pickup</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">DoorDash Delivery</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Rewards That Actually Reward You</span>
              <span className="text-black/30">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
