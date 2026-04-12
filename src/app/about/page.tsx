import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About LoveCheck | Relationship Tools & Quizzes",
  description: "Learn about LoveCheck, our relationship tool mission, and our approach to educational, privacy-first self-reflection resources.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About LoveCheck</h1>
      <p className="text-muted-foreground">
        LoveCheck is a traffic-first, SEO-first relationship platform offering free quizzes, checkers, and compatibility tools for modern dating and relationships.
      </p>
      <p className="text-muted-foreground">
        Our tools are designed for self-reflection, education, and practical communication guidance. We prioritize clear language, privacy, and useful insight.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/tools" className="rounded-lg border px-3 py-2 hover:bg-muted">Browse tools</Link>
        <Link href="/blog" className="rounded-lg border px-3 py-2 hover:bg-muted">Read articles</Link>
      </div>
    </main>
  );
}
