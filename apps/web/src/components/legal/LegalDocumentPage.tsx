import Link from "next/link";
import type { LegalDocument } from "@packages/legal";
import { LEGAL_CONTACT } from "@packages/legal";
import AltHomeHeader from "@/components/home-alt/AltHomeHeader";
import AltHomeFooter from "@/components/home-alt/AltHomeFooter";

type Props = {
  document: LegalDocument;
};

export default function LegalDocumentPage({ document }: Props) {
  return (
    <main className="ob-theme-root ob-force-light min-h-screen bg-white text-[#05070B]">
      <AltHomeHeader />

      <section className="ob-canvas bg-white px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.28em] text-[#05070B]/55">
            Last updated {document.lastUpdated}
          </p>
          <h1 className="font-montserrat text-4xl font-black uppercase tracking-[-0.06em] sm:text-5xl">
            {document.title}
          </h1>
          {document.intro ? (
            <p className="mt-6 text-sm font-semibold leading-relaxed text-[#05070B]/70">
              {document.intro}
            </p>
          ) : null}

          <div className="mt-10 space-y-10">
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-sm font-semibold leading-relaxed text-[#05070B]/70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-[#05070B]/10 pt-8 text-xs font-semibold leading-relaxed text-[#05070B]/55">
            Questions? Contact {LEGAL_CONTACT.businessName} at{" "}
            <a href={`mailto:${LEGAL_CONTACT.email}`} className="text-[#05070B] underline-offset-4 hover:underline">
              {LEGAL_CONTACT.email}
            </a>
            .
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex text-[10px] font-black uppercase tracking-widest text-[#05070B] underline-offset-4 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </section>

      <AltHomeFooter />
    </main>
  );
}
