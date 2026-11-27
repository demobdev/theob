import { NextResponse } from "next/server";
import {
  createShopifyCheckout,
  getShopifyProduct,
  isShopifyCheckoutEnabled,
} from "@/lib/shopify/storefront";

export async function POST(request: Request) {
  if (!isShopifyCheckoutEnabled()) {
    return NextResponse.json({ error: "Shop coming soon" }, { status: 503 });
  }

  let variantId: string;
  try {
    const body: unknown = await request.json();
    const value =
      body && typeof body === "object" && "variantId" in body
        ? body.variantId
        : null;
    if (
      typeof value !== "string" ||
      !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value.trim())
    ) {
      return NextResponse.json({ error: "Choose a size" }, { status: 400 });
    }
    variantId = value.trim();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    // Recheck the exact tee variant without cached inventory before creating the cart.
    const product = await getShopifyProduct(undefined, { cache: "no-store" });
    const variant = product?.variants.find(
      (candidate) => candidate.id === variantId,
    );
    if (!variant) {
      return NextResponse.json(
        { error: "This size is unavailable" },
        { status: 400 },
      );
    }
    if (!variant.availableForSale) {
      return NextResponse.json(
        { error: "This size is sold out. Choose another size." },
        { status: 409 },
      );
    }
    const checkoutUrl = await createShopifyCheckout(variant.id);
    return NextResponse.json({ checkoutUrl });
  } catch {
    return NextResponse.json(
      { error: "Unable to open checkout. Please try again." },
      { status: 502 },
    );
  }
}
