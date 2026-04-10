"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Trash2,
  RotateCcw,
  ChevronRight,
  X,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getHistory, clearHistory, type HistoryEntry } from "@/lib/history";
import type { ToolSlug, RiskLevel } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface HistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTool: (slug: ToolSlug) => void;
}

const riskLevelConfig: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  moderate: {
    label: "Moderate",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  elevated: {
    label: "Elevated",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
};

const toolNames: Record<string, string> = {
  "relationship-risk-radar": "Risk Radar",
  "attachment-style-lens": "Attachment Lens",
  "communication-pattern-check": "Comm. Check",
  "texting-energy-match": "Texting Match",
  "love-bombing-detector": "Bombing Detect",
  "future-alignment-checker": "Future Check",
  "flirty-reply-coach": "Reply Coach",
  "compatibility-compass": "Compatibility",
  "red-flag-scanner": "Red Flags",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function HistorySheet({ open, onOpenChange, onStartTool }: HistorySheetProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    if (open) {
      // Use rAF to avoid synchronous setState in effect
      requestAnimationFrame(() => refreshHistory());
    }
  }, [open, refreshHistory]);

  // Listen for storage events
  useEffect(() => {
    const handler = () => refreshHistory();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refreshHistory]);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const handleDeleteOne = (index: number) => {
    const updated = [...history];
    updated.splice(index, 1);
    if (typeof window !== "undefined") {
      localStorage.setItem("lovecheck-history", JSON.stringify(updated));
    }
    setHistory(updated);
  };

  // Compute stats
  const totalSessions = history.length;
  const uniqueTools = new Set(history.map((e) => e.toolSlug)).size;
  const avgRiskScore = totalSessions > 0
    ? history.reduce((acc, e) => {
        const risk = e.result.dominantPattern?.riskLevel ?? "low";
        const score: Record<string, number> = { low: 1, moderate: 2, elevated: 3, high: 4 };
        return acc + (score[risk] ?? 1);
      }, 0) / totalSessions
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-5 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <History className="h-4 w-4 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-base">Your History</SheetTitle>
                <SheetDescription className="text-xs">
                  Past results and insights
                </SheetDescription>
              </div>
            </div>
            {totalSessions > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-destructive gap-1 h-7 px-2"
              >
                <Trash2 className="h-3 w-3" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Stats Cards */}
        {totalSessions > 0 && (
          <div className="px-5 py-4 border-b">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1">
                  <BarChart3 className="h-3 w-3 text-primary" />
                  <span className="text-lg font-bold">{totalSessions}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Sessions</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-lg font-bold">{uniqueTools}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Tools Used</span>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="text-lg font-bold">{avgRiskScore.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Avg Risk</span>
              </div>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {totalSessions === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No results yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Take a tool to see your first insight
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <AnimatePresence>
                {history.map((entry, idx) => {
                  const risk = entry.result.dominantPattern?.riskLevel ?? "low";
                  const config = riskLevelConfig[risk];
                  const patternName = entry.result.dominantPattern?.name ?? "Unknown Pattern";
                  const toolName = toolNames[entry.toolSlug] ?? entry.toolSlug;

                  return (
                    <motion.div
                      key={`${entry.savedAt}-${idx}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="group rounded-xl border bg-card p-3.5 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {/* Tool name + time */}
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 rounded-md font-medium"
                            >
                              {toolName}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDate(entry.savedAt)}
                            </span>
                          </div>

                          {/* Pattern name + risk */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium truncate">
                              {patternName}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                config.className
                              )}
                            >
                              {config.label}
                            </span>
                          </div>

                          {/* Summary snippet */}
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {entry.result.summary}
                          </p>

                          {/* Confidence */}
                          {entry.result.dominantPattern?.confidence && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <div className="h-1 flex-1 max-w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary/60"
                                  style={{
                                    width: `${Math.min((entry.result.dominantPattern.confidence / 100) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {entry.result.dominantPattern.confidence}% confidence
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleDeleteOne(idx)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Delete result"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => {
                              onStartTool(entry.toolSlug as ToolSlug);
                              onOpenChange(false);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                            aria-label="Retake tool"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
