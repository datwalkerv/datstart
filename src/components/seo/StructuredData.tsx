import { SITE } from "@/lib/site";

const FEATURES = [
  "Liquid glass clock",
  "Ambient weather with hourly forecast",
  "Configurable search engine",
  "Pinned link cards with favicons",
  "Drag and drop reordering",
  "App dock",
  "Custom backgrounds",
  "Local-only storage with JSON export",
];

/** schema.org data so search engines can describe the app in results. */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    alternateName: `${SITE.name} — ${SITE.tagline}`,
    url: SITE.url,
    description: SITE.description,
    applicationCategory: "BrowserApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    inLanguage: "en",
    featureList: FEATURES,
    softwareVersion: "1.0",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Person",
      name: SITE.author,
      url: `https://github.com/${SITE.author}`,
    },
    codeRepository: SITE.repository,
    license: "https://opensource.org/licenses/MIT",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
