import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import Link from "next/link";
import { Users, Tv, UtensilsCrossed } from "lucide-react";

export const metadata = {
  title: "Private Events | The Owner's Box",
};

export default function PrivateEventsPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />
      <section className="container mx-auto px-4 py-24 max-w-3xl">
        <span className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] text-sm mb-4 block">
          Hospitality
        </span>
        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">
          Private Events
        </h1>
        <p className="text-gray-400 font-medium leading-relaxed mb-12">
          Watch parties, team celebrations, and group nights at Greenville&apos;s sports headquarters. We handle the screens, the food, and the energy — you bring the crowd.
        </p>

        <div className="grid gap-6 mb-12">
          {[
            {
              icon: Users,
              title: "Groups & celebrations",
              text: "Birthdays, corporate outings, and league drafts — flexible seating for mid-size groups.",
            },
            {
              icon: Tv,
              title: "Dedicated screens",
              text: "Request audio/video priority for your matchup when schedules allow.",
            },
            {
              icon: UtensilsCrossed,
              title: "Catering-style menus",
              text: "Shared appetizers, wings, and pizza packages. Full bar for dine-in events.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="h-12 w-12 rounded-xl bg-[#D4AF37] flex items-center justify-center shrink-0">
                <Icon className="h-6 w-6 text-black" />
              </div>
              <div>
                <h2 className="text-white font-black uppercase tracking-widest text-sm mb-2">
                  {title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-8">
          Online catering checkout isn&apos;t on the site yet — inquiries go through our team directly.
        </p>
        <Link href="/locations#contact">
          <button
            type="button"
            className="px-10 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-xs gold-glow"
          >
            Inquire via Contact Form
          </button>
        </Link>
      </section>
      <Footer />
    </main>
  );
}
