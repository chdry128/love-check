import type { FinalResult } from "@/types";

const STORAGE_KEY = "lovecheck-history";
const MAX_HISTORY = 10;

export interface HistoryEntry {
  result: FinalResult;
  savedAt: string; // ISO date string
  toolSlug: string;
}

/**
 * Save a result to the localStorage history.
 * Keeps only the most recent MAX_HISTORY entries.
 */
export function saveToHistory(
  result: FinalResult,
  toolSlug: string
): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getHistory();

    const entry: HistoryEntry = {
      result,
      savedAt: new Date().toISOString(),
      toolSlug,
    };

    // Prepend so newest is first
    const updated = [entry, ...existing].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable or full — fail silently
  }
}

/**
 * Retrieve all saved history entries (newest first).
 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];

    // Validate basic shape
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Remove all saved history entries.
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

/**
 * Return the number of entries currently saved.
 */
export function getHistoryCount(): number {
  return getHistory().length;
}
