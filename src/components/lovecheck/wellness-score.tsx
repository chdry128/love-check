"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion, useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getHistory, type HistoryEntry } from "@/lib/history";
import type { RiskLevel } from "@/types";
import { useLoveCheckStore } from "@/lib/store";

// ── Risk → Normalized Value Mapping ─────────────────────────────
const RISK_TO_NORMALIZED: Record<RiskLevel, number> = {
  low: 0.2,
  moderate: 0.45,
  elevated: 0.7,
  high: 0.95,
};

// ── Score Color Config ──────────────────────────────────────────
function getScoreColor(score: number) {
  if (score <= 30) return { text: "text-red-500 dark:text-red-400", stroke: "#ef4444", ring: "ring-red-500/20", bg: "bg-red-50 dark:bg-red-950/30" };
  if (score <= 60) return { text: "text-amber-500 dark:text-amber-400", stroke: "#f59e0b", ring: "ring-amber-500/20", bg: "bg-amber-50 dark:bg-amber-950/30" };
  if (score <= 80) return { text: "text-teal-500 dark:text-teal-400", stroke: "#14b8a6", ring: "ring-teal-500/20", bg: "bg-teal-50 dark:bg-teal-950/30" };
  return { text: "text-emerald-500 dark:text-emerald-400", stroke: "#10b981", ring: "ring-emerald-500/20", bg: "bg-emerald-50 dark:bg-emerald-950/30" };
}

// ── Personalized Message ────────────────────────────────────────
function getScoreMessage(score: number): string {
  if (score <= 30) return "Your relationships deserve extra care and attention right now. You're already taking a brave step by looking inward.";
  if (score <= 60) return "You're on a meaningful journey of self-discovery. Every assessment brings you closer to understanding your patterns.";
  if (score <= 80) return "Great progress! You're developing strong self-awareness about your relationship dynamics.";
  return "You're showing exceptional relationship intelligence! Your self-awareness is a real strength.";
}

// ── SVG Constants ───────────────────────────────────────────────
const RADIUS = 70;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SIZE = (RADIUS + STROKE_WIDTH) * 2 + 8;

// ── Wellness Score Widget ───────────────────────────────────────

export function WellnessScore() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px 0px" });
  const reduced = useReducedMotion();
  const startToolIntro = useLoveCheckStore((s) => s.startToolIntro);

  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // SSR-safe: read history on mount
    requestAnimationFrame(() => {
      setEntries(getHistory());
    });

    const handler = () => setEntries(getHistory());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const wellnessScore = useMemo(() => {
    if (entries.length === 0) return null;
    const total = entries.reduce((sum, entry) => {
      const risk = entry.result.dominantPattern?.riskLevel ?? "moderate";
      const normalized = RISK_TO_NORMALIZED[risk];
      return sum + (100 - normalized * 25);
    }, 0);
    return Math.round(total / entries.length);
  }, [entries]);

  // Animated score counter
  const motionVal = useMotionValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  useMotionValueEvent(motionVal, "change", (v) =>
    setDisplayScore(Math.round(v)),
  );

  useEffect(() => {
    if (wellnessScore === null) return;
    const target = reduced ? wellnessScore : 0;
    motionVal.set(target);
    if (isInView && !reduced) {
      const ctrl = animate(motionVal, wellnessScore, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => ctrl.stop();
    }
  }, [wellnessScore, isInView, reduced, motionVal]);

  const score = wellnessScore ?? 0;
  const offset = CIRCUMFERENCE * (1 - score / 100);
  const colorConfig = getScoreColor(score);

  // ── Empty state ─────────────────────────────────────────────
  if (entries.length === 0) {
    return (
      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center space-y-4">
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/10">
                <Heart className="h-8 w-8 text-primary/60" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Start your journey</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Take your first assessment and we&apos;ll build your personalized Relationship Wellness Score.
              </p>
            </div>
            <Button
              className="gap-2 rounded-xl h-11 shadow-md shadow-rose-200/30 dark:shadow-rose-900/20"
              onClick={() => startToolIntro("relationship-risk-radar")}
            >
              <Sparkles className="h-4 w-4" />
              Take Assessment
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Score state ─────────────────────────────────────────────
  return (
    <Card className="border-0 shadow-md overflow-hidden" ref={ref}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <h3 className="text-base font-semibold flex items-center justify-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              Relationship Wellness Score
            </h3>
            <p className="text-xs text-muted-foreground">
              Based on your assessment history
            </p>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative" style={{ width: SIZE, height: SIZE }}>
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full h-full"
              role="img"
              aria-label={`Relationship Wellness Score: ${score} out of 100`}
            >
              {/* Background track */}
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                className="text-muted-foreground/15"
              />

              {/* Animated progress arc */}
              <motion.circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={colorConfig.stroke}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={isInView || reduced ? { strokeDashoffset: offset } : { strokeDashoffset: CIRCUMFERENCE }}
                transition={reduced ? { duration: 0 } : { duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>

            {/* Center score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn("text-3xl font-bold tabular-nums", colorConfig.text)}>
                {displayScore}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            {getScoreMessage(score)}
          </p>

          {/* Assessment count */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-primary/50" />
              {entries.length} {entries.length === 1 ? "assessment" : "assessments"} completed
            </span>
          </div>

          {/* CTA button for low scores */}
          {score < 80 && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl h-11 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              onClick={() => startToolIntro("relationship-risk-radar")}
            >
              <Sparkles className="h-4 w-4" />
              Take Assessment
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
