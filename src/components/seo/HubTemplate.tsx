import Link from "next/link";
import { toolRegistry } from "@/data/tools";
import { blogRegistry } from "@/data/blog-posts-registry";

type HubTemplateProps = {
  h1: string;
  intro: string;
  categorySlug: string;
  includeBlog?: boolean;
};

export function HubTemplate({ h1, intro, categorySlug, includeBlog = true }: HubTemplateProps) {
  const tools = categorySlug === "tools"
    ? toolRegistry
    : toolRegistry.filter((tool) => tool.category === categorySlug || (categorySlug === "relationship-tests" && tool.category === "relationship-tests") || (categorySlug === "quizzes" && tool.intentType === "quiz"));

  const posts = includeBlog
    ? blogRegistry.filter((post) =>
        categorySlug === "tools" ? true :
          categorySlug === "blog" ? true :
          post.category === categorySlug.replace("relationship-tests", "dating")
      ).slice(0, 8)
    : [];

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
        <p className="max-w-3xl text-muted-foreground">{intro}</p>
      </section>

      {tools.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Featured tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/${tool.slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
                <h3 className="font-medium">{tool.seoName}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Related articles</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
                <h3 className="font-medium">{post.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
