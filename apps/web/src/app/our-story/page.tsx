import Image from "next/image";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";

export const metadata = {
  title: "Our Story | The Owner's Box",
  description:
    "Greenville's game-day bar on Woodruff Road — wall-to-wall screens, scratch-made food, and a room built for regulars.",
};

export default function OurStoryPage() {
  const orderUrl = getHeartlandOrderUrl();

  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-12 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-10">
          <div className="relative min-h-[460px] overflow-hidden rounded-[24px] border-2 border-[#05070B]/10 sm:min-h-[620px]">
            <Image
              src="/images/atmosphere/wide-view-from-right.jpg"
              alt="The Owner's Box dining room and bar"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
              sizes="(max-width: 768px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Est. 2026 · Greenville, SC
              </p>
              <h1 className="max-w-5xl font-montserrat text-[clamp(4rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-white">
                Our
                <br />
                Story
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/78 sm:text-base">
                The easy answer for friends, families, regulars, and fans who want the food to hit
                as hard as the matchup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 py-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/35 bg-[#171713] shadow-2xl">
            <Image
              src="/images/atmosphere/big-wall-left-1.jpg"
              alt="Wall-to-wall sports screens at The Owner's Box"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 680px"
            />
          </div>

          <div className="max-w-2xl space-y-6 text-sm font-semibold leading-relaxed text-[#05070B]/72 sm:text-base">
            <p>
              <strong className="text-[#05070B]">The Owner&apos;s Box Bar & Grill</strong> is
              Greenville&apos;s home for big games, cold drinks, and scratch-made food done right.
              We built the Box for regulars — people who want great wings, craft pizza, and a seat
              where the matchup actually matters.
            </p>
            <p>
              Wall-to-wall screens, NFL Sunday Ticket, and a kitchen that doesn&apos;t cut
              corners. Whether you&apos;re in for lunch, brunch, or a late-night finish, you get
              real hospitality and a menu built for sharing.
            </p>
            <p>
              Browse the menu on our site, order takeout through Heartland, or get delivery on
              DoorDash. One location on Woodruff Road — pull up for the full experience.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/menu"
                className="inline-flex rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
              >
                View Menu
              </Link>
              <Link
                href="/locations"
                className="inline-flex rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-transform hover:-translate-y-0.5"
              >
                Visit Us
              </Link>
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border-2 border-[#D4AF37] bg-[#071B2F] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#F2EAD4] transition-transform hover:-translate-y-0.5"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
