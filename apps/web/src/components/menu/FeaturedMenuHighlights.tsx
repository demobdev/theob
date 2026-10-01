import Link from "next/link";

// Transcribed from the current menu.pdf?v=2026-09-27, reviewed October 1, 2026.
// Keep these highlights in sync with the full menu; service hours are separate.
const sections = [
  {
    id: "brunch-highlights",
    eyebrow: "Make it a brunch date",
    title: "Brunch first.",
    description:
      "Chicken & waffles, braised rib hash, and a reason to bring the whole crew.",
    items: [
      { name: "Chicken & Waffles", price: "$12" },
      { name: "Braised Rib Hash", price: "$15" },
      { name: "Steak & Eggs", price: "$17" },
      { name: "French Toast — Churro Berries", price: "$11" },
    ],
    href: "/menu#full-menu",
    link: "Explore the full brunch menu",
  },
  {
    id: "game-day-highlights",
    eyebrow: "Football season at The Owner's Box",
    title: "Game day next.",
    description:
      "Bring your people. Settle in for football, wings, pizza, and the sports-bar atmosphere.",
    items: [
      { name: "Traditional Jumbo Wings · 12", price: "$16" },
      { name: "Traditional Jumbo Wings · 18", price: "$21" },
      { name: "Charleston Crab Dip", price: "$14" },
      { name: "Buffalo Chicken Pizza", price: "$15" },
    ],
    href: "/private-events",
    link: "Plan a group game day",
  },
];

export default function FeaturedMenuHighlights() {
  return (
    <section
      aria-label="Brunch and game day menu highlights"
      className="ob-canvas relative z-20 bg-white px-4 py-12 text-[#05070B] sm:px-6 sm:py-16"
    >
      <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-8 rounded-[28px] border-2 border-[#05070B]/10 bg-[#F3EBD8] p-6 sm:p-10"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#05070B]/70">
              {section.eyebrow}
            </p>
            <h2 className="mt-4 font-montserrat text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
              {section.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-[#05070B]/75">
              {section.description}
            </p>
            <dl className="mt-6 divide-y divide-[#05070B]/15">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start justify-between gap-4 py-3 text-sm font-semibold"
                >
                  <dt>{item.name}</dt>
                  <dd className="shrink-0 font-black">{item.price}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={section.href}
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#05070B] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              {section.link}
            </Link>
          </article>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-[1600px] text-xs font-semibold text-[#05070B]/70">
        Highlights from our current menu.{" "}
        <Link href="/menu#full-menu" className="underline underline-offset-4">
          View the full menu
        </Link>{" "}
        for the complete selection.
      </p>
    </section>
  );
}
