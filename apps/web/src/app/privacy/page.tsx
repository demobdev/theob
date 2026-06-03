import type { Metadata } from "next";
import LegalDocumentPage from "@/components/legal/LegalDocumentPage";
import { privacyPolicy } from "@packages/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | The Owner's Box",
  description:
    "How The Owner's Box collects, uses, and protects your information in our app and website.",
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={privacyPolicy} />;
}
