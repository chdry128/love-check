import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toolRegistry, toolMap } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, toolWebApplicationSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ToolIntro } from "@/components/seo/ToolIntro";
import { ToolWidgetPlaceholder } from "@/components/seo/ToolWidgetPlaceholder";
import { HowItWorks } from "@/components/seo/HowItWorks";
import { ResultMeaning } from "@/components/seo/ResultMeaning";
import { FAQSection } from "@/components/seo/FAQSection";
import { RelatedTools } from "@/components/seo/RelatedTools";
import { RelatedArticles } from "@/components/seo/RelatedArticles";
import { toCanonical } from "@/lib/canonical";

export function generateStaticParams() {
  return toolRegistry.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = toolMap.get(params.slug);
  if (!tool) {
    return buildMetadata({
      title: "Tool Not Found | LoveCheck",
      description: "This LoveCheck tool page could not be found.",
      path: "/tools",
    });
  }

  return buildMetadata({
    title: tool.title,
    description: tool.metaDescription,
    path: `/${tool.slug}`,
    keywords: [tool.primaryKeyword, ...tool.secondaryKeywords, ...tool.synonyms, ...tool.searchAliases],
  });
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = toolMap.get(params.slug);
  if (!tool) notFound();

  const breadcrumbItems = [
    { label: "Home", href: toCanonical("/") },
    { label: "Tools", href: toCanonical("/tools") },
    { label: tool.primaryKeyword, href: toCanonical(`/${tool.slug}`) },
  ];

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={toolWebApplicationSchema(tool.primaryKeyword, `/${tool.slug}`, tool.metaDescription)} />
      <JsonLd data={faqSchema(tool.faq)} />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: tool.primaryKeyword, href: `/${tool.slug}` },
        ]}
      />

      <ToolIntro tool={tool} />

      <ToolWidgetPlaceholder tool={tool} />

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What is {tool.primaryKeyword}?</h2>
        <p className="text-muted-foreground">
          {tool.primaryKeyword} is a free {tool.intentType} that helps you evaluate relationship patterns with practical next steps. It is designed for clear self-reflection, not diagnosis.
        </p>
      </section>

      <HowItWorks title={tool.primaryKeyword} steps={tool.howItWorks} />

      <ResultMeaning title={tool.primaryKeyword} points={tool.resultMeaning} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common signs and patterns</h2>
        <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
          {tool.commonSigns.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
      </section>

      <FAQSection items={tool.faq} />

      <RelatedTools slugs={tool.relatedTools} />

      <RelatedArticles slugs={tool.relatedArticles} />

      <section className="space-y-3 rounded-xl border bg-muted/40 p-4">
        <h2 className="text-lg font-semibold">Important disclaimer</h2>
        <p className="text-sm text-muted-foreground">
          LoveCheck tools are for self-reflection, education, and entertainment. They are not a substitute for licensed therapy, mental health care, or emergency support.
        </p>
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        <Link href="/tools" className="rounded-lg border px-3 py-2 hover:bg-muted">All tools</Link>
        <Link href={`/${tool.category}`} className="rounded-lg border px-3 py-2 hover:bg-muted">More in {tool.category.replace(/-/g, " ")}</Link>
        <Link href="/blog" className="rounded-lg border px-3 py-2 hover:bg-muted">Relationship advice articles</Link>
      </section>
    </main>
  );
}
