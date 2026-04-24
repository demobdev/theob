import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import LocationFulfillmentModal from "@/components/menu/LocationFulfillmentModal";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Owner's Box | Greenville's Sports Bar",
  description: "Watch live sports, order food, and earn rewards at The Owner's Box in Greenville, SC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, montserrat.className, lato.className)}>
        <ConvexClientProvider>
          {children}
          <LocationFulfillmentModal />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
