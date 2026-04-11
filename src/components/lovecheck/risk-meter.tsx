"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useMotionValueEvent,
} from "framer-motion";
import type { RiskLevel } from "@/types";
import { cn } from "@/lib/utils";

// ── Risk Level Configuration ──────────────────────────────────

const RISK_CONFIG = {
  low: {
    label: "Low Risk",
    percentage: 20,
    colorClass: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  moderate: {
    label: "Moderate Risk",
    percentage: 45,
    colorClass: "text-amber-600 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  elevated: {
    label: "Elevated Risk",
    percentage: 70,
    colorClass: "text-orange-600 dark:text-orange-400",
    dotClass: "bg-orange-500",
  },
  high: {
    label: "High Risk",
    percentage: 92,
    colorClass: "text-rose-600 dark:text-rose-400",
    dotClass: "bg-rose-500",
  },
} satisfies Record<RiskLevel, {
  label: string;
  percentage: number;
  colorClass: string;
  dotClass: string;
}>;

// ── SVG Geometry ──────────────────────────────────────────────

const CX = 120;
const CY = 112;
const R = 85;
const STROKE_W = 10;
const CIRC = 2 * Math.PI * R;
const HALF_CIRC = CIRC / 2;
const VIEWBOX = "0 0 240 140";

// ── Helpers ───────────────────────────────────────────────────

/** Get (x, y) on the arc for a given percentage fill. */
function arcPoint(pct: number) {
  const angle = Math.PI * (1 - pct / 100);
  return {
    x: CX + R * Math.cos(angle),
    y: CY - R * Math.sin(angle),
  };
}

/** Pre-compute tick positions for all four risk levels. */
const TICKS = (["low", "moderate", "elevated", "high"] as const).map(
  (level) => ({
    level,
    ...arcPoint(RISK_CONFIG[level].percentage),
  }),
);

// ── Component ─────────────────────────────────────────────────

interface RiskMeterProps {
  riskLevel: RiskLevel;
  className?: string;
}

export function RiskMeter({ riskLevel, className }: RiskMeterProps) {
  const config = RISK_CONFIG[riskLevel];
  const targetOffset = HALF_CIRC * (1 - config.percentage / 100);

  // ── Animated percentage counter ───────────────────────────
  const motionVal = useMotionValue(0);
  const [displayPct, setDisplayPct] = useState(0);

  useMotionValueEvent(motionVal, "change", (v) =>
    setDisplayPct(Math.round(v)),
  );

  useEffect(() => {
    const ctrl = animate(motionVal, config.percentage, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1], // smooth ease-out-expo
    });
    return () => ctrl.stop();
  }, [config.percentage, motionVal]);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* ── SVG Gauge ──────────────────────────────────────── */}
      <svg
        viewBox={VIEWBOX}
        className="w-full max-w-[300px] sm:max-w-[340px]"
        role="img"
        aria-label={`Risk meter showing ${config.label} at ${config.percentage}%`}
      >
        <defs>
          {/* Color gradient: emerald → amber → orange → rose */}
          <linearGradient id="meter-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="33%" stopColor="#f59e0b" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>

          {/* Subtle radial glow behind the arc */}
          <radialGradient
            id="bg-glow"
            cx="50%"
            cy="55%"
            r="45%"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.035" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for the active arc */}
          <filter
            id="arc-glow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Subtle inner glow ───────────────────────────── */}
        <circle
          cx={CX}
          cy={CY}
          r={R - 18}
          fill="url(#bg-glow)"
          className="text-foreground"
        />

        {/* ── Background track ────────────────────────────── */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={`${HALF_CIRC} ${HALF_CIRC}`}
          className="text-muted-foreground"
          strokeOpacity={0.15}
          transform={`rotate(180 ${CX} ${CY})`}
        />

        {/* ── Tick marks at each risk level ───────────────── */}
        {TICKS.map((tick) => {
          const isActive = tick.level === riskLevel;
          return (
            <circle
              key={tick.level}
              cx={tick.x}
              cy={tick.y}
              r={isActive ? 3.5 : 2}
              fill="currentColor"
              fillOpacity={isActive ? 0.85 : 0.12}
              className={
                isActive ? "text-foreground" : "text-muted-foreground"
              }
            />
          );
        })}

        {/* ── Animated active arc ─────────────────────────── */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="url(#meter-gradient)"
          strokeWidth={STROKE_W}
          strokeLinecap="round"
          strokeDasharray={`${HALF_CIRC} ${HALF_CIRC}`}
          filter="url(#arc-glow)"
          transform={`rotate(180 ${CX} ${CY})`}
          initial={{ strokeDashoffset: HALF_CIRC }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── Percentage display ──────────────────────────── */}
        <text
          x={CX}
          y={CY - 16}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          className="text-foreground select-none"
          style={{ fontSize: 42, fontWeight: 700 }}
        >
          {displayPct}%
        </text>

        {/* ── Subtitle ────────────────────────────────────── */}
        <text
          x={CX}
          y={CY + 15}
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          className="text-muted-foreground select-none"
          style={{
            fontSize: 10.5,
            fontWeight: 500,
            letterSpacing: "0.14em",
          }}
        >
          RISK SCORE
        </text>
      </svg>

      {/* ── Risk Level Label ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-2"
      >
        <span
          className={cn("h-2 w-2 rounded-full", config.dotClass)}
          aria-hidden="true"
        />
        <span
          className={cn(
            "text-sm font-semibold tracking-wide",
            config.colorClass,
          )}
        >
          {config.label}
        </span>
      </motion.div>
    </div>
  );
}
