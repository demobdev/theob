import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";
import { OB_GOOGLE_REVIEW_URL, OB_SOCIAL } from "@/lib/localSeo";

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

            <section aria-label="Stay updated" className="lg:pl-10">
              <p className="mb-4 max-w-md text-[11px] font-black uppercase leading-relaxed tracking-[0.12em] text-[#F2EAD4]/85 sm:text-[13px] sm:tracking-tight">
                Stay updated on the latest from The Owner&apos;s Box
              </p>
              <p className="max-w-lg text-sm font-semibold leading-relaxed text-[#F2EAD4]/70">
                Email signup is not available yet. Follow us on Instagram for the latest updates.
              </p>
              <Link
                href={OB_SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#05070B]"
              >
                Follow on Instagram
              </Link>
            </section>
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
