"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { useLoveCheckStore } from "@/lib/store";
import { analytics } from "@/lib/analytics";

// ── Animation helpers ──────────────────────────────────────

function fadeUpVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0 },
  };
}

function staggerContainerVariants(reduced: boolean) {
  return {
    hidden: {},
    visible: reduced
      ? { transition: { staggerChildren: 0 } }
      : { transition: { staggerChildren: 0.08 } },
  };
}

function staggerChildVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: reduced
      ? { opacity: 1, y: 0, transition: { duration: 0 } }
      : { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
}

// ── Category color map ─────────────────────────────────────

const categoryColors: Record<string, string> = {
  Insights: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Patterns: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Self-Awareness": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Safety: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Communication: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

// ── Component ──────────────────────────────────────────────

export function BlogPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduced = !!useReducedMotion();
  const openBlog = useLoveCheckStore((s) => s.openBlog);
  const goHome = useLoveCheckStore((s) => s.goHome);

  function handleCardClick(slug: string) {
    analytics.blogViewed(slug);
    openBlog(slug);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={goHome}
        className="mb-8 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {/* Header */}
      <div className="mb-10 sm:mb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants(reduced)}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-2 block">
            Journal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From the Journal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
            Perspectives on patterns, growth, and making sense of connections.
            Honest, warm, and actually useful.
          </p>
        </motion.div>
      </div>

      {/* Blog grid */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainerVariants(reduced)}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {blogPosts.map((post) => (
          <motion.div key={post.slug} variants={staggerChildVariants(reduced)}>
            <Card
              className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden h-full"
              onClick={() => handleCardClick(post.slug)}
            >
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-primary/30 to-primary/10 transition-all duration-300 group-hover:from-primary/50 group-hover:to-primary/20" />

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

              <CardContent className="relative p-5 flex flex-col h-full gap-3">
                {/* Category + Read time */}
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] font-semibold px-2 py-0.5 border-0 ${
                      categoryColors[post.category] ?? "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-sm sm:text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {/* Related tool + read more */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  {post.relatedTools.length > 0 && (
                    <span className="text-[10px] font-medium text-primary/70 bg-primary/5 px-2 py-0.5 rounded-full">
                      Uses: {post.relatedTools.map((t) => t.split("-").slice(0, 2).join(" ")).join(", ")}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    Read
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
