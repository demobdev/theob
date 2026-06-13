import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import AppDownloadPromoModal from "@/components/common/AppDownloadPromoModal";
import PostHogAuthSync from "@/components/PostHogAuthSync";
import ConvexProfileSync from "@/components/ConvexProfileSync";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Owner's Box | Greenville's Sports Bar",
  description: "Watch live sports, order food, and enjoy game day at The Owner's Box in Greenville, SC.",
  icons: {
    icon: "/ob-icon.png",
    apple: "/ob-icon.png",
  },
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
          <PostHogAuthSync />
          <ConvexProfileSync />
          {children}
          <AppDownloadPromoModal />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
