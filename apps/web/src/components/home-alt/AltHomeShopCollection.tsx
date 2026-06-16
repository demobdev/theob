import Image from "next/image";
import Link from "next/link";
import AltHomeShopBuyButton from "./AltHomeShopBuyButton";
import {
  formatShopifyPrice,
  getShopifyProduct,
  isShopifyConfigured,
} from "@/lib/shopify/storefront";

const FALLBACK_IMAGE = "/images/ob-crew-tee-tp.png";
const FALLBACK_TITLE = "OB Crew Tee";
const FALLBACK_DESCRIPTION =
  "The OB Crew Tee — black cotton, gold chest logo, Greenville on the tag.";

export default async function AltHomeShopCollection() {
  const shopifyReady = isShopifyConfigured();
  let product = null;

  if (shopifyReady) {
    try {
      product = await getShopifyProduct();
    } catch {
      product = null;
    }
  }

  const isLive = Boolean(product?.availableForSale && product.variantId);
  const title = product?.title ?? FALLBACK_TITLE;
  const description = product?.description?.trim() || FALLBACK_DESCRIPTION;
  const imageSrc = product?.imageUrl ?? FALLBACK_IMAGE;
  const imageAlt =
    product?.imageAlt ?? "Black Owner's Box crew shirt with gold chest logo";
  const priceLabel = product
    ? formatShopifyPrice(product.priceAmount, product.priceCurrency)
    : null;

  return (
    <section
      id="shop"
      className="ob-canvas relative z-20 scroll-mt-28 bg-white px-4 pb-20 pt-16 text-[#05070B] sm:px-6 sm:pb-24 sm:pt-20"
    >
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
            {description}
          </p>
          {priceLabel ? (
            <p className="mt-4 font-montserrat text-3xl font-black uppercase tracking-tight text-[#05070B]">
              {priceLabel}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            {isLive && product ? (
              <AltHomeShopBuyButton variantId={product.variantId} />
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed rounded-full border-2 border-[#05070B]/25 bg-[#05070B]/5 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B]/45"
                aria-label="Shopify checkout coming soon"
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
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="rounded-[32px] border-2 border-[#05070B]/10 bg-white p-3 shadow-[0_18px_60px_rgba(0,0,0,0.1)] sm:p-5">
            <div className="relative aspect-[0.86/1] overflow-hidden rounded-[24px] bg-transparent">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.18)]"
                sizes="(max-width: 768px) 90vw, 560px"
                priority={false}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#05070B]/65">
                {title}
              </p>
              <span className="rounded-full border-2 border-[#05070B] px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                {isLive ? "In stock" : "Coming Soon"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
