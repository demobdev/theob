"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MonitorPlay, Users, UtensilsCrossed } from "lucide-react";
import { getOrderPagePath } from "@/lib/orderLinks";
import {
  STACK_SCROLL,
  stackStickyTop,
  stackZIndex,
} from "./stackScrollConfig";

function cardShellClass(index: number, isLast: boolean, body: string): string {
  const heightClass = isLast
    ? STACK_SCROLL.lastCardHeight
    : index === 0
      ? `${STACK_SCROLL.firstCardHeight} ${STACK_SCROLL.cardOverlapMargin}`
      : index === 1
        ? `${STACK_SCROLL.middleCardHeightParty} ${STACK_SCROLL.cardOverlapMargin}`
        : `${STACK_SCROLL.middleCardHeight} ${STACK_SCROLL.cardOverlapMargin}`;

  const overflowClass = "overflow-hidden";

  return `sticky isolate ${overflowClass} rounded-[28px] border-2 border-[#D4AF37]/45 shadow-[0_30px_90px_rgba(0,0,0,0.35)] ${body} ${heightClass}`;
}

function cardGridClass(isLast: boolean, body: string, hasEventPanel?: boolean): string {
  const innerMin = isLast
    ? STACK_SCROLL.innerGridMdMinHeight
    : hasEventPanel
      ? STACK_SCROLL.innerGridMdMinHeightParty
      : STACK_SCROLL.innerGridMdMinHeightMiddle;

  if (isLast) {
    return `relative z-0 grid h-auto grid-cols-1 md:grid-cols-[0.95fr_1.05fr] md:grid-rows-none ${innerMin} ${body}`;
  }

  return `relative z-0 grid h-auto grid-cols-1 md:h-[calc(100%-40px)] md:grid-cols-[0.95fr_1.05fr] md:grid-rows-none ${innerMin} ${body}`;
}

const cardImageColumnClass =
  "relative aspect-square w-full shrink-0 overflow-hidden md:aspect-auto md:h-full md:min-h-0";

/**
 * Desktop stack overlap exposes ~34vh of the previous card's left column.
 * Split into hero (top) + peek strip (bottom) so the visible slice is intentional.
 * Mobile keeps a single square hero — overlap strip isn't visible there.
 */
