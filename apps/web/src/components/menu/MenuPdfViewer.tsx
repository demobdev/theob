"use client";

import { Download, ExternalLink } from "lucide-react";
import { MENU_PDF_URL } from "@/lib/menuAssets";
import { getOrderPagePath } from "@/lib/orderLinks";

export default function MenuPdfViewer() {
  const orderUrl = getOrderPagePath();

  return (
    <section className="ob-canvas bg-white px-4 py-10 text-[#05070B] sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/55">
              Full menu
            </p>
            <p className="mt-2 max-w-xl text-sm font-semibold leading-relaxed text-[#05070B]/70">
              Food, bar beverages, and specialty drinks — scroll the menu below or download a copy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={MENU_PDF_URL}
              download
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#05070B] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-[3px_3px_0_#05070B] transition-transform hover:-translate-y-0.5"
            >
              <Download size={14} aria-hidden />
              Download PDF
            </a>
            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
            >
              Order Now
              <ExternalLink size={14} aria-hidden />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border-2 border-[#05070B]/10 bg-[#171713] shadow-[0_28px_90px_rgba(0,0,0,0.18)]">
          <iframe
            title="The Owner's Box menu PDF"
            src={`${MENU_PDF_URL}#view=FitH`}
            className="h-[min(85vh,1200px)] w-full min-h-[520px] bg-white"
          />
        </div>

        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#05070B]/45">
          Can&apos;t see the menu?{" "}
          <a href={MENU_PDF_URL} target="_blank" rel="noopener noreferrer" className="text-[#05070B] underline">
            Open PDF in a new tab
          </a>
        </p>
      </div>
    </section>
  );
}
