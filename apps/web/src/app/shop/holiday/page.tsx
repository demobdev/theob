import Link from "next/link";
import MerchPageFrame, {
  merchLinkClass,
} from "@/components/shop/MerchPageFrame";
import { merchMetadata, MERCH_PATHS } from "@/lib/shop/merch";

export const metadata = merchMetadata(
  "The 2026 Holiday Drop | The Owners Box, Greenville SC",
  "The 2026 Holiday Drop from The Owners Box in Greenville, SC. Our first OB Game Day Christmas Sweater is a real knit in development. Coming soon.",
  MERCH_PATHS.holiday,
);

export default function HolidayShopPage() {
  return (
    <MerchPageFrame
      title="The 2026 Holiday Drop"
      intro="A little holiday spirit for the crew on Woodruff Road. Our first Christmas knit is coming soon."
      currentPath={MERCH_PATHS.holiday}
    >
      <article className="grid gap-8 rounded-[28px] border-2 border-[#D4AF37]/30 bg-[#071B2F] p-6 text-[#F3EBD8] sm:p-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
            Coming soon
          </p>
          <h2 className="mt-5 font-montserrat text-4xl font-black uppercase leading-tight tracking-tight">
            OB Game Day Christmas Sweater
          </h2>
          <p className="mt-6 text-base font-semibold leading-relaxed text-[#F3EBD8]/80">
            A real knitted sweater with original OB artwork. We’re working
            through the design and staff fit checks before sharing the finished
            garment.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#F3EBD8]/70">
            Final materials, sizing, price and delivery details will be
            available before orders open.
          </p>
          <button
            type="button"
            disabled
            className="mt-8 inline-flex min-h-11 cursor-not-allowed items-center rounded-full border-2 border-[#F3EBD8]/30 px-5 py-3 text-xs font-black uppercase tracking-widest text-[#F3EBD8]/60"
          >
            Coming soon
          </button>
        </div>
        <div className="flex min-h-64 flex-col justify-center rounded-2xl border border-[#F3EBD8]/25 p-8 sm:min-h-80">
          <p className="font-montserrat text-2xl font-black uppercase">
            Knit preview coming soon
          </p>
          <p className="mt-4 max-w-sm text-sm font-semibold leading-relaxed text-[#F3EBD8]/70">
            The actual garment deserves its own photograph. We’ll share it here
            when the first design is ready.
          </p>
        </div>
      </article>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href={MERCH_PATHS.shop} className={merchLinkClass}>
          All Owners Box merch
        </Link>
      </div>
    </MerchPageFrame>
  );
}
