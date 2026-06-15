import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import AltHomeGalleryCarousel from "@/components/home-alt/AltHomeGalleryCarousel";
import AltHomeGoodTimes from "@/components/home-alt/AltHomeGoodTimes";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeHero from "@/components/home-alt/AltHomeHero";
import AltHomeShopCollection from "@/components/home-alt/AltHomeShopCollection";
import AltHomeStackedCards from "@/components/home-alt/AltHomeStackedCards";
import AltHomeStorySection from "@/components/home-alt/AltHomeStorySection";

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
