"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Users, Brain, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Stat data ─────────────────────────────────────────────────

interface StatItem {
  id: string;
  icon: typeof Users;
  label: string;
  value: number;
  suffix: string;
  duration: number; // animation duration in ms
}

const stats: StatItem[] = [
  {
    id: "assessments",
    icon: Users,
    label: "Assessments Taken",
    value: 12847,
    suffix: "+",
    duration: 2000,
  },
  {
    id: "patterns",
    icon: Brain,
    label: "Pattern Rules",
    value: 37,
    suffix: "+",
    duration: 1500,
  },
  {
    id: "rating",
    icon: Star,
    label: "Average Rating",
    value: 4.9,
    suffix: "/5",
    duration: 1800,
  },
];

// ── Animated counter hook ─────────────────────────────────────

function useAnimatedCounter(
  target: number,
  isActive: boolean,
  duration: number,
  reduced: boolean
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive || reduced) {
      if (isActive && reduced) {
        const raf = requestAnimationFrame(() => setCount(target));
        return () => cancelAnimationFrame(raf);
      }
      return;
    }

    const startTime = Date.now();
    const isDecimal = target % 1 !== 0;
    const startVal = 0;

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isActive, target, duration, reduced]);

  return count;
}

// ── Individual stat card ──────────────────────────────────────

function StatCard({
  stat,
  isInView,
  reduced,
  isPrimary,
}: {
  stat: StatItem;
  isInView: boolean;
  reduced: boolean;
  isPrimary: boolean;
}) {
  const Icon = stat.icon;
  const animatedValue = useAnimatedCounter(
    stat.value,
    isInView,
    stat.duration,
    reduced
  );
  const isDecimal = stat.value % 1 !== 0;

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border p-5 sm:p-6 text-center transition-shadow duration-300",
        "bg-card/80 backdrop-blur-sm",
        isPrimary
          ? "ring-2 ring-primary/20 shadow-lg shadow-primary/5"
          : "hover:shadow-md"
      )}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : reduced
            ? { opacity: 1 }
            : { opacity: 0, y: 20, scale: 0.95 }
      }
      transition={{
        duration: reduced ? 0 : 0.5,
        delay: reduced ? 0 : isPrimary ? 0 : 0.15,
        ease: "easeOut",
      }}
    >
      {/* Pulsing ring animation on primary stat */}
      {isPrimary && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-xl"
          style={{
            animation: "pulseRing 3s ease-in-out infinite",
          }}
        >
          <span className="absolute inset-0 rounded-xl ring-2 ring-primary/10" />
        </span>
      )}

      <div
        className={cn(
          "mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl",
          "bg-primary/5 ring-1 ring-primary/10",
          isPrimary && "bg-rose-50 dark:bg-rose-950/30 ring-rose-200/50 dark:ring-rose-800/30"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isPrimary
              ? "text-rose-600 dark:text-rose-400"
              : "text-primary"
          )}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-center gap-0.5">
          <span
            className={cn(
              "text-2xl sm:text-3xl font-bold tabular-nums",
              isPrimary
                ? "text-rose-600 dark:text-rose-400"
                : "text-foreground"
            )}
          >
            {isDecimal ? animatedValue.toLocaleString() : animatedValue.toLocaleString()}
          </span>
          <span
            className={cn(
              "text-lg font-semibold",
              isPrimary
                ? "text-rose-500 dark:text-rose-400/70"
                : "text-muted-foreground"
            )}
          >
            {stat.suffix}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Social Proof Section ─────────────────────────────────

export function SocialProof({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const reduced = !!useReducedMotion();

  return (
    <section
      ref={ref}
      className={cn("mx-auto max-w-4xl px-4 sm:px-6 pb-12 sm:pb-16", className)}
    >
      <motion.div
        className="space-y-8"
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : reduced
              ? { opacity: 1 }
              : { opacity: 0, y: 20 }
        }
        transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
      >
        {/* Section header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Trusted by thousands</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            People everywhere are using LoveCheck to gain clarity.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat, idx) => (
            <StatCard
              key={stat.id}
              stat={stat}
              isInView={isInView}
              reduced={reduced}
              isPrimary={idx === 0}
            />
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          className="text-center text-sm text-muted-foreground/80 italic"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.4 }}
        >
          Join thousands who see their relationships more clearly.
        </motion.p>
      </motion.div>

      {/* Pulse ring keyframe */}
      <style jsx global>{`
        @keyframes pulseRing {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(1.08);
          }
        }
      `}</style>
    </section>
  );
}
