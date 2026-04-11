"use client";

import { cn } from "@/lib/utils";
import type { PatternId } from "@/types";

interface PatternBadgeProps {
  patternId: PatternId;
  className?: string;
}

const patternConfig: Record<PatternId, { label: string; className: string }> = {
  "hot-cold-loop": {
    label: "Hot & Cold Loop",
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800",
  },
  "overgiver-dynamic": {
    label: "Overgiver Dynamic",
    className: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800",
  },
  "low-clarity-connection": {
    label: "Low-Clarity Connection",
    className: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  },
  "strong-chemistry-weak-structure": {
    label: "Strong Chemistry, Weak Structure",
    className: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800",
  },
  "boundary-friction-pattern": {
    label: "Boundary Friction",
    className: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  },
  "repairable-but-uneven": {
    label: "Repairable but Uneven",
    className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
  },
};

export function PatternBadge({ patternId, className }: PatternBadgeProps) {
  const config = patternConfig[patternId];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
