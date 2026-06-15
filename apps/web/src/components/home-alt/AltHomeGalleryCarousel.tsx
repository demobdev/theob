"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/** ~95s per full loop at typical desktop widths (matches prior marquee-extra-slow feel). */
const AUTO_SCROLL_PX_PER_SEC = 58;

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

function normalizeOffset(offset: number, loopWidth: number): number {
  if (loopWidth <= 0) return offset;
  let next = offset % loopWidth;
  if (next < 0) next += loopWidth;
  return next;
}

export default function AltHomeGalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

  const [revealed, setRevealed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const carouselImages = [...galleryImages, ...galleryImages];

  const measureLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    loopWidthRef.current = track.scrollWidth / 2;
  }, []);

  const paintOffset = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const loopWidth = loopWidthRef.current;
    if (loopWidth > 0) {
      offsetRef.current = normalizeOffset(offsetRef.current, loopWidth);
    }

    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById("stack-gallery-sentinel");
    if (!sentinel) {
      setRevealed(true);
      return;
    }

    const onScroll = () => {
      const { top } = sentinel.getBoundingClientRect();
      setRevealed(top <= window.innerHeight * 0.55);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!revealed) return;

    const track = trackRef.current;
    if (!track) return;

    measureLoopWidth();
    paintOffset();

    const resizeObserver = new ResizeObserver(() => {
      measureLoopWidth();
      paintOffset();
    });
    resizeObserver.observe(track);

    const tick = (time: number) => {
      const loopWidth = loopWidthRef.current;
      if (!isDraggingRef.current && loopWidth > 0) {
        const last = lastFrameRef.current ?? time;
        const elapsed = time - last;
        offsetRef.current += (AUTO_SCROLL_PX_PER_SEC * elapsed) / 1000;
        paintOffset();
      }
      lastFrameRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [revealed, measureLoopWidth, paintOffset]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastFrameRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    const deltaX = dragStartXRef.current - event.clientX;
    offsetRef.current = dragStartOffsetRef.current + deltaX;
    paintOffset();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);
    lastFrameRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    paintOffset();
  };

  if (!revealed) {
    return (
      <section
        aria-hidden="true"
        className="ob-canvas relative z-0 bg-white py-12 pt-28 sm:pt-24 md:pt-20"
      />
    );
  }

  return (
    <section className="ob-canvas relative z-0 overflow-hidden bg-white py-12 pt-28 text-[#05070B] sm:pt-24 md:pt-20">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div
          ref={trackRef}
          role="region"
          aria-label="Photo gallery. Click and drag horizontally to browse."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`flex w-max touch-pan-y select-none items-center gap-5 px-5 ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ willChange: "transform" }}
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
                className={`pointer-events-none object-cover ${
                  isDragging ? "" : "transition-transform duration-700 hover:scale-105"
                }`}
                sizes="(max-width: 768px) 200px, (max-width: 1536px) 260px, 320px"
                onLoad={measureLoopWidth}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
