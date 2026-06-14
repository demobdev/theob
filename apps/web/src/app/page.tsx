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
    <main className="ob-theme-root min-h-screen bg-white">
      <AltHomeHeader />
      <AltHomeHero />
      <AltHomeGoodTimes />
      <AltHomeStackedCards />
      <AltHomeShopCollection />
      <AltHomeGalleryCarousel />
      <AltHomeStorySection />
      <AltHomeFooter />
    </main>
  );
}
