// ============================================================
// LoveCheck — Pattern Detector
// Matches aggregated signals against defined pattern rules
// ============================================================

import type { SignalMap, PatternId, RiskLevel, ConfidenceLevel } from '@/types';
import { patternRules } from '@/data/patterns';

/**
 * Detects which patterns match the given signals.
 *
 * For each pattern rule:
 * 1. Check if ALL requiredSignals meet their minimum thresholds
 * 2. If matched, calculate a score based on how much signals exceed thresholds
 * 3. Bonus points for optional signals that are also present
 * 4. Determine confidence level based on the score
 *
 * Results are sorted by score descending.
 *
 * @param signals - The aggregated signal map from the extractor
 * @returns Array of matched patterns with scores and confidence levels
 */
export function detectPatterns(
  signals: SignalMap
): Array<{
  patternId: PatternId;
  score: number;
  confidence: ConfidenceLevel;
}> {
  if (!signals || Object.keys(signals).length === 0) {
    return [];
  }

  const matches: Array<{
    patternId: PatternId;
    score: number;
    confidence: ConfidenceLevel;
  }> = [];

  for (const rule of patternRules) {
    const result = evaluatePattern(rule, signals);
    if (result !== null) {
      matches.push(result);
    }
  }

  // Sort by score descending (highest match first)
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Evaluates a single pattern rule against the signal map.
 * Returns null if the pattern doesn't match (required signals not met).
 */
function evaluatePattern(
  rule: (typeof patternRules)[0],
  signals: SignalMap
): { patternId: PatternId; score: number; confidence: ConfidenceLevel } | null {
  // Check required signals
  let allRequiredMet = true;
  let requiredScore = 0;
  let maxRequiredPossible = 0;

  for (const [signalKey, threshold] of Object.entries(rule.requiredSignals)) {
    const signalValue = signals[signalKey as keyof SignalMap] ?? 0;
    maxRequiredPossible += threshold;

    if (signalValue >= threshold) {
      // Score how much the signal exceeds the threshold (up to 2x for diminishing returns)
      const excess = signalValue - threshold;
      const bonus = Math.min(excess / threshold, 1.0) * threshold * 0.5;
      requiredScore += threshold + bonus;
    } else {
      allRequiredMet = false;
      // Even if not fully met, track partial for near-miss scoring
      const partial = signalValue / threshold;
      requiredScore += signalValue * partial * 0.3;
    }
  }

  // Pattern doesn't match if less than 70% of required signals are met
  // (We use a soft threshold rather than hard cutoff for nuanced results)
  const requiredRatio = requiredScore / (maxRequiredPossible * 1.5);
  if (requiredRatio < 0.3) {
    return null;
  }

  let totalScore = requiredScore;

  // Add bonus for optional signals
  if (rule.optionalSignals) {
    for (const [signalKey, threshold] of Object.entries(rule.optionalSignals)) {
      const signalValue = signals[signalKey as keyof SignalMap] ?? 0;
      if (signalValue > 0 && signalValue >= threshold * 0.5) {
        // Optional signals add up to 30% bonus
        const optionalBonus = Math.min(signalValue / threshold, 1.0) * threshold * 0.3;
        totalScore += optionalBonus;
      }
    }
  }

  // Apply pattern weight as a multiplier (normalized to 0-10 scale)
  const weightMultiplier = rule.weight / 7; // 7 is roughly average weight
  totalScore = totalScore * weightMultiplier;

  // Normalize score to a 0–100 scale
  // Max theoretical: ~15 required + ~5 optional = ~20 * 1.4 weight = ~28
  const normalizedScore = Math.min(Math.round((totalScore / 20) * 100), 100);

  // Determine confidence based on score
  const confidence = scoreToConfidence(normalizedScore, requiredRatio);

  return {
    patternId: rule.id,
    score: normalizedScore,
    confidence,
  };
}

/**
 * Maps a normalized score and required-signal ratio to a confidence level.
 */
function scoreToConfidence(
  score: number,
  requiredRatio: number
): ConfidenceLevel {
  // High confidence: strong score AND most required signals fully met
  if (score >= 65 && requiredRatio >= 0.8) {
    return 'high';
  }

  // Fairly high: good score or strong signal coverage
  if (score >= 50 && requiredRatio >= 0.6) {
    return 'fairly-high';
  }

  // Moderate: decent match but with gaps
  if (score >= 30) {
    return 'moderate';
  }

  // Low: weak match
  return 'low';
}

/**
 * Gets the risk level for a pattern by its ID.
 */
export function getPatternRiskLevel(patternId: PatternId): RiskLevel {
  const rule = patternRules.find((r) => r.id === patternId);
  return rule?.riskLevel ?? 'low';
}
