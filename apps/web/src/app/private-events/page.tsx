import Image from "next/image";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { CalendarDays, Mail, Tv, Users, UtensilsCrossed } from "lucide-react";

export const metadata = {
  title: "Private Events | The Owner's Box",
};

const eventFeatures = [
  {
    icon: Users,
    title: "Groups & celebrations",
    text: "Birthdays, corporate outings, watch parties, and league drafts with flexible seating for mid-size groups.",
  },
  {
    icon: Tv,
    title: "Dedicated screens",
    text: "Request audio/video priority for your matchup when schedules allow, with the full sports-bar atmosphere.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food for the table",
    text: "Shared apps, wings, pizza, and bar favorites that keep the party fed without overcomplicating the night.",
  },
];

export default function PrivateEventsPage() {
  return (
    <main className="ob-theme-root min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-12 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-10">
          <div className="relative min-h-[460px] overflow-hidden rounded-[24px] border-2 border-[#05070B]/10 sm:min-h-[620px]">
            <Image
              src="/sports-feature.jpg"
              alt="The Owner's Box bar set up for private events"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Groups, parties, regulars
              </p>
              <h1 className="max-w-5xl font-montserrat text-[clamp(4rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-white">
                The Party
                <br />
                Starts Here
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/78 sm:text-base">
                Bring the crew for birthdays, watch parties, league drafts, and Greenville nights
                out. We handle the screens, food, and room energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 py-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] border border-white/10 bg-[#05070B] text-white">
            <Image
              src="/images/hero-bg.png"
              alt="The Owner's Box event atmosphere"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 680px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="grid gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#05070B] p-7 text-white sm:p-10">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                What we can host
              </p>
              <div className="grid gap-4">
                {eventFeatures.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-white/10 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white text-[#05070B]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="mb-2 text-sm font-black uppercase tracking-widest text-white">
                        {title}
                      </h2>
                      <p className="text-sm font-semibold leading-relaxed text-white/62">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white p-7 text-[#05070B]">
                <CalendarDays className="mb-8 h-9 w-9" />
                <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em]">
                  Plan A
                  <br />
                  Night Out
                </h3>
                <p className="mt-5 text-sm font-semibold leading-relaxed text-[#05070B]/70">
                  Tell us your date, group size, and what you want on the screens.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#05070B] p-7 text-white">
                <Mail className="mb-8 h-9 w-9 text-white" />
                <h3 className="font-montserrat text-4xl font-black uppercase leading-[0.85] tracking-[-0.06em]">
                  Start
                  <br />
                  Here
                </h3>
                <p className="mt-5 text-sm font-semibold leading-relaxed text-white/65">
                  Online catering checkout is not on the site yet, so inquiries go through the team.
                </p>
                <Link
                  href="/locations#contact"
                  className="mt-7 inline-flex rounded-full border-2 border-white bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-transform hover:-translate-y-0.5"
                >
                  Inquire via contact form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
