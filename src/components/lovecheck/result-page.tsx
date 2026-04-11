"use client";

import { useState, useEffect, useMemo } from "react";
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
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoveCheckStore } from "@/lib/store";
import type { FinalResult, RiskLevel } from "@/types";
import { PatternBadge } from "./pattern-badge";
import { RiskBadge } from "./risk-badge";
import { ConfidenceChip } from "./confidence-chip";
import { InsightCard } from "./insight-card";
import { NextToolCard } from "./next-tool-card";
import { ShareSection } from "./share-section";
import { RiskMeter } from "./risk-meter";
import { SignalBars } from "./signal-bars";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

/** Heart confetti burst animation for result page */
function HeartConfetti() {
  const [hearts] = useState(() => {
    const colors = [
      "#f43f5e", "#fb7185", "#fda4af", "#e11d48",
      "#f97316", "#fb923c", "#f472b6", "#ec4899",
      "#f87171", "#fca5a5",
    ];
    return Array.from({ length: 20 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 160;
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        rotation: Math.random() * 360 - 180,
        scale: 0.6 + Math.random() * 0.6,
        delay: i * 0.03,
      };
    });
  });

  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [reduced]);

  if (reduced || !visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, h.scale, h.scale * 0.8],
            x: h.x,
            y: h.y + 80,
            rotate: h.rotation,
          }}
          transition={{
            duration: 2,
            delay: h.delay,
            ease: "easeOut",
          }}
        >
          <svg
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill={h.color}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** Typewriter effect hook */
function useTypewriter(text: string, speed = 20, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }
    setDisplayed("");
    setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);

  return { displayed, isDone };
}

/** Animated risk level gauge bar */
function AnimatedRiskGauge({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();

  const riskMap: Record<RiskLevel, { pct: number; color: string; label: string }> = {
    low: { pct: 20, color: "bg-emerald-500", label: "Low" },
    moderate: { pct: 45, color: "bg-amber-500", label: "Moderate" },
    elevated: { pct: 70, color: "bg-orange-500", label: "Elevated" },
    high: { pct: 92, color: "bg-rose-500", label: "High" },
  };

  const config = riskMap[riskLevel];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Risk Level</span>
        <span className="font-semibold text-foreground">{config.label}</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted-foreground/10 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", config.color)}
          initial={{ width: "0%" }}
          animate={{ width: `${config.pct}%` }}
          transition={reduced ? { duration: 0 } : { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </div>
    </div>
  );
}

/** Floating tiny hearts background particles */
function FloatingHeartParticles() {
  const reduced = useReducedMotion();
  const hearts = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 8 + Math.random() * 10,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      opacity: 0.15 + Math.random() * 0.2,
    }));
  }, []);

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: h.left, bottom: "-20px" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -400, -500],
            opacity: [0, h.opacity, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            repeatDelay: 2 + Math.random() * 3,
            ease: "easeOut",
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill="rgba(244,63,94,0.6)"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export function ResultPage({ result }: ResultPageProps) {
  const { resetSession, startToolIntro, activeTool } = useLoveCheckStore();
  const reduced = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(true);
  const [explanationReady, setExplanationReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Start typewriter after a short delay for dramatic reveal
  useEffect(() => {
    const delay = reduced ? 0 : 800;
    const timer = setTimeout(() => setExplanationReady(true), delay);
    return () => clearTimeout(timer);
  }, [reduced]);

  const { displayed: typedExplanation, isDone: typeDone } = useTypewriter(
    result.personalizedExplanation,
    20,
    explanationReady,
  );

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
      <motion.div
        variants={item}
        className="relative"
      >
        {/* Floating heart particles behind result card */}
        <FloatingHeartParticles />

        {/* Confetti decoration for low risk */}
        {isLowRisk && <LowRiskDecoration />}
        {showConfetti && <HeartConfetti />}

        {/* Brief rose flash glow on reveal */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl z-30"
          initial={{ opacity: 0 }}
          animate={reduced ? { opacity: 0 } : {
            opacity: [0, 0.4, 0],
            boxShadow: [
              "0 0 0 0 rgba(244,63,94,0)",
              "0 0 30px 10px rgba(244,63,94,0.2)",
              "0 0 0 0 rgba(244,63,94,0)",
            ],
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.div
          initial={reduced ? {} : { scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 20 }}
        >
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-b from-card via-card to-muted/30" data-result-card>
          <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
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

            {/* Risk Meter + Animated Gauge */}
            {result.dominantPattern && (
              <div className="space-y-4">
                <RiskMeter riskLevel={result.dominantPattern.riskLevel} className="py-2" />
                <AnimatedRiskGauge riskLevel={result.dominantPattern.riskLevel} />
              </div>
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

            {/* Personalized explanation with typewriter effect */}
            <div className="rounded-xl bg-muted/40 p-4 sm:p-5 border border-border/50">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-xs font-semibold text-muted-foreground">Your Pattern Analysis</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {typedExplanation}
                {!typeDone && explanationReady && (
                  <span className="inline-block w-[2px] h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                )}
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
            {result.recommendedTools
              .filter((tool, idx, arr) => arr.findIndex((t) => t.slug === tool.slug) === idx)
              .slice(0, 4)
              .map((tool, idx) => (
              <NextToolCard
                key={`${tool.slug}-${idx}`}
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
          className="gap-2 rounded-xl hover:bg-primary/5"
          onClick={handleRetake}
        >
          <RotateCcw className="h-4 w-4" />
          Retake Assessment
        </Button>
        <Button
          size="lg"
          className="gap-2 rounded-xl shadow-md shadow-primary/15"
          onClick={resetSession}
        >
          <Home className="h-4 w-4" />
          Explore All Tools
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
      <Card className="border-0 shadow-lg bg-gradient-to-b from-card via-card to-muted/30">
        <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-pulse" />
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
          <div className="rounded-xl bg-muted/40 p-4 sm:p-5 border border-border/50 space-y-2">
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

      <div className="flex flex-col items-center justify-center gap-3 py-8">
        {/* Animated heartbeat loader */}
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Analyzing your patterns</p>
          <p className="text-xs text-muted-foreground mt-0.5">Cross-referencing signals and detecting dynamics...</p>
        </div>
      </div>
    </div>
  );
}