function StackCardImageColumn({
  image,
  imagePosition = "center",
  peekImage,
  peekImages,
  peekImagePosition = "center",
  peekImageCover = false,
  bodyClass,
}: {
  image: string;
  imagePosition?: string;
  peekImage?: string;
  peekImages?: string[];
  peekImagePosition?: string;
  peekImageCover?: boolean;
  bodyClass: string;
}) {
  const showPeekStrip = peekImages?.length || peekImage;

  return (
    <div className={`${cardImageColumnClass} ${bodyClass}`}>
      <div className="relative h-full w-full md:flex md:flex-col">
        <div className="relative aspect-square w-full overflow-hidden md:aspect-auto md:min-h-0 md:flex-1">
          <Image
            src={image}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: imagePosition }}
            sizes="(max-width: 768px) 100vw, 780px"
          />
        </div>
        {showPeekStrip ? (
          <div
            className={`relative ${STACK_SCROLL.peekStripHeight} hidden shrink-0 overflow-hidden border-t border-[#D4AF37]/25 bg-[#101014] md:block`}
          >
            {peekImages?.length ? (
              <div className="grid h-full grid-cols-3">
                {peekImages.map((src) => (
                  <div key={src} className="relative h-full min-h-0">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 260px"
                    />
                  </div>
                ))}
              </div>
            ) : peekImage ? (
              <Image
                src={peekImage}
                alt=""
                fill
                className={
                  peekImageCover || !peekImage.endsWith(".png")
                    ? "object-cover"
                    : "object-contain p-3 sm:p-4"
                }
                style={
                  peekImageCover || !peekImage.endsWith(".png")
                    ? { objectPosition: peekImagePosition }
                    : undefined
                }
                sizes="(max-width: 768px) 100vw, 780px"
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const cards = [
  {
    eyebrow: "Game day energy",
    title: "Catch Every Play",
    text: "Cold drinks and a room built for the matchup.",
    href: "/locations",
    cta: "Visit Us",
    image: "/images/atmosphere/wide-view-from-right.jpg",
    imagePosition: "center 30%",
    peekImage: "/images/atmosphere/big-wall-left-1.jpg",
    peekImagePosition: "center 42%",
    strip: "bg-[#071B2F] text-[#F2EAD4]",
    body: "bg-[#101014] text-[#F2EAD4]",
    marquee: ["Sports Bar", "Full Bar", "Specialty Drinks", "Big Screens"],
  },
  {
    eyebrow: "Groups, parties, regulars",
    title: "The Party Starts Here",
    text: "Bring the crew for birthdays, watch parties, fantasy draft nights, and Greenville nights out.",
    href: "/private-events",
    cta: "Book A Party",
    image: "/images/atmosphere/friends-and-family.jpg",
    imagePosition: "center 22%",
    peekImage: "/images/atmosphere/ob-front.png",
    peekImagePosition: "center 40%",
    peekImageCover: true,
    strip: "bg-white text-[#05070B]",
    body: "bg-[#071B2F] text-[#F2EAD4]",
    eventImage: "/images/atmosphere/dtl-1.jpg",
    eventFeatures: [
      {
        icon: Users,
        label: "Groups & celebrations",
        detail: "Birthdays, fantasy draft nights, and nights out with your crew.",
      },
      {
        icon: MonitorPlay,
        label: "Dedicated screens",
        detail: "Put your game on the wall and keep every seat in the action.",
      },
      {
        icon: UtensilsCrossed,
        label: "Apps, wings & pizza",
        detail: "Shareable favorites and cold pours for the whole table.",
      },
    ],
  },
  {
    eyebrow: "Scratch-made lineup",
    title: "Good Eats All Night",
    text: "Pizza, wings, shareables, and bar favorites that keep the table full.",
    href: "/menu",
    cta: "Order Takeout",
    orderOnline: true,
    strip: "bg-white text-[#05070B]",
    body: "bg-[#171713] text-[#F2EAD4]",
    marquee: ["Good Eats", "Wings", "Pizza"],
    heroImage: {
      src: "/images/food/official/featured-pizza.png",
      alt: "Featured pizza at The Owner's Box",
    },
    foodImages: [
      {
        src: "/images/food/official/featured-pizza.png",
        alt: "Featured pizza",
        label: "Featured Pizza",
      },
      {
        src: "/images/food/official/bang-bang-shrimp-3.png",
        alt: "Bang Bang Shrimp appetizer",
        label: "Bang Bang",
        thumbPosition: "center 55%",
        heroObjectFit: "contain" as const,
      },
      {
        src: "/images/food/official/philly-cheesesteak-1.png",
        alt: "Philly cheesesteak with fries",
        label: "Cheesesteak",
        thumbPosition: "center 42%",
        heroObjectFit: "contain" as const,
      },
      {
        src: "/images/food/official/scratch-made.png",
        alt: "Scratch-made pizza prep",
        label: "Scratch-Made",
        thumbPosition: "center 38%",
        heroObjectFit: "contain" as const,
      },
    ],
  },
];

function MarqueeLine({ words, compact = false }: { words: string[]; compact?: boolean }) {
  const items = [...words, ...words, ...words, ...words];

  return (
    <div
      className={`relative isolate overflow-hidden border-y border-current/20 bg-inherit ${
        compact ? "py-2" : "py-3"
      }`}
    >
      <div className="flex w-max animate-marquee items-center whitespace-nowrap">
        {items.map((word, index) => (
          <div key={`${word}-${index}`} className="flex items-center gap-5 px-5">
            <span
              className={`font-montserrat font-black uppercase leading-none tracking-[-0.06em] ${
                compact ? "text-2xl sm:text-4xl" : "text-3xl sm:text-5xl"
              }`}
            >
              {word}
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-current" />
          </div>
        ))}
      </div>
    </div>
  );
}

function foodImageStyle(image: {
  thumbPosition?: string;
  imageRotate?: number;
}): CSSProperties | undefined {
  const rotate = image.imageRotate;
  if (rotate === undefined && !image.thumbPosition) return undefined;

  return {
    ...(image.thumbPosition ? { objectPosition: image.thumbPosition } : {}),
    ...(rotate !== undefined
      ? { transform: `rotate(${rotate}deg) scale(1.42)` }
      : {}),
  };
}

function FoodImageStack({
  images,
  selectedIndex,
  onSelect,
  compact = false,
}: {
  images: Array<{
    src: string;
    alt: string;
    label: string;
    thumbPosition?: string;
    thumbObjectFit?: "contain" | "cover";
    imageRotate?: number;
  }>;
  selectedIndex: number;
  onSelect: (index: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={`max-w-3xl shrink-0 ${compact ? "pt-0" : "pt-1 sm:pt-3"}`}>
      <p className="mb-2 text-[9px] font-black uppercase tracking-[0.28em] text-[#D4AF37] sm:mb-3">
        Menu favorites
      </p>
      <div className={`grid grid-cols-4 ${compact ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
        {images.map((image, index) => {
          const isSelected = index === selectedIndex;
          const tilt =
            index === 1 ? 2 : index === 2 ? -2 : index === 3 ? 1 : -1;

          return (
            <button
              type="button"
              key={image.src}
              onClick={() => onSelect(index)}
              className={`group relative aspect-square w-full min-w-0 overflow-hidden rounded-2xl border-2 bg-[#101014] shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                isSelected
                  ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50"
                  : "border-[#F2EAD4]/20 hover:border-[#D4AF37]/60"
              }`}
              style={{
                transform: compact
                  ? undefined
                  : `translateY(${index % 2 === 0 ? 0 : 8}px) rotate(${tilt}deg)`,
              }}
              aria-label={`Show ${image.label}`}
              aria-pressed={isSelected}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                style={
                  image.thumbPosition
                    ? { objectPosition: image.thumbPosition }
                    : undefined
                }
                sizes="(max-width: 640px) 42vw, 180px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171713] to-transparent p-2 sm:p-3">
                <span className="text-[7px] font-black uppercase tracking-widest text-[#F2EAD4] sm:text-[8px]">
                  {image.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardCta({
  href,
  external,
  label,
}: {
  href: string;
  external?: boolean;
  label: string;
}) {
  const className =
    "mt-4 inline-flex rounded-full border-2 border-current px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 sm:mt-7 sm:px-5 sm:text-[10px]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function GoodEatsCard({
  card,
  index,
  isLast,
  orderUrl,
}: {
  card: (typeof cards)[number] & {
    heroImage: { src: string; alt: string };
    foodImages: Array<{
      src: string;
      alt: string;
      label: string;
      thumbPosition?: string;
      thumbObjectFit?: "contain" | "cover";
      heroObjectFit?: "contain" | "cover";
      imageRotate?: number;
    }>;
  };
  index: number;
  isLast: boolean;
  orderUrl: string;
}) {
  const [selectedFoodIndex, setSelectedFoodIndex] = useState<number | null>(null);
  const activeFood =
    selectedFoodIndex !== null
      ? (card.foodImages[selectedFoodIndex] ?? null)
      : null;
  const displayImage = activeFood ?? card.heroImage;
  const heroFit = activeFood?.heroObjectFit ?? "cover";

  return (
    <article
      className={cardShellClass(index, isLast, card.body)}
      style={{ top: `${stackStickyTop(index)}px`, zIndex: stackZIndex(index, isLast) }}
    >
      <div
        className={`relative z-10 flex items-center justify-between gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] sm:px-6 ${card.strip}`}
      >
        <span>The Owner&apos;s Box</span>
        <span className="md:hidden">{card.eyebrow}</span>
        <span className="hidden max-w-[55%] truncate text-right md:inline">{card.title}</span>
      </div>

      <div className={cardGridClass(isLast, card.body)}>
        <div className={`${cardImageColumnClass} ${card.body}`}>
          <Image
            key={displayImage.src}
            src={displayImage.src}
            alt={displayImage.alt}
            fill
            className={`transition-opacity duration-500 ${
              heroFit === "contain" ? "object-contain p-4 sm:p-8" : "object-cover"
            }`}
            style={
              activeFood?.imageRotate !== undefined || activeFood?.thumbPosition
                ? foodImageStyle(activeFood ?? {})
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 780px"
          />
        </div>

        <div
          className={`flex min-w-0 flex-col justify-between gap-3 p-4 max-md:pb-8 sm:gap-4 sm:p-6 md:min-h-0 md:justify-end md:gap-4 md:overflow-visible md:p-10 ${card.body}`}
        >
          {/* Mobile: full headline block. Desktop: hidden so stack peek shows food picks, not clipped title copy. */}
          <div className="shrink-0 md:hidden">
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-70 sm:mb-3 sm:text-[10px]">
              {card.eyebrow}
            </p>
            <h3 className="max-w-full text-balance font-montserrat text-[clamp(2.2rem,8vw,6rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] sm:text-[clamp(2.55rem,6vw,5.75rem)]">
              {card.title}
            </h3>
            <p className="mt-3 max-w-lg text-xs font-semibold leading-relaxed opacity-70 sm:mt-4 sm:text-sm">
              {card.text}
            </p>
            <CardCta href={orderUrl} external label={card.cta} />
          </div>

          <FoodImageStack
            images={card.foodImages}
            selectedIndex={selectedFoodIndex ?? -1}
            onSelect={setSelectedFoodIndex}
          />
          <div className="shrink-0 max-md:mt-2 md:mt-0">
            <div className="mb-4 hidden max-w-lg md:block">
              <p className="text-sm font-semibold leading-relaxed opacity-70">{card.text}</p>
              <CardCta href={orderUrl} external label={card.cta} />
            </div>
            <MarqueeLine words={card.marquee} />
          </div>
        </div>
      </div>
    </article>
  );
}

function EventFeatureRow({
  icon: Icon,
  label,
  detail,
  compact = false,
}: {
  icon: typeof Users;
  label: string;
  detail: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex w-full items-start gap-2.5 rounded-2xl border border-[#F2EAD4]/10 bg-[#101014]/55 sm:gap-3 ${
        compact ? "p-2.5 sm:p-3" : "h-full flex-1 p-2.5 sm:p-3 md:gap-4 md:p-4"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#071B2F] text-[#D4AF37] ${
          compact ? "h-8 w-8" : "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
        }`}
      >
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} aria-hidden />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#F2EAD4] sm:text-[11px] md:text-xs">
          {label}
        </p>
        <p className="mt-0.5 text-[11px] font-semibold leading-snug text-[#F2EAD4]/55 sm:mt-1 sm:text-xs sm:leading-relaxed">
          {detail}
        </p>
      </div>
    </div>
  );
}

function EventIntroBlock({
  leadFeature,
}: {
  leadFeature?: {
    icon: typeof Users;
    label: string;
    detail: string;
  };
}) {
  return (
    <div className="mt-6 scroll-mt-6 border-t border-[#F2EAD4]/15 pt-5 sm:mt-7 sm:scroll-mt-8 sm:pt-6">
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.32em] text-[#D4AF37] sm:text-[11px]">
        Private events
      </p>
      <p className="max-w-lg text-sm font-semibold leading-relaxed text-[#F2EAD4]/72">
        Host your crew with screens, cold drinks, and the full menu ready when you walk in.
      </p>
      {leadFeature ? (
        <div className="mt-4">
          <EventFeatureRow {...leadFeature} compact />
        </div>
      ) : null}
    </div>
  );
}

function EventInfoPanel({
  image,
  features,
  href,
}: {
  image: string;
  features: Array<{
    icon: typeof Users;
    label: string;
    detail: string;
  }>;
  href: string;
}) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3 sm:gap-4">
      <div className="grid grid-cols-1 items-stretch gap-3 sm:gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-6">
        <div className="relative min-h-[10.5rem] overflow-hidden rounded-[20px] border-2 border-[#F2EAD4]/15 bg-[#171713] shadow-[0_18px_45px_rgba(0,0,0,0.28)] sm:min-h-0 sm:rounded-[28px] md:min-h-[10.5rem]">
          <Image
            src={image}
            alt="Private events at The Owner's Box"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 42vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B2F]/85 via-[#071B2F]/10 to-transparent" />
        </div>

        {/* Feature copy hidden on mobile — it sits in the stack peek zone and gets clipped by the card above. */}
        <ul className="hidden h-full flex-col justify-between gap-2 sm:gap-2.5 md:flex">
          {features.map((feature) => (
            <li key={feature.label} className="flex flex-1">
              <EventFeatureRow {...feature} />
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={href}
        className="inline-flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37] transition-colors hover:text-[#F2EAD4]"
      >
        Plan your event
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </div>
  );
}

export default function AltHomeStackedCards() {
  const orderUrl = getOrderPagePath();

  return (
    <section className="ob-canvas relative z-30 bg-white px-4 pt-16 text-[#05070B] sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-5">
            <div
              aria-hidden="true"
              className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#071B2F] shadow-[0_12px_32px_rgba(0,0,0,0.18)] sm:flex lg:h-[4.5rem] lg:w-[4.5rem]"
            >
              <Image src="/ob-icon.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            </div>
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/60">
                Restaurant + Sports Bar
              </p>
              <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-7xl">
                The Full
                <br />
                Experience
              </h2>
            </div>
          </div>
          <p className="max-w-md text-sm font-semibold leading-relaxed text-[#05070B]/65">
            Game-day energy, private events, and scratch-made favorites on Woodruff Road.
          </p>
        </div>

        <div className="relative isolate bg-white">
          {cards.map((card, index) => {
            const isLast = index === cards.length - 1;
            const href = "orderOnline" in card && card.orderOnline ? orderUrl : card.href;
            const external = "orderOnline" in card && card.orderOnline;

            if (card.foodImages) {
              return (
                <GoodEatsCard
                  key={card.title}
                  card={card}
                  index={index}
                  isLast={isLast}
                  orderUrl={orderUrl}
                />
              );
            }

            return (
              <article
                key={card.title}
                className={cardShellClass(index, isLast, card.body)}
                style={{ top: `${stackStickyTop(index)}px`, zIndex: stackZIndex(index, isLast) }}
              >
                <div
                  className={`relative z-10 flex items-center justify-between gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] sm:px-6 ${card.strip}`}
                >
                  <span>The Owner&apos;s Box</span>
                  <span>{card.eyebrow}</span>
                </div>

                <div className={cardGridClass(isLast, card.body, Boolean(card.eventImage))}>
                  <StackCardImageColumn
                    image={card.image}
                    imagePosition={
                      "imagePosition" in card && card.imagePosition ? card.imagePosition : "center"
                    }
                    peekImage={"peekImage" in card ? card.peekImage : undefined}
                    peekImageCover={
                      "peekImageCover" in card ? Boolean(card.peekImageCover) : false
                    }
                    peekImagePosition={
                      "peekImagePosition" in card && card.peekImagePosition
                        ? card.peekImagePosition
                        : "center"
                    }
                    bodyClass={card.body}
                  />

                  <div
                    className={`flex min-w-0 flex-1 flex-col gap-3 p-5 max-md:pb-8 sm:gap-4 sm:p-8 md:min-h-0 md:gap-5 md:p-10 ${
                      card.eventImage ? "justify-start md:overflow-visible" : "justify-between md:overflow-hidden"
                    } ${card.body}`}
                  >
                    <div className="shrink-0">
                      <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-70 sm:mb-4 sm:text-[10px]">
                        {card.eyebrow}
                      </p>
                      <h3 className="max-w-full text-balance font-montserrat text-[clamp(2.55rem,10.5vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] sm:text-[clamp(3rem,7vw,7rem)]">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-lg text-xs font-semibold leading-relaxed opacity-70 sm:mt-5 sm:text-sm md:text-base">
                        {card.text}
                      </p>
                      <CardCta href={href} external={external} label={card.cta} />
                      {card.eventFeatures && (
                        <EventIntroBlock leadFeature={card.eventFeatures[0]} />
                      )}
                    </div>

                    {card.eventImage && card.eventFeatures && (
                      <div className="w-full scroll-mt-4 pt-4 sm:scroll-mt-6 sm:pt-5 md:scroll-mt-8">
                        <EventInfoPanel
                          image={card.eventImage}
                          features={card.eventFeatures.slice(1)}
                          href={card.href}
                        />
                      </div>
                    )}
                    {!card.eventImage && card.marquee && (
                      <div className="shrink-0">
                        <MarqueeLine words={card.marquee} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
          <div
            aria-hidden="true"
            className={`pointer-events-none ${STACK_SCROLL.postStackRunway}`}
          />
          <div id="stack-gallery-sentinel" aria-hidden="true" className="h-px w-full" />
        </div>
      </div>
    </section>
  );
}
