import {
  OB_DEFAULT_DESCRIPTION,
  OB_GOOGLE_REVIEW_URL,
  OB_SITE_URL,
  OB_SOCIAL,
  OB_SUPPORT_EMAIL,
} from "@/lib/localSeo";
import { OB_ADDRESS, OB_COORDS, OB_HOURS } from "@/lib/storeLocation";

export default function LocalBusinessJsonLd() {
  const openingHoursSpecification = OB_HOURS.schema.flatMap(({ days, opens, closes }) =>
    days.map((dayOfWeek) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${dayOfWeek}`,
      opens,
      closes,
    })),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "BarOrPub", "SportsActivityLocation"],
    "@id": `${OB_SITE_URL}/#restaurant`,
    name: OB_ADDRESS.name,
    description: OB_DEFAULT_DESCRIPTION,
    url: OB_SITE_URL,
    telephone: OB_ADDRESS.phoneTel,
    email: OB_SUPPORT_EMAIL,
    image: `${OB_SITE_URL}/ob-icon.png`,
    priceRange: "$$",
    servesCuisine: ["American", "Sports Bar", "Barbecue", "Pizza"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Kids menu", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sports on TV", value: true },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: OB_ADDRESS.line1,
      addressLocality: OB_ADDRESS.city,
      addressRegion: OB_ADDRESS.state,
      postalCode: OB_ADDRESS.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: OB_COORDS.lat,
      longitude: OB_COORDS.lng,
    },
    openingHoursSpecification,
    sameAs: [OB_SOCIAL.facebook, OB_SOCIAL.instagram],
    areaServed: {
      "@type": "City",
      name: "Greenville",
      containedInPlace: { "@type": "State", name: "South Carolina" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "11",
      bestRating: "5",
    },
    hasMenu: `${OB_SITE_URL}/menu`,
    potentialAction: {
      "@type": "ReviewAction",
      target: OB_GOOGLE_REVIEW_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
