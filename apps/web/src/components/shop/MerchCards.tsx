import Link from "next/link";
import { MERCH_PATHS } from "@/lib/shop/merch";
import { merchLinkClass } from "./MerchPageFrame";

export function KnitCard() {
  return (
    <article className="flex h-full flex-col justify-between rounded-[28px] border-2 border-[#D4AF37]/35 bg-[#071B2F] p-6 text-[#F3EBD8] sm:p-8">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
          Coming soon · Holiday 2026
        </p>
        <h2 className="mt-6 font-montserrat text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
          OB Game Day Christmas Sweater
        </h2>
        <p className="mt-6 max-w-lg text-sm font-semibold leading-relaxed text-[#F3EBD8]/80">
          A real Christmas knit for holiday shifts and game nights. The first
          design and fit are still being confirmed.
        </p>
        <div className="my-10 rounded-2xl border border-[#F3EBD8]/25 p-8">
          <p className="text-sm font-bold">Knit preview coming soon</p>
          <p className="mt-2 text-sm leading-relaxed text-[#F3EBD8]/70">
            We’ll share the actual garment and original OB artwork when they’re
            ready.
          </p>
        </div>
      </div>
      <Link href={MERCH_PATHS.holiday} className={merchLinkClass}>
        Explore the Holiday Drop
      </Link>
    </article>
  );
}
