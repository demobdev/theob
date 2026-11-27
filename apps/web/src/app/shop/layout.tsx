import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MERCH_REVIEW_ROBOTS } from "@/lib/shop/merch";

// Every shop child is review-only until a separate live-readiness change removes this.
export const metadata: Metadata = { robots: MERCH_REVIEW_ROBOTS };

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}
