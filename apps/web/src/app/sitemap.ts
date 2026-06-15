import type { MetadataRoute } from "next";
import { OB_MARKETING_ROUTES, OB_SITE_URL } from "@/lib/localSeo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return OB_MARKETING_ROUTES.map((path) => ({
    url: `${OB_SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/menu" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/locations" || path === "/menu" ? 0.9 : 0.7,
  }));
}
