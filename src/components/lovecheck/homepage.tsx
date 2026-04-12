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
  ShieldCheck,
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
import { MoodCheckin } from "@/components/lovecheck/mood-checkin";
import { DailyTip } from "@/components/lovecheck/daily-tip";
import { LoveLanguageQuiz } from "@/components/lovecheck/love-language-quiz";
import { FloatingHearts } from "@/components/lovecheck/floating-hearts";
import { SocialProof } from "@/components/lovecheck/social-proof";
import { WelcomeBanner } from "@/components/lovecheck/welcome-banner";
import { IcebreakerGenerator } from "@/components/lovecheck/icebreaker-generator";
import { WellnessScore } from "@/components/lovecheck/wellness-score";

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
      : { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };
}

function sectionTransition(reduced: boolean) {
  return reduced
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const };
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
  const reduced = !!useReducedMotion();

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
  const reduced = !!useReducedMotion();

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
  const reduced = !!useReducedMotion();
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
    name: "Check Your Relationship Health",
    tagline: "Quick quiz to see if your relationship is healthy or has problems.",
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
    name: "What's Your Love Style",
    tagline: "Find out how you act in relationships and what you need from your partner.",
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
    name: "How Do You Talk Together",
    tagline: "See how you and your partner talk to each other and if it's working.",
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
    name: "Do Your Texts Match",
    tagline: "Check if you both text the same way or if one person is doing all the work.",
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
    name: "Is It Real Love Or Fake",
    tagline: "Tell the difference between real love and when someone is being too intense.",
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
    name: "Do You Want The Same Future",
    tagline: "Find out if you both want the same things in life and have the same goals.",
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
    name: "Perfect Reply Writer",
    tagline: "Get help writing the perfect text message to send back to your crush.",
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
    name: "Are You Two Compatible",
    tagline: "See if you and your partner actually match well together.",
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
    name: "Spot Red Flags in Dating",
    tagline: "Learn the warning signs of a bad relationship before you get hurt.",
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
    question: "Is this like a real therapy?",
    answer:
      "No. This is just a quiz to help you think about your relationship. It's not therapy and can't replace talking to a real therapist if you need one.",
  },
  {
    question: "Do you save my answers?",
    answer:
      "No. Everything stays on your phone or computer. We don't save anything or sell your info. When you close the tab, your answers are gone.",
  },
  {
    question: "How correct are the results?",
    answer:
      "The results are pretty accurate if you answer honestly. The more honest you are, the better the results. Think of it as like a mirror for your relationship.",
  },
  {
    question: "Can I take the quiz again?",
    answer:
      "Yes! You can take any quiz as many times as you want. Your answers might change over time as your relationship changes.",
  },
  {
    question: "Why are the questions different for me?",
    answer:
      "The quiz changes based on your answers. So your quiz might be different from your friend's quiz. That's on purpose!",
  },
  {
    question: "Is this based on real science?",
    answer:
      "Yes! But it's not a medical test. We used real research, but this quiz is just to help you understand your relationship better, not to diagnose anything.",
  },
];


const valueProps = [
  {
    icon: Brain,
    title: "Get Real Answers",
    description:
      "No guess work. Our quizzes are based on real research about relationships.",
  },
  {
    icon: Eye,
    title: "100% Private",
    description:
      "We never save your answers. Everything stays on your phone or computer. No trackers.",
  },
  {
    icon: Lock,
    title: "Not Therapy",
    description:
      "This is a quiz, not medical advice. It helps you understand your relationship better.",
  },
  {
    icon: Zap,
    title: "Your Own Quiz",
    description:
      "The questions change based on your answers. So your quiz is unique to you.",
  },
];

const patternExamples = [
  {
    name: "Hot & Cold",
    description:
      "One moment they're really into you, the next moment they text back late. Super confusing.",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    name: "One Person Tries Harder",
    description:
      "You're the one always asking them out or texting first. They never put in the effort.",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
  {
    name: "Just Enough Attention",
    description:
      "They text just enough to keep you interested but never actually commit to you.",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  },
  {
    name: "Nobody Knows What's Going On",
    description:
      "Neither of you know if this is serious or casual. The future is really unclear.",
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800/30 dark:text-slate-300",
  },
  {
    name: "You Don't Talk About Real Stuff",
    description:
      "You avoid talking about important things and never have real conversations.",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    name: "Too Much Too Fast",
    description:
      "Everything moves super fast at first, making it hard to think clearly.",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
];

const howItWorksSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Answer Questions",
    description:
      "Just be honest. Answer simple questions about your relationship. No right or wrong answers.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "We Check Your Answers",
    description:
      "Our quiz looks at your answers and matches them with patterns from real relationships.",
  },
  {
    number: "03",
    icon: Lightbulb,
    title: "Get Your Results",
    description:
      "Find out what's really going on in your relationship. Get honest, simple advice.",
  },
];

