import type { Metadata } from "next";

export const MERCH_PATHS = {
  shop: "/shop",
  holiday: "/shop/holiday",
  tee: "/shop/woodruff-road-tee",
} as const;

// Review URLs always canonicalize to the permanent production route, never localhost or a preview host.
const MERCH_CANONICAL_ORIGIN = "https://ownersboxgvl.com";

export const MERCH_REVIEW_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
};

export function merchMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = `${MERCH_CANONICAL_ORIGIN}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: MERCH_REVIEW_ROBOTS,
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
