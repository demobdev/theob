import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { OB_GOOGLE_REVIEW_URL, OB_SOCIAL } from "@/lib/localSeo";

const footerInputClass =
  "w-full rounded-xl border border-[#F2EAD4]/15 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#F2EAD4] placeholder:text-[#F2EAD4]/40 transition-colors focus:border-[#D4AF37]/55 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20";

const footerColumns = [
  [
    { label: "Locations", href: "/locations" },
    { label: "Events", href: "/private-events" },
    { label: "Our Story", href: "/our-story" },
  ],
  [
    { label: "Menu", href: "/menu" },
    { label: "Now Hiring", href: "/careers" },
    { label: "FAQ", href: "/faq" },
  ],
  [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Leave a Review", href: OB_GOOGLE_REVIEW_URL, external: true },
  ],
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: OB_SOCIAL.facebook },
  { icon: Instagram, label: "Instagram", href: OB_SOCIAL.instagram },
];

export default function AltHomeFooter() {
  return (
    <footer className="bg-[#05070B] text-[#F2EAD4]">
      <div className="border-t border-[#F2EAD4]/10 bg-[#05070B] px-6 py-12 sm:px-10 xl:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <div className="mb-10 flex flex-wrap items-center gap-8">
                <Image src="/ob-icon.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" />
                <p className="font-montserrat text-3xl font-black uppercase leading-none tracking-tight">
                  The Owner&apos;s Box
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {footerColumns.map((column, columnIndex) => (
                  <nav key={columnIndex} className="space-y-4">
                    {column.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={"external" in link && link.external ? "_blank" : undefined}
                        rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                        className="block text-[11px] font-black uppercase tracking-tight text-[#F2EAD4]/70 transition-colors hover:text-[#F2EAD4]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                ))}
              </div>
            </div>

            <div className="lg:pl-10">
              <p className="mb-4 max-w-md text-[11px] font-black uppercase leading-relaxed tracking-[0.12em] text-[#F2EAD4]/85 sm:text-[13px] sm:tracking-tight">
                Stay updated on the latest from The Owner&apos;s Box
              </p>
              <form className="flex max-w-lg flex-col gap-3" action="#">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    aria-label="First name"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="First name"
                    className={footerInputClass}
                  />
                  <input
                    aria-label="Last name"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={footerInputClass}
                  />
                </div>
                <input
                  aria-label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={footerInputClass}
                />
                <button
                  type="submit"
                  className="mt-1 w-full rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#05070B] shadow-[0_8px_24px_rgba(212,175,55,0.22)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:self-start"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-[#F2EAD4]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-semibold text-[#F2EAD4]/55">
              © {new Date().getFullYear()} The Owner&apos;s Box Bar & Grill.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="text-[#F2EAD4]/70 transition-colors hover:text-[#F2EAD4]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
