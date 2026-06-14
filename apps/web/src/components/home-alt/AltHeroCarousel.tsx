"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";

type HeroSlide = {
  id: string;
  label: string;
  heading: string;
  subheading: string;
  ctaHref: string;
  ctaLabel: string;
  image?: string;
  imageAlt?: string;
  objectPosition?: string;
  badge?: string;
  backgroundClassName?: string;
};

const firstHeroSlide: HeroSlide = {
  id: "bar",
  label: "Greenville's Game Day Bar",
  heading: "Nothing But Good Times",
  subheading: "People at the bar, sports on the screens, and the full Owner's Box energy.",
  ctaHref: "/menu",
  ctaLabel: "View the menu",
  image: "/sports-feature.jpg",
  imageAlt: "Guests at The Owner's Box bar",
  objectPosition: "center",
  badge: "Now Open",
};

const heroSlides: HeroSlide[] = [
  firstHeroSlide,
  {
    id: "knicks",
    label: "Basketball Watch Party",
    heading: "Knicks On The Big Screens",
    subheading: "Bring the crew for basketball, wings, pizza, and game-day sound when the matchup is on.",
    ctaHref: "/games",
    ctaLabel: "See games",
    image: "/images/sports/knicks-finals-watch.png",
    imageAlt: "New York Knicks championship celebration",
    objectPosition: "center",
    badge: "NBA Nights",
  },
  {
    id: "nhl",
    label: "Hockey Watch Party",
    heading: "Stanley Cup Energy",
    subheading: "Hockey nights, cold drinks, and a room ready for every shift.",
    ctaHref: "/private-events",
    ctaLabel: "Book a party",
    image: "/images/sports/stanley-cup-watch.png",
    imageAlt: "Hockey players skating onto the ice",
    objectPosition: "center",
    badge: "Hockey Ready",
  },
];

function splitHeading(heading: string): string[] {
  if (heading === "Nothing But Good Times") return ["Nothing But", "Good Times"];
  if (heading === "Knicks On The Big Screens") return ["Knicks On", "Big Screens"];
  if (heading === "Stanley Cup Energy") return ["Stanley Cup", "Energy"];
  return [heading];
}

export default function AltHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeSlide = heroSlides[activeIndex] ?? firstHeroSlide;

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + heroSlides.length) % heroSlides.length);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % heroSlides.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const scrollToNextSection = useCallback(() => {
    document.getElementById("good-times")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(goNext, 6500);
    return () => window.clearInterval(timer);
  }, [goNext, isPaused]);

  return (
    <div
      className="relative min-h-[420px] overflow-hidden rounded-[24px] border-2 border-[#171713]/10 bg-[#101014] sm:min-h-[560px] lg:min-h-[560px] xl:min-h-[620px] 2xl:min-h-[700px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {activeSlide.image ? (
            <Image
              src={activeSlide.image}
              alt={activeSlide.imageAlt ?? ""}
              fill
              priority={activeSlide.id === "bar"}
              className="object-cover"
              style={{ objectPosition: activeSlide.objectPosition ?? "center" }}
              sizes="(max-width: 768px) 100vw, 1600px"
            />
          ) : (
            <div className={`absolute inset-0 ${activeSlide.backgroundClassName ?? "bg-[#101014]"}`}>
              <div className="absolute left-[8%] top-[14%] h-44 w-44 rounded-full border-[18px] border-[#D4AF37]/30" />
              <div className="absolute right-[10%] top-[18%] h-40 w-40 rounded-full border-[16px] border-white/10" />
              <div className="absolute bottom-[12%] right-[16%] rounded-[28px] border border-[#D4AF37]/25 bg-black/25 px-8 py-6 backdrop-blur">
                <p className="font-montserrat text-5xl font-black uppercase leading-none tracking-[-0.08em] text-[#F2EAD4]">
                  NYK
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                  Watch Party
                </p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/78 via-black/28 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/72 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-10">
        <div className="max-w-5xl">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
            {activeSlide.badge && <span className="h-2 w-2 rounded-full bg-white" />}
            {activeSlide.label}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.id}-copy`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <h1 className="font-montserrat text-[clamp(3.4rem,10.5vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F2EAD4]">
                {splitHeading(activeSlide.heading).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-[#F2EAD4]/75 sm:text-base">
                {activeSlide.subheading}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={scrollToNextSection}
          className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#05070B] shadow-xl transition-transform hover:scale-105 sm:bottom-8 sm:right-8"
          aria-label="Scroll to the next section"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute right-5 top-5 z-20 flex items-center gap-2 sm:bottom-8 sm:right-28 sm:top-auto">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#05070B]"
          aria-label="Previous hero slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-9 bg-white" : "w-2.5 bg-white/45"
            }`}
            aria-label={`Show ${slide.label}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
        <button
          type="button"
          onClick={goNext}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur transition-colors hover:bg-white hover:text-[#05070B]"
          aria-label="Next hero slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
