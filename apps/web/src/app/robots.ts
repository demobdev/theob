import type { MetadataRoute } from "next";
import { OB_SITE_URL } from "@/lib/localSeo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/checkout/", "/notes/", "/sign-in/", "/sign-up/", "/access-denied/"],
      },
    ],
    sitemap: `${OB_SITE_URL}/sitemap.xml`,
  };
}
