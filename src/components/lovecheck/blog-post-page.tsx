"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Markdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";
import { getBlogPost } from "@/data/blog-posts";
import { useLoveCheckStore } from "@/lib/store";
import { analytics } from "@/lib/analytics";
import { loadTool } from "@/lib/engine";
import type { ToolSlug } from "@/types";

// ── Category color map ─────────────────────────────────────

const categoryColors: Record<string, string> = {
  Insights: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Patterns: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Self-Awareness": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Safety: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Communication: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

// ── Component ──────────────────────────────────────────────

export function BlogPostPage() {
  const reduced = useReducedMotion();
  const blogPostSlug = useLoveCheckStore((s) => s.blogPostSlug);
  const goHome = useLoveCheckStore((s) => s.goHome);
  const openBlog = useLoveCheckStore((s) => s.openBlog);
  const startToolIntro = useLoveCheckStore((s) => s.startToolIntro);

  const post = blogPostSlug ? getBlogPost(blogPostSlug) : undefined;

  // Track analytics on mount
  useEffect(() => {
    if (blogPostSlug) {
      analytics.blogViewed(blogPostSlug);
    }
  }, [blogPostSlug]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Post not found.
        </p>
        <Button variant="ghost" onClick={goHome} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Button>
      </div>
    );
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" }
  );

  function handleToolClick(slug: ToolSlug) {
    try {
      const tool = loadTool(slug);
      if (tool.comingSoon) return;
      analytics.toolViewed(slug);
      startToolIntro(slug);
    } catch {
      // Tool not found
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Back button */}
      <motion.div
        initial={reduced ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Button>
      </motion.div>

      {/* Article */}
      <article>
        {/* Meta section */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
          className="mb-8 space-y-4"
        >
          <Badge
            variant="secondary"
            className={`text-[10px] font-semibold px-2.5 py-0.5 border-0 ${
              categoryColors[post.category] ?? "bg-muted text-muted-foreground"
            }`}
          >
            {post.category}
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {publishedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Markdown content */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.5, ease: "easeOut", delay: 0.1 }
          }
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-3 prose-ul:space-y-1.5
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary/30 prose-blockquote:text-muted-foreground
            [&_strong]:text-foreground
          "
        >
          <Markdown>{post.content}</Markdown>
        </motion.div>
      </article>

      {/* Divider */}
      <div className="h-px bg-border my-10" />

      {/* Related Tools */}
      {post.relatedTools.length > 0 && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.4, ease: "easeOut", delay: 0.2 }
          }
          className="mb-10"
        >
          <h2 className="text-lg font-semibold mb-4">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {post.relatedTools.map((slug) => {
              let toolName = slug
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              let isAvailable = false;

              try {
                const tool = loadTool(slug);
                isAvailable = !tool.comingSoon;
                toolName = tool.name;
              } catch {
                // Tool not registered
              }

              return (
                <Card
                  key={slug}
                  className={`transition-all duration-200 hover:shadow-sm ${
                    isAvailable
                      ? "cursor-pointer hover:-translate-y-0.5 hover:border-primary/30"
                      : "opacity-60 cursor-default"
                  }`}
                  onClick={() => isAvailable && handleToolClick(slug)}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{toolName}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {isAvailable
                          ? "Take this assessment"
                          : "Coming soon"}
                      </p>
                    </div>
                    {isAvailable && (
                      <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Back to Journal button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={goHome}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Journal
        </Button>
      </div>
    </div>
  );
}
