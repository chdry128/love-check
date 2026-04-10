// ============================================================
// LoveCheck — Pattern-to-Tool Mapping
// Maps each pattern to the tools most likely to detect it,
// based on signal overlap and the pattern's tryNextTemplate.
// ============================================================

import type { PatternId, ToolSlug } from "@/types";

/**
 * For each pattern, lists the tool slugs that can detect it.
 * The first slug is the "primary" tool (best match).
 */
export const patternToolMapping: Record<PatternId, ToolSlug[]> = {
  // ── Core Relationship Patterns (Part 1) ────────────────
  "hot-cold-loop": [
    "relationship-risk-radar",
    "attachment-style-lens",
    "communication-pattern-check",
  ],
  "overgiver-dynamic": [
    "relationship-risk-radar",
    "attachment-style-lens",
    "communication-pattern-check",
  ],
  "low-clarity-connection": [
    "relationship-risk-radar",
    "compatibility-compass",
    "communication-pattern-check",
  ],
  "strong-chemistry-weak-structure": [
    "relationship-risk-radar",
    "compatibility-compass",
    "communication-pattern-check",
  ],
  "boundary-friction-pattern": [
    "red-flag-scanner",
    "attachment-style-lens",
    "relationship-risk-radar",
  ],
  "repairable-but-uneven": [
    "relationship-risk-radar",
    "communication-pattern-check",
    "compatibility-compass",
  ],
  "anxious-avoidant-trap": [
    "attachment-style-lens",
    "relationship-risk-radar",
    "communication-pattern-check",
  ],
  "self-reliance-shield": [
    "attachment-style-lens",
    "relationship-risk-radar",
    "communication-pattern-check",
  ],
  "stonewall-cycle": [
    "communication-pattern-check",
    "relationship-risk-radar",
    "attachment-style-lens",
  ],
  "misaligned-expectations": [
    "communication-pattern-check",
    "compatibility-compass",
    "relationship-risk-radar",
  ],
  "communication-withdrawal": [
    "communication-pattern-check",
    "attachment-style-lens",
    "relationship-risk-radar",
  ],

  // ── Texting Energy Match Patterns ──────────────────────
  "balanced-texting-match": [
    "texting-energy-match",
    "communication-pattern-check",
    "relationship-risk-radar",
  ],
  "overgiver-texting-dynamic": [
    "texting-energy-match",
    "relationship-risk-radar",
    "attachment-style-lens",
  ],
  "high-interest-low-follow-through": [
    "texting-energy-match",
    "communication-pattern-check",
    "relationship-risk-radar",
  ],
  "warm-but-casual-energy": [
    "texting-energy-match",
    "future-alignment-checker",
    "relationship-risk-radar",
  ],
  "mixed-signal-thread": [
    "texting-energy-match",
    "relationship-risk-radar",
    "attachment-style-lens",
  ],
  "breadcrumbing-risk": [
    "texting-energy-match",
    "red-flag-scanner",
    "relationship-risk-radar",
  ],

  // ── Love Bombing Detector Patterns ─────────────────────
  "fast-intensity-risk": [
    "love-bombing-detector",
    "red-flag-scanner",
    "relationship-risk-radar",
  ],
  "future-faking-signal": [
    "love-bombing-detector",
    "future-alignment-checker",
    "compatibility-compass",
  ],
  "intense-but-unstable": [
    "love-bombing-detector",
    "red-flag-scanner",
    "attachment-style-lens",
  ],
  "pacing-pressure-pattern": [
    "love-bombing-detector",
    "attachment-style-lens",
    "relationship-risk-radar",
  ],

  // ── Future Alignment Patterns ──────────────────────────
  "strong-alignment": [
    "future-alignment-checker",
    "compatibility-compass",
    "communication-pattern-check",
  ],
  "good-chemistry-some-friction": [
    "future-alignment-checker",
    "compatibility-compass",
    "relationship-risk-radar",
  ],
  "uneven-long-term-alignment": [
    "future-alignment-checker",
    "compatibility-compass",
    "relationship-risk-radar",
  ],
  "high-attraction-low-structural-fit": [
    "future-alignment-checker",
    "compatibility-compass",
    "relationship-risk-radar",
  ],
  "future-mismatch": [
    "future-alignment-checker",
    "compatibility-compass",
    "communication-pattern-check",
  ],
};

/**
 * Returns the primary (best-match) tool for a given pattern.
 */
export function getPrimaryTool(patternId: PatternId): ToolSlug | undefined {
  return patternToolMapping[patternId]?.[0];
}

/**
 * Returns all tools that can detect a given pattern.
 */
export function getToolsForPattern(patternId: PatternId): ToolSlug[] {
  return patternToolMapping[patternId] ?? [];
}
