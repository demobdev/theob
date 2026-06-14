import Image from "next/image";
import Link from "next/link";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";

export default function AltHomeGoodTimes() {
  const orderUrl = getHeartlandOrderUrl();

  return (
    <section id="good-times" className="ob-canvas scroll-mt-4 bg-white px-4 py-14 text-[#05070B] sm:px-6">
      <div className="ob-surface mx-auto max-w-[1600px] rounded-[28px] bg-white px-4 py-10 shadow-[0_28px_90px_rgba(0,0,0,0.2)] sm:px-8 lg:px-12">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/65">
            Your go-to for
          </p>
          <h2 className="font-montserrat text-6xl font-black uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl">
            Good
            <br />
            Times
          </h2>
        </div>

        <div className="max-w-xl">
          <p className="mb-6 text-sm font-semibold leading-relaxed text-[#05070B]/75">
            Pull up for scratch-made favorites, cold drinks, and the game on every screen. The
            homepage stays minimal here, but the energy is still wall-to-wall Owner&apos;s Box.
          </p>
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-[3px_3px_0_#05070B] transition-transform hover:-translate-y-0.5"
          >
            Order Takeout
          </a>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-[#171713]">
          <Image
            src="/images/hero-bg.png"
            alt="The Owner's Box atmosphere"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 520px"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative min-h-[260px] overflow-hidden rounded-[24px] bg-[#171713]">
            <Image
              src="/images/food/official/featured-pizza.png"
              alt="Owner's Box pizza"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <p className="absolute bottom-5 left-5 font-montserrat text-3xl font-black uppercase leading-none text-[#F2EAD4]">
              Good Eats
            </p>
          </div>

          <div className="flex min-h-[260px] flex-col justify-between rounded-[24px] bg-[#05070B] p-7 text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/65">
              Minimal sports
            </p>
            <div>
              <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
                14 HD
                <br />
                Screens
              </h3>
              <p className="mt-4 text-xs font-semibold leading-relaxed text-white/60">
                Big games are still part of the story, just not the whole homepage.
              </p>
            </div>
            <Link
              href="/games"
              className="w-fit rounded-full border border-white/40 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white hover:text-[#05070B]"
            >
              Game Day
            </Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
