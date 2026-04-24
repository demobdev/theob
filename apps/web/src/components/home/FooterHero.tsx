import Link from "next/link";
import React from "react";

const FooterHero = () => {
  return (
    <section className="bg-black py-24 relative overflow-hidden">
      <div className="absolute inset-0 leather-bg opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] text-sm mb-6 block">
            Visit Us Today
          </span>
          <h2 className="text-white text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-10">
            The Table is Set. <br />
            <span className="gold-text-gradient">We’re Just Waiting on You.</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-12">
            Whether it’s a quick pickup for the house or a front-row seat for the big game, we’ve got everything ready.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/menu" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-12 py-5 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-lg gold-glow hover:scale-105 transition-all">
                Order Online
              </button>
            </Link>
            <Link href="/locations" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-12 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
                Find a Location
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-[-50%] left-[-10%] w-full h-full bg-[#D4AF37]/10 blur-[150px] rounded-full pointer-events-none" />
    </section>
  );
};

export default FooterHero;
