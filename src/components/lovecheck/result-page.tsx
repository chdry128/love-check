"use client";

// ─────────────────────────────────────────────────────────────────────────────
// LoveCheck — Result Page  (tool-aware, unique per-tool identity)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, RotateCcw, Home, Sparkles, Loader2, ShieldCheck,
  Activity, Star, Radar, Heart, MessagesSquare, MessageCircle,
  Shield, Target, Compass, Wand2, ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoveCheckStore } from "@/lib/store";
import type { FinalResult, RiskLevel, ToolSlug, PatternId } from "@/types";
import { PatternBadge } from "./pattern-badge";
import { RiskBadge } from "./risk-badge";
import { ConfidenceChip } from "./confidence-chip";
import { InsightCard } from "./insight-card";
import { NextToolCard } from "./next-tool-card";
import { ShareSection } from "./share-section";
import { RiskMeter } from "./risk-meter";
import { SignalBars } from "./signal-bars";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ResultPageProps { result: FinalResult; }

interface SectionLabels {
  strengths: string; risks: string; watchNext: string;
  tryNext: string; safe: string; explanation: string; signals: string;
}

interface ToolUI {
  name: string;
  heroTagline: string;
  accentGradient: string;
  glowColor: string;
  confettiColors: string[];
  iconClass: string;
  iconBgClass: string;
  sectionLabels: SectionLabels;
  heroTitle: (result: FinalResult) => string;
  shareText: (result: FinalResult) => string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool icon map
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_ICONS: Record<ToolSlug, React.ComponentType<{ className?: string }>> = {
  "red-flag-scanner": ShieldAlert,
  "relationship-risk-radar": Radar,
  "attachment-style-lens": Heart,
  "communication-pattern-check": MessagesSquare,
  "texting-energy-match": MessageCircle,
  "love-bombing-detector": Shield,
  "future-alignment-checker": Target,
  "compatibility-compass": Compass,
  "flirty-reply-coach": Wand2,
};

// ─────────────────────────────────────────────────────────────────────────────
// Attachment style helpers
// ─────────────────────────────────────────────────────────────────────────────

const ATTACH_COLORS = {
  secure:       { bg: "bg-emerald-50 dark:bg-emerald-950/50", border: "border-emerald-400", text: "text-emerald-700 dark:text-emerald-300", check: "text-emerald-500" },
  anxious:      { bg: "bg-amber-50 dark:bg-amber-950/50",   border: "border-amber-400",   text: "text-amber-700 dark:text-amber-300",   check: "text-amber-500"   },
  avoidant:     { bg: "bg-violet-50 dark:bg-violet-950/50", border: "border-violet-400",  text: "text-violet-700 dark:text-violet-300",  check: "text-violet-500"  },
  disorganized: { bg: "bg-rose-50 dark:bg-rose-950/50",     border: "border-rose-400",    text: "text-rose-700 dark:text-rose-300",      check: "text-rose-500"    },
} as const;

type AttachStyle = keyof typeof ATTACH_COLORS;

const PATTERN_ATTACH: Partial<Record<PatternId, AttachStyle>> = {
  "anxious-avoidant-trap":        "disorganized",
  "self-reliance-shield":         "avoidant",
  "overgiver-dynamic":            "anxious",
  "hot-cold-loop":                "disorganized",
  "repairable-but-uneven":        "secure",
  "communication-withdrawal":     "avoidant",
  "boundary-friction-pattern":    "avoidant",
  "stonewall-cycle":              "avoidant",
  "misaligned-expectations":      "disorganized",
  "low-clarity-connection":       "anxious",
  "strong-chemistry-weak-structure": "anxious",
  "strong-alignment":             "secure",
  "good-chemistry-some-friction": "secure",
};

const RISK_ATTACH: Record<RiskLevel, AttachStyle> = {
  low: "secure", moderate: "anxious", elevated: "avoidant", high: "disorganized",
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOL_UI — per-tool identity, labels, and titles
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_UI: Record<ToolSlug, ToolUI> = {
  "red-flag-scanner": {
    name: "Red Flag Scanner",
    heroTagline: "Relationship Warning Scan",
    accentGradient: "from-rose-500 via-red-500 to-rose-500",
    glowColor: "rgba(244,63,94,0.3)",
    confettiColors: ["#f43f5e","#fb7185","#e11d48","#dc2626","#fca5a5","#fda4af"],
    iconClass: "text-rose-500",
    iconBgClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    sectionLabels: {
      strengths: "✓ Green Signals Detected",
      risks: "⚑ Red Flags Raised",
      watchNext: "Watch Closely For",
      tryNext: "Protective Steps",
      safe: "Safe Boundary Step",
      explanation: "What This Scan Found",
      signals: "Warning Signals Detected",
    },
    heroTitle: (r) => {
      const n = ({ low: 0, moderate: 2, elevated: 4, high: 6 } as Record<RiskLevel, number>)[r.dominantPattern?.riskLevel ?? "low"];
      return n === 0 ? "No Red Flags Detected ✓" : `${n} Red Flag${n > 1 ? "s" : ""} Found`;
    },
    shareText: (r) => `I ran LoveCheck's Red Flag Scanner — pattern: "${r.dominantPattern?.name ?? "see result"}". Scan yours:`,
  },

  "relationship-risk-radar": {
    name: "Relationship Risk Radar",
    heroTagline: "Relationship Health Assessment",
    accentGradient: "from-primary/40 via-primary to-primary/40",
    glowColor: "rgba(244,63,94,0.2)",
    confettiColors: ["#f43f5e","#fb7185","#fda4af","#e11d48","#f97316","#fb923c"],
    iconClass: "text-rose-500",
    iconBgClass: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
    sectionLabels: {
      strengths: "Healthy Signals",
      risks: "Risk Factors",
      watchNext: "Monitor Closely",
      tryNext: "Steps Forward",
      safe: "Safe Starting Point",
      explanation: "Your Relationship Analysis",
      signals: "Signal Breakdown",
    },
    heroTitle: (r) => (({ low: "Relationship Looks Healthy ✓", moderate: "Some Risk Detected", elevated: "Elevated Risk Found", high: "High Risk Relationship" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"],
    shareText: (r) => `LoveCheck's Relationship Risk Radar found: "${r.dominantPattern?.name ?? "results in"}". Check yours:`,
  },

  "attachment-style-lens": {
    name: "Attachment Style Lens",
    heroTagline: "Your Attachment Profile",
    accentGradient: "from-violet-500 via-purple-500 to-violet-500",
    glowColor: "rgba(139,92,246,0.25)",
    confettiColors: ["#8b5cf6","#a78bfa","#c4b5fd","#7c3aed","#ec4899","#f9a8d4"],
    iconClass: "text-violet-500",
    iconBgClass: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
    sectionLabels: {
      strengths: "Your Strengths",
      risks: "Growth Areas",
      watchNext: "Attachment Triggers",
      tryNext: "Healing Practices",
      safe: "Gentle First Step",
      explanation: "Your Attachment Analysis",
      signals: "Attachment Signals",
    },
    heroTitle: (r) => {
      const idMap: Partial<Record<PatternId, string>> = {
        "anxious-avoidant-trap": "Complex Attachment Detected",
        "self-reliance-shield": "Avoidant Attachment Pattern",
        "overgiver-dynamic": "Anxious Attachment Tendencies",
        "hot-cold-loop": "Disorganized Attachment Signs",
        "repairable-but-uneven": "Secure But Growing",
        "communication-withdrawal": "Dismissive-Avoidant Pattern",
        "boundary-friction-pattern": "Avoidant Attachment Detected",
      };
      if (r.dominantPattern?.id && idMap[r.dominantPattern.id]) return idMap[r.dominantPattern.id]!;
      return (({ low: "Secure Attachment Style ✓", moderate: "Mild Anxious Tendencies", elevated: "Avoidant Tendencies Detected", high: "Complex Attachment Pattern" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"];
    },
    shareText: (r) => `I found my attachment style with LoveCheck — "${r.dominantPattern?.name ?? "complex pattern"}". Find yours:`,
  },

  "communication-pattern-check": {
    name: "Communication Checker",
    heroTagline: "Communication Health Analysis",
    accentGradient: "from-amber-400 via-yellow-500 to-amber-400",
    glowColor: "rgba(245,158,11,0.25)",
    confettiColors: ["#f59e0b","#fbbf24","#fde68a","#d97706","#fb923c","#fed7aa"],
    iconClass: "text-amber-500",
    iconBgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    sectionLabels: {
      strengths: "What's Working",
      risks: "Communication Gaps",
      watchNext: "Patterns to Watch",
      tryNext: "Conversation Starters",
      safe: "First Conversation to Have",
      explanation: "Your Communication Reading",
      signals: "Communication Signals",
    },
    heroTitle: (r) => (({ low: "Communication Is Flowing Well ✓", moderate: "Some Communication Friction", elevated: "Communication Needs Attention", high: "Significant Communication Breakdown" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"],
    shareText: (r) => `LoveCheck analyzed my communication style — "${r.dominantPattern?.name ?? "see result"}". Check yours:`,
  },

  "texting-energy-match": {
    name: "Texting Energy Match",
    heroTagline: "Texting Dynamics Analysis",
    accentGradient: "from-teal-400 via-cyan-500 to-teal-400",
    glowColor: "rgba(20,184,166,0.25)",
    confettiColors: ["#14b8a6","#2dd4bf","#99f6e4","#0d9488","#38bdf8","#67e8f9"],
    iconClass: "text-teal-500",
    iconBgClass: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800",
    sectionLabels: {
      strengths: "Balanced Signs",
      risks: "Energy Imbalances",
      watchNext: "Watch Your Texting",
      tryNext: "Rebalancing Tips",
      safe: "Try This First",
      explanation: "Your Texting Energy Reading",
      signals: "Energy Signals",
    },
    heroTitle: (r) => {
      const idMap: Partial<Record<PatternId, string>> = {
        "balanced-texting-match": "Your Texting Energy Is Balanced ✓",
        "overgiver-texting-dynamic": "You're Giving More Than You Receive",
        "high-interest-low-follow-through": "Mixed Texting Signals Detected",
        "warm-but-casual-energy": "Warm but Casual Energy Match",
        "mixed-signal-thread": "Confusing Texting Patterns Found",
        "breadcrumbing-risk": "Breadcrumbing Pattern Detected",
      };
      if (r.dominantPattern?.id && idMap[r.dominantPattern.id]) return idMap[r.dominantPattern.id]!;
      return (({ low: "Well-Matched Texting Energy ✓", moderate: "Slight Energy Imbalance", elevated: "Unequal Texting Effort", high: "Significant Energy Mismatch" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"];
    },
    shareText: (r) => `LoveCheck checked my texting energy — "${r.dominantPattern?.name ?? "see result"}". Match yours:`,
  },

  "love-bombing-detector": {
    name: "Love Bombing Detector",
    heroTagline: "Relationship Intensity Scan",
    accentGradient: "from-orange-400 via-amber-500 to-orange-400",
    glowColor: "rgba(249,115,22,0.25)",
    confettiColors: ["#f97316","#fb923c","#fed7aa","#ea580c","#f59e0b","#fde68a"],
    iconClass: "text-orange-500",
    iconBgClass: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800",
    sectionLabels: {
      strengths: "Genuine Signs",
      risks: "⚠ Concern Signals",
      watchNext: "What To Watch",
      tryNext: "Grounding Steps",
      safe: "Calm First Step",
      explanation: "Intensity Assessment",
      signals: "Intensity Signals",
    },
    heroTitle: (r) => {
      const idMap: Partial<Record<PatternId, string>> = {
        "fast-intensity-risk": "Fast Intensity Pattern Detected",
        "future-faking-signal": "Future Faking Signals Found",
        "intense-but-unstable": "Intense But Unstable Connection",
        "pacing-pressure-pattern": "Unhealthy Pacing Pressure Found",
      };
      if (r.dominantPattern?.id && idMap[r.dominantPattern.id]) return idMap[r.dominantPattern.id]!;
      return (({ low: "Healthy Relationship Pacing ✓", moderate: "Moving Faster Than Usual", elevated: "Intensity Concerns Detected", high: "Strong Love Bombing Signals" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"];
    },
    shareText: (r) => `I ran a love bombing detector on LoveCheck — "${r.dominantPattern?.name ?? "see result"}". Check yours:`,
  },

  "future-alignment-checker": {
    name: "Future Alignment Checker",
    heroTagline: "Long-Term Compatibility Scan",
    accentGradient: "from-emerald-400 via-green-500 to-emerald-400",
    glowColor: "rgba(16,185,129,0.25)",
    confettiColors: ["#10b981","#34d399","#6ee7b7","#059669","#0d9488","#99f6e4"],
    iconClass: "text-emerald-500",
    iconBgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    sectionLabels: {
      strengths: "Shared Ground",
      risks: "Friction Points",
      watchNext: "Alignment Gaps",
      tryNext: "Bridge-Building Steps",
      safe: "First Alignment Conversation",
      explanation: "Your Alignment Report",
      signals: "Alignment Signals",
    },
    heroTitle: (r) => {
      const idMap: Partial<Record<PatternId, string>> = {
        "strong-alignment": "You're Well Aligned for the Future ✓",
        "good-chemistry-some-friction": "Good Alignment With Some Friction",
        "uneven-long-term-alignment": "Uneven Long-Term Alignment",
        "high-attraction-low-structural-fit": "Strong Chemistry, Weak Structure",
        "future-mismatch": "Significant Future Mismatch Found",
      };
      if (r.dominantPattern?.id && idMap[r.dominantPattern.id]) return idMap[r.dominantPattern.id]!;
      return (({ low: "Strong Future Alignment ✓", moderate: "Moderate Alignment Found", elevated: "Alignment Gaps Detected", high: "Misaligned Future Goals" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"];
    },
    shareText: (r) => `LoveCheck checked my future alignment — "${r.dominantPattern?.name ?? "see result"}". Check yours:`,
  },

  "compatibility-compass": {
    name: "Compatibility Compass",
    heroTagline: "Relationship Compatibility Reading",
    accentGradient: "from-blue-400 via-indigo-500 to-blue-400",
    glowColor: "rgba(99,102,241,0.25)",
    confettiColors: ["#6366f1","#818cf8","#c7d2fe","#4f46e5","#7c3aed","#a78bfa"],
    iconClass: "text-indigo-500",
    iconBgClass: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
    sectionLabels: {
      strengths: "Compatibility Strengths",
      risks: "Compatibility Gaps",
      watchNext: "Watch These Areas",
      tryNext: "Deepen Connection",
      safe: "Start Here",
      explanation: "Compatibility Reading",
      signals: "Compatibility Signals",
    },
    heroTitle: (r) => (({ low: "You're Highly Compatible ✓", moderate: "Good Compatibility With Gaps", elevated: "Compatibility Challenges Found", high: "Low Compatibility Detected" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"],
    shareText: (r) => `LoveCheck ran a compatibility check — "${r.dominantPattern?.name ?? "see result"}". Try yours:`,
  },

  "flirty-reply-coach": {
    name: "Flirty Reply Coach",
    heroTagline: "Reply Strategy & Charm Analysis",
    accentGradient: "from-pink-400 via-fuchsia-500 to-pink-400",
    glowColor: "rgba(236,72,153,0.25)",
    confettiColors: ["#ec4899","#f472b6","#fbcfe8","#db2777","#a855f7","#e879f9"],
    iconClass: "text-pink-500",
    iconBgClass: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-800",
    sectionLabels: {
      strengths: "What's Charming ✨",
      risks: "What To Refine",
      watchNext: "Tone Pointers",
      tryNext: "Reply Techniques",
      safe: "Safe Opener",
      explanation: "Your Reply Profile",
      signals: "Charm Signals",
    },
    heroTitle: (r) => (({ low: "You Have Great Reply Game ✨", moderate: "Solid Replies With Room to Grow", elevated: "Your Replies Need a Refresh", high: "Time to Rethink Your Approach" }) as Record<RiskLevel, string>)[r.dominantPattern?.riskLevel ?? "moderate"],
    shareText: (r) => `LoveCheck coached my flirty replies — "${r.dominantPattern?.name ?? "see result"}". Check yours:`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Per-tool visual components
// ─────────────────────────────────────────────────────────────────────────────

/** 1. Red Flag Scanner — animated flag poles */
function RedFlagVisual({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const flagCount = ({ low: 0, moderate: 2, elevated: 4, high: 6 } as Record<RiskLevel, number>)[riskLevel];
  const total = 6;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="flex items-end justify-center gap-4">
        {Array.from({ length: total }, (_, i) => {
          const raised = i < flagCount;
          return (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 12 }}
                animate={{ opacity: raised ? 1 : 0.12, y: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.1 + 0.25, duration: 0.35, ease: "backOut" }}
                className={cn(
                  "w-8 h-6 rounded-r-md",
                  raised
                    ? "bg-gradient-to-br from-rose-400 to-red-600 shadow-sm shadow-rose-300/60 dark:shadow-rose-900/40"
                    : "bg-muted/40"
                )}
              />
              <div className={cn("w-[2px] h-10", raised ? "bg-rose-300/80 dark:bg-rose-700/50" : "bg-muted-foreground/15")} />
              <div className={cn("w-4 h-1.5 rounded-full", raised ? "bg-rose-200 dark:bg-rose-900/60" : "bg-muted/40")} />
            </div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 1, duration: 0.4 }}
        className="text-center"
      >
        <div className={cn("text-5xl font-black tabular-nums", flagCount === 0 ? "text-emerald-500" : "text-rose-500")}>
          {flagCount === 0 ? "0" : flagCount}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5 font-medium">
          {flagCount === 0 ? "No warning signs detected" : `warning sign${flagCount !== 1 ? "s" : ""} identified`}
        </div>
      </motion.div>
    </div>
  );
}

/** 2. Attachment Style Lens — 4-quadrant style wheel */
function AttachmentWheel({ patternId, riskLevel }: { patternId?: PatternId; riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const activeStyle: AttachStyle = (patternId ? PATTERN_ATTACH[patternId] : undefined) ?? RISK_ATTACH[riskLevel];

  const quadrants: Array<{ id: AttachStyle; label: string; sub: string }> = [
    { id: "anxious",      label: "Anxious",   sub: "Craves closeness,\nfears rejection"   },
    { id: "secure",       label: "Secure",    sub: "Comfortable\nwith intimacy"           },
    { id: "disorganized", label: "Complex",   sub: "Mixed attachment\nsignals"            },
    { id: "avoidant",     label: "Avoidant",  sub: "Values space\nand independence"       },
  ];

  return (
    <div className="w-full max-w-[260px] mx-auto">
      <div className="grid grid-cols-2 gap-2">
        {quadrants.map((q, i) => {
          const isActive = q.id === activeStyle;
          const c = ATTACH_COLORS[q.id];
          return (
            <motion.div
              key={q.id}
              initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduced ? 0 : i * 0.08 + 0.2, type: "spring", stiffness: 280, damping: 22 }}
              className={cn(
                "rounded-xl p-3 border-2 text-center min-h-[80px] flex flex-col items-center justify-center gap-0.5",
                isActive ? `${c.bg} ${c.border} shadow-md` : "border-border bg-muted/20 opacity-35"
              )}
            >
              {isActive && <div className={cn("text-sm font-black", c.check)}>✓</div>}
              <div className={cn("text-xs font-bold leading-tight", isActive ? c.text : "text-muted-foreground")}>{q.label}</div>
              {isActive && <div className="text-[10px] text-muted-foreground whitespace-pre-line leading-tight mt-0.5">{q.sub}</div>}
            </motion.div>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-muted-foreground mt-2 tracking-wide uppercase">Attachment Style Profile</p>
    </div>
  );
}

/** 3. Communication Pattern — stacked health bars */
function ChatFlowVisual({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const FILLS: Record<RiskLevel, [number, number, number]> = {
    low:      [88, 84, 91],
    moderate: [62, 55, 58],
    elevated: [36, 33, 28],
    high:     [16, 20, 13],
  };
  const fills = FILLS[riskLevel];
  const barColor = { low: "bg-amber-400", moderate: "bg-amber-400", elevated: "bg-orange-400", high: "bg-rose-400" }[riskLevel];
  const bars = [
    { label: "Clarity",          value: fills[0] },
    { label: "Consistency",      value: fills[1] },
    { label: "Emotional Safety", value: fills[2] },
  ];

  return (
    <div className="w-full space-y-3.5 py-2">
      <div className="flex justify-center mb-1">
        <MessagesSquare className="h-8 w-8 text-amber-400/70" />
      </div>
      {bars.map((bar, i) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground font-medium">{bar.label}</span>
            <span className={cn("font-bold tabular-nums", bar.value >= 65 ? "text-amber-500" : bar.value >= 35 ? "text-orange-500" : "text-rose-500")}>
              {bar.value}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted-foreground/10 overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", barColor)}
              initial={{ width: "0%" }}
              animate={{ width: `${bar.value}%` }}
              transition={reduced ? { duration: 0 } : { delay: i * 0.15 + 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** 4. Texting Energy Match — split energy bars */
function TextingEnergyBars({ riskLevel, signals }: { riskLevel: RiskLevel; signals: FinalResult["signals"] }) {
  const reduced = useReducedMotion();
  const effort = signals.effort_imbalance ?? 0;
  const mismatch = signals.enthusiasm_mismatch ?? 0;
  const yourRaw = 90 - effort * 12;
  const themRaw = 85 - effort * 22 - mismatch * 18;
  const you  = Math.min(100, Math.max(8, Math.round(yourRaw)));
  const them = Math.min(100, Math.max(5, Math.round(themRaw)));
  const balanced = Math.abs(you - them) < 18;

  const bars = [
    { label: "Your Energy",   value: you,  color: "bg-teal-400"  },
    { label: "Their Energy",  value: them, color: balanced ? "bg-teal-400" : "bg-rose-400" },
  ];

  return (
    <div className="w-full space-y-4 py-2">
      <div className="space-y-3.5">
        {bars.map((bar, i) => (
          <div key={bar.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-medium">{bar.label}</span>
              <span className={cn("font-bold tabular-nums", bar.value >= 70 ? "text-teal-500" : bar.value >= 40 ? "text-amber-500" : "text-rose-500")}>
                {bar.value}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted-foreground/10 overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", bar.color)}
                initial={{ width: "0%" }}
                animate={{ width: `${bar.value}%` }}
                transition={reduced ? { duration: 0 } : { delay: i * 0.2 + 0.3, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 1.3 }}
        className={cn(
          "text-center text-xs font-semibold rounded-lg py-1.5 px-3",
          balanced
            ? "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400"
            : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
        )}
      >
        {balanced ? "✓ Energy levels are well-matched" : "⚡ Energy imbalance detected"}
      </motion.div>
    </div>
  );
}

/** 5. Love Bombing Detector — pulsing intensity circle */
function IntensityMeter({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const CFG = {
    low:      { label: "Healthy Pace",    pct: 18,  gradient: "from-emerald-400 to-teal-500",  glow: "rgba(16,185,129,0.3)",  pulse: 1.04, badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
    moderate: { label: "Moving Quickly", pct: 45,  gradient: "from-amber-400 to-orange-500",   glow: "rgba(245,158,11,0.3)",  pulse: 1.08, badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
    elevated: { label: "Very Intense",   pct: 72,  gradient: "from-orange-400 to-red-500",     glow: "rgba(249,115,22,0.3)",  pulse: 1.13, badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300" },
    high:     { label: "Overwhelming",   pct: 96,  gradient: "from-rose-500 to-red-600",       glow: "rgba(244,63,94,0.4)",   pulse: 1.19, badge: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
  };
  const cfg = CFG[riskLevel];

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="relative flex items-center justify-center">
        {!reduced && (
          <motion.div
            className="absolute rounded-full"
            style={{ width: 136, height: 136, background: cfg.glow }}
            animate={{ scale: [1, cfg.pulse, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.div
          className={cn("relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br shadow-xl", cfg.gradient)}
          initial={reduced ? {} : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.15 }}
        >
          <div className="text-center text-white">
            <div className="text-4xl font-black tabular-nums">{cfg.pct}%</div>
            <div className="text-[10px] font-bold opacity-80 tracking-widest uppercase mt-0.5">Intensity</div>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.65 }}
        className={cn("text-sm font-bold px-4 py-1.5 rounded-full", cfg.badge)}
      >
        {cfg.label}
      </motion.div>
    </div>
  );
}

/** 6. Future Alignment — two-path SVG converging or diverging */
function AlignmentPath({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const CFG = {
    low:      { p1: "M 20 55 Q 110 55, 200 58", p2: "M 20 65 Q 110 65, 200 62", label: "Paths Are Merging ✓",   color: "#10b981", merge: true  },
    moderate: { p1: "M 20 45 Q 110 48, 200 52", p2: "M 20 75 Q 110 72, 200 68", label: "Paths Are Close",       color: "#f59e0b", merge: false },
    elevated: { p1: "M 20 40 Q 100 30, 200 15", p2: "M 20 80 Q 100 90, 200 105",label: "Paths Are Diverging",   color: "#f97316", merge: false },
    high:     { p1: "M 20 50 Q 70 28, 200 5",   p2: "M 20 70 Q 70 92, 200 115", label: "Paths Are Far Apart",   color: "#f43f5e", merge: false },
  };
  const cfg = CFG[riskLevel];

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <svg viewBox="0 0 220 120" className="w-full max-w-[260px]" aria-hidden>
        <circle cx="20" cy="55" r="5" fill={cfg.color} fillOpacity="0.85" />
        <circle cx="20" cy="65" r="5" fill={cfg.color} fillOpacity="0.55" />
        <motion.path
          d={cfg.p1} fill="none" stroke={cfg.color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.9"
          initial={reduced ? {} : { pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.path
          d={cfg.p2} fill="none" stroke={cfg.color} strokeWidth="3" strokeLinecap="round" strokeOpacity="0.55" strokeDasharray="7 3"
          initial={reduced ? {} : { pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
        />
        {cfg.merge && (
          <motion.circle cx="200" cy="60" r="7" fill={cfg.color}
            initial={reduced ? {} : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduced ? 0 : 1.5, type: "spring" }}
          />
        )}
        <text x="6" y="52" fill={cfg.color} fontSize="8" fontWeight="700" fillOpacity="0.85">You</text>
        <text x="6" y="82" fill={cfg.color} fontSize="8" fontWeight="700" fillOpacity="0.55">Partner</text>
      </svg>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 1.2 }}
        className="text-xs font-semibold text-muted-foreground"
      >
        {cfg.label}
      </motion.p>
    </div>
  );
}

/** 7. Compatibility Compass — animated SVG compass needle */
function CompassVisual({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const ANGLES: Record<RiskLevel, number> = { low: -42, moderate: 8, elevated: 62, high: 118 };
  const LABELS: Record<RiskLevel, string> = { low: "Great Match",  moderate: "Good Fit",  elevated: "Some Friction", high: "Different Paths" };
  const NCOLORS: Record<RiskLevel, string> = { low: "#10b981", moderate: "#f59e0b", elevated: "#f97316", high: "#f43f5e" };

  const angle = ANGLES[riskLevel];
  const label = LABELS[riskLevel];
  const nColor = NCOLORS[riskLevel];
  const CX = 60, CY = 60, R = 50;

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <svg viewBox="0 0 120 130" className="w-36 h-36" aria-hidden>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" className="text-foreground" />
        <circle cx={CX} cy={CY} r={R - 10} fill="currentColor" fillOpacity="0.025" className="text-foreground" />
        {[{ t: "N", x: CX, y: CY - R + 9 }, { t: "S", x: CX, y: CY + R - 3 }, { t: "E", x: CX + R - 5, y: CY + 4 }, { t: "W", x: CX - R + 5, y: CY + 4 }].map(d => (
          <text key={d.t} x={d.x} y={d.y} textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor" fillOpacity="0.35" className="select-none text-foreground">{d.t}</text>
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={CX + (R - 1) * Math.sin(a)} y1={CY - (R - 1) * Math.cos(a)} x2={CX + (R - 6) * Math.sin(a)} y2={CY - (R - 6) * Math.cos(a)} stroke="currentColor" strokeOpacity="0.13" strokeWidth="1" className="text-foreground" />;
        })}
        {/* Needle — framer-motion rotate around CX,CY */}
        <motion.line
          x1={CX} y1={CY} x2={CX} y2={CY - 36}
          stroke={nColor} strokeWidth="3.5" strokeLinecap="round"
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={reduced ? {} : { rotate: -200 }}
          animate={{ rotate: angle }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 12, delay: 0.3 }}
        />
        <motion.line
          x1={CX} y1={CY} x2={CX} y2={CY + 18}
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.28"
          className="text-muted-foreground"
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={reduced ? {} : { rotate: -200 }}
          animate={{ rotate: angle }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 70, damping: 12, delay: 0.3 }}
        />
        <circle cx={CX} cy={CY} r="5" fill="currentColor" fillOpacity="0.6" className="text-foreground" />
        <circle cx={CX} cy={CY} r="2.5" fill={nColor} />
        <text x={CX} y={118} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={nColor} fillOpacity="0.9" className="select-none">{label}</text>
      </svg>
    </div>
  );
}

/** 8. Flirty Reply Coach — star charm meter */
function CharmMeter({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const CHARM: Record<RiskLevel, { stars: number; label: string; labelClass: string }> = {
    low:      { stars: 5, label: "Excellent Charm Level",     labelClass: "text-pink-500"    },
    moderate: { stars: 4, label: "Good Charm, Keep Refining", labelClass: "text-pink-400"    },
    elevated: { stars: 2, label: "Needs Work",                labelClass: "text-fuchsia-400" },
    high:     { stars: 1, label: "Time to Rethink Approach",  labelClass: "text-purple-400"  },
  };
  const cfg = CHARM[riskLevel];

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < cfg.stars;
          return (
            <motion.div
              key={i}
              initial={reduced ? {} : { opacity: 0, scale: 0, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: reduced ? 0 : i * 0.08 + 0.2, type: "spring", stiffness: 320, damping: 16 }}
            >
              <Star
                className={cn(
                  "h-10 w-10",
                  filled
                    ? "text-pink-400 fill-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.55)]"
                    : "text-muted-foreground/20"
                )}
              />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.75 }}
        className={cn("text-sm font-bold", cfg.labelClass)}
      >
        {cfg.label}
      </motion.div>
    </div>
  );
}

/** Animated risk gauge bar — kept for relationship-risk-radar */
function AnimatedRiskGauge({ riskLevel }: { riskLevel: RiskLevel }) {
  const reduced = useReducedMotion();
  const riskMap: Record<RiskLevel, { pct: number; color: string; label: string }> = {
    low:      { pct: 20, color: "bg-emerald-500", label: "Low"      },
    moderate: { pct: 45, color: "bg-amber-500",   label: "Moderate" },
    elevated: { pct: 70, color: "bg-orange-500",  label: "Elevated" },
    high:     { pct: 92, color: "bg-rose-500",    label: "High"     },
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

// ─────────────────────────────────────────────────────────────────────────────
// Decoration & Effect Components
// ─────────────────────────────────────────────────────────────────────────────

function LowRiskDecoration() {
  const positions = [
    { top: "-8px", left: "12%", size: 14, delay: 0 },
    { top: "10%", right: "-6px", size: 12, delay: 0.2 },
    { bottom: "15%", left: "-8px", size: 10, delay: 0.4 },
    { bottom: "-6px", right: "15%", size: 16, delay: 0.1 },
    { top: "40%", right: "-10px", size: 8, delay: 0.6 },
    { top: "-4px", right: "30%", size: 10, delay: 0.3 },
  ];
  return (
    <AnimatePresence>
      {positions.map((pos, i) => (
        <motion.div
          key={i} className="pointer-events-none absolute z-10"
          style={{ top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.6, 1], scale: [0, 1.2, 1, 1.1] }}
          transition={{ duration: 1.5, delay: pos.delay, repeat: Infinity, repeatDelay: 2.5 + i * 0.3 }}
        >
          <Star className="text-amber-400/70 dark:text-amber-300/50" style={{ width: pos.size, height: pos.size, fill: "currentColor" }} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function ToolConfetti({ colors }: { colors: string[] }) {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.5;
      const dist = 70 + Math.random() * 150;
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rotation: Math.random() * 360 - 180,
        scale: 0.55 + Math.random() * 0.65,
        delay: i * 0.035,
      };
    })
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id} className="absolute"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, p.scale, p.scale * 0.8], x: p.x, y: p.y + 80, rotate: p.rotation }}
          transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
        >
          <svg width={12} height={12} viewBox="0 0 24 24" fill={p.color}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function FloatingParticles() {
  const reduced = useReducedMotion();
  const particles = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: `${6 + Math.random() * 88}%`,
      size: 7 + Math.random() * 9,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      opacity: 0.12 + Math.random() * 0.18,
    })), []
  );
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute" style={{ left: p.left, bottom: "-20px" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [0, -380, -460], opacity: [0, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, repeatDelay: 2 + Math.random() * 3, ease: "easeOut" }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="rgba(244,63,94,0.55)">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// useTypewriter hook
// ─────────────────────────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 20, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (!enabled) { setDisplayed(text); setIsDone(true); return; }
    setDisplayed(""); setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setIsDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, enabled]);
  return { displayed, isDone };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool Hero Section
// ─────────────────────────────────────────────────────────────────────────────

function ToolHeroSection({ result, toolUI }: { result: FinalResult; toolUI: ToolUI }) {
  const reduced = useReducedMotion();
  const Icon = TOOL_ICONS[result.toolSlug];
  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center space-y-2.5 mb-5"
    >
      <motion.div
        initial={reduced ? {} : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.08 }}
        className="flex justify-center"
      >
        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-md", toolUI.iconBgClass)}>
          <Icon className={cn("h-8 w-8", toolUI.iconClass)} />
        </div>
      </motion.div>

      <div className="flex justify-center">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase px-3 py-1 rounded-full bg-muted/60">
          {toolUI.heroTagline}
        </span>
      </div>

      <motion.h1
        initial={reduced ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.2 }}
        className="text-2xl sm:text-3xl font-black tracking-tight leading-tight"
      >
        {toolUI.heroTitle(result)}
      </motion.h1>

      <motion.p
        initial={reduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.35 }}
        className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto"
      >
        {result.summary}
      </motion.p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tool visual switcher
// ─────────────────────────────────────────────────────────────────────────────

function ToolVisual({ result }: { result: FinalResult }) {
  const riskLevel = result.dominantPattern?.riskLevel ?? "moderate";
  const patternId = result.dominantPattern?.id;

  switch (result.toolSlug) {
    case "red-flag-scanner":
      return <RedFlagVisual riskLevel={riskLevel} />;
    case "relationship-risk-radar":
      return (
        <div className="w-full space-y-4">
          <RiskMeter riskLevel={riskLevel} className="py-1" />
          <AnimatedRiskGauge riskLevel={riskLevel} />
        </div>
      );
    case "attachment-style-lens":
      return <AttachmentWheel patternId={patternId} riskLevel={riskLevel} />;
    case "communication-pattern-check":
      return <ChatFlowVisual riskLevel={riskLevel} />;
    case "texting-energy-match":
      return <TextingEnergyBars riskLevel={riskLevel} signals={result.signals} />;
    case "love-bombing-detector":
      return <IntensityMeter riskLevel={riskLevel} />;
    case "future-alignment-checker":
      return <AlignmentPath riskLevel={riskLevel} />;
    case "compatibility-compass":
      return <CompassVisual riskLevel={riskLevel} />;
    case "flirty-reply-coach":
      return <CharmMeter riskLevel={riskLevel} />;
    default:
      return <RiskMeter riskLevel={riskLevel} className="py-1" />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ResultPage
// ─────────────────────────────────────────────────────────────────────────────

export function ResultPage({ result }: ResultPageProps) {
  const { resetSession, startToolIntro, activeTool } = useLoveCheckStore();
  const reduced = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(true);
  const [explanationReady, setExplanationReady] = useState(false);

  const toolUI = TOOL_UI[result.toolSlug] ?? TOOL_UI["relationship-risk-radar"];
  const labels = toolUI.sectionLabels;
  const isLowRisk = result.dominantPattern?.riskLevel === "low";

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setExplanationReady(true), reduced ? 0 : 800);
    return () => clearTimeout(t);
  }, [reduced]);

  const { displayed: typedExpl, isDone: typeDone } = useTypewriter(
    result.personalizedExplanation, 18, explanationReady
  );

  const handleRetake = () => {
    if (activeTool) startToolIntro(activeTool);
    else startToolIntro("relationship-risk-radar");
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
  const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={container} initial="hidden" animate="show"
      className="mx-auto max-w-2xl px-4 py-6 sm:py-10"
    >
      {/* ── Nav bar ─────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={resetSession}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={resetSession}>
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Try Again</span>
        </Button>
      </div>

      {/* ── Tool Hero ────────────────────────────── */}
      <motion.div variants={item}>
        <ToolHeroSection result={result} toolUI={toolUI} />
      </motion.div>

      {/* ── Main Result Card ─────────────────────── */}
      <motion.div variants={item} className="relative">
        <FloatingParticles />
        {isLowRisk && <LowRiskDecoration />}
        {showConfetti && !reduced && <ToolConfetti colors={toolUI.confettiColors} />}

        {/* Tool-colored reveal glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl z-30"
          initial={{ opacity: 0 }}
          animate={reduced ? { opacity: 0 } : {
            opacity: [0, 0.6, 0],
            boxShadow: [`0 0 0 0 ${toolUI.glowColor}`, `0 0 40px 14px ${toolUI.glowColor}`, `0 0 0 0 ${toolUI.glowColor}`],
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />

        <motion.div
          initial={reduced ? {} : { scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 20 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-b from-card via-card to-muted/30" data-result-card>
            {/* Tool-specific accent bar */}
            <div className={cn("h-1.5 bg-gradient-to-r", toolUI.accentGradient)} />

            <CardContent className="p-6 sm:p-8 space-y-5">
              {/* Tool-specific visual */}
              <div className="flex justify-center">
                <div className="w-full max-w-sm">
                  <ToolVisual result={result} />
                </div>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                {result.dominantPattern && <PatternBadge patternId={result.dominantPattern.id} />}
                {result.dominantPattern && <RiskBadge level={result.dominantPattern.riskLevel} />}
                {result.dominantPattern && <ConfidenceChip level={result.dominantPattern.confidence} />}
                {result.aiEnhanced && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-100 via-fuchsia-100 to-violet-100 dark:from-violet-950/70 dark:via-fuchsia-950/50 dark:to-violet-950/70 px-2.5 py-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300 ring-1 ring-violet-200/60 dark:ring-violet-800/40">
                    <Sparkles className="h-3 w-3" /> AI Enhanced
                  </span>
                )}
              </div>

              {/* Personalized explanation — typewriter */}
              <div className="rounded-xl bg-muted/40 p-4 sm:p-5 border border-border/50">
                <div className="flex items-center gap-1.5 mb-2">
                  <Activity className="h-3.5 w-3.5 text-primary/60" />
                  <span className="text-xs font-semibold text-muted-foreground">{labels.explanation}</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {typedExpl}
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
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">AI Insight</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.aiInsights}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ── Insight Cards — tool-specific labels ─── */}
      <div className="mt-6 space-y-4">
        {result.strengths.length > 0 && (
          <motion.div variants={item}>
            <InsightCard title={labels.strengths} items={result.strengths} variant="strength" />
          </motion.div>
        )}
        {result.risks.length > 0 && (
          <motion.div variants={item}>
            <InsightCard title={labels.risks} items={result.risks} variant="risk" />
          </motion.div>
        )}
        {result.watchNext.length > 0 && (
          <motion.div variants={item}>
            <InsightCard title={labels.watchNext} items={result.watchNext} variant="watch" />
          </motion.div>
        )}
        {result.tryNext.length > 0 && (
          <motion.div variants={item}>
            <InsightCard title={labels.tryNext} items={result.tryNext} variant="try" />
          </motion.div>
        )}
        {result.safeSuggestion && (
          <motion.div variants={item}>
            <InsightCard title={labels.safe} items={[result.safeSuggestion]} variant="safe" />
          </motion.div>
        )}
      </div>

      {/* ── Signal Breakdown ────────────────────── */}
      {Object.values(result.signals).some((v) => v !== 0) && (
        <motion.div variants={item} className="mt-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {labels.signals}
                </h3>
              </div>
              <SignalBars signals={result.signals} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Next Tools ──────────────────────────── */}
      {result.recommendedTools.length > 0 && (
        <motion.div variants={item} className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recommended Next Steps
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.recommendedTools
              .filter((t, idx, arr) => arr.findIndex((x) => x.slug === t.slug) === idx)
              .slice(0, 4)
              .map((tool, idx) => (
                <NextToolCard key={`${tool.slug}-${idx}`} tool={tool} onStartTool={() => {}} />
              ))}
          </div>
        </motion.div>
      )}

      {/* ── Share ───────────────────────────────── */}
      <motion.div variants={item} className="mt-6">
        <ShareSection text={toolUI.shareText(result)} result={result} />
      </motion.div>

      {/* ── Disclaimer ──────────────────────────── */}
      <motion.div variants={item} className="mt-6 mb-8">
        <div className="flex items-start gap-2 rounded-xl bg-muted/30 p-4">
          <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This analysis identifies patterns, not diagnoses. It&apos;s not a substitute for professional
            therapy or medical advice. If you&apos;re in an unsafe situation, please reach out to a qualified
            professional or crisis helpline.
          </p>
        </div>
      </motion.div>

      {/* ── CTA ─────────────────────────────────── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-8">
        <Button variant="outline" size="lg" className="gap-2 rounded-xl hover:bg-primary/5" onClick={handleRetake}>
          <RotateCcw className="h-4 w-4" />
          Retake Assessment
        </Button>
        <Button size="lg" className="gap-2 rounded-xl shadow-md shadow-primary/15" onClick={resetSession}>
          <Home className="h-4 w-4" />
          Explore All Tools
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ResultLoading — skeleton while API call is in flight
// ─────────────────────────────────────────────────────────────────────────────

export function ResultLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 space-y-4">
      <div className="mb-6"><Skeleton className="h-4 w-20" /></div>

      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-3 mb-5">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-b from-card via-card to-muted/30">
        <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-pulse" />
        <CardContent className="p-6 sm:p-8 space-y-5">
          {/* Visual skeleton */}
          <div className="flex justify-center py-2">
            <div className="relative">
              <Skeleton className="h-36 w-36 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
            </div>
          </div>
          {/* Badge row */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          {/* Explanation */}
          <Skeleton className="h-24 w-full rounded-xl" />
          {/* AI insight */}
          <div className="rounded-xl bg-muted/40 p-4 space-y-2">
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Loader */}
      <div className="flex flex-col items-center justify-center gap-3 py-8">
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
