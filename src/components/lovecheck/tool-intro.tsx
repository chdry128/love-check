"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Clock, Lock, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import type { ToolConfig } from "@/types";

interface ToolIntroProps {
  tool: ToolConfig;
  onStart: () => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function ToolIntro({ tool, onStart, onBack }: ToolIntroProps) {
  return (
    <div className="fade-in mx-auto max-w-lg px-4 py-8 sm:py-12 relative">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-b from-rose-100/60 via-rose-50/40 to-transparent blur-3xl dark:from-rose-950/30 dark:via-rose-900/20 dark:to-transparent" />
        <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-gradient-to-tl from-orange-100/50 via-orange-50/30 to-transparent blur-3xl dark:from-orange-950/20 dark:via-orange-900/10 dark:to-transparent" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Back button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </motion.div>

        <div className="text-center space-y-6">
          {/* Icon — Lucide Radar with gradient container and glow */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-400 to-orange-300 opacity-20 blur-lg animate-pulse" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-50 to-orange-50 ring-1 ring-rose-200/60 dark:from-rose-950/60 dark:to-orange-950/40 dark:ring-rose-800/30">
                {tool.slug === "relationship-risk-radar" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-9 w-9 text-rose-500 dark:text-rose-400"
                  >
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M16 12H4" />
                    <circle cx="2" cy="12" r="1" />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {tool.description}
            </p>
          </motion.div>

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {tool.estimatedTime}
            </span>
            <span className="text-border">|</span>
            <span>{tool.estimatedQuestions} questions</span>
            <span className="text-border">|</span>
            <span>Adaptive</span>
          </motion.div>

          {/* What to expect — with connector lines and colored circles */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl border bg-muted/30 p-5 text-left">
              <h3 className="text-sm font-semibold mb-4">What to expect</h3>
              <div className="relative space-y-0">
                {/* Connector line */}
                <div className="absolute left-[15px] top-[30px] bottom-[30px] w-px bg-gradient-to-b from-rose-300 via-rose-200 to-rose-100 dark:from-rose-700 dark:via-rose-800 dark:to-rose-900" />

                {/* Step 1 */}
                <div className="flex gap-3 items-start pb-5">
                  <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-500 text-white text-xs font-bold shadow-sm shadow-rose-200 dark:from-rose-600 dark:to-rose-700 dark:shadow-rose-950/50">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Start with a routing question that sets your path
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex gap-3 items-start pb-5">
                  <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white text-xs font-bold shadow-sm shadow-orange-200 dark:from-orange-600 dark:to-orange-700 dark:shadow-orange-950/50">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Answer 4–6 follow-up questions (one at a time)
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex gap-3 items-start">
                  <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs font-bold shadow-sm shadow-amber-200 dark:from-amber-600 dark:to-amber-700 dark:shadow-amber-950/50">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">
                    Get your personalized pattern analysis
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy trust badges */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 flex-wrap"
          >
            <Badge
              variant="secondary"
              className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/40 text-[11px] px-2.5 py-1 rounded-full"
            >
              <Lock className="h-3 w-3" />
              No account needed
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/40 text-[11px] px-2.5 py-1 rounded-full"
            >
              <Zap className="h-3 w-3" />
              3 min
            </Badge>
            <Badge
              variant="secondary"
              className="gap-1.5 bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800/40 text-[11px] px-2.5 py-1 rounded-full"
            >
              <ShieldCheck className="h-3 w-3" />
              Non-clinical
            </Badge>
          </motion.div>

          {/* Reminder */}
          <motion.p
            variants={itemVariants}
            className="text-xs text-muted-foreground/80 max-w-sm mx-auto"
          >
            There are no right or wrong answers. This tool identifies patterns —
            not diagnoses. Your answers stay private in your browser.
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              className="gap-2 px-10 text-base rounded-xl h-12 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 hover:shadow-xl hover:shadow-rose-200/60 dark:hover:shadow-rose-900/40 transition-shadow duration-300"
              onClick={onStart}
            >
              Begin
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
