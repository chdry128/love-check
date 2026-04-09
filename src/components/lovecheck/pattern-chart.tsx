"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SignalMap, SignalKey } from "@/types";

// ── Chart Dimensions ──────────────────────────────────────────

const DIMENSIONS = [
  { key: "trust_instability" as SignalKey, label: "Trust" },
  { key: "clarity_low" as SignalKey, label: "Clarity" },
  { key: "effort_imbalance" as SignalKey, label: "Effort Balance" },
  { key: "mixed_signals_high" as SignalKey, label: "Communication" },
  { key: "emotional_availability_low" as SignalKey, label: "Emotional Safety" },
  { key: "future_ambiguity" as SignalKey, label: "Future Alignment" },
] as const;

const NUM_AXES = DIMENSIONS.length;
const ANGLE_STEP = (2 * Math.PI) / NUM_AXES;
const CENTER = 120;
const MAX_RADIUS = 90;
const RING_STEPS = 5;

// ── Helpers ───────────────────────────────────────────────────

/** Get point on radar for a given axis index and value (0–1) */
function getPoint(axisIndex: number, value: number) {
  const angle = ANGLE_STEP * axisIndex - Math.PI / 2;
  return {
    x: CENTER + MAX_RADIUS * value * Math.cos(angle),
    y: CENTER + MAX_RADIUS * value * Math.sin(angle),
  };
}

/** Build the SVG polygon points string */
function buildPolygonPath(values: number[]): string {
  return values
    .map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

/** Convert signal values to normalized 0–1 range for the chart */
function normalizeSignals(signals: SignalMap): number[] {
  const maxVal = 5; // max signal value we'll encounter

  return DIMENSIONS.map((dim) => {
    const raw = Math.abs(signals[dim.key] ?? 0);
    // Positive signals like repair_potential_high = low risk (invert)
    if (dim.key === "effort_imbalance" || dim.key === "clarity_low") {
      // These are "low" signals — high value means more risk
      return Math.min(raw / maxVal, 1);
    }
    return Math.min(raw / maxVal, 1);
  });
}

// ── Component ─────────────────────────────────────────────────

interface PatternChartProps {
  signals: SignalMap;
  className?: string;
}

export function PatternChart({ signals, className }: PatternChartProps) {
  const reduced = useReducedMotion();
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    DIMENSIONS.map(() => 0)
  );

  const targetValues = useMemo(() => normalizeSignals(signals), [signals]);

  useEffect(() => {
    if (reduced) {
      setAnimatedValues(targetValues);
      return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const startValues = [...animatedValues];

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const newValues = startValues.map((start, i) => {
        return start + (targetValues[i] - start) * eased;
      });

      setAnimatedValues(newValues);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [targetValues, reduced]);

  const hasAnyData = targetValues.some((v) => v > 0);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* ── SVG Radar Chart ─────────────────────────────────── */}
      <svg
        viewBox="0 0 240 240"
        className="w-full max-w-[280px] sm:max-w-[320px]"
        role="img"
        aria-label="Relationship pattern radar chart"
      >
        {/* Grid rings */}
        {Array.from({ length: RING_STEPS }).map((_, i) => {
          const ringRadius = MAX_RADIUS * ((i + 1) / RING_STEPS);
          const ringPoints = DIMENSIONS.map((_, axisIdx) => {
            const angle = ANGLE_STEP * axisIdx - Math.PI / 2;
            return `${CENTER + ringRadius * Math.cos(angle)},${CENTER + ringRadius * Math.sin(angle)}`;
          }).join(" ");

          return (
            <polygon
              key={`ring-${i}`}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-muted-foreground"
              strokeOpacity={0.12}
            />
          );
        })}

        {/* Axis lines */}
        {DIMENSIONS.map((_, i) => {
          const end = getPoint(i, 1);
          return (
            <line
              key={`axis-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-muted-foreground"
              strokeOpacity={0.1}
            />
          );
        })}

        {/* Data polygon with gradient fill */}
        {hasAnyData && (
          <motion.polygon
            points={buildPolygonPath(animatedValues)}
            fill="url(#radar-gradient)"
            stroke="url(#radar-stroke)"
            strokeWidth={2}
            strokeLinejoin="round"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        )}

        {/* Data points */}
        {hasAnyData &&
          animatedValues.map((val, i) => {
            if (val < 0.01) return null;
            const p = getPoint(i, val);
            return (
              <motion.circle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r={3.5}
                fill="var(--color-rose-500)"
                stroke="var(--color-background)"
                strokeWidth={1.5}
                initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: reduced ? 0 : 0.8 + i * 0.08,
                }}
              />
            );
          })}

        {/* Dimension labels */}
        {DIMENSIONS.map((dim, i) => {
          const labelPos = getPoint(i, 1.22);
          // Adjust text-anchor based on position
          let anchor: string = "middle";
          let dx = 0;
          let dy = 0;
          if (i === 0) { anchor = "middle"; dy = -4; } // top
          else if (i === 1) { anchor = "start"; dx = 4; } // top-right
          else if (i === 2) { anchor = "start"; dx = 4; dy = 4; } // bottom-right
          else if (i === 3) { anchor = "middle"; dy = 8; } // bottom
          else if (i === 4) { anchor = "end"; dx = -4; dy = 4; } // bottom-left
          else if (i === 5) { anchor = "end"; dx = -4; } // top-left

          return (
            <text
              key={`label-${i}`}
              x={labelPos.x + dx}
              y={labelPos.y + dy}
              textAnchor={anchor}
              fill="currentColor"
              className="text-foreground select-none"
              style={{ fontSize: 8.5, fontWeight: 500 }}
            >
              {dim.label}
            </text>
          );
        })}

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.5 0.15 15 / 0.25)" />
            <stop offset="100%" stopColor="oklch(0.5 0.15 15 / 0.05)" />
          </radialGradient>
          <linearGradient id="radar-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>

      {/* Chart legend */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Signal intensity</span>
        </div>
        <span>&middot;</span>
        <span>{DIMENSIONS.length} dimensions</span>
      </div>
    </div>
  );
}
