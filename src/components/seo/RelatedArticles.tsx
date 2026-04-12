import Link from "next/link";
import { blogRegistry } from "@/data/blog-posts-registry";

const blogMap = new Map(blogRegistry.map((post) => [post.slug, post]));

export function RelatedArticles({ slugs }: { slugs: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Related articles</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {slugs.map((slug) => {
          const article = blogMap.get(slug);
          if (!article) return null;
          return (
            <Link key={slug} href={`/blog/${slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
              <h3 className="font-medium">{article.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{article.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
