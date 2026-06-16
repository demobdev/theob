import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import PostHogAuthSync from "@/components/PostHogAuthSync";
import ConvexProfileSync from "@/components/ConvexProfileSync";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { OB_DEFAULT_DESCRIPTION, OB_SITE_URL, OB_SOCIAL } from "@/lib/localSeo";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(OB_SITE_URL),
  title: {
    default: "The Owner's Box Bar & Grill | Sports Bar & Family Restaurant in Greenville, SC",
    template: "%s | The Owner's Box Bar & Grill",
  },
  description: OB_DEFAULT_DESCRIPTION,
  keywords: [
    "sports bar Greenville SC",
    "sports bar and grill Greenville",
    "family friendly restaurant Greenville SC",
    "bar and grill Woodruff Road",
    "kids menu Greenville",
    "watch party Greenville SC",
    "The Owners Box Greenville",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: OB_SITE_URL,
    siteName: "The Owner's Box Bar & Grill",
    title: "The Owner's Box Bar & Grill | Greenville, SC Sports Bar & Grill",
    description: OB_DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "The Owner's Box Bar & Grill | Greenville, SC",
    description: OB_DEFAULT_DESCRIPTION,
  },
  other: {
    "geo.region": "US-SC",
    "geo.placename": "Greenville",
    "geo.position": "34.8200749;-82.2714396",
    ICBM: "34.8200749, -82.2714396",
  },
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
      <head>
        <link rel="me" href={OB_SOCIAL.instagram} />
        <link rel="me" href={OB_SOCIAL.facebook} />
      </head>
      <body className={cn(inter.className, montserrat.className, lato.className)}>
        <GoogleAnalytics />
        <LocalBusinessJsonLd />
        <ConvexClientProvider>
          <PostHogAuthSync />
          <ConvexProfileSync />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
