import Image from "next/image";
import Link from "next/link";
import MerchPageFrame, { merchLinkClass } from "@/components/shop/MerchPageFrame";
import { KnitCard } from "@/components/shop/MerchCards";
import { merchMetadata, MERCH_PATHS } from "@/lib/shop/merch";

export const metadata = merchMetadata(
  "2026 Drops | The Owners Box Merch",
  "Explore the 2026 Drops from The Owners Box in Greenville, SC: the OB Premium Crew Tee and our first holiday knit.",
  MERCH_PATHS.shop,
);

export default function ShopPage() {
  return (
    <MerchPageFrame title="2026 Drops" intro="The Owners Box collection. Made for game days, late shifts, and wherever you take GVL." currentPath={MERCH_PATHS.shop}>
      <section aria-labelledby="featured-tee" className="mb-10 grid overflow-hidden rounded-[28px] bg-[#05070B] text-white md:grid-cols-[1.15fr_1fr] md:items-center">
        <div className="relative aspect-[5/4] bg-[#F4F1E9]">
          <Image src="/images/ob-premium-crew-front.png" alt="Black premium tee with gold OB left-chest crest" fill priority sizes="(max-width: 767px) 94vw, 53vw" className="object-contain p-5" />
        </div>
        <div className="p-7 sm:p-12">
          <p className="text-xs font-black uppercase tracking-[.24em] text-[#E4C76D]">Featured · The GVL Collection</p>
          <h2 id="featured-tee" className="mt-3 font-montserrat text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">OB Premium Crew Tee</h2>
          <p className="mb-5 mt-4 text-sm leading-relaxed text-white/80">Heavyweight black cotton, our gold chest crest, and GVL across the upper back.</p>
          <p className="mb-5 font-bold">$40 <span className="ml-2 text-xs text-white/75">· S–4XL</span></p>
          <Link href="/shop/ob-premium-crew-tee" className={merchLinkClass}>View the tee</Link>
        </div>
      </section>
      <section aria-labelledby="more-merch">
        <h2 id="more-merch" className="mb-5 font-montserrat text-2xl font-black uppercase">More from The Owners Box</h2>
        <KnitCard />
      </section>
    </MerchPageFrame>
  );
}
