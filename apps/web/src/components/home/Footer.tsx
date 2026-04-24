import React from "react";
import Logo from "../common/Logo";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

const footerNav = {
  explore: [
    { name: "The Lineup", href: "/menu" },
    { name: "Live Games", href: "/games" },
    { name: "The Roster", href: "/rewards" },
    { name: "Order Online", href: "/menu" },
    { name: "Gift Cards", href: "/gift-cards" },
  ],
  visit: [
    { name: "Greenville, SC", href: "/locations" },
    { name: "Private Events", href: "/events" },
    { name: "About the Box", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Careers", href: "/careers" },
  ]
};

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] relative overflow-hidden">
      {/* Premium Leather Top Border */}
      <div className="h-1 gold-gradient w-full" />
      
      <div className="absolute inset-0 leather-bg opacity-20 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Info */}
          <div className="space-y-8">
            <Logo />
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
              Greenville’s premier sports bar experience. Where game-day energy meets modern hospitality and the best craft pizza in the Upstate.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">The Lineup</h4>
            <ul className="space-y-4">
              {footerNav.explore.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 hover:text-[#D4AF37] transition-colors text-xs font-black uppercase tracking-widest">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Hospitality</h4>
            <ul className="space-y-4">
              {footerNav.visit.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-500 hover:text-[#D4AF37] transition-colors text-xs font-black uppercase tracking-widest">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Apps */}
          <div className="space-y-10">
            <div>
              <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-6">Download the App</h4>
              <div className="flex flex-col gap-3">
                <Link href="#" className="hover:scale-[1.02] transition-transform">
                  <Image src="/apple-app-store.svg" alt="Download on the App Store" width={140} height={42} />
                </Link>
                <Link href="#" className="hover:scale-[1.02] transition-transform">
                  <Image src="/google-play.svg" alt="Get it on Google Play" width={140} height={42} />
                </Link>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex items-center gap-3 text-gray-500">
                  <MapPin size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">1757 Woodruff Rd, Greenville</span>
               </div>
               <div className="flex items-center gap-3 text-gray-500">
                  <Phone size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">(864) 555-0123</span>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} The Owner’s Box Bar & Grill
            </p>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">Crafted by</span>
             <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Peters Design Co.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
