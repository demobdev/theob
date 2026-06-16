import Image from "next/image";
import Link from "next/link";

export default function AltHomeStorySection() {
  return (
    <section
      id="our-story"
      className="ob-canvas relative z-10 overflow-hidden bg-white px-4 py-20 text-[#05070B] sm:px-6"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 overflow-hidden border-y border-[#05070B]/10 bg-white py-2">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center">
                <span className="px-6 font-montserrat text-5xl font-black uppercase tracking-[-0.06em] text-[#05070B] sm:text-7xl">
                  Good Times
                </span>
                <span className="px-6 font-montserrat text-5xl font-black uppercase tracking-[-0.06em] text-[#05070B] sm:text-7xl">
                  Good Eats
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
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
              When the game&apos;s on and your crew wants a spot worth showing up for, this is the
              room — fourteen HD screens, sound that matches the moment, and friends who actually
              watch together. NFL, NBA, hockey, soccer: grab a seat, pick your wall, and make it a
              good night out.
            </p>
            <Link
              href="/our-story"
              className="mt-8 inline-flex rounded-full border-2 border-[#05070B] px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[#05070B] hover:text-white"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
