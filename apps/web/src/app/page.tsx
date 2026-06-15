import dynamic from "next/dynamic";
import AltHomeGoodTimes from "@/components/home-alt/AltHomeGoodTimes";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeHero from "@/components/home-alt/AltHomeHero";

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

const AltHomeShopCollection = dynamic(
  () => import("@/components/home-alt/AltHomeShopCollection"),
  { loading: () => <div aria-hidden="true" className="ob-canvas min-h-[24vh] bg-white" /> },
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
      <AltHomeStackedCards />
      <div
        aria-hidden="true"
        className="relative z-20 bg-white h-[40vh] sm:h-[44vh] md:hidden"
      />
      <div
        aria-hidden="true"
        className="relative z-20 hidden bg-white md:block md:h-[55vh]"
      />
      <AltHomeGalleryCarousel />
      <AltHomeStorySection />
      <AltHomeShopCollection />
      <AltHomeFooter />
    </main>
  );
}
