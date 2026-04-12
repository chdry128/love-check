import Link from "next/link";
import { toolMap } from "@/data/tools";

export function RelatedTools({ slugs }: { slugs: string[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Related tools</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {slugs.map((slug) => {
          const tool = toolMap.get(slug);
          if (!tool) return null;
          return (
            <Link key={slug} href={`/${slug}`} className="rounded-xl border bg-card p-4 hover:border-primary/50">
              <h3 className="font-medium">{tool.seoName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.shortDescription}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
