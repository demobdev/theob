import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getOrderPagePath } from "@/lib/orderLinks";

const Hero = () => {
  const orderUrl = getOrderPagePath();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden noise-overlay pt-20">
      <Image
        src="/images/hero-bg.png"
        fill
        alt=""
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/55" aria-hidden />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
            Now Open
          </span>
          <h1 className="font-montserrat text-white text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
            Craft Pizza, <br />
            <span className="gold-text-gradient">Wings & More</span>
            <br /> Game Day Energy
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0">
            Now open with scratch-made favorites, wall-to-wall sports, and a game-day atmosphere built for regulars. Browse the menu here — order takeout or DoorDash delivery from the header.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
            <Link href="/menu">
              <button className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
                View Menu
              </button>
            </Link>
            <a href={orderUrl} target="_blank" rel="noopener noreferrer">
              <button className="w-full sm:w-auto px-10 py-5 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-lg gold-glow hover:scale-105 transition-all active:scale-95 inline-flex items-center justify-center gap-2">
                Order Takeout
                <ExternalLink size={20} />
              </button>
            </a>
          </div>
        </div>
      </div>



      <div className="relative z-10 w-full bg-[#D4AF37] py-6 overflow-hidden mt-12">

        <div className="flex whitespace-nowrap animate-marquee">

          {[1, 2, 3, 4].map((i) => (

            <div key={i} className="flex items-center gap-12 px-6">

              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Live Games</span>

              <span className="text-black/30">•</span>

              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Local Favorites</span>

              <span className="text-black/30">•</span>

              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Wall-to-Wall Sports</span>

              <span className="text-black/30">•</span>

              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Fast Pickup</span>

              <span className="text-black/30">•</span>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

};



export default Hero;

