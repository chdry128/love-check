"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Lock,
  Zap,
  ShieldCheck,
  Radar,
  Heart,
  MessagesSquare,
  MessageCircle,
  Shield,
  Target,
  Wand2,
  Compass,
  ShieldAlert,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ToolConfig } from "@/types";

interface ToolIntroProps {
  tool: ToolConfig;
  onStart: () => void;
  onBack: () => void;
}

// Map tool slugs to their icons and color themes
const toolThemes: Record<string, { icon: LucideIcon; gradient: string; ringColor: string; bgGlow: string }> = {
  "relationship-risk-radar": {
    icon: Radar,
    gradient: "from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/40",
    ringColor: "ring-rose-200/60 dark:ring-rose-800/30",
    bgGlow: "bg-gradient-to-br from-rose-100/60 via-rose-50/40 to-transparent dark:from-rose-950/30 dark:via-rose-900/20 dark:to-transparent",
    glowAccent: "from-rose-400 to-orange-300",
  },
  "attachment-style-lens": {
    icon: Heart,
    gradient: "from-violet-50 to-purple-50 dark:from-violet-950/60 dark:to-purple-950/40",
    ringColor: "ring-violet-200/60 dark:ring-violet-800/30",
    bgGlow: "bg-gradient-to-br from-violet-100/60 via-violet-50/40 to-transparent dark:from-violet-950/30 dark:via-violet-900/20 dark:to-transparent",
    glowAccent: "from-violet-400 to-purple-300",
  },
  "communication-pattern-check": {
    icon: MessagesSquare,
    gradient: "from-amber-50 to-yellow-50 dark:from-amber-950/60 dark:to-yellow-950/40",
    ringColor: "ring-amber-200/60 dark:ring-amber-800/30",
    bgGlow: "bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-transparent dark:from-amber-950/30 dark:via-amber-900/20 dark:to-transparent",
    glowAccent: "from-amber-400 to-yellow-300",
  },
  "texting-energy-match": {
    icon: MessageCircle,
    gradient: "from-teal-50 to-cyan-50 dark:from-teal-950/60 dark:to-cyan-950/40",
    ringColor: "ring-teal-200/60 dark:ring-teal-800/30",
    bgGlow: "bg-gradient-to-br from-teal-100/60 via-teal-50/40 to-transparent dark:from-teal-950/30 dark:via-teal-900/20 dark:to-transparent",
    glowAccent: "from-teal-400 to-cyan-300",
  },
  "love-bombing-detector": {
    icon: Shield,
    gradient: "from-orange-50 to-red-50 dark:from-orange-950/60 dark:to-red-950/40",
    ringColor: "ring-orange-200/60 dark:ring-orange-800/30",
    bgGlow: "bg-gradient-to-br from-orange-100/60 via-orange-50/40 to-transparent dark:from-orange-950/30 dark:via-orange-900/20 dark:to-transparent",
    glowAccent: "from-orange-400 to-red-300",
  },
  "future-alignment-checker": {
    icon: Target,
    gradient: "from-emerald-50 to-green-50 dark:from-emerald-950/60 dark:to-green-950/40",
    ringColor: "ring-emerald-200/60 dark:ring-emerald-800/30",
    bgGlow: "bg-gradient-to-br from-emerald-100/60 via-emerald-50/40 to-transparent dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-transparent",
    glowAccent: "from-emerald-400 to-green-300",
  },
  "flirty-reply-coach": {
    icon: Wand2,
    gradient: "from-pink-50 to-rose-50 dark:from-pink-950/60 dark:to-rose-950/40",
    ringColor: "ring-pink-200/60 dark:ring-pink-800/30",
    bgGlow: "bg-gradient-to-br from-pink-100/60 via-pink-50/40 to-transparent dark:from-pink-950/30 dark:via-pink-900/20 dark:to-transparent",
    glowAccent: "from-pink-400 to-rose-300",
  },
  "compatibility-compass": {
    icon: Compass,
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/40",
    ringColor: "ring-emerald-200/60 dark:ring-emerald-800/30",
    bgGlow: "bg-gradient-to-br from-emerald-100/60 via-emerald-50/40 to-transparent dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-transparent",
    glowAccent: "from-emerald-400 to-teal-300",
  },
  "red-flag-scanner": {
    icon: ShieldAlert,
    gradient: "from-red-50 to-orange-50 dark:from-red-950/60 dark:to-orange-950/40",
    ringColor: "ring-red-200/60 dark:ring-red-800/30",
    bgGlow: "bg-gradient-to-br from-red-100/60 via-red-50/40 to-transparent dark:from-red-950/30 dark:via-red-900/20 dark:to-transparent",
    glowAccent: "from-red-400 to-orange-300",
  },
};

