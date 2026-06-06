"use client";

import Header from "@/components/Header";
import Footer from "@/components/home/Footer";
import HeartlandOrderLink from "@/components/common/HeartlandOrderLink";
import MenuViewer, { MENU_PDF_URL } from "@/components/menu/MenuViewer";
import { Download, ExternalLink, FileText } from "lucide-react";

export default function MenuPage() {
  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Header />

      <section className="relative border-b border-[#D4AF37]/15 overflow-hidden pt-24">
        <div className="absolute inset-0 leather-bg opacity-20" />
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl">
            <div className="h-px w-12 bg-[#D4AF37] mb-4" />
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">
              The Lineup
            </h1>
            <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed mb-8 max-w-2xl">
              Drag the zoom slider under the menu, use your scroll wheel on desktop, or
              pinch on mobile. Drag the image to pan when zoomed in. Download the PDF to
              save or print. When you&apos;re ready to order, curbside pickup, dine-in,
              and delivery are available online.
            </p>
            <div className="flex flex-wrap gap-4">
              <HeartlandOrderLink>
                <span className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-sm gold-glow hover:scale-105 transition-all cursor-pointer">
                  Order Online
                  <ExternalLink size={16} />
                </span>
              </HeartlandOrderLink>
              <a
                href={MENU_PDF_URL}
                download="the-owners-box-menu.pdf"
                className="inline-flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                <Download size={14} className="text-[#D4AF37]" />
                Download PDF
              </a>
            </div>
            <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mt-4">
              Also on DoorDash · Greenville, SC
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-6">
          <FileText size={18} className="text-[#D4AF37]" />
          <h2 className="text-white font-black uppercase tracking-widest text-xs">
            Full Menu
          </h2>
        </div>

        <MenuViewer />
      </section>

      <section className="border-t border-white/5 py-16 bg-black/40">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-4">
            Ready to Order?
          </h3>
          <p className="text-gray-400 text-sm mb-8">
            Curbside pickup, dine-in, and delivery are available online. DoorDash is available for delivery too.
          </p>
          <HeartlandOrderLink>
            <span className="inline-flex px-10 py-4 rounded-xl gold-gradient text-black font-black uppercase tracking-widest text-sm gold-glow cursor-pointer hover:scale-105 transition-all">
              Order Online
            </span>
          </HeartlandOrderLink>
        </div>
      </section>

      <Footer />
    </main>
  );
}
