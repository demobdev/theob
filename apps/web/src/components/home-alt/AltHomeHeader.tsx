import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import AltThemeToggle from "./AltThemeToggle";
import { getHeartlandOrderUrl } from "@/lib/orderLinks";
import { OB_ADDRESS } from "@/lib/storeLocation";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Book a Party", href: "/private-events" },
  { label: "Locations", href: "/locations" },
];

const utilityLinks = [
  { label: "Careers", href: "/contact" },
  { label: "Shop", href: "#shop" },
  { label: "Our Story", href: "/about" },
  { label: "Feedback", href: "/contact" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/ownersbox.gvl/" },
];

export default function AltHomeHeader() {
  const orderUrl = getHeartlandOrderUrl();
  const phoneHref = `tel:${OB_ADDRESS.phone.replace(/\D/g, "")}`;

  return (
    <header className="relative z-30 bg-[#071B2F] text-[#F3EBD8]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em]">
        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-[#F3EBD8]/80 transition-colors hover:text-[#D4AF37]"
            >
              <Icon className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {utilityLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-[#D4AF37]">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="ob-nav-surface bg-white text-[#05070B]">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 xl:px-8">
          <nav className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-black uppercase tracking-tight sm:gap-x-7 sm:text-xs">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="flex items-center justify-center gap-2">
            <Image src="/ob-icon.png" alt="" width={34} height={34} className="h-8 w-8 object-contain" />
            <span className="hidden font-montserrat text-lg font-black uppercase leading-none tracking-tight sm:block">
              The Owner&apos;s Box
            </span>
          </Link>

          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <AltThemeToggle />
            <a
              href={phoneHref}
              className="hidden rounded-full border-2 border-[#05070B]/15 px-3 py-2 text-[8px] font-black uppercase tracking-widest text-[#05070B] transition-colors hover:border-[#05070B] sm:inline-flex sm:text-[9px]"
            >
              {OB_ADDRESS.phone}
            </a>
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#05070B] bg-[#05070B] px-3 py-2 text-[8px] font-black uppercase tracking-widest text-white transition-transform hover:scale-[1.02] sm:px-4 sm:text-[9px]"
            >
              Order Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