const defaultTheme = {
  icon: Brain,
  gradient: "from-rose-50 to-orange-50 dark:from-rose-950/60 dark:to-orange-950/40",
  ringColor: "ring-rose-200/60 dark:ring-rose-800/30",
  bgGlow: "bg-gradient-to-br from-rose-100/60 via-rose-50/40 to-transparent dark:from-rose-950/30 dark:via-rose-900/20 dark:to-transparent",
  glowAccent: "from-rose-400 to-orange-300",
};

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

// Color gradient configs for step circles
const stepColors = [
  { from: "from-rose-400", to: "to-rose-500", shadow: "shadow-rose-200 dark:shadow-rose-950/50", darkFrom: "dark:from-rose-600", darkTo: "dark:to-rose-700" },
  { from: "from-orange-400", to: "to-orange-500", shadow: "shadow-orange-200 dark:shadow-orange-950/50", darkFrom: "dark:from-orange-600", darkTo: "dark:to-orange-700" },
  { from: "from-amber-400", to: "to-amber-500", shadow: "shadow-amber-200 dark:shadow-amber-950/50", darkFrom: "dark:from-amber-600", darkTo: "dark:to-amber-700" },
];

const connectorGradient = "from-rose-300 via-rose-200 to-rose-100 dark:from-rose-700 dark:via-rose-800 dark:to-rose-900";

export function ToolIntro({ tool, onStart, onBack }: ToolIntroProps) {
  const theme = toolThemes[tool.slug] ?? defaultTheme;
  const ToolIcon = theme.icon;

  return (
    <div className="fade-in mx-auto max-w-lg px-4 py-8 sm:py-12 relative">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full ${theme.bgGlow} blur-3xl`} />
        <div className={`absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-gradient-to-tl ${theme.glowAccent} opacity-20 blur-3xl`} />
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
          {/* Icon with dynamic gradient and glow */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Glow ring */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${theme.glowAccent} opacity-20 blur-lg animate-pulse`} />
              <div className={`relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${theme.gradient} ring-1 ${theme.ringColor}`}>
                <ToolIcon className="h-9 w-9 text-rose-500 dark:text-rose-400" />
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
            className="flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {tool.estimatedTime}
            </span>
            <span className="text-border">|</span>
            <span>{tool.estimatedQuestions} questions</span>
            <span className="text-border">|</span>
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Adaptive
            </span>
          </motion.div>

          {/* What to expect */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl border bg-muted/30 p-5 text-left">
              <h3 className="text-sm font-semibold mb-4">What to expect</h3>
              <div className="relative space-y-0">
                {/* Connector line */}
                <div className={`absolute left-[15px] top-[30px] bottom-[30px] w-px bg-gradient-to-b ${connectorGradient}`} />

                {[
                  "Start with a routing question that sets your path",
                  `Answer ${tool.estimatedQuestions} follow-up questions (one at a time)`,
                  "Get your personalized pattern analysis",
                ].map((step, i) => {
                  const colors = stepColors[i];
                  return (
                    <div key={i} className="flex gap-3 items-start pb-5 last:pb-0">
                      <div className={`relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${colors.from} ${colors.to} ${colors.darkFrom} ${colors.darkTo} text-white text-xs font-bold ${colors.shadow}`}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-muted-foreground pt-1">
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Trust badges */}
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
              <Clock className="h-3 w-3" />
              {tool.estimatedTime}
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
