import Image from "next/image";

const galleryImages = [
  {
    src: "/sports-feature.jpg",
    alt: "Friends at The Owner's Box",
    shape: "square",
  },
  {
    src: "/images/food/official/IMGL6785.jpg",
    alt: "Owner's Box food spread",
    shape: "tall",
  },
  {
    src: "/images/menu/jumbo_wings.png",
    alt: "Jumbo wings",
    shape: "square",
  },
  {
    src: "/images/hero-bg.png",
    alt: "Bar atmosphere",
    shape: "tall",
  },
  {
    src: "/images/food/official/featured-pizza.png",
    alt: "Featured pizza",
    shape: "square",
  },
  {
    src: "/images/menu/crab_dip.png",
    alt: "Crab dip",
    shape: "square",
  },
];

export default function AltHomeGalleryCarousel() {
  const carouselImages = [...galleryImages, ...galleryImages, ...galleryImages];

  return (
    <section className="ob-canvas relative overflow-hidden bg-white py-12 text-[#05070B]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max animate-marquee-extra-slow items-center gap-5 px-5">
          {carouselImages.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={
                image.shape === "tall"
                  ? "relative h-72 w-48 shrink-0 overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/20 bg-[#171713] sm:h-[390px] sm:w-64 2xl:h-[460px] 2xl:w-80"
                  : "relative h-48 w-48 shrink-0 overflow-hidden rounded-[28px] border-2 border-[#D4AF37]/20 bg-[#171713] sm:h-64 sm:w-64 2xl:h-80 2xl:w-80"
              }
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 200px, (max-width: 1536px) 260px, 320px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
