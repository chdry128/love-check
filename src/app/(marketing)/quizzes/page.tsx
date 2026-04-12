import type { Metadata } from "next";
import { categories } from "@/data/categories";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { HubTemplate } from "@/components/seo/HubTemplate";
import { toCanonical } from "@/lib/canonical";

const category = categories.find((c) => c.slug === "quizzes")!;

export const metadata: Metadata = buildMetadata({ title: category.title, description: category.description, path: "/quizzes" });

export default function QuizzesHubPage() {
  return (
    <>
      <JsonLd data={collectionPageSchema(category.h1, "/quizzes", category.description)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", item: toCanonical("/") }, { name: "Quizzes", item: toCanonical("/quizzes") }])} />
      <HubTemplate h1={category.h1} intro={category.intro} categorySlug={category.slug} />
    </>
  );
}
