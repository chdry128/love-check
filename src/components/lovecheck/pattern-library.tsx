"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Search,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Zap,
  Heart,
  MessageCircle,
  Target,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patternRules } from "@/data/patterns";
import { patternToolMapping } from "@/data/pattern-tool-mapping";
import type { ToolSlug, RiskLevel, PatternId } from "@/types";

// ── Props ────────────────────────────────────────────────

interface PatternLibraryProps {
  onStartTool: (slug: ToolSlug) => void;
  onBack?: () => void;
}

// ── Pattern categories derived from source sections ─────

type PatternCategory =
  | "All"
  | "Core Dynamics"
  | "Texting & Communication"
  | "Early Stage"
  | "Future & Values";

const patternCategories: PatternCategory[] = [
  "All",
  "Core Dynamics",
  "Texting & Communication",
  "Early Stage",
  "Future & Values",
];

/** Map each pattern ID to its display category */
function getPatternCategory(id: PatternId): PatternCategory {
  const textingPatterns: PatternId[] = [
    "balanced-texting-match",
    "overgiver-texting-dynamic",
    "high-interest-low-follow-through",
    "warm-but-casual-energy",
    "mixed-signal-thread",
    "breadcrumbing-risk",
  ];
  const earlyStagePatterns: PatternId[] = [
    "fast-intensity-risk",
    "future-faking-signal",
    "intense-but-unstable",
    "pacing-pressure-pattern",
  ];
  const futurePatterns: PatternId[] = [
    "strong-alignment",
    "good-chemistry-some-friction",
    "uneven-long-term-alignment",
    "high-attraction-low-structural-fit",
    "future-mismatch",
  ];

  if (textingPatterns.includes(id)) return "Texting & Communication";
  if (earlyStagePatterns.includes(id)) return "Early Stage";
  if (futurePatterns.includes(id)) return "Future & Values";
  return "Core Dynamics";
}

// ── Risk level config ────────────────────────────────────

type RiskLabel = "Low" | "Moderate" | "Elevated" | "High";
type RiskFilter = "All" | RiskLabel;

const riskFilters: RiskFilter[] = ["All", "Low", "Moderate", "Elevated", "High"];

const riskLabelToLevel: Record<RiskLabel, RiskLevel> = {
  Low: "low",
  Moderate: "moderate",
  Elevated: "elevated",
  High: "high",
};

const riskConfig: Record<
  RiskLevel,
  { label: string; bg: string; text: string; dot: string; border: string }
> = {
  low: {
    label: "Low",
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800/60",
  },
  moderate: {
    label: "Moderate",
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800/60",
  },
  elevated: {
    label: "Elevated",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
    border: "border-orange-200 dark:border-orange-800/60",
  },
  high: {
    label: "High",
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
    border: "border-red-200 dark:border-red-800/60",
  },
};

// ── Tool display info ────────────────────────────────────

const toolDisplayNames: Record<ToolSlug, string> = {
  "relationship-risk-radar": "Risk Radar",
  "attachment-style-lens": "Attachment Lens",
  "communication-pattern-check": "Comm Check",
  "compatibility-compass": "Compat. Compass",
  "red-flag-scanner": "Red Flag Scanner",
  "texting-energy-match": "Texting Match",
  "love-bombing-detector": "Love Bombing",
  "future-alignment-checker": "Future Check",
  "flirty-reply-coach": "Reply Coach",
};

// ── Category badge colors ────────────────────────────────

const categoryColors: Record<PatternCategory, string> = {
  All: "bg-muted/60 text-muted-foreground",
  "Core Dynamics": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "Texting & Communication":
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Early Stage": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Future & Values":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

// ── Animation variants (reduced-motion aware) ────────────

function useReducedMotionValue() {
  return !!useReducedMotion();
}

function fadeUpVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };
}

function sectionTransition(reduced: boolean) {
  return reduced
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const };
}

function staggerContainerVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 1 } : { opacity: 0 },
    visible: reduced
      ? { opacity: 1 }
      : {
          opacity: 1,
          transition: { staggerChildren: 0.04, delayChildren: 0.08 },
        },
  };
}

function staggerChildVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 12 },
    visible: reduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
}

// ── Sub-components ───────────────────────────────────────

function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const reduced = useReducedMotionValue();

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

function AnimatedGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduced = useReducedMotionValue();

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
  const reduced = useReducedMotionValue();
  return (
    <motion.div variants={staggerChildVariants(reduced)} className={className}>
      {children}
    </motion.div>
  );
}

// ── Risk Level Badge ─────────────────────────────────────

function RiskBadge({ level }: { level: RiskLevel }) {
  const config = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        config.bg,
        config.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

// ── Empty State ──────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1">No patterns found</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Try adjusting your search terms or filters to find what you&apos;re looking for.
      </p>
    </div>
  );
}

// ── Pattern Card ─────────────────────────────────────────

function PatternCard({
  pattern,
  category,
  primaryTool,
  allTools,
  onStartTool,
}: {
  pattern: (typeof patternRules)[number];
  category: PatternCategory;
  primaryTool: ToolSlug;
  allTools: ToolSlug[];
  onStartTool: (slug: ToolSlug) => void;
}) {
  const risk = riskConfig[pattern.riskLevel];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        risk.border
      )}
    >
      {/* Accent bar at top */}
      <div className="absolute left-0 top-0 bottom-0 w-1">
        <div className={cn("h-full rounded-l-lg", risk.dot)} />
      </div>

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6">
        {/* Header row: name + risk badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold leading-tight">
              {pattern.name}
            </h3>
            <RiskBadge level={pattern.riskLevel} />
          </div>
        </div>

        {/* Category badge */}
        <div className="mb-2.5">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              categoryColors[category]
            )}
          >
            {category}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {pattern.description}
        </p>

        {/* Tool tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {allTools.map((toolSlug) => (
            <Badge
              key={toolSlug}
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 font-medium border-dashed"
            >
              {toolDisplayNames[toolSlug]}
            </Badge>
          ))}
        </div>

        {/* Try Now button */}
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs gap-1.5 px-2.5 text-primary hover:bg-primary/10 hover:text-primary group/btn"
          onClick={() => onStartTool(primaryTool)}
        >
          Try Now
          <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Main Component ───────────────────────────────────────

