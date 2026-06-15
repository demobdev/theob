import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Location & Hours | Sports Bar on Woodruff Road Greenville SC",
  description:
    "Visit The Owners Box Bar & Grill at 1757 Woodruff Rd in Greenville, SC. Family-friendly sports bar with kids menu, Wi-Fi, big screens, takeout, and DoorDash delivery.",
  alternates: { canonical: "/locations" },
};

export default function LocationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
