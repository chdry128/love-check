"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  HeartCrack,
  CloudRain,
  SmilePlus,
  Minus,
  Flame,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────

type MoodLevel = "great" | "good" | "okay" | "rough" | "struggling";

interface MoodEntry {
  date: string;
  mood: MoodLevel;
}

// ── Mood Config ──────────────────────────────────────────────

interface MoodOption {
  level: MoodLevel;
  label: string;
  icon: typeof Heart;
  color: string;
  bgColor: string;
  borderColor: string;
  ringColor: string;
  dotColor: string;
  messages: string[];
}

const moodOptions: MoodOption[] = [
  {
    level: "great",
    label: "Great",
    icon: Heart,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    ringColor: "ring-emerald-200 dark:ring-emerald-700",
    dotColor: "bg-emerald-500",
    messages: [
      "That's wonderful! Appreciate these moments.",
      "Keep nurturing what's working.",
      "Healthy connections take intention — and you're showing up.",
    ],
  },
  {
    level: "good",
    label: "Good",
    icon: SmilePlus,
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
    ringColor: "ring-teal-200 dark:ring-teal-700",
    dotColor: "bg-teal-500",
    messages: [
      "Solid ground to build on.",
      "Small things add up to something beautiful.",
      "You're doing better than you think.",
    ],
  },
  {
    level: "okay",
    label: "Okay",
    icon: Minus,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    ringColor: "ring-amber-200 dark:ring-amber-700",
    dotColor: "bg-amber-500",
    messages: [
      "Okay is a perfectly valid place to be.",
      "Uncertainty is part of the journey.",
      "Give yourself grace today.",
    ],
  },
  {
    level: "rough",
    label: "Rough",
    icon: CloudRain,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    ringColor: "ring-orange-200 dark:ring-orange-700",
    dotColor: "bg-orange-500",
    messages: [
      "Hard days don't define the whole story.",
      "It's okay to need space.",
      "You deserve support — consider talking to someone you trust.",
    ],
  },
  {
    level: "struggling",
    label: "Struggling",
    icon: HeartCrack,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    ringColor: "ring-red-200 dark:ring-red-700",
    dotColor: "bg-red-500",
    messages: [
      "You don't have to figure this out alone.",
      "Your feelings are valid, even when they're painful.",
      "Consider reaching out to a trusted friend or professional.",
    ],
  },
];

const STORAGE_KEY = "lovecheck-mood";

// ── Helpers ──────────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function loadMoods(): MoodEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMoods(entries: MoodEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function getStreak(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if checked in today or yesterday to start counting
  const mostRecent = new Date(sorted[0].date);
  mostRecent.setHours(0, 0, 0, 0);

  const diffFromToday = Math.floor(
    (today.getTime() - mostRecent.getTime()) / 86400000
  );

  if (diffFromToday > 1) return 0;

  let streak = 0;
  let checkDate = new Date(today);

  // If no check-in today, start from yesterday
  if (diffFromToday === 1) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Build a set of dates for O(1) lookup
  const dateSet = new Set(entries.map((e) => e.date));

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (dateSet.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getLast7Days(entries: MoodEntry[]): (MoodLevel | null)[] {
  const dateMap = new Map<string, MoodLevel>();
  for (const entry of entries) {
    dateMap.set(entry.date, entry.mood);
  }

  const days: (MoodLevel | null)[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push(dateMap.get(dateStr) ?? null);
  }

  return days;
}

function getDayLabels(): string[] {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString(undefined, { weekday: "narrow" }));
  }
  return labels;
}

function getRandomMessage(mood: MoodLevel): string {
  const option = moodOptions.find((o) => o.level === mood);
  if (!option) return "";
  return option.messages[Math.floor(Math.random() * option.messages.length)];
}

// ── Component ────────────────────────────────────────────────

