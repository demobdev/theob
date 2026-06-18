import Image from "next/image";
import Link from "next/link";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";
import { getOrderPagePath } from "@/lib/orderLinks";

export const metadata = {
  title: "Our Story | Family-Friendly Sports Bar in Greenville SC",
  description:
    "The Owners Box Bar & Grill on Woodruff Road — Greenville's upscale game-day sports bar with scratch-made food, big screens, and room for the whole crew.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  const orderUrl = getOrderPagePath();

  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="bg-white px-4 pb-12 text-[#05070B] sm:px-6">
        <div className="mx-auto max-w-[1600px] overflow-hidden rounded-b-[28px] bg-white pb-10">
          <div className="relative min-h-[460px] overflow-hidden rounded-[24px] border-2 border-[#05070B]/10 sm:min-h-[620px]">
            <Image
              src="/images/atmosphere/wide-view-from-right.jpg"
              alt="The Owner's Box dining room and bar"
              fill
              priority
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
              sizes="(max-width: 768px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-10">
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white backdrop-blur">
                Est. 2026 · Greenville, SC
              </p>
              <h1 className="max-w-5xl font-montserrat text-[clamp(4rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-[-0.08em] text-white">
                Our
                <br />
                Story
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/78 sm:text-base">
                The easy answer for friends, families, regulars, and fans who want the food to hit
                as hard as the matchup.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ob-canvas bg-white px-4 py-16 text-[#05070B] sm:px-6">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative min-h-[420px]">
            <div className="absolute left-0 top-0 h-[64%] w-[68%] overflow-hidden rounded-[24px] border-2 border-[#D4AF37]/25 shadow-lg">
              <Image
                src="/images/atmosphere/ob-front.png"
                alt="The Owner's Box storefront on Woodruff Road"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 70vw, 460px"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-[46%] w-[58%] overflow-hidden rounded-[20px] border-2 border-[#D4AF37]/25 shadow-xl">
              <Image
                src="/don-vik-denny.jpg"
                alt="Owners Don Bailey, Denny Nepton, and Vik Tanksale"
                fill
                className="object-cover"
                style={{ objectPosition: "center 20%" }}
                sizes="(max-width: 1024px) 60vw, 400px"
              />
            </div>
          </div>

          <div className="max-w-2xl space-y-6 text-sm font-semibold leading-relaxed text-[#05070B]/72 sm:text-base">
            <p>
              <strong className="text-[#05070B]">The Owner&apos;s Box Bar & Grill</strong> was born from a friendship that spans over two decades.
              Don Bailey, Denny Nepton, and Vik Tanksale first met walking the hallways of Mauldin Middle School, later graduating together as lifelong friends from Mauldin High.
            </p>
            <p>
              Through college, careers, and the busy rhythms of life, their bond remained unchanged—anchored by a shared love for sports, great food, and their local community.
              For years, they talked about creating the ultimate neighborhood hangout: a place where the wings are always crispy, the draft beer is ice-cold, and every game is treated like a championship matchup.
            </p>
            <p>
              In 2026, that dream became a reality on Woodruff Road. Built for sports fans, families, and regulars alike, it represents the intersection of their lifelong friendship and their passion for authentic Greenville hospitality. Pull up a seat at the bar, and you&apos;re not just visiting a restaurant—you&apos;re stepping into the culmination of a Mauldin-born dream.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/menu"
                className="inline-flex rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-0.5"
              >
                View Menu
              </Link>
              <Link
                href="/locations"
                className="inline-flex rounded-full border-2 border-[#05070B] bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-transform hover:-translate-y-0.5"
              >
                Visit Us
              </Link>
              <a
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border-2 border-[#D4AF37] bg-[#071B2F] px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#F2EAD4] transition-transform hover:-translate-y-0.5"
              >
                Order Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Owners/Founders Section */}
      <section className="bg-[#0A0D14] px-4 py-20 text-white sm:px-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] mb-3">
              The Team Behind the Box
            </p>
            <h2 className="font-montserrat text-4xl font-black uppercase tracking-tight sm:text-5xl text-white">
              Meet The Owners
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-[#D4AF37]" />
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Don Bailey",
                role: "Co-Owner / Founder",
                bio: "A proud Mauldin High alumnus, Don's vision for The Owner's Box was to create the ultimate game-day living room for Greenville sports fans—combining high-end screens with the welcoming energy of a local neighborhood clubhouse.",
              },
              {
                name: "Denny Nepton",
                role: "Co-Owner / Founder",
                bio: "Denny's journey from Mauldin Middle to co-owner of the Box is fueled by his commitment to service. He manages guest relations and logistics, ensuring every visitor feels like a regular from day one.",
              },
              {
                name: "Vik Tanksale",
                role: "Co-Owner / Founder",
                bio: "Vik leads the culinary standards and kitchen operations. Drawing on a shared lifetime of sports watch parties, he ensures that scratch-made pizzas, gourmet burgers, and the best wings in Greenville are served hot every day.",
              },
            ].map((owner, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#121620] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-2xl"
              >
                <div>
                  <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-neutral-900/50 flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-center p-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
                        Photo Pending
                      </span>
                    </div>
                  </div>
                  <h3 className="font-montserrat text-2xl font-bold uppercase tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                    {owner.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/80 mt-1">
                    {owner.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    {owner.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
