import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";

export const metadata = {
  title: "FAQ | The Owner's Box",
  description: "Hours, ordering, location, private events, and common questions about The Owner's Box.",
};

const faqs = [
  {
    q: "What are your hours?",
    a: "Mon · Wed · Fri: 4 PM – Midnight. Thu · Sat: 11:30 AM – Midnight. Sun: 10 AM – Midnight. Sunday brunch runs 10 AM – 2 PM. Kitchen hours may vary on holidays — call ahead or visit our location page.",
  },
  {
    q: "Where are you located?",
    a: "1757 Woodruff Rd. STE A, Greenville, SC 29607. One location for dine-in and pickup.",
  },
  {
    q: "Can I order online?",
    a: "Browse the full menu on our website. For takeout, use Order Now in the header — it opens our Heartland online ordering site. Delivery is available through DoorDash.",
  },
  {
    q: "Do you offer delivery?",
    a: "Yes — order delivery through DoorDash using the Order on DoorDash button on our site.",
  },
  {
    q: "Are mobile apps available?",
    a: "iOS and Android apps are coming soon. Until then, order online through Heartland and check our site for hours, menu, and visit info.",
  },
  {
    q: "What is curbside pickup?",
    a: "Order takeout through our online ordering site, then pick up at the restaurant. Call if you need help finding us when you arrive.",
  },
  {
    q: "Can I order alcohol for pickup?",
    a: "No. Alcohol cannot be ordered for pickup or takeout. Beer and wine are available for dine-in only, with ID checks at the bar.",
  },
  {
    q: "How do I see what games are on?",
    a: "Wall-to-wall screens and NFL Sunday Ticket at the bar. Ask the team when you arrive or mention your matchup when booking a private event.",
  },
  {
    q: "Do you host private events?",
    a: "Yes — groups and watch parties. Visit our Private Events page or contact us through the form on our Locations page.",
  },
  {
    q: "Is there a dress code?",
    a: "Come as you are — game-day casual. We ask for respectful behavior so every guest enjoys the atmosphere.",
  },
  {
    q: "Do you accommodate dietary needs?",
    a: "Many items can be customized; ask your server or add special instructions when ordering. Major allergens are noted where available.",
  },
  {
    q: "How do I contact the restaurant?",
    a: "Use the contact form on our Locations page, email support@ownersboxgvl.com, or call during business hours.",
  },
];

export default function FaqPage() {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="ob-canvas bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
            Help center
          </p>
          <h1 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-7xl">
            FAQ
          </h1>

          <div className="mt-10 space-y-4">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-[24px] border-2 border-[#05070B]/10 bg-white p-5 shadow-[0_12px_0_rgba(5,7,11,0.04)] sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-black uppercase tracking-tight text-[#05070B]">
                  {item.q}
                  <span className="shrink-0 text-[#D4AF37] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm font-semibold leading-relaxed text-[#05070B]/70">{item.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-12 text-sm font-semibold text-[#05070B]/60">
            Still stuck?{" "}
            <Link href="/locations#contact" className="font-black text-[#05070B] underline-offset-4 hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
