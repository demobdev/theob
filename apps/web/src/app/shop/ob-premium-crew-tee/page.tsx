import Image from "next/image";
import Link from "next/link";
import MerchPageFrame, { merchLinkClass } from "@/components/shop/MerchPageFrame";
import { merchMetadata, MERCH_PATHS } from "@/lib/shop/merch";

const path = "/shop/ob-premium-crew-tee";
const views = [
  { file: "ob-premium-crew-front", label: "Front", alt: "Black Comfort Colors tee with a gold OB crest on the wearer’s left chest" },
  { file: "ob-premium-crew-back", label: "Back", alt: "Black Comfort Colors tee with gold GVL lettering below the back collar" },
];

export const metadata = merchMetadata(
  "OB Premium Crew Tee | The Owners Box",
  "The $40 black heavyweight tee from The Owners Box, with a gold left-chest crest and GVL on the back. S to 4XL. Part of the 2026 Drops.",
  path,
);

export default function PremiumCrewTeePage() {
  return (
    <MerchPageFrame title="OB Premium Crew Tee" intro="Black and gold, from Woodruff Road." currentPath={path}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2" aria-label="Product gallery">
          {views.map((view) => (
            <figure key={view.label} className="overflow-hidden rounded-2xl bg-[#F4F1E9]">
              <div className="relative aspect-square">
                <Image src={`/images/${view.file}.png`} alt={view.alt} fill priority={view.label === "Front"} className="object-contain p-4" sizes="(max-width: 639px) 94vw, (max-width: 1023px) 46vw, 29vw" />
              </div>
              <figcaption className="px-4 pb-4 text-xs font-bold uppercase tracking-widest">{view.label}</figcaption>
            </figure>
          ))}
        </div>
        <section aria-label="Product details" className="border-y border-black/15 py-6 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[.24em]">2026 Drops · The GVL Collection</p>
          <p className="mt-3 font-montserrat text-4xl font-black">$40 <span className="text-xs font-semibold uppercase tracking-wider">USD</span></p>
          <p className="mt-4 leading-relaxed">A heavyweight, garment-dyed Comfort Colors 1717 in black. Gold OB on the left chest. Gold GVL high on the back.</p>
          <dl className="my-6 grid grid-cols-[6rem_1fr] gap-x-3 gap-y-3 border-t border-black/15 pt-5 text-sm">
            <dt className="font-bold">Fit</dt><dd>Relaxed unisex</dd>
            <dt className="font-bold">Fabric</dt><dd>6.1 oz ring-spun cotton</dd>
            <dt className="font-bold">Color</dt><dd>Black</dd>
            <dt className="font-bold">Sizes</dt><dd>S, M, L, XL, 2XL, 3XL, 4XL</dd>
          </dl>
          <p className="rounded-xl bg-[#05070B] px-5 py-4 text-sm font-bold text-white">Online ordering opens soon</p>
          <Link href={MERCH_PATHS.shop} className={`${merchLinkClass} mt-5`}>Explore the 2026 Drops</Link>
        </section>
      </div>
    </MerchPageFrame>
  );
}
