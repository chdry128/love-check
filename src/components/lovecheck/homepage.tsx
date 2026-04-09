"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Radar,
  Heart,
  MessagesSquare,
  Compass,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Eye,
  Brain,
  Lock,
  Zap,
} from "lucide-react";
import type { ToolSlug } from "@/types";

interface HomepageProps {
  onStartTool: (slug: ToolSlug) => void;
}

const tools = [
  {
    slug: "relationship-risk-radar" as ToolSlug,
    name: "Relationship Risk Radar",
    tagline: "See your relationship patterns clearly — without judgment.",
    icon: Radar,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "hover:border-rose-200 dark:hover:border-rose-800",
    category: "Self-Reflection",
    time: "3–5 min",
    comingSoon: false,
  },
  {
    slug: "attachment-style-lens" as ToolSlug,
    name: "Attachment Style Lens",
    tagline: "Understand your emotional patterns — and how they shape love.",
    icon: Heart,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "hover:border-violet-200 dark:hover:border-violet-800",
    category: "Self-Discovery",
    time: "5–8 min",
    comingSoon: true,
  },
  {
    slug: "communication-pattern-check" as ToolSlug,
    name: "Communication Pattern Check",
    tagline: "Decode the way you and your partner actually talk.",
    icon: MessagesSquare,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "hover:border-amber-200 dark:hover:border-amber-800",
    category: "Communication",
    time: "4–6 min",
    comingSoon: true,
  },
  {
    slug: "compatibility-compass" as ToolSlug,
    name: "Compatibility Compass",
    tagline: "Find out if your values, goals, and rhythms actually align.",
    icon: Compass,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
    category: "Compatibility",
    time: "6–10 min",
    comingSoon: true,
  },
  {
    slug: "red-flag-scanner" as ToolSlug,
    name: "Red Flag Scanner",
    tagline: "A quiet, honest look at the warning signs you might be overlooking.",
    icon: ShieldAlert,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "hover:border-orange-200 dark:hover:border-orange-800",
    category: "Safety",
    time: "4–6 min",
    comingSoon: true,
  },
];

const valueProps = [
  {
    icon: Brain,
    title: "Pattern Intelligence",
    description:
      "Go beyond gut feelings. Our adaptive engine identifies relationship patterns backed by research — not guesswork.",
  },
  {
    icon: Eye,
    title: "Private by Design",
    description:
      "No accounts, no tracking, no data storage. Your answers stay in your browser and disappear when you close the tab.",
  },
  {
    icon: Lock,
    title: "Non-Clinical & Safe",
    description:
      "We identify patterns, not disorders. No clinical language, no diagnoses — just honest, compassionate insights.",
  },
  {
    icon: Zap,
    title: "Adaptive & Personal",
    description:
      "Questions adapt based on your answers. Everyone's path is different — because every relationship is different.",
  },
];

const patternExamples = [
  {
    name: "Hot & Cold Loop",
    description:
      "When closeness and distance alternate unpredictably, creating chronic uncertainty.",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    name: "Overgiver Dynamic",
    description:
      "When one person consistently carries more emotional weight than feels sustainable.",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    name: "Low-Clarity Connection",
    description:
      "When direction and expectations remain ambiguous, making it hard to feel secure.",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-300",
  },
  {
    name: "Strong Chemistry, Weak Structure",
    description:
      "When the sparks are real but the day-to-day reliability doesn't match.",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  },
];

const blogPreviews = [
  {
    title: "Why Most Relationship Advice Fails (And What Works Instead)",
    excerpt:
      "Generic advice doesn't account for the unique patterns at play in your connection. Here's why pattern-based understanding changes everything.",
    tag: "Insights",
  },
  {
    title: "5 Signs Your Relationship Has Repair Potential",
    excerpt:
      "Not every struggle means it's over. These five signs suggest there's genuine foundation to build on — even when things feel uneven.",
    tag: "Patterns",
  },
  {
    title: "The Difference Between Healthy Effort and Overgiving",
    excerpt:
      "Generosity is beautiful — until it becomes a pattern of self-abandonment. Learn to recognize where care ends and over-functioning begins.",
    tag: "Self-Awareness",
  },
];

export function Homepage({ onStartTool }: HomepageProps) {
  return (
    <div className="fade-in">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/60 via-transparent to-transparent dark:from-rose-950/20 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-grain" />
        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 sm:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Relationship Intelligence Platform
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              See your relationship{" "}
              <span className="text-gradient-warm">patterns</span> clearly
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Answer a few honest questions and our adaptive engine maps out the
              patterns at play — without judgment, without clinical language, just
              clarity.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="gap-2 px-8 text-base rounded-xl h-12"
                onClick={() => onStartTool("relationship-risk-radar")}
              >
                <Radar className="h-4 w-4" />
                Try Risk Radar — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                3–5 min &middot; No account needed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Tool ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="slide-up">
          <Card className="border-rose-200/60 bg-gradient-to-br from-rose-50/80 to-background overflow-hidden dark:from-rose-950/20 dark:to-background dark:border-rose-800/40">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40">
                  <Radar className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h2 className="text-xl font-bold">Relationship Risk Radar</h2>
                    <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      Available Now
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                    Our flagship tool adapts to your situation with smart routing
                    questions. Whether you&apos;re starting something new, reflecting on
                    the past, or trying to understand where things stand — the
                    Risk Radar meets you where you are.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      className="gap-2 rounded-lg"
                      onClick={() => onStartTool("relationship-risk-radar")}
                    >
                      Start Now
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      6–8 questions &middot; ~3–5 min
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── All Tools Grid ───────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold">All Tools</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Each tool focuses on a different dimension of your relationships.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.slug}
                className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${tool.borderColor}`}
                onClick={() => {
                  if (!tool.comingSoon) onStartTool(tool.slug);
                }}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tool.bgColor}`}
                    >
                      <Icon className={`h-5 w-5 ${tool.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold truncate">
                          {tool.name}
                        </h3>
                        {tool.comingSoon && (
                          <span className="shrink-0 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {tool.tagline}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{tool.category}</span>
                        <span>&middot;</span>
                        <span>{tool.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Value Proposition ────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">Why LoveCheck is different</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Not a quiz. Not therapy. Just honest pattern recognition.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.title}
                className="rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                    <Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{prop.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pattern Examples ─────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Patterns we identify</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Our engine looks for recurring relationship dynamics — not labels.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {patternExamples.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border bg-card p-4 sm:p-5 transition-all duration-200 hover:shadow-sm"
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold mb-2 ${p.color}`}
              >
                {p.name}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Blog Preview ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold">From the Journal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Perspectives on patterns, growth, and making sense of connections.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {blogPreviews.map((post) => (
            <div
              key={post.title}
              className="group rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-sm cursor-pointer"
            >
              <div className="h-2 bg-gradient-to-r from-primary/20 to-primary/5" />
              <div className="p-4 space-y-2">
                <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {post.tag}
                </span>
                <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
