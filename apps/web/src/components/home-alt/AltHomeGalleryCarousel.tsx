"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const galleryImages = [
  {
    src: "/images/food/official/bang-bang-shrimp.jpg",
    alt: "Bang Bang Shrimp appetizer",
    shape: "square" as const,
  },
  {
    src: "/images/food/official/lamb-gyro.jpg",
    alt: "Lamb gyro with fries",
    shape: "square" as const,
  },
  {
    src: "/images/atmosphere/dtl-1.jpg",
    alt: "Down-the-line bar view",
    shape: "tall" as const,
  },
  {
    src: "/images/food/official/buffalo-pizza.jpg",
    alt: "Buffalo chicken pizza",
    shape: "square" as const,
  },
  {
    src: "/images/drinks/vertical-coffe-martini.jpg",
    alt: "Espresso martini at the bar",
    shape: "tall" as const,
  },
  {
    src: "/images/atmosphere/friends-and-family.jpg",
    alt: "Friends and family at the bar",
    shape: "square" as const,
  },
  {
    src: "/images/atmosphere/cinematic-dtl-1.jpg",
    alt: "Cinematic down-the-line interior",
    shape: "tall" as const,
  },
  {
    src: "/images/food/official/featured-pizza.png",
    alt: "Featured pizza",
    shape: "square" as const,
  },
  {
    src: "/images/drinks/cocktail-on-bar-1.jpg",
    alt: "Craft cocktail on the bar",
    shape: "tall" as const,
  },
  {
    src: "/images/atmosphere/big-wall-left-1.jpg",
    alt: "Wall-to-wall sports screens",
    shape: "square" as const,
  },
  {
    src: "/images/atmosphere/black-and-white-1.jpg",
    alt: "The Owner's Box interior atmosphere",
    shape: "tall" as const,
  },
  {
    src: "/images/drinks/horizontal-lemon-cocktail.jpg",
    alt: "Lemon cocktail on the bar",
    shape: "square" as const,
  },
  {
    src: "/images/atmosphere/wide-view-from-right.jpg",
    alt: "Wide view of the dining room",
    shape: "square" as const,
  },
];

export default function AltHomeGalleryCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const carouselImages = [...galleryImages, ...galleryImages];
  const shouldAnimate = revealed && isVisible && !isPaused && !prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById("stack-gallery-sentinel");
    if (!sentinel) {
      setRevealed(true);
      return;
    }

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setRevealed(entry.isIntersecting);
      },
      { rootMargin: "-45% 0px 0px 0px", threshold: 0 },
    );

    revealObserver.observe(sentinel);
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const section = sectionRef.current;
    if (!section) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { rootMargin: "120px 0px", threshold: 0.05 },
    );

    visibilityObserver.observe(section);
    return () => visibilityObserver.disconnect();
  }, [revealed]);

  if (!revealed) {
    return (
      <section
        aria-hidden="true"
        className="ob-canvas relative z-0 bg-white py-12 pt-28 sm:pt-24 md:pt-20"
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      className="ob-canvas relative z-0 overflow-hidden bg-white py-12 pt-28 text-[#05070B] sm:pt-24 md:pt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div
          role="region"
          aria-label="Photo gallery. Hover to pause scrolling."
          className={`flex w-max items-center gap-5 px-5 ${
            revealed && !prefersReducedMotion ? "animate-marquee-extra-slow" : ""
          }`}
          style={{
            animationPlayState: shouldAnimate ? "running" : "paused",
          }}
        >
          {carouselImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={
                image.shape === "tall"
                  ? "relative h-72 w-48 shrink-0 overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/20 bg-[#171713] sm:h-[390px] sm:w-64 2xl:h-[460px] 2xl:w-80"
                  : "relative h-48 w-48 shrink-0 overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/20 bg-[#171713] sm:h-64 sm:w-64 2xl:h-80 2xl:w-80"
              }
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                draggable={false}
                className="pointer-events-none object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 200px, (max-width: 1536px) 260px, 320px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
