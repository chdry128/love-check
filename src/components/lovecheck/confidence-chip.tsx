"use client";

import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/types";

interface ConfidenceChipProps {
  level: ConfidenceLevel;
  className?: string;
}

const confidenceConfig: Record<ConfidenceLevel, { label: string; className: string }> = {
  low: {
    label: "Low confidence",
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
  moderate: {
    label: "Moderate confidence",
    className: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
  },
  "fairly-high": {
    label: "Fairly high confidence",
    className: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  },
  high: {
    label: "High confidence",
    className: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
};

export function ConfidenceChip({ level, className }: ConfidenceChipProps) {
  const config = confidenceConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          level === "low" && "bg-gray-400",
          level === "moderate" && "bg-sky-400",
          level === "fairly-high" && "bg-violet-400",
          level === "high" && "bg-emerald-400"
        )}
      />
      {config.label}
    </span>
  );
}
