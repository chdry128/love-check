import { toCanonical, SITE_URL } from "@/lib/canonical";

type ListItem = { name: string; item: string };

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LoveCheck",
    url: SITE_URL,
    description:
      "LoveCheck offers free relationship quizzes, red flag checkers, texting tests, and compatibility tools.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/tools`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LoveCheck",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}

export function breadcrumbSchema(items: ListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function collectionPageSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: toCanonical(path),
    description,
  };
}

export function toolWebApplicationSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: toCanonical(path),
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description,
  };
}

export function faqSchema(faq: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: "LoveCheck Editorial Team",
    },
    publisher: {
      "@type": "Organization",
      name: "LoveCheck",
    },
    mainEntityOfPage: toCanonical(input.path),
  };
}
