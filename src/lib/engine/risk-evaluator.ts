// ============================================================
// LoveCheck — Risk Evaluator
// Determines overall risk level from signals and patterns
// ============================================================

import type { SignalMap, RiskLevel, PatternId } from '@/types';
import { riskRules } from '@/data/risk-rules';

const RISK_LEVELS: RiskLevel[] = ['low', 'moderate', 'elevated', 'high'];
const RISK_SCORES: Record<RiskLevel, number> = {
  low: 0,
  moderate: 1,
  elevated: 2,
  high: 3,
};

/**
 * Evaluates the overall risk level based on signals and matched patterns.
 *
 * Process:
 * 1. For each active signal, check it against risk thresholds
 * 2. Track the highest signal-based risk level
 * 3. Factor in the risk levels of matched patterns
 * 4. Return the highest applicable risk level
 *
 * @param signals - Aggregated signal map
 * @param matchedPatterns - Array of matched pattern info with patternId
 * @returns The overall RiskLevel
 */
export function evaluateRisk(
  signals: SignalMap,
  matchedPatterns: Array<{
    patternId: PatternId;
    score: number;
    confidence: 'low' | 'moderate' | 'fairly-high' | 'high';
  }>
): RiskLevel {
  if (!signals || Object.keys(signals).length === 0) {
    return 'low';
  }

  let highestRisk: RiskLevel = 'low';
  let maxRiskScore = 0;

  // Evaluate each signal against its risk thresholds
  for (const rule of riskRules) {
    const value = signals[rule.signal] ?? 0;

    // Only evaluate positive signal values (negative = protective signal)
    if (value <= 0) {
      continue;
    }

    const signalRisk = getSignalRiskLevel(rule.signal, value);
    const signalRiskScore = RISK_SCORES[signalRisk];

    if (signalRiskScore > maxRiskScore) {
      maxRiskScore = signalRiskScore;
      highestRisk = signalRisk;
    }
  }

  // Factor in pattern risk levels — elevate if patterns suggest higher risk
  for (const matched of matchedPatterns) {
    // Only consider patterns with at least moderate confidence
    if (matched.confidence === 'low') continue;

    // Import pattern rules to get risk levels
    // We use a lookup approach to avoid circular imports
    const patternRisk = getPatternRiskLevel(matched.patternId);
    const patternRiskScore = RISK_SCORES[patternRisk];

    // Patterns can elevate risk but not lower it
    if (patternRiskScore > maxRiskScore) {
      maxRiskScore = patternRiskScore;
      highestRisk = patternRisk;
    }
  }

  return highestRisk;
}

/**
 * Determines the risk level for a single signal based on its value and thresholds.
 */
function getSignalRiskLevel(signalKey: string, value: number): RiskLevel {
  const rule = riskRules.find((r) => r.signal === signalKey);
  if (!rule) {
    return 'low';
  }

  const { thresholds } = rule;

  if (value >= thresholds.high) return 'high';
  if (value >= thresholds.elevated) return 'elevated';
  if (value >= thresholds.moderate) return 'moderate';
  return 'low';
}

/**
 * Gets the risk level for a pattern by its ID.
 * Inline lookup to avoid importing from patterns (which creates dependency chain).
 */
function getPatternRiskLevel(patternId: PatternId): RiskLevel {
  const patternRiskMap: Record<PatternId, RiskLevel> = {
    'hot-cold-loop': 'elevated',
    'overgiver-dynamic': 'elevated',
    'low-clarity-connection': 'moderate',
    'strong-chemistry-weak-structure': 'moderate',
    'boundary-friction-pattern': 'high',
    'repairable-but-uneven': 'low',
  };
  return patternRiskMap[patternId] ?? 'low';
}

/**
 * Returns a human-readable label for a risk level.
 */
export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    elevated: 'Elevated Risk',
    high: 'High Risk',
  };
  return labels[level];
}
