import Image from "next/image";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { OB_INDEED_JOBS_URL, OB_SUPPORT_EMAIL } from "@/lib/localSeo";
import { OB_ADDRESS } from "@/lib/storeLocation";
import { Briefcase, ExternalLink, Mail, UtensilsCrossed, Wine } from "lucide-react";

export const metadata = {
  title: "Careers & Now Hiring | The Owner's Box Bar & Grill Greenville SC",
  description:
    "Join The Owners Box Bar & Grill on Woodruff Road in Greenville, SC. Now hiring servers, bartenders, and kitchen staff.",
};

const openRoles = [
  {
    icon: Wine,
    title: "Bartender",
    text: "Craft cocktails, beer & wine, and game-day energy behind the bar.",
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchen Staff",
    text: "Scratch-made wings, pizza, steaks, and shareables for a busy sports bar kitchen.",
  },
  {
    icon: Briefcase,
    title: "Server",
    text: "Warm hospitality for families, regulars, and watch-party crowds.",
  },
];

export default function CareersPage() {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="ob-canvas bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[900px]">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#05070B]/55">
            Now hiring · Greenville, SC
          </p>
          <h1 className="font-montserrat text-5xl font-black uppercase leading-[0.82] tracking-[-0.08em] sm:text-7xl">
            Join The
            <br />
            Crew
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-semibold leading-relaxed text-[#05070B]/72 sm:text-base">
            The Owners Box Bar & Grill is a family-friendly sports bar and grill on Woodruff Road.
            We&apos;re building a team that loves great food, cold drinks, and game-day hospitality.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={OB_INDEED_JOBS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
            >
              View jobs on Indeed
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={`mailto:${OB_SUPPORT_EMAIL}?subject=Careers%20at%20The%20Owners%20Box`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-transform hover:-translate-y-0.5"
            >
              Email {OB_SUPPORT_EMAIL}
              <Mail className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative mt-12 min-h-[320px] overflow-hidden rounded-[28px] border-2 border-[#05070B]/10 sm:min-h-[420px]">
            <Image
              src="/images/food/official/staff.jpg"
              alt="The Owner's Box staff welcoming guests"
              fill
              className="object-cover"
              style={{ objectPosition: "center 35%" }}
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {openRoles.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[24px] border-2 border-[#05070B]/10 bg-white p-5 shadow-[0_12px_0_rgba(5,7,11,0.04)]"
              >
                <Icon className="mb-4 h-8 w-8 text-[#05070B]" />
                <h2 className="font-montserrat text-2xl font-black uppercase tracking-tight">{title}</h2>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-[#05070B]/68">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm font-semibold leading-relaxed text-[#05070B]/60">
            Prefer to visit? Stop by {OB_ADDRESS.line1}, {OB_ADDRESS.city}, {OB_ADDRESS.state}{" "}
            {OB_ADDRESS.zip} or call{" "}
            <a href={`tel:${OB_ADDRESS.phoneTel}`} className="font-black text-[#05070B] hover:underline">
              {OB_ADDRESS.phone}
            </a>
            .
          </p>

          <Link
            href="/locations"
            className="mt-6 inline-flex text-[10px] font-black uppercase tracking-widest text-[#05070B] underline-offset-4 hover:underline"
          >
            Get directions
          </Link>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
