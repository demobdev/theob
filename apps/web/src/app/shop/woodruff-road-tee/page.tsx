import Image from "next/image";
import Link from "next/link";
import MerchPageFrame, {
  merchLinkClass,
} from "@/components/shop/MerchPageFrame";
import { merchMetadata, MERCH_PATHS } from "@/lib/shop/merch";

export const metadata = merchMetadata(
  "Woodruff Road Tee | The Owners Box, Greenville SC",
  "Meet the Woodruff Road Tee from The Owners Box in Greenville, SC. Preview the black tee with the gold Owners Box mark. Online ordering is coming soon.",
  MERCH_PATHS.tee,
);

export default function WoodruffRoadTeePage() {
  return (
    <MerchPageFrame
      title="Woodruff Road Tee"
      intro="Black, gold, and a little Woodruff Road. The everyday Owners Box tee, starting with our front-of-house crew in Greenville."
      currentPath={MERCH_PATHS.tee}
    >
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
        <figure className="overflow-hidden rounded-[28px] border-2 border-[#05070B]/10 bg-white">
          <div className="relative aspect-square bg-[#F6F4EF]">
            <Image
              src="/images/ob-crew-tee-tp.png"
              alt="Current black Owners Box tee preview with a small gold chest mark"
              fill
              priority
              className="object-contain p-6"
              sizes="(max-width: 1023px) 90vw, 680px"
            />
          </div>
          <figcaption className="p-5 text-xs font-semibold leading-relaxed text-[#05070B]/60">
            Current tee preview. Final artwork and fit details are being
            confirmed.
          </figcaption>
        </figure>
        <div className="space-y-8 rounded-[28px] border-2 border-[#05070B]/10 p-6 sm:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#05070B]/60">
              Coming soon
            </p>
            <h2 className="mt-4 font-montserrat text-3xl font-black uppercase tracking-tight">
              Wear a little Woodruff Road
            </h2>
            <p className="mt-4 text-sm font-semibold leading-relaxed text-[#05070B]/70">
              From the bar to game night, this is where the Owners Box
              collection starts.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">
              Fit and size guide
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#05070B]/70">
              Final fits, measurements and care details will be published after
              staff fit testing and before orders open.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">
              Ordering and delivery
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#05070B]/70">
              Online ordering is coming soon. Pricing, shipping and delivery
              timing will be confirmed before checkout opens.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full border-2 border-[#05070B]/25 bg-[#05070B]/5 px-5 py-3 text-xs font-black uppercase tracking-widest text-[#05070B]/50"
          >
            Coming soon
          </button>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={MERCH_PATHS.shop} className={merchLinkClass}>
          All Owners Box merch
        </Link>
        <Link href={MERCH_PATHS.holiday} className={merchLinkClass}>
          The 2026 Holiday Drop
        </Link>
      </div>
    </MerchPageFrame>
  );
}
