import { Download, ExternalLink, FileText, Smartphone } from "lucide-react";
import DoorDashButton from "@/components/common/DoorDashButton";
import { MENU_PDF_DOWNLOAD_NAME, MENU_PDF_URL } from "@/lib/menuAssets";
import { getOrderPagePath } from "@/lib/orderLinks";

function MenuActionButtons({
  layout,
}: {
  layout: "row" | "stack";
}) {
  const orderUrl = getOrderPagePath();
  const stacked = layout === "stack";

  return (
    <>
      <a
        href={MENU_PDF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={
          stacked
            ? "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-white"
            : "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#05070B] bg-[#05070B] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
        }
      >
        {stacked ? <FileText size={14} aria-hidden /> : <ExternalLink size={14} aria-hidden />}
        {stacked ? "Open full menu" : "View menu"}
      </a>
      <a
        href={MENU_PDF_URL}
        download={MENU_PDF_DOWNLOAD_NAME}
        className={
          stacked
            ? "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#05070B] bg-white px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
            : "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#05070B] bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B] shadow-[3px_3px_0_#05070B] transition-transform hover:-translate-y-0.5"
        }
      >
        <Download size={14} aria-hidden />
        {stacked ? "Save PDF" : "Download"}
      </a>
      <a
        href={orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={
          stacked
            ? "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-[#05070B]"
            : "inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#05070B] transition-transform hover:scale-[1.02]"
        }
      >
        Order takeout
      </a>
      <DoorDashButton fullWidth={stacked} className={stacked ? "rounded-full" : undefined} />
    </>
  );
}

export default function MenuPdfViewer() {
  return (
    <section className="ob-canvas bg-white px-4 py-10 text-[#05070B] sm:px-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/55">
              Full menu
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#05070B]/70 sm:text-base">
              Food, bar beverages, and specialty drinks. Order takeout online or get delivery on
              DoorDash.
            </p>
          </div>

          {/* Desktop / tablet only — mobile uses the card below */}
          <div className="hidden flex-wrap gap-2 md:flex md:gap-3">
            <MenuActionButtons layout="row" />
          </div>
        </div>

        {/* Mobile: single action block */}
        <div className="overflow-hidden rounded-[28px] border-2 border-[#05070B]/10 bg-[#F8F6F0] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.1)] sm:p-8 md:hidden">
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#05070B]/10 bg-white text-[#05070B]">
              <Smartphone className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="font-montserrat text-2xl font-black uppercase tracking-tight text-[#05070B]">
              Best on your phone
            </h2>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-[#05070B]/65">
              Open the PDF in your browser — pinch to zoom and scroll through every page.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <MenuActionButtons layout="stack" />
            </div>
          </div>
        </div>

        {/* Desktop: embedded PDF */}
        <div className="hidden overflow-hidden rounded-[28px] border-2 border-[#05070B]/10 bg-[#171713] shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:block">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#101014] px-4 py-3 sm:px-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
              Menu preview — scroll inside the frame
            </p>
            <a
              href={MENU_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-white"
            >
              Open in new tab
            </a>
          </div>
          <object
            data={`${MENU_PDF_URL}#view=FitH&toolbar=1`}
            type="application/pdf"
            className="h-[min(82vh,1100px)] w-full min-h-[560px] bg-white"
            aria-label="The Owner's Box menu PDF preview"
          >
            <iframe
              title="The Owner's Box menu PDF"
              src={`${MENU_PDF_URL}#view=FitH&toolbar=1`}
              className="h-[min(82vh,1100px)] w-full min-h-[560px] bg-white"
            />
          </object>
        </div>

        <p className="mt-4 text-center text-xs font-medium text-[#05070B]/50">
          Prices and availability may vary. For the latest menu, use the PDF above or order online.
        </p>
      </div>
    </section>
  );
}
