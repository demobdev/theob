"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AltHomeShopBuyButton from "./AltHomeShopBuyButton";
import { cn } from "@/lib/utils";
import type { ShopifyVariant } from "@/lib/shopify/storefront";
import { formatShopifyPrice } from "@/lib/shopify/pricing";

export type ShopCarouselItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  priceLabel: string | null;
  variants: ShopifyVariant[];
};

type Props = {
  products: ShopCarouselItem[];
  checkoutEnabled?: boolean;
};

export default function AltHomeShopCarousel({
  products,
  checkoutEnabled = false,
}: Props) {
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState<{
    productId: string;
    variantId: string;
  } | null>(null);
  const count = products.length;
  const active = products[index] ?? products[0];

  const goTo = useCallback(
    (next: number) => {
      if (count <= 1) return;
      setIndex((next + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("select, input, textarea, button, a")
      )
        return;
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, goNext, goPrev]);

  if (!active) return null;

  const isLive = checkoutEnabled && active.variants.length > 0;
  const selectedVariant =
    selection?.productId === active.id
      ? active.variants.find((variant) => variant.id === selection.variantId)
      : undefined;
  const priceLabel = selectedVariant
    ? formatShopifyPrice(
        selectedVariant.priceAmount,
        selectedVariant.priceCurrency,
      )
    : active.priceLabel;
  const stockLabel = !isLive
    ? "Coming Soon"
    : selectedVariant
      ? selectedVariant.availableForSale
        ? "Available to order"
        : "Sold out"
      : active.variants.some((variant) => variant.availableForSale)
        ? "Choose a size"
        : "Sold out";
  const hasMultiple = count > 1;

  return (
    <div className="ob-surface ob-surface-light relative z-10 mx-auto grid max-w-[1600px] items-center gap-10 rounded-[28px] border border-[#05070B]/8 bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.12)] md:grid-cols-[0.9fr_1.1fr] md:p-12 xl:p-16">
      <div>
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/65">
          {isLive ? "Official merch" : "Coming soon"}
        </p>
        <h2 className="font-montserrat text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl">
          Shop The
          <br />
          Collection
        </h2>
        <p className="mt-6 max-w-md text-sm font-semibold leading-relaxed text-[#05070B]/70">
          {active.description}
        </p>
        {priceLabel ? (
          <p className="mt-4 font-montserrat text-3xl font-black uppercase tracking-tight text-[#05070B]">
            {priceLabel}
          </p>
        ) : null}
        {isLive ? (
          <div className="mt-6 max-w-xs">
            <label
              htmlFor="shop-size"
              className="block text-xs font-black uppercase tracking-widest"
            >
              Size
            </label>
            <select
              id="shop-size"
              value={selectedVariant?.id ?? ""}
              onChange={(event) =>
                setSelection({
                  productId: active.id,
                  variantId: event.target.value,
                })
              }
              aria-describedby="shop-stock"
              className="mt-2 min-h-11 w-full rounded-xl border-2 border-[#05070B]/25 bg-white px-3 py-2 text-sm font-semibold text-[#05070B]"
            >
              <option value="">Choose a size</option>
              {active.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.selectedOptions
                    .map((option) => option.value)
                    .join(" / ") || variant.title}
                  {variant.availableForSale ? "" : " — Sold out"}
                </option>
              ))}
            </select>
            <p
              id="shop-stock"
              role="status"
              className="mt-2 text-xs font-semibold text-[#05070B]/70"
            >
              {stockLabel}
            </p>
          </div>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-3">
          {isLive ? (
            <AltHomeShopBuyButton
              key={selectedVariant?.id ?? active.id}
              variantId={selectedVariant?.id ?? null}
              disabled={!selectedVariant?.availableForSale}
              label={
                selectedVariant
                  ? selectedVariant.availableForSale
                    ? "Shop Now"
                    : "Sold out"
                  : "Choose a size"
              }
            />
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed rounded-full border-2 border-[#05070B]/25 bg-[#05070B]/5 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B]/45"
              aria-label={`${active.title} — shop coming soon`}
            >
              Shop Now — Soon
            </button>
          )}
          <Link
            href="/locations#contact"
            className="inline-flex rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-[3px_3px_0_#05070B] transition-transform hover:-translate-y-0.5"
          >
            Join The List
          </Link>
        </div>

        {hasMultiple ? (
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#05070B] text-[#05070B] transition-transform hover:scale-105"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Shop products"
            >
              {products.map((product, dotIndex) => (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-label={`Show ${product.title}`}
                  onClick={() => setIndex(dotIndex)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    dotIndex === index
                      ? "w-6 bg-[#05070B]"
                      : "w-2 bg-[#05070B]/25 hover:bg-[#05070B]/45",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#05070B] text-[#05070B] transition-transform hover:scale-105"
              aria-label="Next product"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      <div className="relative mx-auto w-full max-w-xl">
        <div className="rounded-[32px] border-2 border-[#05070B]/10 bg-white p-3 shadow-[0_18px_60px_rgba(0,0,0,0.1)] sm:p-5">
          <div className="relative">
            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#05070B]/15 bg-white/95 text-[#05070B] shadow-md backdrop-blur transition-transform hover:scale-105 sm:left-3"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#05070B]/15 bg-white/95 text-[#05070B] shadow-md backdrop-blur transition-transform hover:scale-105 sm:right-3"
                  aria-label="Next product"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}

            <div className="relative aspect-[0.86/1] overflow-hidden rounded-[24px] bg-transparent">
              <Image
                key={active.imageUrl}
                src={active.imageUrl}
                alt={active.imageAlt}
                fill
                className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.18)] transition-opacity duration-300"
                sizes="(max-width: 768px) 90vw, 560px"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#05070B]/65">
              {active.title}
            </p>
            <span className="rounded-full border-2 border-[#05070B] px-3 py-1 text-[8px] font-black uppercase tracking-widest">
              {stockLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