export function PatternLibrary({ onStartTool, onBack }: PatternLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PatternCategory>("All");
  const [activeRisk, setActiveRisk] = useState<RiskFilter>("All");

  // Filter patterns
  const filteredPatterns = useMemo(() => {
    return patternRules.filter((pattern) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          pattern.name.toLowerCase().includes(q) ||
          pattern.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (activeCategory !== "All") {
        const patternCat = getPatternCategory(pattern.id);
        if (patternCat !== activeCategory) return false;
      }

      // Risk filter
      if (activeRisk !== "All") {
        if (pattern.riskLevel !== riskLabelToLevel[activeRisk]) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeRisk]);

  // Count patterns per category
  const categoryCounts = useMemo(() => {
    const counts: Record<PatternCategory, number> = {
      All: patternRules.length,
      "Core Dynamics": 0,
      "Texting & Communication": 0,
      "Early Stage": 0,
      "Future & Values": 0,
    };
    for (const pattern of patternRules) {
      const cat = getPatternCategory(pattern.id);
      counts[cat]++;
    }
    return counts;
  }, []);

  // Count patterns per risk level
  const riskCounts = useMemo(() => {
    const counts: Record<RiskFilter, number> = {
      All: patternRules.length,
      Low: 0,
      Moderate: 0,
      Elevated: 0,
      High: 0,
    };
    for (const pattern of patternRules) {
      const key =
        pattern.riskLevel.charAt(0).toUpperCase() +
        pattern.riskLevel.slice(1).toLowerCase();
      counts[key]++;
    }
    return counts;
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      {/* ── Back link ──────────────────────────────────── */}
      {onBack && (
        <AnimatedSection className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </AnimatedSection>
      )}

      {/* ── Header ─────────────────────────────────────── */}
      <AnimatedSection className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Pattern Library
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Explore every relationship pattern our engine detects — and the tools that reveal them.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Search ─────────────────────────────────────── */}
      <AnimatedSection className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patterns by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </AnimatedSection>

      {/* ── Category Filter Tabs ────────────────────────── */}
      <AnimatedSection className="mb-4">
        <div className="flex flex-wrap gap-1.5">
          {patternCategories.map((cat) => {
            const count = categoryCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat}
                <span
                  className={cn(
                    "inline-flex items-center justify-center h-4 min-w-4 rounded-full px-1 text-[10px] font-semibold",
                    activeCategory === cat
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ── Risk Level Filter ───────────────────────────── */}
      <AnimatedSection className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Risk level:</span>
          {riskFilters.map((risk) => {
            const isActive = activeRisk === risk;
            if (risk === "All") {
              return (
                <button
                  key={risk}
                  onClick={() => setActiveRisk("All")}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({riskCounts.All})
                </button>
              );
            }
            const level = riskLabelToLevel[risk];
            const config = riskConfig[level];
            const count = riskCounts[risk];
            return (
              <button
                key={risk}
                onClick={() => setActiveRisk(risk as RiskFilter)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200",
                  isActive
                    ? cn(config.bg, config.text, "ring-1 ring-current/20")
                    : cn(config.bg + "/60", config.text + "/70", "hover:opacity-100 opacity-80")
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    config.dot,
                    isActive ? "animate-pulse" : ""
                  )}
                />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </AnimatedSection>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <AnimatedSection className="mb-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <strong className="text-foreground">{filteredPatterns.length}</strong> of{" "}
            {patternRules.length} patterns
          </span>
          {(searchQuery || activeCategory !== "All" || activeRisk !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setActiveRisk("All");
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </AnimatedSection>

      {/* ── Pattern Grid or Empty State ─────────────────── */}
      {filteredPatterns.length === 0 ? (
        <EmptyState />
      ) : (
        <AnimatedGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatterns.map((pattern) => {
            const category = getPatternCategory(pattern.id);
            const tools = patternToolMapping[pattern.id] ?? [];
            const primaryTool = tools[0];

            return (
              <AnimatedGridItem key={pattern.id}>
                <PatternCard
                  pattern={pattern}
                  category={category}
                  primaryTool={primaryTool}
                  allTools={tools}
                  onStartTool={onStartTool}
                />
              </AnimatedGridItem>
            );
          })}
        </AnimatedGrid>
      )}

      {/* ── Footer CTA ─────────────────────────────────── */}
      <AnimatedSection className="mt-12 sm:mt-16">
        <div className="rounded-xl border bg-card p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/30">
              <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <h2 className="text-lg font-bold mb-1">
            Patterns are just the beginning
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Understanding your patterns is the first step. Take a tool to discover
            which ones are showing up in your relationships — with personalized
            insights and next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              size="sm"
              onClick={() => onStartTool("relationship-risk-radar")}
              className="gap-1.5"
            >
              <Shield className="h-3.5 w-3.5" />
              Start Risk Radar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartTool("attachment-style-lens")}
              className="gap-1.5"
            >
              <Heart className="h-3.5 w-3.5" />
              Attachment Lens
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartTool("communication-pattern-check")}
              className="gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Comm Check
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
