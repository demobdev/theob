/**
 * Scroll-stack tuning for AltHomeStackedCards.
 * If parallax timing drifts after edits, restore these values first.
 *
 * How it works:
 * - Cards 1–2: fixed viewport height + negative bottom margin (overlap slide).
 * - Card 3: sticky pin with taller min-height so Good Eats content fits.
 * - Post-stack runway: empty spacer AFTER card 3; Shop/Gallery must not enter
 *   until the user scrolls through this runway while card 3 is still pinned.
 * Last locked: 2026-06-15 — runway md 130vh + 55vh page buffer before Gallery.
 *
 * STABLE SNAPSHOT (do not change unless intentionally re-tuning parallax):
 * - Section wrapper: relative z-30, cards in relative isolate container
 * - Card shell: sticky + rounded border + height from first/middle/last + overlap on 1–2
 * - Sticky tops: card0=76px, card1=92px, card2=108px
 * - z-index: card0=10, card1=15, card2=25
 * - Grid: md:grid-cols-[0.95fr_1.05fr], strip is 40px, inner h calc(100%-40px)
 * - Post-stack runway div AFTER all cards, then #stack-gallery-sentinel (1px)
 * - Gallery hidden until sentinel scrolls past (see AltHomeGalleryCarousel)
 * - page.tsx adds extra 55vh white buffer before Gallery
 */
export const STACK_SCROLL = {
  /** Sticky top offset per card: 76px + index * 16px */
  stickyTopBasePx: 76,
  stickyTopStepPx: 16,

  /** Cards 1–2 pull up over the previous card */
  cardOverlapMargin: "-mb-[38vh]",

  /** Left-column strip height — must match overlap margin above */
  peekStripHeight: "h-[38vh]",

  /** z-index: 10 + index * 5 (+5 on last card) */
  zIndexBase: 10,
  zIndexStep: 5,
  zIndexLastBoost: 5,

  /** Card 1 — slightly taller so hero image reads */
  firstCardHeight:
    "h-[calc(100svh-88px)] sm:h-[calc(100svh-100px)] md:h-auto md:min-h-[80vh]",

  /** Cards 2 — standard stack height */
  middleCardHeight:
    "h-[calc(100svh-112px)] sm:h-[calc(100svh-124px)] md:h-auto md:min-h-[72vh]",

  /** Card 2 (Party) — auto height on mobile so CTA is not clipped */
  middleCardHeightParty: "h-auto md:h-auto md:min-h-[76vh]",

  /** Card 3 — auto height on mobile; pinned min-height on desktop */
  lastCardHeight: "h-auto md:min-h-[80vh]",

  /** Inner grid min-height on desktop (card height minus strip) */
  innerGridMdMinHeight: "md:min-h-[calc(80vh-40px)]",
  innerGridMdMinHeightMiddle: "md:min-h-[calc(72vh-40px)]",

  /** Card 2 (Party) — room for CTA + event panel */
  innerGridMdMinHeightParty: "md:min-h-[calc(78vh-40px)]",

  /**
   * Runway after card 3 — blank white scroll while card 3 stays pinned.
   * Gallery must not peek behind card margins until this is cleared.
   */
  postStackRunway:
    "h-[52vh] sm:h-[60vh] md:h-[130vh] lg:h-[120vh]",
} as const;

export function stackStickyTop(index: number): number {
  return STACK_SCROLL.stickyTopBasePx + index * STACK_SCROLL.stickyTopStepPx;
}

export function stackZIndex(index: number, isLast: boolean): number {
  return (
    STACK_SCROLL.zIndexBase +
    index * STACK_SCROLL.zIndexStep +
    (isLast ? STACK_SCROLL.zIndexLastBoost : 0)
  );
}
