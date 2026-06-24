import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Wings, Pizza & Bar Favorites in Greenville SC",
  description:
    "View The Owner's Box full menu — scratch-made wings, pizza, bar beverages, specialty drinks, and shareables. Download the PDF or order online on Woodruff Road.",
  alternates: { canonical: "/menu" },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
