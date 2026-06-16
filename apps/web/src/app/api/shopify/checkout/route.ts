import { NextResponse } from "next/server";
import { createShopifyCheckout, getShopifyConfig } from "@/lib/shopify/storefront";

export async function POST(request: Request) {
  const config = getShopifyConfig();
  if (!config) {
    return NextResponse.json({ error: "Shop not configured" }, { status: 503 });
  }

  let variantId: string | undefined;
  try {
    const body = (await request.json()) as { variantId?: string };
    variantId = body.variantId?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!variantId) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }

  try {
    const checkoutUrl = await createShopifyCheckout(variantId);
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
