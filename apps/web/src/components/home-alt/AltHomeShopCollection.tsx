import Image from "next/image";
import Link from "next/link";
import { MERCH_PATHS } from "@/lib/shop/merch";
import { merchLinkClass } from "@/components/shop/MerchPageFrame";

export default function AltHomeShopCollection() {
  return (
    <section
      id="shop"
      aria-labelledby="home-shop-title"
      className="ob-canvas relative z-20 scroll-mt-28 bg-white px-4 pb-20 pt-16 text-[#05070B] sm:px-6 sm:pb-24 sm:pt-20"
    >
      <div className="ob-surface ob-surface-light relative z-10 mx-auto grid max-w-[1600px] items-center gap-10 rounded-[28px] border border-[#05070B]/8 bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.12)] md:grid-cols-[0.9fr_1.1fr] md:p-12 xl:p-16">
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/65">
            2026 Drops · The GVL Collection
          </p>
          <h2 id="home-shop-title" className="font-montserrat text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] sm:text-7xl">
            Shop The<br />Collection
          </h2>
          <h3 className="mt-6 font-montserrat text-xl font-black uppercase">OB Premium Crew Tee</h3>
          <p className="mt-2 max-w-md text-sm font-semibold leading-relaxed text-[#05070B]/70">
            Heavyweight black cotton with a gold chest crest and GVL on the back.
          </p>
          <p className="mt-4 font-bold">$40 <span className="ml-2 text-xs text-[#05070B]/70">· S–4XL</span></p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={MERCH_PATHS.shop} className={merchLinkClass}>Explore the 2026 Drops</Link>
            <Link href="/shop/ob-premium-crew-tee" className={merchLinkClass}>View the tee</Link>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-[24px] bg-[#F4F1E9]">
          <Image
            src="/images/ob-premium-crew-front.png"
            alt="Black premium tee with gold OB left-chest crest"
            fill
            className="object-contain p-5"
            sizes="(max-width: 768px) 90vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}
