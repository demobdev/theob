import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

const footerColumns = [
  [
    { label: "Locations", href: "/locations" },
    { label: "Book a Party", href: "/private-events" },
    { label: "Careers", href: "/contact" },
  ],
  [
    { label: "Menu", href: "/menu" },
    { label: "Live Games", href: "/games" },
    { label: "Events", href: "/events" },
  ],
  [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Feedback", href: "/contact" },
  ],
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/ownersbox.gvl/" },
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
              <p className="mb-4 text-[13px] font-black uppercase tracking-tight">
                Stay updated on the latest from The Owner&apos;s Box
              </p>
              <form className="grid gap-3" action="#">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    aria-label="First name"
                    placeholder="First name"
                    className="rounded-md border-2 border-[#F2EAD4]/20 bg-[#071B2F] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#F2EAD4] placeholder:text-[#F2EAD4]/35"
                  />
                  <input
                    aria-label="Last name"
                    placeholder="Last name"
                    className="rounded-md border-2 border-[#F2EAD4]/20 bg-[#071B2F] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#F2EAD4] placeholder:text-[#F2EAD4]/35"
                  />
                </div>
                <div className="flex">
                  <input
                    aria-label="Email"
                    type="email"
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 rounded-l-md border-2 border-r-0 border-[#F2EAD4]/20 bg-[#071B2F] px-4 py-3 text-xs font-black uppercase tracking-widest text-[#F2EAD4] placeholder:text-[#F2EAD4]/35"
                  />
                  <button
                    type="submit"
                    className="rounded-r-md border-2 border-white bg-white px-5 text-lg font-black text-[#05070B]"
                    aria-label="Submit email signup"
                  >
                    -
                  </button>
                </div>
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
