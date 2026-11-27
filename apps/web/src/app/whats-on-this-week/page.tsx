import type { Metadata } from "next";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { OB_SITE_URL } from "@/lib/localSeo";

const title = "What’s on this week at The Owners Box";
const introduction = "Make a game-day plan on Woodruff Road. Bring your crew to The Owners Box for wall-to-wall screens, jumbo wings and scratch-made pizza in Greenville, SC.";

export const metadata: Metadata = {
  title,
  description: introduction,
  alternates: { canonical: `${OB_SITE_URL}/whats-on-this-week` },
};

const visitLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Location and directions" },
  { href: "/private-events", label: "Group events" },
];

export default function WhatsOnThisWeekPage() {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />
      <article className="ob-canvas bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="max-w-[17ch] font-montserrat text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-[#05070B]/75">{introduction}</p>

          <section className="mt-12 border-t-2 border-[#05070B]/10 pt-8" aria-labelledby="specific-game">
            <h2 id="specific-game" className="font-montserrat text-2xl font-bold tracking-tight">
              Planning to catch a specific game?
            </h2>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-[#05070B]/75">
              Call <a className="font-bold text-[#05070B] underline underline-offset-4" href="tel:+18647326963">(864) 732-6963</a> before you head out to check what’s on and when we open. Seating is first come, first served. The kitchen closes at 11 p.m. during regular service.
            </p>
          </section>

          <section className="mt-9 border-t-2 border-[#05070B]/10 pt-8" aria-labelledby="plan-visit">
            <h2 id="plan-visit" className="font-montserrat text-2xl font-bold tracking-tight">Plan your visit</h2>
            <p className="mt-3 max-w-[65ch] leading-relaxed text-[#05070B]/75">
              The Owners Box is at 1757 Woodruff Rd, Suite A, Greenville, SC 29607. Browse the menu before you come, or ask about a group watch party.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5">
              {visitLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-11 items-center font-bold underline decoration-[#B08B19] decoration-2 underline-offset-4 hover:decoration-current">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      <AltHomeFooter />
    </main>
  );
}
