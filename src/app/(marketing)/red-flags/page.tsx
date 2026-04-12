import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { HubTemplate } from "@/components/seo/HubTemplate";
import { toCanonical } from "@/lib/canonical";

const category = categories.find((c) => c.slug === "red-flags")!;

export const metadata: Metadata = buildMetadata({ title: category.title, description: category.description, path: "/red-flags" });

export default function RedFlagsHubPage() {
  return (
    <>
      <JsonLd data={collectionPageSchema(category.h1, "/red-flags", category.description)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", item: toCanonical("/") }, { name: "Red Flags", item: toCanonical("/red-flags") }])} />
      <HubTemplate h1={category.h1} intro={category.intro} categorySlug={category.slug} />
    </>
  );
}
