import AltHeroCarousel from "./AltHeroCarousel";

export default function AltHomeHero() {
  return (
    <section className="ob-canvas bg-white px-3 pb-10 text-[#05070B] sm:px-5 sm:pb-12 md:pb-10 lg:pb-12">
      <div className="ob-canvas mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-8 sm:pb-10">
        <AltHeroCarousel />
      </div>
    </section>
  );
}
