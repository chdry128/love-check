"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SignalKey, SignalMap } from "@/types";

// ── Label Mapping ─────────────────────────────────────────────

const SIGNAL_LABELS: Record<SignalKey, string> = {
  clarity_low: "Clarity",
  consistency_low: "Consistency",
  effort_imbalance: "Effort Balance",
  future_ambiguity: "Future Clarity",
  emotional_availability_low: "Emotional Availability",
  repair_potential_high: "Repair Potential",
  boundary_friction: "Boundaries",
  mixed_signals_high: "Mixed Signals",
  trust_instability: "Trust Stability",
  follow_through_low: "Follow Through",
};

// Signals where a high value is a POSITIVE indicator
const POSITIVE_SIGNALS: Set<SignalKey> = new Set([
  "repair_potential_high",
]);

// ── Color & Strength Configuration ────────────────────────────

interface StrengthConfig {
  label: string;
  barClass: string;
  dotClass: string;
  textClass: string;
  bgBarClass: string;
}

const STRENGTH_CONFIG: Record<number, StrengthConfig> = {
  1: {
    label: "Low",
    barClass: "bg-emerald-500",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgBarClass: "bg-emerald-100 dark:bg-emerald-950/40",
  },
  2: {
    label: "Moderate",
    barClass: "bg-amber-500",
    dotClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    bgBarClass: "bg-amber-100 dark:bg-amber-950/40",
  },
  3: {
    label: "Elevated",
    barClass: "bg-orange-500",
    dotClass: "bg-orange-500",
    textClass: "text-orange-600 dark:text-orange-400",
    bgBarClass: "bg-orange-100 dark:bg-orange-950/40",
  },
};

function getStrengthConfig(value: number): StrengthConfig {
  if (value >= 4) {
    return {
      label: "High",
      barClass: "bg-rose-500",
      dotClass: "bg-rose-500",
      textClass: "text-rose-600 dark:text-rose-400",
      bgBarClass: "bg-rose-100 dark:bg-rose-950/40",
    };
  }
  return STRENGTH_CONFIG[value] ?? STRENGTH_CONFIG[1];
}

// ── Processed Signal ──────────────────────────────────────────

interface ProcessedSignal {
  key: SignalKey;
  label: string;
  absoluteValue: number;
  strengthLabel: string;
  config: StrengthConfig;
  isPositive: boolean;
  widthPercent: number;
}

const MAX_BAR_WIDTH = 5; // maximum signal value to scale against

// ── Component ─────────────────────────────────────────────────

interface SignalBarsProps {
  signals: SignalMap;
  className?: string;
}

export function SignalBars({ signals, className }: SignalBarsProps) {
  const processedSignals = useMemo<ProcessedSignal[]>(() => {
    const entries = Object.entries(signals) as [SignalKey, number][];

    const active = entries
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => {
        const absValue = Math.abs(value);
        const config = getStrengthConfig(absValue);
        const isPositive = POSITIVE_SIGNALS.has(key);

        return {
          key,
          label: SIGNAL_LABELS[key] ?? formatSnakeCase(key),
          absoluteValue: absValue,
          strengthLabel: isPositive ? "Strong" : config.label,
          config: isPositive
            ? {
                label: "Strong",
                barClass: "bg-emerald-500",
                dotClass: "bg-emerald-500",
                textClass: "text-emerald-600 dark:text-emerald-400",
                bgBarClass: "bg-emerald-100 dark:bg-emerald-950/40",
              }
            : config,
          isPositive,
          widthPercent: Math.min((absValue / MAX_BAR_WIDTH) * 100, 100),
        };
      });

    // Sort by strength descending
    active.sort((a, b) => b.absoluteValue - a.absoluteValue);

    return active;
  }, [signals]);

  if (processedSignals.length === 0) return null;

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {processedSignals.map((signal, index) => (
        <motion.div
          key={signal.key}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="rounded-lg border bg-card p-3.5 transition-colors hover:bg-accent/30"
        >
          {/* Label row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground leading-tight">
              {signal.label}
            </span>
            <span
              className={cn(
                "text-xs font-semibold ml-2 shrink-0",
                signal.config.textClass
              )}
            >
              {signal.strengthLabel}
            </span>
          </div>

          {/* Bar track */}
          <div
            className={cn(
              "relative h-2 rounded-full overflow-hidden",
              signal.config.bgBarClass
            )}
          >
            <motion.div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                signal.config.barClass
              )}
              initial={{ width: 0 }}
              animate={{ width: `${signal.widthPercent}%` }}
              transition={{
                duration: 0.7,
                delay: index * 0.06 + 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>

          {/* Strength dots */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: MAX_BAR_WIDTH }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full transition-colors",
                  i < signal.absoluteValue
                    ? signal.config.dotClass
                    : "bg-muted-foreground/15"
                )}
              />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              {signal.absoluteValue}/{MAX_BAR_WIDTH}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────

function formatSnakeCase(str: string): string {
  return str
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
