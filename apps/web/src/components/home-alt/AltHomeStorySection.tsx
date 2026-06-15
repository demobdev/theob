import Image from "next/image";
import Link from "next/link";

export default function AltHomeStorySection() {
  return (
    <section id="our-story" className="ob-canvas relative overflow-hidden bg-white px-4 py-20 text-[#05070B] sm:px-6">
      <div className="absolute inset-x-0 top-0 flex whitespace-nowrap border-y border-[#05070B]/10 bg-white py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex animate-marquee items-center">
            <span className="px-6 font-montserrat text-5xl font-black uppercase tracking-[-0.06em] text-[#05070B] sm:text-7xl">
              Good Times
            </span>
            <span className="px-6 font-montserrat text-5xl font-black uppercase tracking-[-0.06em] text-[#05070B] sm:text-7xl">
              Good Eats
            </span>
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-12 pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="relative min-h-[520px]">
          <div className="absolute left-0 top-0 h-[64%] w-[68%] overflow-hidden rounded-[32px] border-2 border-[#D4AF37]/35 bg-[#171713] shadow-2xl">
            <Image
              src="/images/atmosphere/big-wall-left-1.jpg"
              alt="The Owner's Box sports bar with wall-to-wall screens"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 70vw, 620px"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[46%] w-[58%] overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/35 bg-[#171713] shadow-2xl">
            <Image
              src="/images/atmosphere/IMG_3603.jpg"
              alt="Guests enjoying game day at The Owner's Box"
              fill
              className="object-cover"
              style={{ objectPosition: "center 22%" }}
              sizes="(max-width: 1024px) 60vw, 520px"
            />
          </div>
          <div className="absolute bottom-5 left-[18%] rounded-full border-2 border-[#D4AF37] bg-[#071B2F] p-4 shadow-xl">
            <Image src="/ob-icon.png" alt="" width={72} height={72} className="h-16 w-16 object-contain" />
          </div>
        </div>

        <div className="max-w-xl lg:justify-self-center">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/60">
            Since the first pour
          </p>
          <h2 className="font-montserrat text-[clamp(3.8rem,8vw,8rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
            Built For
            <br />
            Game Day
          </h2>
          <p className="mt-7 text-sm font-semibold leading-relaxed text-[#05070B]/70 sm:text-base">
            The Owner&apos;s Box is the easy answer for friends, families, regulars, and fans who
            want the food to hit as hard as the matchup. Pull up for scratch-made eats, stay for the
            screens, and make it a Greenville ritual.
          </p>
          <Link
            href="/our-story"
            className="mt-8 inline-flex rounded-full border-2 border-[#05070B] px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[#05070B] hover:text-white"
          >
            Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}
