"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getOrderPagePath } from "@/lib/orderLinks";

const orderUrl = getOrderPagePath();

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
  /** When true the image is a self-contained banner — no overlay text or gradients are rendered. */
  bannerOnly?: boolean;
};

const firstHeroSlide: HeroSlide = {
  id: "bar",
  label: "Pull Up & Stay Awhile",
  heading: "Nothing But Good Times",
  subheading: "Walk in for one round. Stay for the kind of night you talk about tomorrow.",
  ctaHref: orderUrl,
  ctaLabel: "Order Now",
  image: "/images/atmosphere/IMGL6884.jpg",
  imageAlt: "The Owner's Box bar interior with wall-to-wall screens",
  objectPosition: "center 45%",
  badge: "Now Open",
};

const heroSlides: HeroSlide[] = [
  firstHeroSlide,
  {
    id: "world-cup",
    label: "This Friday · June 19 · 3 PM ET",
    heading: "World Cup Watch Party",
    subheading: "USA vs Australia on every screen. Pull up early, grab a seat, and rep the red, white & blue with the crew.",
    ctaHref: "/private-events",
    ctaLabel: "Book A Spot",
    image: "/images/world-cup-watch-party.JPEG",
    imageAlt: "World Cup Watch Party — USA vs Australia at The Owner's Box",
    objectPosition: "left center",
    badge: "⚽ FIFA World Cup",
    bannerOnly: true,
  },
  {
    id: "cocktails",
    label: "Craft Cocktails",
    heading: "Delicious Cocktails",
    subheading: "Fresh pours and cold glasses at the bar.",
    ctaHref: orderUrl,
    ctaLabel: "Order Takeout",
    image: "/images/food/esspresso-martini.JPG",
    imageAlt: "Espresso martini at The Owner's Box bar",
    objectPosition: "center 45%",
    badge: "Cold Drinks",
  },
  {
    id: "pizza",
    label: "Scratch-Made Pizza",
    heading: "Pizza Worth Staying For",
    subheading: "Craft pizza, jumbo wings, and bar favorites made fresh.",
    ctaHref: orderUrl,
    ctaLabel: "Order Takeout",
    image: "/images/food/official/featured-pizza.png",
    imageAlt: "Featured pizza at The Owner's Box",
    objectPosition: "center 22%",
    badge: "Good Eats",
  },
  {
    id: "baseball",
    label: "Baseball Watch Party",
    heading: "Catch Every Inning",
    subheading: "Grab a seat, pick your wall, and watch every inning with the crew.",
    ctaHref: "/private-events",
    ctaLabel: "Book a party",
    image: "/images/atmosphere/big-wall-left-1.jpg",
    imageAlt: "Guests watching baseball on wall-to-wall screens at The Owner's Box",
    objectPosition: "center 35%",
    badge: "MLB Season",
  },
  {
    id: "soccer",
    label: "Soccer Watch Party",
    heading: "Match Day At The Box",
    subheading: "World Cup summers, MLS weekends, and international nights with your crew.",
    ctaHref: "/private-events",
    ctaLabel: "Book a party",
    image: "/images/atmosphere/wide-view-from-right.jpg",
    imageAlt: "The Owner's Box dining room ready for a soccer watch party",
    objectPosition: "center 30%",
    badge: "Match Day",
  },
  {
    id: "woodruff",
    label: "Greenville, SC",
    heading: "Make This Your Spot",
    subheading: "Your neighborhood spot on Woodruff Road for food, drinks, and game day.",
    ctaHref: "/locations",
    ctaLabel: "Visit Us",
    image: "/images/atmosphere/ob-front.png",
    imageAlt: "The Owner's Box storefront on Woodruff Road at night",
    objectPosition: "center 42%",
    badge: "Your Neighborhood Bar",
  },
  {
    id: "late-night",
    label: "Late Night Hangs",
    heading: "Your Crew, Your Bar",
    subheading: "When the game ends and the room is still buzzing.",
    ctaHref: "/private-events",
    ctaLabel: "Book A Party",
    image: "/images/food/official/late-night-fun.jpg",
    imageAlt: "Friends enjoying drinks at The Owner's Box bar",
    objectPosition: "center 40%",
    badge: "Late Night Fun",
  },
];

function splitHeading(heading: string): string[] {
  if (heading === "Nothing But Good Times") return ["Nothing But", "Good Times"];
  if (heading === "Delicious Cocktails") return ["Delicious", "Cocktails"];
  if (heading === "Pizza Worth Staying For") return ["Pizza Worth", "Staying For"];
  if (heading === "Catch Every Inning") return ["Catch Every", "Inning"];
  if (heading === "World Cup Watch Party") return ["World Cup", "Watch Party"];
  if (heading === "Match Day At The Box") return ["Match Day", "At The Box"];
  if (heading === "Make This Your Spot") return ["Make This", "Your Spot"];
  if (heading === "Your Crew, Your Bar") return ["Your Crew,", "Your Bar"];
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
      className="relative min-h-[420px] overflow-hidden bg-[#101014] sm:min-h-[560px] md:min-h-[70vh] lg:min-h-[78vh] xl:min-h-[82vh] 2xl:min-h-[860px]"
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
            {!slide.bannerOnly && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-[#071B2F]/75 via-[#071B2F]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#05070B]/80 to-transparent" />
              </>
            )}
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[28%] z-10 flex flex-col justify-end p-5 pb-14 sm:top-[24%] sm:p-10 sm:pb-20 lg:top-[22%]">
        {!activeSlide.bannerOnly && (
        <div className="max-w-5xl pr-16 sm:max-w-[min(100%,42rem)] sm:pr-4">
          <p className="mb-4 flex w-fit items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#071B2F] px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-[#F2EAD4]">
            {activeSlide.badge && <span className="h-2 w-2 rounded-full bg-white" />}
            {activeSlide.label}
          </p>
          <div
            key={activeSlide.id}
            className="transition-all duration-500 ease-out motion-reduce:transition-none"
          >
            <h1 className="font-montserrat text-[clamp(2.5rem,7.5vw,6.5rem)] font-black uppercase leading-[0.84] tracking-[-0.08em] text-[#F2EAD4] xl:text-[clamp(2.75rem,6vw,7rem)]">
              {splitHeading(activeSlide.heading).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-4 max-w-md text-sm font-semibold leading-relaxed text-white sm:mt-5 sm:max-w-xl sm:text-base">
              {activeSlide.subheading}
            </p>
            {activeSlide.ctaHref === orderUrl ? (
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto mt-5 inline-flex rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-lg transition-transform hover:scale-[1.02] sm:mt-6"
              >
                {activeSlide.ctaLabel}
              </a>
            ) : null}
          </div>
        </div>
        )}

        <button
          type="button"
          onClick={scrollToNextSection}
          className="pointer-events-auto absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#05070B] shadow-xl transition-transform hover:scale-105 sm:bottom-8 sm:right-8"
          aria-label="Scroll to the next section"
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      </div>

      <div className="pointer-events-auto absolute top-5 right-5 z-10 flex flex-col items-end gap-2 sm:top-8 sm:right-8">
        <p className="rounded-full border border-[#D4AF37]/35 bg-[#071B2F]/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#F2EAD4] sm:text-[10px]">
          {activeIndex + 1} / {heroSlides.length}
        </p>
        <div className="flex items-center gap-2">
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
    </div>
  );
}
