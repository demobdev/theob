import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import PostHogAuthSync from "@/components/PostHogAuthSync";
import ConvexProfileSync from "@/components/ConvexProfileSync";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Owner's Box | Sports Bar & Grill",
  description: "Now open on Woodruff Road. Game day food, 14 HD screens, takeout ordering, and DoorDash delivery.",
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
        </ConvexClientProvider>
      </body>
    </html>
  );
}
