import type { ReactNode } from "react";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { MERCH_PATHS } from "@/lib/shop/merch";

export const merchLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-[#05070B] bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[#05070B] transition-colors hover:bg-[#05070B] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]";

type Props = {
  title: string;
  intro: string;
  currentPath: string;
  children: ReactNode;
};

export default function MerchPageFrame({
  title,
  intro,
  currentPath,
  children,
}: Props) {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />
      <section className="ob-canvas px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-[1440px]">
          <nav
            aria-label="Merch navigation"
            className="mb-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold"
          >
            <Link
              href={MERCH_PATHS.shop}
              aria-current={
                currentPath === MERCH_PATHS.shop ? "page" : undefined
              }
              className="underline underline-offset-4"
            >
              Shop
            </Link>
            <Link
              href={MERCH_PATHS.holiday}
              aria-current={
                currentPath === MERCH_PATHS.holiday ? "page" : undefined
              }
              className="underline underline-offset-4"
            >
              Holiday Drop
            </Link>
          </nav>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#05070B]/65">
            Woodruff Road · Greenville, SC
          </p>
          <h1 className="mt-4 max-w-5xl font-montserrat text-[clamp(2.75rem,7vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[-0.06em]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-relaxed text-[#05070B]/70">
            {intro}
          </p>
          <div className="mt-12">{children}</div>
        </div>
      </section>
      <AltHomeFooter />
    </main>
  );
}
