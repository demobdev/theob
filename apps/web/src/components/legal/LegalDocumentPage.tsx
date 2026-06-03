import Link from "next/link";
import type { LegalDocument } from "@packages/legal";
import { LEGAL_CONTACT } from "@packages/legal";

type Props = {
  document: LegalDocument;
};

export default function LegalDocumentPage({ document }: Props) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[#D4AF37] text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            ← The Owner&apos;s Box
          </Link>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
            Last updated {document.lastUpdated}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
          {document.title}
        </h1>
        {document.intro ? (
          <p className="text-gray-400 leading-relaxed mb-10">{document.intro}</p>
        ) : null}

        <div className="space-y-10">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#D4AF37] mb-3">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-gray-400 text-sm leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-gray-600 text-xs leading-relaxed border-t border-white/10 pt-8">
          Questions? Contact {LEGAL_CONTACT.businessName} at{" "}
          <a
            href={`mailto:${LEGAL_CONTACT.email}`}
            className="text-[#D4AF37] hover:underline"
          >
            {LEGAL_CONTACT.email}
          </a>
          .
        </p>
      </main>
    </div>
  );
}