export function MoodCheckin() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loaded = loadMoods();
    requestAnimationFrame(() => {
      setMoods(loaded);

      const today = todayString();
      const todayEntry = loaded.find((e) => e.date === today);
      if (todayEntry) {
        setHasCheckedInToday(true);
        setSelectedMood(todayEntry.mood);
        setMessage(getRandomMessage(todayEntry.mood));
      }
    });
  }, []);

  // Persist to localStorage whenever moods change
  useEffect(() => {
    if (moods.length > 0) {
      saveMoods(moods);
    }
  }, [moods]);

  const handleSelectMood = useCallback((mood: MoodLevel) => {
    if (hasCheckedInToday) return;

    const today = todayString();
    const newEntry: MoodEntry = { date: today, mood };

    setMoods((prev) => {
      // Remove any existing entry for today and add new one
      const filtered = prev.filter((e) => e.date !== today);
      return [...filtered, newEntry];
    });

    setSelectedMood(mood);
    setMessage(getRandomMessage(mood));
    setHasCheckedInToday(true);
  }, [hasCheckedInToday]);

  const streak = useMemo(() => getStreak(moods), [moods]);
  const last7Days = useMemo(() => getLast7Days(moods), [moods]);
  const dayLabels = useMemo(() => getDayLabels(), []);
  const moodDotColorMap = useMemo(() => {
    const map: Record<MoodLevel, string> = {} as Record<MoodLevel, string>;
    for (const opt of moodOptions) {
      map[opt.level] = opt.dotColor;
    }
    return map;
  }, []);

  return (
    <Card className="overflow-hidden border bg-card">
      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/30">
            <Heart className="h-4 w-4 text-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Daily Mood Check-in</h3>
            <p className="text-[11px] text-muted-foreground">
              How are you feeling about your relationship today?
            </p>
          </div>
        </div>

        {/* Mood Options */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {moodOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedMood === opt.level;
            const isDisabled = hasCheckedInToday && !isSelected;

            return (
              <button
                key={opt.level}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelectMood(opt.level)}
                aria-label={`Mood: ${opt.label}`}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl p-2.5 sm:p-3 transition-all duration-200 flex-1 min-w-0",
                  isSelected
                    ? `${opt.bgColor} ${opt.borderColor} border-2 ring-2 ${opt.ringColor} ring-offset-1 dark:ring-offset-background shadow-sm`
                    : isDisabled
                      ? "opacity-30 cursor-not-allowed border-2 border-transparent"
                      : "border-2 border-transparent hover:bg-muted/50 hover:border-muted cursor-pointer"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 transition-colors duration-200",
                    isSelected ? opt.color : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-medium truncate w-full text-center",
                    isSelected ? opt.color : "text-muted-foreground"
                  )}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Supportive Message */}
        {message && selectedMood && (
          <div
            className={cn(
              "rounded-lg p-3.5 transition-all duration-300",
              moodOptions.find((o) => o.level === selectedMood)?.bgColor
            )}
          >
            <p className="text-xs sm:text-sm leading-relaxed text-foreground/80">
              {message}
            </p>
          </div>
        )}

        {/* Streak + Trend */}
        <div className="flex items-center justify-between gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5">
            {streak > 0 ? (
              <>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/30">
                  <Flame className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {streak} day streak
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Keep it going!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Start your streak
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Check in tomorrow to begin
                  </p>
                </div>
              </>
            )}
          </div>

          {/* 7-day trend dots */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground mr-1 hidden sm:inline">
              Last 7 days
            </span>
            <div className="flex items-center gap-1">
              {last7Days.map((dayMood, idx) => (
                <div key={idx} className="flex flex-col items-center gap-0.5">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors duration-200",
                      dayMood
                        ? moodDotColorMap[dayMood]
                        : "bg-muted-foreground/20"
                    )}
                    title={
                      dayMood
                        ? `${dayLabels[idx]}: ${dayMood}`
                        : `${dayLabels[idx]}: no check-in`
                    }
                  />
                  <span className="text-[8px] text-muted-foreground/50 hidden sm:block">
                    {dayLabels[idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Already checked in today notice */}
        {hasCheckedInToday && (
          <p className="text-[10px] text-center text-muted-foreground/60">
            You&apos;ve checked in today. Come back tomorrow!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
