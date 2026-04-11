"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, MessageSquare, Heart, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolSlug } from "@/types";

// ── Types ──────────────────────────────────────────────────

type DepthLevel = "light" | "deeper" | "heart";

interface Starter {
  text: string;
}

interface DepthConfig {
  label: string;
  icon: typeof MessageSquare;
  badgeClass: string;
  tabActiveClass: string;
  relatedTool: ToolSlug;
  relatedToolLabel: string;
}

// ── Data ───────────────────────────────────────────────────

const starters: Record<DepthLevel, Starter[]> = {
  light: [
    { text: "If we could teleport anywhere right now for dinner, where would we go and what would we order?" },
    { text: "What is the most ridiculous thing you have ever done to impress someone you liked?" },
    { text: "If your personality was a playlist, what three songs would definitely be on it?" },
    { text: "What is a small, seemingly insignificant thing I do that makes your day better?" },
    { text: "If we were characters in a romantic comedy, what would our meet-cute scene look like?" },
    { text: "What is something you are genuinely terrible at but enjoy doing anyway?" },
    { text: "Describe your perfect lazy Sunday together in exactly five words." },
    { text: "If you could read my mind for one hour, what do you think would surprise you the most?" },
  ],
  deeper: [
    { text: "When do you feel most connected to me, and when do you feel most disconnected?" },
    { text: "Is there something you have been wanting to share with me but have held back?" },
    { text: "What does emotional safety look like for you in our relationship?" },
    { text: "When was the last time you felt truly heard during a conversation between us?" },
    { text: "What is a pattern from your family that you find yourself repeating, even when you try not to?" },
    { text: "How do you usually respond when you feel misunderstood, and how would you like to be approached instead?" },
    { text: "What is something about our relationship that you feel grateful for but rarely mention out loud?" },
    { text: "If you could change one thing about how we handle disagreements, what would it be?" },
  ],
  heart: [
    { text: "What is the most vulnerable you have ever felt with me, and what made it feel safe enough?" },
    { text: "Are there any unspoken expectations you carry in our relationship that you have never voiced?" },
    { text: "What is your deepest fear about us, and what would it mean to you if we could face it together?" },
    { text: "When you think about the future of our relationship, what is the image that brings you the most peace?" },
    { text: "Is there a moment from our past together that quietly changed how you see me?" },
    { text: "What do you need from me that you feel you have to ask for repeatedly?" },
    { text: "If our relationship had a mission statement, what do you think it would say?" },
    { text: "What have you learned about love from being with me that you did not know before?" },
  ],
};

const depthConfigs: Record<DepthLevel, DepthConfig> = {
  light: {
    label: "Light & Fun",
    icon: MessageSquare,
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    tabActiveClass: "bg-rose-500 text-white dark:bg-rose-600",
    relatedTool: "texting-energy-match",
    relatedToolLabel: "Texting Energy Match",
  },
  deeper: {
    label: "Getting Deeper",
    icon: Sparkles,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    tabActiveClass: "bg-amber-500 text-white dark:bg-amber-600",
    relatedTool: "communication-pattern-check",
    relatedToolLabel: "Communication Pattern Check",
  },
  heart: {
    label: "Heart-to-Heart",
    icon: Heart,
    badgeClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    tabActiveClass: "bg-pink-500 text-white dark:bg-pink-600",
    relatedTool: "attachment-style-lens",
    relatedToolLabel: "Attachment Style Lens",
  },
};

const depthOrder: DepthLevel[] = ["light", "deeper", "heart"];

// ── Animation variants ─────────────────────────────────────

const cardVariants = {
  enter: (reduced: boolean) =>
    reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 16, scale: 0.97 },
  center: (reduced: boolean) =>
    reduced
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 1, y: 0, scale: 1 },
  exit: (reduced: boolean) =>
    reduced
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: -12, scale: 0.97 },
};

// ── Component ──────────────────────────────────────────────

interface IcebreakerGeneratorProps {
  onStartTool: (slug: ToolSlug) => void;
}

export function IcebreakerGenerator({ onStartTool }: IcebreakerGeneratorProps) {
  const [activeDepth, setActiveDepth] = useState<DepthLevel>("light");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [seenCount, setSeenCount] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const reduced = useReducedMotion();

  const currentStarter = starters[activeDepth][currentIndex];
  const config = depthConfigs[activeDepth];
  const DepthIcon = config.icon;

  const generateNew = useCallback(() => {
    const pool = starters[activeDepth];
    let nextIndex: number;
    do {
      nextIndex = Math.floor(Math.random() * pool.length);
    } while (nextIndex === currentIndex && pool.length > 1);
    setCurrentIndex(nextIndex);
    setSeenCount((c) => c + 1);
    setAnimKey((k) => k + 1);
  }, [activeDepth, currentIndex]);

  const handleDepthChange = useCallback(
    (depth: DepthLevel) => {
      if (depth === activeDepth) return;
      setActiveDepth(depth);
      setCurrentIndex(Math.floor(Math.random() * starters[depth].length));
      setSeenCount((c) => c + 1);
      setAnimKey((k) => k + 1);
    },
    [activeDepth]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Conversation Starters
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thoughtful questions to spark deeper connection. Pick a depth level and generate
          a new starter whenever you need one.
        </p>
      </div>

      {/* Depth tabs */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center rounded-xl bg-muted/60 p-1 gap-1">
          {depthOrder.map((depth) => {
            const dConfig = depthConfigs[depth];
            const DIcon = dConfig.icon;
            const isActive = depth === activeDepth;
            return (
              <button
                key={depth}
                onClick={() => handleDepthChange(depth)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200",
                  isActive
                    ? cn(dConfig.tabActiveClass, "shadow-sm")
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <DIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{dConfig.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Starter card */}
      <div className="relative mx-auto max-w-lg">
        <AnimatePresence mode="wait" custom={reduced}>
          <motion.div
            key={animKey}
            custom={reduced}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
            }
            className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm space-y-5"
          >
            {/* Depth badge + counter */}
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
                  config.badgeClass
                )}
              >
                <DepthIcon className="h-3 w-3" />
                {config.label}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {seenCount} explored
              </span>
            </div>

            {/* Starter text */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -left-1 -top-2 text-4xl font-serif text-primary/10 select-none"
              >
                &ldquo;
              </div>
              <p className="text-base sm:text-lg font-medium leading-relaxed pl-5 pt-3">
                {currentStarter.text}
              </p>
              <div
                aria-hidden="true"
                className="absolute -bottom-2 right-0 text-4xl font-serif text-primary/10 select-none"
              >
                &rdquo;
              </div>
            </div>

            {/* Related tool suggestion */}
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={() => onStartTool(config.relatedTool)}
                className="group flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 w-full"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-colors" />
                <span className="flex-1 text-left">
                  Explore deeper:{" "}
                  <span className="font-medium underline underline-offset-2 decoration-primary/30 group-hover:decoration-primary/60 transition-colors">
                    {config.relatedToolLabel}
                  </span>
                </span>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Generate button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="gap-2 rounded-xl px-6"
          onClick={generateNew}
        >
          <RefreshCw className="h-4 w-4" />
          Generate New
        </Button>
      </div>
    </div>
  );
}
