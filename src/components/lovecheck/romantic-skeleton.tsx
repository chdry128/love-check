"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Romantic Skeleton Card ────────────────────────────────────

interface RomanticSkeletonCardProps {
  className?: string;
}

export function RomanticSkeletonCard({ className }: RomanticSkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 sm:p-6 space-y-4",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 max-w-[200px]" />
          <Skeleton className="h-3 w-1/2 max-w-[140px]" />
        </div>
      </div>

      {/* Body skeleton bars with warm shimmer */}
      <div className="space-y-3">
        <div className="romantic-skeleton-bar h-3.5 w-full rounded-md" />
        <div className="romantic-skeleton-bar h-3.5 w-5/6 rounded-md" />
        <div className="romantic-skeleton-bar h-3.5 w-2/3 rounded-md" />
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// ── Romantic Skeleton Text ────────────────────────────────────

interface RomanticSkeletonTextProps {
  lines?: number;
  className?: string;
}

export function RomanticSkeletonText({
  lines = 3,
  className,
}: RomanticSkeletonTextProps) {
  const widths = ["w-full", "w-5/6", "w-3/4", "w-4/5", "w-2/3", "w-7/8"];
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "romantic-skeleton-bar h-3 rounded-md",
            widths[i % widths.length]
          )}
        />
      ))}
    </div>
  );
}

// ── Full Romantic Loading State ───────────────────────────────

interface RomanticSkeletonProps {
  className?: string;
  message?: string;
}

export function RomanticSkeleton({
  className,
  message = "Analyzing your patterns...",
}: RomanticSkeletonProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "mx-auto max-w-2xl px-4 py-6 sm:py-10 space-y-6",
        className
      )}
    >
      {/* Top bar */}
      <div className="mb-2">
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Main card skeleton */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 space-y-5">
        {/* Gradient bar */}
        <div className="h-1.5 rounded-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 animate-pulse" />

        {/* Title area */}
        <div className="space-y-3 pt-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>

        {/* Risk meter area */}
        <div className="flex justify-center py-4">
          <div className="relative">
            <Skeleton className="h-36 w-36 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-2.5 w-12 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Badge row */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Explanation block */}
        <div className="rounded-xl bg-muted/40 p-4 sm:p-5 border border-border/50 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 rounded-sm" />
            <Skeleton className="h-3 w-20 rounded-sm" />
          </div>
          <div className="romantic-skeleton-bar h-3.5 w-full rounded-md" />
          <div className="romantic-skeleton-bar h-3.5 w-5/6 rounded-md" />
          <div className="romantic-skeleton-bar h-3.5 w-3/4 rounded-md" />
        </div>

        {/* Insight cards */}
        <div className="space-y-3">
          <div className="rounded-xl border p-4 space-y-2.5">
            <Skeleton className="h-4 w-24 rounded-md" />
            <div className="romantic-skeleton-bar h-3 w-full rounded-md" />
            <div className="romantic-skeleton-bar h-3 w-4/5 rounded-md" />
          </div>
          <div className="rounded-xl border p-4 space-y-2.5">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="romantic-skeleton-bar h-3 w-full rounded-md" />
            <div className="romantic-skeleton-bar h-3 w-3/5 rounded-md" />
          </div>
        </div>
      </div>

      {/* Centered heart + message */}
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        {/* Pulsing heart icon */}
        <div className="relative h-14 w-14 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/15"
            animate={
              reduced
                ? { scale: 1 }
                : { scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/10">
            <Heart className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Message + progressive dots */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{message}</p>
          <motion.div
            className="flex items-center justify-center gap-1 mt-2"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-primary"
                animate={
                  reduced
                    ? { opacity: 0.5 }
                    : { opacity: [0.3, 1, 0.3] }
                }
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
