import { sanitizePublicUrl } from "@/lib/envUrl";

/** Local SEO + social URLs — keep in sync with Google Business Profile. */

export const OB_SITE_URL = sanitizePublicUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  "https://ownersboxgvl.com",
);

export const OB_SOCIAL = {
  facebook: "https://www.facebook.com/people/The-Owners-Box/61572349191177/",
  instagram: "https://www.instagram.com/ownersbox.gvl/",
} as const;

export const OB_GOOGLE_REVIEW_URL = "https://maps.app.goo.gl/7R7p87W2GwNvQ9cb7";

export const OB_GOOGLE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=The+Owners+Box+1757+Woodruff+Rd+Greenville+SC+29607";

export const OB_INDEED_JOBS_URL =
  "https://www.indeed.com/q-the-owners-box-l-greenville,-sc-jobs.html";

export const OB_SUPPORT_EMAIL = "support@ownersboxgvl.com";

export const OB_SEO_KEYWORDS = [
  "sports bar Greenville SC",
  "sports bar and grill Greenville",
  "family friendly restaurant Greenville SC",
  "bar and grill Woodruff Road",
  "watch party Greenville",
  "kids menu Greenville restaurant",
  "wings and pizza Greenville",
  "The Owners Box Greenville",
] as const;

export const OB_DEFAULT_DESCRIPTION =
  "The Owners Box Bar & Grill on Woodruff Road in Greenville, SC — a family-friendly sports bar with scratch-made wings, pizza, and steaks, cold drinks, big screens, takeout, and DoorDash delivery.";

export const OB_MARKETING_ROUTES = [
  "/",
  "/menu",
  "/locations",
  "/our-story",
  "/private-events",
  "/faq",
  "/careers",
  "/privacy",
  "/terms",
] as const;