const testimonials = [
  {
    quote:
      "This helped me see things I was ignoring. Not mean about it, just real. I finally get why the same things keep happening to me.",
    initials: "A",
    label: "Person working through a past relationship",
  },
  {
    quote:
      "I went in thinking it was just a dumb quiz. But the questions were actually deep and the answers made sense. Felt like talking to someone who gets it.",
    initials: "J",
    label: "Someone figuring out if they like their crush",
  },
  {
    quote:
      "It didn't tell me what to do. It just showed me what's actually happening. That's exactly what I needed.",
    initials: "M",
    label: "Person wondering if their relationship will last",
  },
];

const blogPreviews = [
  {
    slug: "why-most-relationship-advice-fails",
    title: "Why Bad Relationship Advice Doesn't Work",
    excerpt:
      "Most advice is too general. Real help needs to look at YOUR relationship and what's actually happening.",
    tag: "Tips",
  },
  {
    slug: "love-bombing-vs-real-enthusiasm",
    title: "Love Bombing vs Real Love – How to Tell The Difference",
    excerpt:
      "Love bombing feels amazing at first, but it changes later. Here's how to spot it before you get hurt.",
    tag: "Safety",
  },
  {
    slug: "how-to-read-texting-dynamic",
    title: "What Your Texts Say About Your Relationship",
    excerpt:
      "Your texting style tells you a lot about your relationship. Here's what to look for.",
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
        description: "explore another dimension of your relationships",
      });
    } else {
      onStartTool(tool.slug);
    }
  }

  return (
    <div>
      {/* ── Welcome Banner ─────────────────────────────── */}
      <WelcomeBanner onStartTool={onStartTool} />

      {/* ── Hero Section (Simplified for mobile) ──────────────────────────────── */}
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

        {/* Floating hearts background */}
        <FloatingHearts intensity="medium" />

        <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16 sm:pb-12">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center">
              {/* Animated ECG Heartbeat Line */}
              <div className="mb-6 flex justify-center" aria-hidden="true">
                <svg
                  viewBox="0 0 320 40"
                  className="h-8 w-64 sm:w-80 opacity-30 dark:opacity-20"
                  style={{ animation: "ecgFade 3s ease-in-out infinite" }}
                >
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                    points="0,20 60,20 70,20 80,8 90,32 100,4 110,36 120,20 130,20 200,20 210,20 220,8 230,32 240,4 250,36 260,20 270,20 320,20"
                    strokeDasharray="600"
                    strokeDashoffset="600"
                    style={{ animation: "ecgDraw 2.5s ease-out forwards" }}
                  />
                </svg>
              </div>

              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                Free Love & Relationship Quizzes
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Understand your{" "}
                <span className="text-gradient-warm">relationship</span> better
              </h1>
              <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Take our free quizzes to check your relationship, spot red flags, and understand what's really happening in your love life.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-2 sm:gap-3">
                <Button
                  size="lg"
                  className="gap-2 px-6 sm:px-8 text-sm sm:text-base rounded-xl h-11 sm:h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-shadow duration-300 w-full sm:w-auto"
                  onClick={() => onStartTool("relationship-risk-radar")}
                >
                  <Radar className="h-4 w-4" />
                  Start Quiz – Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  3–5 min &middot; No account needed
                </span>
              </div>

              {/* Trust indicators - simplified for mobile */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] text-muted-foreground/60">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  100% Private
                </span>
                <span className="hidden sm:inline text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Real Science
                </span>
                <span className="hidden sm:inline text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Instant Results
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── ALL TOOLS GRID (MOVED TO TOP) ───────────────────────────── */}
      <section id="tools" className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <AnimatedSection className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold">All Our Quizzes</h2>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              9 quizzes
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Take any quiz to learn more about your relationship.
          </p>
        </AnimatedSection>

        {/* Category filter tabs - improved for mobile */}
        <div className="mb-6 flex flex-wrap gap-1.5 sm:gap-2">
          {toolCategories.map((cat) => {
            const count = cat === "All" ? tools.length : tools.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat}
                <span className={cn(
                  "ml-1.5 text-[9px] sm:text-[10px]",
                  activeCategory === cat ? "text-primary-foreground/70" : "text-muted-foreground/50"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Enhanced mobile-friendly grid layout */}
        <AnimatedGrid className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <AnimatedGridItem key={tool.slug}>
                <Card
                  className={cn(
                    "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 h-full",
                    tool.borderColor
                  )}
                  onClick={() => handleToolClick(tool)}
                >
                  <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
                          tool.bgColor
                        )}
                      >
                        <Icon className={cn("h-6 w-6", tool.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold truncate">
                            {tool.name}
                          </h3>
                          {tool.comingSoon && (
                            <span className="shrink-0 text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-grow">
                      {tool.tagline}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                      <span className="px-2 py-1 rounded-full bg-muted/50 text-xs">{tool.category}</span>
                      <span className="text-xs font-medium">{tool.time}</span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedGridItem>
            );
          })}
        </AnimatedGrid>
      </section>

      {/* ── Featured Tool (moved down) ────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          {/* Gradient border wrapper */}
          <div className="rounded-xl bg-gradient-to-r from-rose-300/50 via-pink-300/40 to-rose-200/50 p-[1.5px] dark:from-rose-700/40 dark:via-pink-700/30 dark:to-rose-600/40">
            <Card className="border-0 bg-gradient-to-br from-rose-50/90 to-background overflow-hidden dark:from-rose-950/30 dark:to-background rounded-[10px]">
              <CardContent className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40">
                    <Radar className="h-7 w-7 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <h2 className="text-lg sm:text-xl font-bold">Check Your Relationship Health</h2>
                      <span className="relative inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        {/* Pulsing dot */}
                        <span className="absolute -top-px -left-px flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span className="ml-2.5">Most Popular</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                      Take a quick quiz to see if your relationship is healthy or has problems. Get instant results that make sense.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                      <Button
                        className="gap-2 rounded-lg text-sm"
                        onClick={() => onStartTool("relationship-risk-radar")}
                      >
                        Take The Quiz
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        ~5 min
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </section>

      {/* ── Daily Mood Check-in (Hidden on mobile) ──────────────────────────── */}
      <section className="hidden md:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <MoodCheckin />
        </AnimatedSection>
      </section>

      {/* ── Love Language Quick Quiz (Hidden on mobile) ────────── */}
      <section className="hidden md:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <LoveLanguageQuiz onStartTool={onStartTool} />
        </AnimatedSection>
      </section>

      {/* ── Daily Relationship Tip (Hidden on mobile) ─────────── */}
      <section className="hidden md:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <DailyTip />
        </AnimatedSection>
      </section>

      {/* ── Relationship Wellness Score (Hidden on mobile) ──────── */}
      <section className="hidden md:block mx-auto max-w-md px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <WellnessScore />
        </AnimatedSection>
      </section>

      {/* ── How It Works (Hidden on mobile) ─────────────────────────────────── */}
      <section className="hidden sm:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold">How It Works – Just 3 Steps</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Take our quiz and understand your relationship better.
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

      {/* ── Value Proposition (Hidden on mobile) ────────────────────────– */}
      <section className="hidden lg:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <h2 className="text-xl font-bold">Why You'll Love This Quiz</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Simple, private, and based on what really works in relationships.
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
                      <Icon className="size-[18px] text-primary" />
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

      {/* ── Pattern Examples (Hidden on mobile) ─────────────────────────── */}
      <section className="hidden lg:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6">
          <h2 className="text-xl font-bold">What Problems We Can Spot</h2>
          <p className="text-sm text-muted-foreground mt-1">
            These are the real relationship issues we help you see clearly.
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

      {/* ── Social Proof ──────────────────────────────– */}
      <div className="hidden sm:block">
        <AnimatedSection>
          <SocialProof />
        </AnimatedSection>
      </div>

      {/* ── Conversation Starters (Hidden on mobile) ──────────────────────── */}
      <section className="hidden md:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection>
          <IcebreakerGenerator onStartTool={onStartTool} />
        </AnimatedSection>
      </section>

      {/* ── Testimonials (Hidden on mobile) ────────────────────────── */}
      <section className="hidden lg:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <h2 className="text-xl font-bold">What Real People Think</h2>
          <p className="text-sm text-muted-foreground mt-1">
            See what others learned from taking our quizzes.
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

      {/* ── FAQ (Hidden on mobile) ────────────────────────── */}
      <section id="faq" className="hidden sm:block mx-auto max-w-3xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5 text-rose-500" />
            <h2 className="text-xl font-bold">Questions You Might Have</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            We answer the questions people usually ask.
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

      {/* ── Blog Preview (Hidden on mobile) ─────────────────────────────── */}
      <section id="journal" className="hidden md:block mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16">
        <AnimatedSection className="mb-6">
          <h2
            className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
            onClick={() => setView("blog")}
          >
            Tips & Articles
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real advice to help you understand relationships better.
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
