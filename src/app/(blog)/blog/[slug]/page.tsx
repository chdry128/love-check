import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogRegistry } from "@/data/blog-posts-registry";
import { toolMap } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { toCanonical } from "@/lib/canonical";

const blogMap = new Map(blogRegistry.map((post) => [post.slug, post]));

export function generateStaticParams() {
  return blogRegistry.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = blogMap.get(params.slug);
  if (!post) {
    return buildMetadata({ title: "Post Not Found | LoveCheck", description: "The requested article was not found.", path: "/blog" });
  }
  return buildMetadata({
    title: `${post.title} | LoveCheck`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogMap.get(params.slug);
  if (!post) notFound();

  const relatedTools = post.relatedTools.map((slug) => toolMap.get(slug)).filter(Boolean);

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={articleSchema({ title: post.title, description: post.description, path: `/blog/${post.slug}`, datePublished: post.lastUpdated })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", item: toCanonical("/") },
        { name: "Blog", item: toCanonical("/blog") },
        { name: post.title, item: toCanonical(`/blog/${post.slug}`) },
      ])} />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title, href: `/blog/${post.slug}` }]} />

      <article className="space-y-5">
        <header className="space-y-3">
          <div className="ad-banner">
            <a href="https://www.profitablecpmratenetwork.com/u1giby0jw?key=470e1e7d6942888dff155b3a7b564cc7" target="_blank" rel="noopener noreferrer">
              <img src="/path-to-ad-image.jpg" alt="Advertisement" />
            </a>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
          <p className="text-muted-foreground">{post.intro}</p>
          <p className="text-xs text-muted-foreground">Last updated: {post.lastUpdated} • Reviewed by LoveCheck Editorial Team</p>
        </header>

        <section className="space-y-3 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">What this means in real life</h2>
          <p>
            {post.title} is best understood through repeated behavior patterns, not single moments. Use this guide with context, boundaries, and practical communication.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">How to apply this advice</h2>
          <p>
            Focus on consistency over intensity. Track whether behavior improves after honest conversations and clear boundaries.
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Next steps</h2>
          <p>
            Pair this article with one of the related tools below to get personalized insight from your own relationship context.
          </p>
        </section>
      </article>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Related tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {relatedTools.map((tool) => (
            <Link key={tool!.slug} href={`/${tool!.slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
              <h3 className="font-medium">{tool!.seoName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool!.shortDescription}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
