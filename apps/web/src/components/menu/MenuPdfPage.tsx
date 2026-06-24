import dynamic from "next/dynamic";
import Image from "next/image";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import MenuPdfViewer from "@/components/menu/MenuPdfViewer";

const AltHomeGalleryCarousel = dynamic(
  () => import("@/components/home-alt/AltHomeGalleryCarousel"),
  { loading: () => <div aria-hidden="true" className="ob-canvas min-h-[24vh] bg-white" /> },
);

export default function MenuPdfPage() {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-6 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-6">
          <div className="relative min-h-[360px] overflow-hidden rounded-[24px] border-2 border-[#171713]/10 sm:min-h-[440px] lg:min-h-[480px]">
            <Image
              src="/images/food/official/featured-pizza.png"
              fill
              className="object-cover"
              alt="Scratch-made favorites at The Owner's Box"
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Food · Bar · Specialty Drinks
              </p>
              <h1 className="font-montserrat text-[clamp(3rem,11vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-[#F2EAD4]">
                Our Menu
              </h1>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-[#F2EAD4]/80 sm:text-base">
                Browse the full lineup below, including bar beverages and specialty cocktails. Order online when you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MenuPdfViewer />

      <div className="ob-canvas bg-white px-4 pt-4 sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
            From the kitchen
          </p>
          <h2 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-[#05070B] sm:text-5xl">
            Fan Favorites
          </h2>
        </div>
      </div>

      <AltHomeGalleryCarousel />
      <AltHomeFooter />
    </main>
  );
}
