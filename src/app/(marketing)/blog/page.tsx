import type { Metadata } from "next";
import Link from "next/link";
import { blogRegistry } from "@/data/blog-posts-registry";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { toCanonical } from "@/lib/canonical";

export const metadata: Metadata = buildMetadata({
  title: "Relationship Advice Blog | LoveCheck",
  description: "Read practical relationship advice on red flags, green flags, attachment styles, texting signals, and compatibility.",
  path: "/blog",
  keywords: ["relationship advice blog", "dating red flags", "attachment style", "compatibility advice"],
});

export default function BlogHubPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={collectionPageSchema("LoveCheck Blog", "/blog", "Relationship advice articles by LoveCheck")} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", item: toCanonical("/") },
        { name: "Blog", item: toCanonical("/blog") },
      ])} />

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">LoveCheck Blog</h1>
        <p className="max-w-3xl text-muted-foreground">
          Explore practical relationship articles on red flags, green flags, attachment, texting behavior, and compatibility.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {blogRegistry.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
            <h2 className="font-medium">{post.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
