"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  ClipboardList,
  Cpu,
  Lightbulb,
  Quote,
  History,
  Trash2,
  RotateCcw,
  HelpCircle,
  MessageCircle,
  Shield,
  Target,
  Wand2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolSlug, RiskLevel } from "@/types";
import {
  getHistory,
  clearHistory,
  type HistoryEntry,
} from "@/lib/history";
import {
  ComingSoonModal,
  type ComingSoonTool,
} from "@/components/lovecheck/coming-soon-modal";
import { toast } from "sonner";
import { useLoveCheckStore } from "@/lib/store";

// ── Reduced-motion aware animation helpers ──────────────────

// ── Risk level badge styling ───────────────────────────────

const riskLevelConfig: Record<
  RiskLevel,
  { label: string; className: string }
> = {
  low: {
    label: "Low Risk",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  moderate: {
    label: "Moderate",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  elevated: {
    label: "Elevated",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
  high: {
    label: "High Risk",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

// ── Past Results Section ────────────────────────────────────

const EMPTY_HISTORY: HistoryEntry[] = [];

function PastResultsSection({
  onStartTool,
}: {
  onStartTool: (slug: ToolSlug) => void;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window === "undefined") return EMPTY_HISTORY;
    try {
      const raw = localStorage.getItem("lovecheck-history") ?? "";
      return raw ? JSON.parse(raw).slice(0, 3) : EMPTY_HISTORY;
    } catch {
      return EMPTY_HISTORY;
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("lovecheck-history") ?? "";
        setHistory(raw ? JSON.parse(raw).slice(0, 3) : EMPTY_HISTORY);
      } catch {
        setHistory(EMPTY_HISTORY);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handleClear = useCallback(() => {
    clearHistory();
    setHistory(EMPTY_HISTORY);
  }, []);

  if (history.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
      <AnimatedSection>
        <div className="rounded-xl border bg-card p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Your Past Results</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-destructive gap-1.5 h-8 px-2.5"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </Button>
          </div>

          {/* Result list */}
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            {history.map((entry, idx) => {
              const risk = entry.result.dominantPattern?.riskLevel ?? "low";
              const config = riskLevelConfig[risk];
              const patternName = entry.result.dominantPattern?.name ?? "Unknown Pattern";

              return (
                <div
                  key={`${entry.savedAt}-${idx}`}
                  className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3 transition-all duration-200 hover:bg-muted/40"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">
                        {patternName}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          config.className
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(entry.savedAt)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStartTool(entry.toolSlug as ToolSlug)}
                    className="shrink-0 gap-1.5 text-xs h-8"
                  >
                    <RotateCcw className="h-3 w-3" />
                    View Again
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

// ── Reduced-motion aware animation helpers ──────────────────

function fadeUpVariants(reduced: boolean) {
  return {
    hidden: reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
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
      : { transition: { staggerChildren: 0.1 } },
  };
}

function staggerChildVariants(reduced: boolean) {
  return {
    hidden: reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16 },
    visible: reduced
      ? { opacity: 1, y: 0, transition: { duration: 0 } }
      : { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };
}

function sectionTransition(reduced: boolean) {
  return reduced
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] };
}

// ── Animated Section wrapper ────────────────────────────────

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUpVariants(reduced)}
      transition={sectionTransition(reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Grid wrapper (for staggered children) ──────────

function AnimatedGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainerVariants(reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedGridItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div variants={staggerChildVariants(reduced)} className={className}>
      {children}
    </motion.div>
  );
}

// ── Data ────────────────────────────────────────────────────

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
    comingSoon: false,
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
    time: "3–5 min",
    comingSoon: false,
  },
  {
    slug: "texting-energy-match" as ToolSlug,
    name: "Texting Energy Match",
    tagline: "Is your texting vibe actually aligned — or is one person doing all the work?",
    icon: MessageCircle,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "hover:border-teal-200 dark:hover:border-teal-800",
    category: "Communication",
    time: "3–5 min",
    comingSoon: false,
  },
  {
    slug: "love-bombing-detector" as ToolSlug,
    name: "Love Bombing Detector",
    tagline: "Distinguish genuine enthusiasm from intensity that becomes control.",
    icon: Shield,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "hover:border-orange-200 dark:hover:border-orange-800",
    category: "Safety",
    time: "3–5 min",
    comingSoon: false,
  },
  {
    slug: "future-alignment-checker" as ToolSlug,
    name: "Future Alignment Checker",
    tagline: "Are your values, timelines, and visions actually pointing in the same direction?",
    icon: Target,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
    category: "Compatibility",
    time: "3–5 min",
    comingSoon: false,
  },
  {
    slug: "flirty-reply-coach" as ToolSlug,
    name: "Flirty Reply Coach",
    tagline: "Craft the perfect reply — playful, confident, and authentically you.",
    icon: Wand2,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "hover:border-pink-200 dark:hover:border-pink-800",
    category: "Communication",
    time: "2–3 min",
    comingSoon: false,
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
    time: "4–6 min",
    comingSoon: false,
  },
  {
    slug: "red-flag-scanner" as ToolSlug,
    name: "Red Flag Scanner",
    tagline: "A quiet, honest look at the warning signs you might be overlooking.",
    icon: ShieldAlert,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "hover:border-red-200 dark:hover:border-red-800",
    category: "Safety",
    time: "4–6 min",
    comingSoon: false,
  },
];

const faqItems = [
  {
    question: "Is LoveCheck a therapy tool?",
    answer:
      "No. LoveCheck identifies relationship patterns — not diagnoses. It's designed as a self-reflection tool, not a substitute for professional therapy, counseling, or medical advice.",
  },
  {
    question: "Do you store my answers?",
    answer:
      "No. Your answers stay entirely in your browser and are never sent to our servers. When you close the tab, they're gone. We don't use cookies, tracking pixels, or analytics.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Our engine uses pattern detection with weighted signals and confidence scoring. Results are most reliable when you answer honestly and thoughtfully. The confidence level shown indicates how strongly the detected pattern matches your answers.",
  },
  {
    question: "Can I retake the assessment?",
    answer:
      "Yes! Every time you start a new session, you begin fresh. We encourage retaking it periodically as your relationship evolves — you may notice different patterns over time.",
  },
  {
    question: 'What does \"adaptive\" mean?',
    answer:
      "Our questions adapt based on your situation. The first routing question determines which branch of questions you'll see, so everyone's experience is unique.",
  },
  {
    question: "Is this based on real research?",
    answer:
      "Yes. Our pattern detection engine draws on established frameworks from attachment theory, couples therapy research, and relationship science. However, it's designed for self-reflection — not clinical assessment.",
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
    name: "Stonewall Cycle",
    description:
      "When one person withdraws and the other pursues, creating a painful and exhausting loop.",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
  {
    name: "Breadcrumbing Risk",
    description:
      "When someone sends just enough attention to keep you hooked — without real investment.",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  },
  {
    name: "Low-Clarity Connection",
    description:
      "When direction and expectations remain ambiguous, making it hard to feel secure.",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-300",
  },
  {
    name: "Communication Withdrawal",
    description:
      "When important conversations get progressively avoided, eroding connection over time.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    name: "Fast Intensity Risk",
    description:
      "When early intensity accelerates too quickly — making it hard to see clearly.",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Answer Questions",
    description:
      "Honest, thoughtful questions that adapt to your situation — no right or wrong answers, just your truth.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Engine Analyzes Patterns",
    description:
      "Our pattern engine cross-references your answers against researched relationship dynamics in real time.",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Get Your Insights",
    description:
      "Receive a clear, compassionate breakdown of the patterns at play — with suggestions, not prescriptions.",
  },
];

const testimonials = [
  {
    quote:
      "It helped me see things I was actively avoiding. Not in a harsh way — more like a gentle mirror. I finally understood why I kept repeating the same cycle.",
    initials: "A",
    label: "Someone rebuilding after a difficult relationship",
  },
  {
    quote:
      "I went in skeptical but came out with real clarity. The questions were surprisingly deep — it felt like talking to someone who actually gets it.",
    initials: "J",
    label: "Someone navigating early-stage uncertainty",
  },
  {
    quote:
      "This didn't tell me what to do. It showed me what was actually happening. And honestly, that's exactly what I needed to hear.",
    initials: "M",
    label: "Someone questioning long-term compatibility",
  },
];

const blogPreviews = [
  {
    slug: "why-most-relationship-advice-fails",
    title: "Why Most Relationship Advice Fails (And What Works Instead)",
    excerpt:
      "Generic advice doesn't account for the unique patterns at play in your connection. Here's why pattern-based understanding changes everything.",
    tag: "Insights",
  },
  {
    slug: "love-bombing-vs-real-enthusiasm",
    title: "Love Bombing vs Real Enthusiasm: How to Tell the Difference",
    excerpt:
      "Both feel intense at first. But one fades into consistency, the other fades into control. Learn the signs.",
    tag: "Safety",
  },
  {
    slug: "how-to-read-texting-dynamic",
    title: "How to Read Your Texting Dynamic (Without Overthinking It)",
    excerpt:
      "Your texts say more than you think — but probably less than you fear. Here's how to read the real signals.",
    tag: "Communication",
  },
];

// ── Component ───────────────────────────────────────────────

const toolCategories = ["All", "Self-Reflection", "Self-Discovery", "Communication", "Compatibility", "Safety"] as const;

type ToolCategory = (typeof toolCategories)[number];

export function Homepage({ onStartTool }: HomepageProps) {
  const [comingSoonTool, setComingSoonTool] = useState<ComingSoonTool | null>(null);
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("All");
  const openBlog = useLoveCheckStore((s) => s.openBlog);
  const setView = useLoveCheckStore((s) => s.setView);

  const filteredTools = activeCategory === "All"
    ? tools
    : tools.filter((t) => t.category === activeCategory);

  function handleToolClick(tool: (typeof tools)[number]) {
    if (tool.comingSoon) {
      toast("Coming soon!", {
        description: `We're building ${tool.name} with care.`,
      });
      setComingSoonTool({
        slug: tool.slug,
        name: tool.name,
        icon: tool.icon,
        color: tool.color,
        bgColor: tool.bgColor,
        description: tool.comingSoonDescription ?? "explore another dimension of your relationships",
      });
    } else {
      onStartTool(tool.slug);
    }
  }

  return (
    <div>
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/60 via-transparent to-transparent dark:from-rose-950/20 dark:via-transparent dark:to-transparent" />
        <div className="absolute inset-0 bg-grain" />

        {/* Decorative floating gradient orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-900/20"
          style={{ animation: "orbFloat1 8s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-1/4 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl dark:bg-amber-900/15"
          style={{ animation: "orbFloat2 10s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 left-1/2 h-40 w-40 rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-900/10"
          style={{ animation: "orbFloat3 12s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24 sm:pb-16">
          <AnimatedSection>
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
          </AnimatedSection>
        </div>
      </section>

      {/* ── Featured Tool ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          {/* Gradient border wrapper */}
          <div className="rounded-xl bg-gradient-to-r from-rose-300/50 via-pink-300/40 to-rose-200/50 p-[1.5px] dark:from-rose-700/40 dark:via-pink-700/30 dark:to-rose-600/40">
            <Card className="border-0 bg-gradient-to-br from-rose-50/90 to-background overflow-hidden dark:from-rose-950/30 dark:to-background rounded-[10px]">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40">
                    <Radar className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h2 className="text-xl font-bold">Relationship Risk Radar</h2>
                      <span className="relative inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        {/* Pulsing dot */}
                        <span className="absolute -top-px -left-px flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="ml-2.5">Available Now</span>
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
        </AnimatedSection>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold">How It Works</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Three simple steps to understanding your relationship patterns.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedGrid className="relative grid gap-6 sm:grid-cols-3">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-[52px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent sm:block"
          />

          {howItWorksSteps.map((step) => {
            const StepIcon = step.icon;
            return (
              <AnimatedGridItem key={step.number}>
                <div className="relative text-center space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 ring-1 ring-primary/10">
                    <StepIcon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    Step {step.number}
                  </span>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              </AnimatedGridItem>
            );
          })}
        </AnimatedGrid>
      </section>

      {/* ── All Tools Grid ───────────────────────────────── */}
      <section id="tools" className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">All Tools</h2>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              9 active
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Each tool focuses on a different dimension of your relationships.
          </p>
        </AnimatedSection>

        {/* Category filter tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {toolCategories.map((cat) => {
            const count = cat === "All" ? tools.length : tools.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat}
                <span className={cn(
                  "ml-1.5 text-[10px]",
                  activeCategory === cat ? "text-primary-foreground/70" : "text-muted-foreground/50"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatedGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <AnimatedGridItem key={tool.slug}>
                <Card
                  className={cn(
                    "group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                    tool.borderColor
                  )}
                  onClick={() => handleToolClick(tool)}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                          tool.bgColor
                        )}
                      >
                        <Icon className={cn("h-5 w-5", tool.color)} />
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
              </AnimatedGridItem>
            );
          })}
        </AnimatedGrid>
      </section>

      {/* ── Value Proposition ────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <h2 className="text-xl font-bold">Why LoveCheck is different</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Not a quiz. Not therapy. Just honest pattern recognition.
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid gap-4 sm:grid-cols-2">
          {valueProps.map((prop) => {
            const Icon = prop.icon;
            return (
              <AnimatedGridItem key={prop.title}>
                <div className="rounded-xl border bg-card p-5 transition-all duration-200 hover:shadow-sm">
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
              </AnimatedGridItem>
            );
          })}
        </AnimatedGrid>
      </section>

      {/* ── Pattern Examples ─────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6">
          <h2 className="text-xl font-bold">Patterns we identify</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Our engine looks for recurring relationship dynamics — not labels.
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid gap-3 sm:grid-cols-2">
          {patternExamples.map((p) => (
            <AnimatedGridItem key={p.name}>
              <div className="rounded-xl border bg-card p-4 sm:p-5 transition-all duration-200 hover:shadow-sm">
                <span
                  className={cn(
                    "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold mb-2",
                    p.color
                  )}
                >
                  {p.name}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </div>
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </section>

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <h2 className="text-xl font-bold">What people are saying</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real reflections from people who used LoveCheck to see more clearly.
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <AnimatedGridItem key={t.initials}>
              <div className="group relative rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-md overflow-hidden">
                {/* Subtle background pattern */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative space-y-3">
                  <Quote className="h-5 w-5 text-primary/20" />
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {t.initials}
                    </div>
                    <span className="text-[11px] text-muted-foreground/70">
                      {t.label}
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-rose-500" />
            <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Honest answers to the things people wonder about.
          </p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="rounded-xl border bg-card p-2 sm:p-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  className="px-3 sm:px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Blog Preview ─────────────────────────────────── */}
      <section id="journal" className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6">
          <h2
            className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
            onClick={() => setView("blog")}
          >
            From the Journal
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Perspectives on patterns, growth, and making sense of connections.
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid gap-4 sm:grid-cols-3">
          {blogPreviews.map((post) => (
            <AnimatedGridItem key={post.slug}>
              <div
                className="group relative rounded-xl border bg-card overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                onClick={() => openBlog(post.slug)}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/0 to-primary/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative h-2 bg-gradient-to-r from-primary/20 to-primary/5 transition-all duration-300 group-hover:from-primary/40 group-hover:to-primary/15" />
                <div className="relative p-4 space-y-2">
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
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </section>

      {/* ── Past Results History ──────────────────────── */}
      <PastResultsSection onStartTool={onStartTool} />

      {/* ── Coming Soon Modal ──────────────────────────── */}
      <ComingSoonModal
        tool={comingSoonTool}
        open={comingSoonTool !== null}
        onOpenChange={(open) => {
          if (!open) setComingSoonTool(null);
        }}
      />

      {/* ── Orb Float Keyframes (via style tag) ─────────── */}
      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping {
            animation: none;
          }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 10px) scale(0.97); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 15px) scale(0.96); }
          66% { transform: translate(20px, -10px) scale(1.04); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, 20px) scale(1.03); }
          66% { transform: translate(-20px, -15px) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
