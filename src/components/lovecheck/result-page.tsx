"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  RotateCcw,
  Home,
  Sparkles,
  Loader2,
  ShieldCheck,
  Activity,
  FileDown,
  Star,
} from "lucide-react";
import { useLoveCheckStore } from "@/lib/store";
import type { FinalResult } from "@/types";
import { PatternBadge } from "./pattern-badge";
import { RiskBadge } from "./risk-badge";
import { ConfidenceChip } from "./confidence-chip";
import { InsightCard } from "./insight-card";
import { NextToolCard } from "./next-tool-card";
import { ShareSection } from "./share-section";
import { RiskMeter } from "./risk-meter";
import { SignalBars } from "./signal-bars";
import { motion, AnimatePresence } from "framer-motion";

interface ResultPageProps {
  result: FinalResult;
}

/** Subtle sparkle/confetti decoration for low-risk results */
function LowRiskDecoration() {
  const sparklePositions = [
    { top: "-8px", left: "12%", size: 14, delay: 0 },
    { top: "10%", right: "-6px", size: 12, delay: 0.2 },
    { bottom: "15%", left: "-8px", size: 10, delay: 0.4 },
    { bottom: "-6px", right: "15%", size: 16, delay: 0.1 },
    { top: "40%", right: "-10px", size: 8, delay: 0.6 },
    { top: "-4px", right: "30%", size: 10, delay: 0.3 },
    { bottom: "5%", left: "8%", size: 11, delay: 0.5 },
    { top: "25%", left: "-6px", size: 9, delay: 0.7 },
  ];

  return (
    <AnimatePresence>
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-10"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            bottom: pos.bottom,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0.6, 1],
            scale: [0, 1.2, 1, 1.1],
          }}
          transition={{
            duration: 1.5,
            delay: pos.delay,
            repeat: Infinity,
            repeatDelay: 2.5 + i * 0.3,
            ease: "easeOut",
          }}
        >
          <Star
            className="text-amber-400/70 dark:text-amber-300/50"
            style={{
              width: pos.size,
              height: pos.size,
              fill: "currentColor",
            }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

export function ResultPage({ result }: ResultPageProps) {
  const { resetSession, startToolIntro, activeTool } = useLoveCheckStore();

  const shareText = `I just used LoveCheck's Relationship Risk Radar and my dominant pattern is "${result.dominantPattern?.name ?? "Mixed"}" with ${result.dominantPattern?.confidence ?? "moderate"} confidence. Try it yourself:`;

  const isLowRisk = result.dominantPattern?.riskLevel === "low";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  const handleRetake = () => {
    if (activeTool) {
      startToolIntro(activeTool);
    } else {
      startToolIntro("relationship-risk-radar");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-2xl px-4 py-6 sm:py-10"
    >
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={resetSession}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={resetSession}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Try Again</span>
          </Button>
        </div>
      </div>

      {/* ── Main Result Card ─────────────────────────────── */}
      <motion.div variants={item} className="relative">
        {/* Confetti decoration for low risk */}
        {isLowRisk && <LowRiskDecoration />}

        <Card className="overflow-hidden border-0 shadow-lg" data-result-card>
          <div className="h-2 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
          <CardContent className="p-6 sm:p-8 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Your Pattern Analysis
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Risk Meter Visualization */}
            {result.dominantPattern && (
              <RiskMeter riskLevel={result.dominantPattern.riskLevel} className="py-2" />
            )}

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              {result.dominantPattern && (
                <PatternBadge patternId={result.dominantPattern.id} />
              )}
              {result.dominantPattern && (
                <RiskBadge level={result.dominantPattern.riskLevel} />
              )}
              {result.dominantPattern && (
                <ConfidenceChip level={result.dominantPattern.confidence} />
              )}
              {result.aiEnhanced && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 via-fuchsia-100 to-violet-100 dark:from-violet-950/70 dark:via-fuchsia-950/50 dark:to-violet-950/70 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/60 dark:ring-violet-800/40">
                  <Sparkles className="h-3 w-3" />
                  AI Enhanced
                </span>
              )}
            </div>

            {/* Personalized explanation */}
            <div className="rounded-xl bg-muted/40 p-4 sm:p-5">
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {result.personalizedExplanation}
              </p>
            </div>

            {/* AI Insights */}
            {result.aiInsights && (
              <div className="rounded-xl bg-gradient-to-r from-violet-50/60 to-rose-50/60 dark:from-violet-950/20 dark:to-rose-950/20 p-4 sm:p-5 border border-violet-100/50 dark:border-violet-900/30">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                    AI Insight
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {result.aiInsights}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Insight Cards ────────────────────────────────── */}
      <div className="mt-6 space-y-4">
        {result.strengths.length > 0 && (
          <motion.div variants={item}>
            <InsightCard
              title="Strengths"
              items={result.strengths}
              variant="strength"
            />
          </motion.div>
        )}

        {result.risks.length > 0 && (
          <motion.div variants={item}>
            <InsightCard
              title="Watch Areas"
              items={result.risks}
              variant="risk"
            />
          </motion.div>
        )}

        {result.watchNext.length > 0 && (
          <motion.div variants={item}>
            <InsightCard
              title="What to Watch Next"
              items={result.watchNext}
              variant="watch"
            />
          </motion.div>
        )}

        {result.tryNext.length > 0 && (
          <motion.div variants={item}>
            <InsightCard
              title="Try This Next Time"
              items={result.tryNext}
              variant="try"
            />
          </motion.div>
        )}

        {result.safeSuggestion && (
          <motion.div variants={item}>
            <InsightCard
              title="Safe Next Step"
              items={[result.safeSuggestion]}
              variant="safe"
            />
          </motion.div>
        )}
      </div>

      {/* ── Signal Breakdown ──────────────────────────── */}
      {Object.values(result.signals).some((v) => v !== 0) && (
        <motion.div variants={item} className="mt-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Signal Breakdown
                </h3>
              </div>
              <SignalBars signals={result.signals} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Recommended Next Tools ───────────────────────── */}
      {result.recommendedTools.length > 0 && (
        <motion.div variants={item} className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recommended Next Steps
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.recommendedTools.slice(0, 4).map((tool) => (
              <NextToolCard
                key={tool.slug}
                tool={tool}
                onStartTool={() => {
                  // Could navigate to tool, but only risk radar is implemented
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Share Section ────────────────────────────────── */}
      <motion.div variants={item} className="mt-6">
        <ShareSection text={shareText} />
      </motion.div>

      {/* ── Disclaimer ───────────────────────────────────── */}
      <motion.div variants={item} className="mt-6 mb-8">
        <div className="flex items-start gap-2 rounded-xl bg-muted/30 p-4">
          <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This analysis identifies patterns, not diagnoses. It&apos;s not a
            substitute for professional therapy or medical advice. If you&apos;re
            in an unsafe situation, please reach out to a qualified professional
            or crisis helpline.
          </p>
        </div>
      </motion.div>

      {/* ── Final CTA ────────────────────────────────────── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl"
          onClick={resetSession}
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl"
          onClick={handleRetake}
        >
          <RotateCcw className="h-4 w-4" />
          Retake Assessment
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl"
          onClick={resetSession}
        >
          <FileDown className="h-4 w-4" />
          Start Fresh
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ── Loading State ──────────────────────────────────────────

export function ResultLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 space-y-4">
      <div className="mb-6">
        <Skeleton className="h-4 w-20" />
      </div>
      <Card className="border-0 shadow-lg">
        <div className="h-2 bg-muted animate-pulse" />
        <CardContent className="p-6 sm:p-8 space-y-5">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-48" />

          {/* Circular Risk Meter skeleton */}
          <div className="flex justify-center py-2">
            <div className="relative">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Badge row skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Explanation skeleton */}
          <Skeleton className="h-24 w-full rounded-xl" />

          {/* AI Insight skeleton */}
          <div className="rounded-xl bg-muted/40 p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-sm" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>

      {/* Signal bars skeleton */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-4/5 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-3/5 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing your patterns...
      </div>
    </div>
  );
}
