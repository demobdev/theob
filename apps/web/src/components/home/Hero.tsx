import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden noise-overlay leather-bg pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Text Content */}
          <div className="flex-1 max-w-3xl text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-bold uppercase tracking-[0.2em] mb-6 animate-fade-in">
              The Owner’s Favorites
            </span>
            <h1 className="font-montserrat text-white text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Craft Pizza, <br />
              <span className="gold-text-gradient">Wings & More</span>
              <br /> Game Day Energy
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0">
              The Owner’s Box brings together scratch-made favorites, real-time sports, easy online ordering, and a loyalty experience built for regulars. Come in for the game. Stay for the food.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/menu">
                <button className="w-full sm:w-auto px-10 py-5 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-lg gold-glow hover:scale-105 transition-all active:scale-95">
                  Order Now
                </button>
              </Link>
              <Link href="/menu">
                <button className="w-full sm:w-auto px-10 py-5 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-lg hover:bg-white/10 transition-all">
                  View Menu
                </button>
              </Link>
            </div>
            
            <p className="mt-6 text-gray-500 text-sm font-semibold uppercase tracking-widest italic">
              Curbside pickup, dine-in, and direct ordering built for speed.
            </p>
          </div>

          {/* Image / Visual Column */}
          <div className="flex-1 w-full lg:w-auto relative group">
            <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <Image
                src="/hero.png"
                fill
                alt="Owner's Box Premium Pizza and Wings"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#1A1A1A]/90 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full gold-gradient flex items-center justify-center font-black text-black text-xl">
                    OB
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight">Earn Points Daily</h4>
                    <p className="text-gray-400 text-xs font-medium">Join 12,000+ Roster Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip - Now Relative to prevent overlap */}
      <div className="bg-[#D4AF37] py-6 overflow-hidden mt-12">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Live Games</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Local Favorites</span>
              <span className="text-black/30">•</span>
              <span className="text-black font-black uppercase tracking-[0.3em] text-sm">Rewards That Actually Reward You</span>
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
