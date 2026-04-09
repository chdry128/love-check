// ============================================================
// LoveCheck — Confidence Evaluator
// Determines confidence level of engine results
// ============================================================

import type { ConfidenceLevel, PatternId } from '@/types';
import { confidenceRules } from '@/data/confidence-rules';

/**
 * Evaluates how confident we can be in the engine results.
 *
 * Factors:
 * 1. Number of answers provided (more = more confident)
 * 2. Number of active/non-zero signals (more overlap = clearer pattern)
 * 3. Strength of matched patterns (higher scores = more confident)
 *
 * @param matchedPatterns - The patterns detected by the pattern detector
 * @param answerCount - Total number of answers the user provided
 * @returns The ConfidenceLevel
 */
export function evaluateConfidence(
  matchedPatterns: Array<{
    patternId: PatternId;
    score: number;
    confidence: ConfidenceLevel;
  }>,
  answerCount: number
): ConfidenceLevel {
  // Edge case: very few answers
  if (answerCount <= 0) {
    return 'low';
  }

  if (answerCount < 3) {
    return 'low';
  }

  // Get the highest pattern score
  const maxPatternScore = matchedPatterns.length > 0
    ? Math.max(...matchedPatterns.map((p) => p.score))
    : 0;

  // Calculate a composite confidence score
  // Factor 1: Answer count (0–40 points)
  const answerScore = Math.min((answerCount / 10) * 40, 40);

  // Factor 2: Pattern strength (0–40 points)
  const patternScore = Math.min((maxPatternScore / 100) * 40, 40);

  // Factor 3: Number of matched patterns with moderate+ confidence (0–20 points)
  const significantPatterns = matchedPatterns.filter(
    (p) => p.confidence !== 'low'
  ).length;
  const breadthScore = Math.min(significantPatterns * 7, 20);

  const compositeScore = answerScore + patternScore + breadthScore;

  // Map composite score to confidence level using rules as guidelines
  return scoreToConfidence(compositeScore, answerCount);
}

/**
 * Maps the composite score to a ConfidenceLevel,
 * using the confidence rules as calibration anchors.
 */
function scoreToConfidence(compositeScore: number, answerCount: number): ConfidenceLevel {
  // Check against confidence rules for calibration
  const topRule = confidenceRules[confidenceRules.length - 1]; // strictest
  const midRule = confidenceRules[Math.floor(confidenceRules.length / 2)];
  const baseRule = confidenceRules[0]; // most lenient

  // High confidence: meets the strictest rule thresholds
  if (
    compositeScore >= 75 &&
    answerCount >= topRule.minAnswers
  ) {
    return 'high';
  }

  // Fairly high: meets moderate rule thresholds
  if (
    compositeScore >= 55 &&
    answerCount >= midRule.minAnswers
  ) {
    return 'fairly-high';
  }

  // Moderate: meets base rule thresholds
  if (
    compositeScore >= 30 &&
    answerCount >= baseRule.minAnswers
  ) {
    return 'moderate';
  }

  // Low: insufficient data or weak signals
  return 'low';
}

/**
 * Returns a human-readable label for a confidence level.
 */
export function getConfidenceLabel(level: ConfidenceLevel): string {
  const labels: Record<ConfidenceLevel, string> = {
    low: 'Low Confidence',
    moderate: 'Moderate Confidence',
    'fairly-high': 'Fairly High Confidence',
    high: 'High Confidence',
  };
  return labels[level];
}
