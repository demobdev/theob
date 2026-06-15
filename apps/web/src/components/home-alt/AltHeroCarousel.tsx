"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";

const orderUrl = getHeartlandOrderUrl();

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
  ctaHref: orderUrl,
  ctaLabel: "Order Now",
  image: "/sports-feature.jpg",
  imageAlt: "Guests at The Owner's Box bar",
  objectPosition: "center",
  badge: "Now Open",
};

const heroSlides: HeroSlide[] = [
  firstHeroSlide,
  {
    id: "cocktails",
    label: "Craft Cocktails",
    heading: "Delicious Cocktails",
    subheading:
      "Cold glasses, fresh pours, and Greenville nights at the bar — pull up, stay awhile, and sip something great.",
    ctaHref: orderUrl,
    ctaLabel: "View Menu",
    image: "/images/drinks/horizontal-lemon-cocktail.jpg",
    imageAlt: "Craft lemon cocktail at The Owner's Box bar",
    objectPosition: "center 40%",
    badge: "Cold Drinks",
  },
  {
    id: "pizza",
    label: "Scratch-Made Pizza",
    heading: "Pizza Worth Staying For",
    subheading: "Craft pizza, jumbo wings, and bar favorites — made fresh for dine-in or takeout.",
    ctaHref: orderUrl,
    ctaLabel: "View Menu",
    image: "/images/food/official/featured-pizza.png",
    imageAlt: "Featured pizza at The Owner's Box",
    objectPosition: "center 22%",
    badge: "Good Eats",
  },
  {
    id: "basketball",
    label: "Basketball Watch Party",
    heading: "Your Game On The Wall",
    subheading: "Bring the crew for basketball, wings, pizza, and game-day sound when the matchup is on.",
    ctaHref: "/private-events",
    ctaLabel: "Book a party",
    image: "/images/sports/knicks-finals-watch.png",
    imageAlt: "Guests watching basketball at The Owner's Box",
    objectPosition: "center",
    badge: "NBA Nights",
  },
  {
    id: "hockey",
    label: "Hockey Watch Party",
    heading: "Puck Drop Energy",
    subheading: "Hockey nights, cold drinks, and a room ready for every shift.",
    ctaHref: "/private-events",
    ctaLabel: "Book a party",
    image: "/images/sports/stanley-cup-watch.png",
    imageAlt: "Hockey on the screens at The Owner's Box",
    objectPosition: "center",
    badge: "Hockey Ready",
  },
];

function splitHeading(heading: string): string[] {
  if (heading === "Nothing But Good Times") return ["Nothing But", "Good Times"];
  if (heading === "Delicious Cocktails") return ["Delicious", "Cocktails"];
  if (heading === "Pizza Worth Staying For") return ["Pizza Worth", "Staying For"];
  if (heading === "Your Game On The Wall") return ["Your Game", "On The Wall"];
  if (heading === "Puck Drop Energy") return ["Puck Drop", "Energy"];
  return [heading];
}

export default function AltHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [manualControl, setManualControl] = useState(false);
  const activeSlide = heroSlides[activeIndex] ?? firstHeroSlide;

  const pauseAndGo = useCallback((nextIndex: number) => {
    setManualControl(true);
    setIsPaused(true);
    setActiveIndex((nextIndex + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      pauseAndGo(index);
    },
    [pauseAndGo],
  );

  const goNext = useCallback(() => {
    pauseAndGo(activeIndex + 1);
  }, [activeIndex, pauseAndGo]);

  const goPrev = useCallback(() => {
    pauseAndGo(activeIndex - 1);
  }, [activeIndex, pauseAndGo]);

  const scrollToNextSection = useCallback(() => {
    document.getElementById("good-times")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative min-h-[420px] overflow-hidden rounded-[24px] border-2 border-[#171713]/10 bg-[#101014] sm:min-h-[560px] md:min-h-[70vh] lg:min-h-[78vh] xl:min-h-[82vh] 2xl:min-h-[860px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!manualControl) setIsPaused(false);
      }}
    >
      {heroSlides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.image ? (
              <Image
                src={slide.image}
                alt={slide.imageAlt ?? ""}
                fill
                priority={index === 0}
                className="object-cover"
                style={{ objectPosition: slide.objectPosition ?? "center" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 92vw, 1600px"
              />
            ) : (
              <div className={`absolute inset-0 ${slide.backgroundClassName ?? "bg-[#101014]"}`}>
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#071B2F]/75 via-[#071B2F]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05070B]/80 to-transparent" />
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 pb-24 sm:p-10 sm:pb-28">
        <div className="max-w-5xl pr-4 sm:max-w-[min(100%,42rem)]">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#071B2F] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#F2EAD4]">
            {activeSlide.badge && <span className="h-2 w-2 rounded-full bg-white" />}
            {activeSlide.label}
          </p>
          <div
            key={activeSlide.id}
            className="transition-all duration-500 ease-out motion-reduce:transition-none"
          >
            <h1 className="font-montserrat text-[clamp(3.4rem,10.5vw,10rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F2EAD4]">
              {splitHeading(activeSlide.heading).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white sm:text-base">
              {activeSlide.subheading}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToNextSection}
          className="pointer-events-auto absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#05070B] shadow-xl transition-transform hover:scale-105 sm:bottom-8 sm:right-8"
          aria-label="Scroll to the next section"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-auto absolute right-5 top-5 z-30 flex items-center gap-2 sm:right-8 sm:top-8">
        <button
          type="button"
          onClick={goPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#071B2F] text-[#F2EAD4] shadow-lg transition-colors hover:bg-[#D4AF37] hover:text-[#05070B]"
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
              index === activeIndex ? "w-9 bg-[#D4AF37]" : "w-2.5 bg-[#F2EAD4]/50"
            }`}
            aria-label={`Show ${slide.label}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
        <button
          type="button"
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#071B2F] text-[#F2EAD4] shadow-lg transition-colors hover:bg-[#D4AF37] hover:text-[#05070B]"
          aria-label="Next hero slide"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
