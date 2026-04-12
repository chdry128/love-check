import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { HubTemplate } from "@/components/seo/HubTemplate";
import { toCanonical } from "@/lib/canonical";

const category = categories.find((c) => c.slug === "compatibility")!;

export const metadata: Metadata = buildMetadata({ title: category.title, description: category.description, path: "/compatibility" });

export default function CompatibilityHubPage() {
  return (
    <>
      <JsonLd data={collectionPageSchema(category.h1, "/compatibility", category.description)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", item: toCanonical("/") }, { name: "Compatibility", item: toCanonical("/compatibility") }])} />
      <HubTemplate h1={category.h1} intro={category.intro} categorySlug={category.slug} />
    </>
  );
}
