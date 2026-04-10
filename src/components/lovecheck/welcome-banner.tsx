"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToolSlug } from "@/types";

// ── Constants ─────────────────────────────────────────────────

const STORAGE_KEY = "lovecheck-welcomed";

// ── Props ─────────────────────────────────────────────────────

interface WelcomeBannerProps {
  onStartTool: (slug: ToolSlug) => void;
}

// ── Component ─────────────────────────────────────────────────

export function WelcomeBanner({ onStartTool }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const reduced = useReducedMotion();

  // Check localStorage on mount (deferred to avoid SSR hydration mismatch)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const welcomed = localStorage.getItem(STORAGE_KEY);
        if (welcomed !== "true") {
          setVisible(true);
        }
      } catch {
        // localStorage unavailable
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable
    }
  }

  function handleGetStarted() {
    onStartTool("relationship-risk-radar");
    handleDismiss();
  }

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          className="mx-auto max-w-4xl px-4 sm:px-6 pb-8 sm:pb-12 pt-2"
          initial={
            reduced
              ? { opacity: 1 }
              : { opacity: 0, y: -20, height: 0 }
          }
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, y: -20, height: 0 }
          }
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className={cn(
              "relative mx-auto max-w-2xl overflow-hidden rounded-2xl",
              "border border-rose-200/60 dark:border-rose-800/40",
              "bg-white/70 dark:bg-card/70 backdrop-blur-md",
              "p-5 sm:p-6"
            )}
          >
            {/* Gradient border glow effect */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(236,72,153,0.06) 50%, rgba(244,63,94,0.08) 100%)",
              }}
            />

            <div className="relative space-y-4">
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/40">
                  <Heart className="h-5 w-5 text-rose-500 dark:text-rose-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-foreground">
                    Welcome to LoveCheck
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    A safe, private space to explore the patterns in your
                    relationships. No judgment, no clinical language -- just
                    honest, research-based insights that help you see more
                    clearly.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  className="gap-2 rounded-lg shadow-sm"
                  onClick={handleGetStarted}
                >
                  <Heart className="h-3.5 w-3.5" />
                  Get Started
                </Button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
