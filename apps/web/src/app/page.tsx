import dynamic from "next/dynamic";
import type { Metadata } from "next";
import AltHomeGoodTimes from "@/components/home-alt/AltHomeGoodTimes";
import FeaturedMenuHighlights from "@/components/menu/FeaturedMenuHighlights";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeHero from "@/components/home-alt/AltHomeHero";
import AltHomeShopCollection from "@/components/home-alt/AltHomeShopCollection";
import { OB_DEFAULT_DESCRIPTION, OB_SITE_URL } from "@/lib/localSeo";

export const metadata: Metadata = {
  title: "Sports Bar & Family Restaurant in Greenville, SC",
  description: OB_DEFAULT_DESCRIPTION,
  alternates: { canonical: OB_SITE_URL },
  openGraph: {
    title: "The Owner's Box Bar & Grill | Sports Bar & Family Restaurant in Greenville, SC",
    description: OB_DEFAULT_DESCRIPTION,
    url: OB_SITE_URL,
  },
};

const AltHomeStackedCards = dynamic(
  () => import("@/components/home-alt/AltHomeStackedCards"),
  { loading: () => <div aria-hidden="true" className="ob-canvas min-h-[40vh] bg-white" /> },
);

const AltHomeGalleryCarousel = dynamic(
  () => import("@/components/home-alt/AltHomeGalleryCarousel"),
  { loading: () => <div aria-hidden="true" className="ob-canvas min-h-[24vh] bg-white" /> },
);

const AltHomeStorySection = dynamic(
  () => import("@/components/home-alt/AltHomeStorySection"),
  { loading: () => <div aria-hidden="true" className="ob-canvas min-h-[32vh] bg-white" /> },
);

const AltHomeFooter = dynamic(
  () => import("@/components/home-alt/AltHomeFooter"),
  { loading: () => <div aria-hidden="true" className="min-h-[20vh] bg-white" /> },
);

export default function Home() {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white">
      <AltHomeHeader />
      <AltHomeHero />
      <div
        aria-hidden="true"
        className="ob-canvas hidden bg-white md:block md:h-[8vh] lg:h-[10vh]"
      />
      <AltHomeGoodTimes />
      <FeaturedMenuHighlights />
      <AltHomeStackedCards />
      <div
        aria-hidden="true"
        className="relative z-20 bg-white h-[46vh] sm:h-[48vh] md:hidden"
      />
      <div
        aria-hidden="true"
        className="relative z-20 hidden bg-white md:block md:h-[55vh]"
      />
      <AltHomeGalleryCarousel />
      <AltHomeStorySection />
      <section
        id="game-day-visit-planning"
        aria-labelledby="game-day-visit-heading"
        className="ob-canvas relative z-20 bg-[#071B2F] px-4 py-12 text-white sm:px-6 sm:py-16"
      >
        <div className="mx-auto max-w-3xl">
          <h2
            id="game-day-visit-heading"
            className="font-montserrat text-3xl font-black tracking-tight sm:text-4xl"
          >
            Plan your visit to The Owners Box
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/85">
            Plan your visit around these regular opening hours (local time):
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed marker:text-[#D4AF37]">
            <li>Monday–Wednesday and Friday: 4 PM–midnight</li>
            <li>Thursday and Saturday: 11 AM–midnight</li>
            <li>Sunday: 10 AM–midnight</li>
          </ul>
          <p className="mt-5 text-base leading-relaxed text-white/85">
            Contact The Owners Box before you visit to confirm any game coverage or arrangements you need.
          </p>
        </div>
      </section>
      <AltHomeShopCollection />
      <AltHomeFooter />
    </main>
  );
}
