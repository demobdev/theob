import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Wings, Pizza & Bar Favorites in Greenville SC",
  description:
    "Browse The Owners Box menu — scratch-made wings, pizza, steaks, seafood, sandwiches, and shareables. Dine in, takeout, or DoorDash on Woodruff Road.",
  alternates: { canonical: "/menu" },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
