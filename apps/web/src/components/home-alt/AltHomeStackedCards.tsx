"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cards = [
  {
    eyebrow: "Game day energy",
    title: "Rack Up The Fun",
    text: "Fourteen HD screens, cold drinks, and a room built for the matchup.",
    href: "/games",
    cta: "See What's On",
    image: "/sports-feature.jpg",
    strip: "bg-[#071B2F] text-[#F2EAD4]",
    body: "bg-[#101014] text-[#F2EAD4]",
    marquee: ["Sports Bar", "Cold Drinks", "Live Games"],
  },
  {
    eyebrow: "Groups, parties, regulars",
    title: "The Party Starts Here",
    text: "Bring the crew for birthdays, watch parties, league drafts, and Greenville nights out.",
    href: "/private-events",
    cta: "Book A Party",
    image: "/images/hero-bg.png",
    strip: "bg-white text-[#05070B]",
    body: "bg-[#071B2F] text-[#F2EAD4]",
    marquee: ["Book A Party", "Good Times", "Greenville"],
    eventImage: "/sports-feature.jpg",
    eventBullets: ["Groups & celebrations", "Dedicated screens", "Shared apps, wings, pizza"],
  },
  {
    eyebrow: "Scratch-made lineup",
    title: "Good Eats All Night",
    text: "Pizza, wings, shareables, and bar favorites that keep the table full.",
    href: "/menu",
    cta: "View Menu",
    image: "/images/food/official/featured-pizza.png",
    strip: "bg-white text-[#05070B]",
    body: "bg-[#171713] text-[#F2EAD4]",
    marquee: ["Good Eats", "Wings", "Pizza"],
    foodImages: [
      {
        src: "/images/food/official/featured-pizza.png",
        alt: "Featured pizza",
        label: "Featured Pizza",
      },
      {
        src: "/images/food/official/classic-neopolitan.png",
        alt: "Classic Neapolitan pizza",
        label: "Classic Neapolitan",
      },
      {
        src: "/images/food/jumbo_wings.png",
        alt: "Jumbo wings",
        label: "Jumbo Wings",
      },
      {
        src: "/images/food/crab_dip.png",
        alt: "Crab dip",
        label: "Shareables",
      },
    ],
  },
];

function MarqueeLine({ words }: { words: string[] }) {
  const items = [...words, ...words, ...words, ...words];

  return (
    <div className="overflow-hidden border-y border-current/20 py-3">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap">
        {items.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-5 px-5">
            <span className="font-montserrat text-3xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
              {word}
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FoodImageStack({
  images,
}: {
  images: Array<{ src: string; alt: string; label: string }>;
}) {
  return (
    <div className="max-w-3xl pt-1 sm:pt-5">
      <p className="mb-4 text-[9px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
        Menu favorites
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {images.map((image, index) => (
          <Link
            href="#"
            key={image.src}
            className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-[#F2EAD4]/20 bg-[#101014] shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              transform: `translateY(${index % 2 === 0 ? 0 : 8}px) rotate(${
                index === 1 ? 2 : index === 2 ? -2 : index === 3 ? 1 : -1
              }deg)`,
            }}
            aria-label={`View ${image.label}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 42vw, 180px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#F2EAD4]">
                {image.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EventInfoPanel({
  image,
  bullets,
}: {
  image: string;
  bullets: string[];
}) {
  return (
    <div className="grid max-w-3xl grid-cols-[0.8fr_1fr] items-end gap-4 pt-1 sm:grid-cols-[0.9fr_1fr] sm:gap-5 sm:pt-5">
      <div className="relative aspect-square overflow-hidden rounded-[24px] border-2 border-current/20 bg-[#171713] shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:aspect-[4/3] sm:rounded-[28px]">
        <Image
          src={image}
          alt="Private events at The Owner's Box"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 360px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      </div>
      <div className="flex flex-col justify-end">
        <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
          Private events
        </p>
        <ul className="space-y-3">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-current" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AltHomeStackedCards() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 70%", "end 30%"],
  });
  const rotate = useTransform(scrollYProgress, [0, 0.35, 0.55, 0.78, 1], [0, 270, 238, 286, 270]);
  const badgeY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, 0]);

  return (
    <section ref={sectionRef} className="ob-canvas relative bg-white px-4 pt-16 text-[#05070B] sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/60">
              Restaurant + Sports Bar
            </p>
            <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-7xl">
              Scroll The
              <br />
              Lineup
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-relaxed text-[#05070B]/65">
            The cards clip, stack, and slide into the next moment as you scroll. Each one keeps
            that internal marquee movement without bringing back the full sports dashboard.
          </p>
        </div>

        <div className="relative">
          <motion.div
            style={{ rotate, y: badgeY }}
            className="pointer-events-none sticky top-24 z-30 ml-auto mr-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#071B2F] shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:mr-8 sm:h-24 sm:w-24"
          >
            <Image src="/ob-icon.png" alt="" width={60} height={60} className="h-14 w-14 object-contain" />
          </motion.div>

          <div className="-mt-20">
            {cards.map((card, index) => (
              <article
                key={card.title}
                className={`sticky h-[calc(100svh-112px)] overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/45 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:h-[calc(100svh-124px)] md:h-auto ${
                  index < cards.length - 1 ? "-mb-[38vh]" : ""
                }`}
                style={{ top: `${76 + index * 16}px`, zIndex: 10 + index }}
              >
                <div
                  className={`flex items-center justify-between gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] sm:px-6 ${card.strip}`}
                >
                  <span>The Owner&apos;s Box</span>
                  <span>{card.eyebrow}</span>
                </div>

                <div
                  className={`grid h-[calc(100%-40px)] grid-rows-[0.38fr_0.62fr] md:min-h-[72vh] md:grid-cols-[0.95fr_1.05fr] md:grid-rows-none ${card.body}`}
                >
                  <div className="relative min-h-0 overflow-hidden md:min-h-full">
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 780px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  </div>

                  <div className="flex min-h-0 min-w-0 flex-col justify-between gap-3 overflow-hidden p-5 sm:gap-5 sm:p-8 md:gap-6 md:overflow-visible md:p-10">
                    <div>
                      <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-70 sm:mb-4 sm:text-[10px]">
                        {card.eyebrow}
                      </p>
                      <h3 className="max-w-full text-balance font-montserrat text-[clamp(2.55rem,10.5vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] sm:text-[clamp(3rem,7vw,7rem)]">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-xs font-semibold leading-relaxed opacity-70 sm:mt-6 sm:text-sm md:text-base">
                        {card.text}
                      </p>
                      <Link
                        href={card.href}
                        className="mt-4 inline-flex rounded-full border-2 border-current px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 sm:mt-7 sm:px-5 sm:text-[10px]"
                      >
                        {card.cta}
                      </Link>
                    </div>

                    {card.foodImages && <FoodImageStack images={card.foodImages} />}
                    {card.eventImage && card.eventBullets && (
                      <EventInfoPanel image={card.eventImage} bullets={card.eventBullets} />
                    )}
                    <div className="shrink-0">
                      <MarqueeLine words={card.marquee} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <div aria-hidden="true" className="h-[74vh] sm:h-[66vh] md:h-[58vh] lg:h-[52vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}
