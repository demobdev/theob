import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Menu (Preview)",
  robots: { index: false, follow: false },
};

export default function InteractiveMenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
