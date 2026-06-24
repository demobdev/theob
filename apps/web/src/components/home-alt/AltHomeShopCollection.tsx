import {
  formatShopifyPrice,
  getShopifyProducts,
  isShopifyConfigured,
  type ShopifyProduct,
} from "@/lib/shopify/storefront";
import AltHomeShopCarousel, { type ShopCarouselItem } from "./AltHomeShopCarousel";

const FALLBACK_PRODUCTS: ShopCarouselItem[] = [
  {
    id: "fallback-crew-tee",
    title: "The OB Crew Tee",
    description: "Black cotton tee with gold chest logo — Greenville on the tag.",
    imageUrl: "/images/ob-crew-tee-tp.png",
    imageAlt: "Black Owner's Box crew shirt with gold chest logo",
    priceLabel: null,
    variantId: null,
    availableForSale: false,
  },
  {
    id: "fallback-quarter-zip",
    title: "The OB Quarter Zip",
    description: "Black quarter-zip pullover with Owner's Box branding.",
    imageUrl: "/images/ob-crew-tee-tp.png",
    imageAlt: "Owner's Box quarter zip pullover",
    priceLabel: null,
    variantId: null,
    availableForSale: false,
  },
];

function toCarouselItem(product: ShopifyProduct): ShopCarouselItem {
  return {
    id: product.id,
    title: product.title,
    description: product.description.trim() || "Official Owner's Box merch.",
    imageUrl: product.imageUrl ?? "/images/ob-crew-tee-tp.png",
    imageAlt: product.imageAlt ?? product.title,
    priceLabel: formatShopifyPrice(product.priceAmount, product.priceCurrency),
    variantId: product.variantId,
    availableForSale: product.availableForSale,
  };
}

export default async function AltHomeShopCollection() {
  let products: ShopCarouselItem[] = FALLBACK_PRODUCTS;

  if (isShopifyConfigured()) {
    try {
      const fromShopify = await getShopifyProducts();
      if (fromShopify.length > 0) {
        products = fromShopify.map(toCarouselItem);
      }
    } catch {
      products = FALLBACK_PRODUCTS;
    }
  }

  return (
    <section
      id="shop"
      className="ob-canvas relative z-20 scroll-mt-28 bg-white px-4 pb-20 pt-16 text-[#05070B] sm:px-6 sm:pb-24 sm:pt-20"
    >
      <AltHomeShopCarousel products={products} />
    </section>
  );
}
