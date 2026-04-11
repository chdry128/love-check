"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Heart SVG path ────────────────────────────────────────────

const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// ── Intensity config ──────────────────────────────────────────

const INTENSITY_COUNT: Record<string, number> = {
  low: 8,
  medium: 15,
  high: 25,
};

// ── Heart data generator (stable via useMemo) ────────────────

interface HeartData {
  id: number;
  x: number;       // percentage 0-100
  size: number;     // px 8-20
  duration: number; // seconds 6-14
  delay: number;    // seconds 0-8
  swayRange: number; // px 10-40
  opacity: number;  // 0.15-0.4
  hue: number;      // rose hue shift 0-30
  initialRotate: number; // initial rotation -10 to 10
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateHearts(count: number): HeartData[] {
  const rand = createSeededRandom(count * 97 + 17);
  const hearts: HeartData[] = [];
  for (let i = 0; i < count; i++) {
    hearts.push({
      id: i,
      x: rand() * 100,
      size: 8 + rand() * 12,
      duration: 6 + rand() * 8,
      delay: rand() * 8,
      swayRange: 10 + rand() * 30,
      opacity: 0.15 + rand() * 0.25,
      hue: rand() * 30,
      initialRotate: -10 + rand() * 20,
    });
  }
  return hearts;
}

// ── Component ─────────────────────────────────────────────────

interface FloatingHeartsProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function FloatingHearts({
  className,
  intensity = "medium",
}: FloatingHeartsProps) {
  const reduced = useReducedMotion();
  const heartCount = INTENSITY_COUNT[intensity] ?? 15;
  const hearts = useMemo(() => generateHearts(heartCount), [heartCount]);

  // If reduced motion is preferred, render nothing
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      {hearts.map((heart) => (
        <motion.svg
          key={heart.id}
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute bottom-0 text-rose-300 dark:text-rose-400"
          style={{
            left: `${heart.x}%`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
            filter: `hue-rotate(${heart.hue}deg)`,
          }}
          initial={{
            y: "100%",
            x: 0,
            opacity: 0,
            rotate: heart.initialRotate,
            scale: 0.8,
          }}
          animate={{
            y: "-20%",
            x: [0, heart.swayRange / 2, -heart.swayRange / 2, heart.swayRange / 4, 0],
            opacity: [0, heart.opacity, heart.opacity * 0.8, heart.opacity * 0.4, 0],
            rotate: [-10, 10, -5, 8, -10],
            scale: [0.8, 1, 0.95, 0.9, 0.7],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path d={HEART_PATH} />
        </motion.svg>
      ))}
    </div>
  );
}
