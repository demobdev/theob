import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | The Owner's Box",
  description:
    "Owner's Box Bar & Grill in Greenville, SC — sports bar, scratch-made food, EST 2026.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-24 md:py-32 max-w-3xl">
        <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
          Est. 2026 · Greenville, SC
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
          About the Box
        </h1>
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 mb-12">
          <Image src="/hero.png" fill className="object-cover opacity-80" alt="The Owner's Box" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>
        <div className="space-y-6 text-gray-300 font-medium leading-relaxed">
          <p>
            <strong className="text-white">The Owner&apos;s Box Bar & Grill</strong> is Greenville&apos;s home for big games, cold drinks, and scratch-made food done right. We built the Box for regulars — people who want great wings, craft pizza, and a seat where the matchup actually matters.
          </p>
          <p>
            Wall-to-wall screens, NFL Sunday Ticket, and a kitchen that doesn&apos;t cut corners. Whether you&apos;re in for lunch, brunch, or a late-night finish, you get real hospitality and a menu built for sharing.
          </p>
          <p>
            Order ahead in our app, earn rewards on every visit, and see what&apos;s on TV before you walk in. One location on Woodruff Road — for now — with more Upstate neighborhoods on the radar.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/menu">
            <button
              type="button"
              className="px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow"
            >
              View Menu
            </button>
          </Link>
          <Link href="/locations">
            <button
              type="button"
              className="px-8 py-4 rounded-xl border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#D4AF37]/50"
            >
              Visit Us
            </button>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
