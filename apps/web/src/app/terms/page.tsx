import type { Metadata } from "next";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";
import { termsOfService } from "@packages/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions | The Owner's Box",
  description: "Terms of use for The Owner's Box mobile app and website.",
};

export default function TermsPage() {
  return <LegalDocumentPage document={termsOfService} />;
}
