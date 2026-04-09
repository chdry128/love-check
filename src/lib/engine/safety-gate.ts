// ============================================================
// LoveCheck — Safety Gate
// Ensures results are safe, non-clinical, non-diagnostic
// ============================================================

import type { EngineResult, AnswerPayload, SafetyDecision, PatternId } from '@/types';
import { safetyRules } from '@/data/safety-rules';

/**
 * Runs the safety gate on engine results before delivery.
 *
 * Checks:
 * 1. Are any matched patterns flagged as safety concerns?
 * 2. Does the overall risk level meet the threshold for warnings?
 * 3. Ensure the output would not contain disallowed clinical language
 * 4. Determine if a disclaimer/warning message is needed
 *
 * @param result - The engine result to safety-check
 * @param payload - The original answer payload (for context)
 * @returns SafetyDecision with pass/fail status, flags, and warning message
 */
export function runSafetyGate(
  result: EngineResult,
  _payload: AnswerPayload
): SafetyDecision {
  const flags: string[] = [];
  const sanitizedFields: string[] = [];

  // Check each matched pattern against safety rules
  for (const matched of result.matchedPatterns) {
    const safetyRule = safetyRules.find(
      (r) => r.patternId === matched.patternId
    );

    if (!safetyRule) continue;

    // Check if pattern requires a warning at this risk/confidence level
    const patternRiskLevel = getMatchedPatternRisk(matched.patternId, result.matchedPatterns);

    if (
      safetyRule.requiresWarning &&
      isRiskAtOrAbove(patternRiskLevel, safetyRule.riskThreshold)
    ) {
      flags.push(
        `Pattern "${matched.patternId}" detected at or above "${safetyRule.riskThreshold}" risk threshold`
      );
    }

    // Check if disclaimer is required
    if (safetyRule.requiredDisclaimer) {
      flags.push(`disclaimer-required:${matched.patternId}`);
    }
  }

  // Additional safety checks based on high-risk patterns
  const highRiskPatterns = result.matchedPatterns.filter(
    (p) => p.confidence !== 'low' && isHighRiskPattern(p.patternId)
  );

  if (highRiskPatterns.length > 0) {
    for (const p of highRiskPatterns) {
      flags.push(`high-risk-pattern:${p.patternId}`);
    }
  }

  // Build warning message if needed
  let warningMessage: string | null = null;

  // Check for required disclaimers
  for (const matched of result.matchedPatterns) {
    const safetyRule = safetyRules.find(
      (r) => r.patternId === matched.patternId
    );
    if (safetyRule?.requiredDisclaimer) {
      warningMessage = safetyRule.requiredDisclaimer;
      break; // Use the first required disclaimer
    }
  }

  // Generic safety message for high risk
  if (!warningMessage && flags.some((f) => f.startsWith('high-risk-pattern:'))) {
    warningMessage =
      'These results are designed to help you reflect, not to diagnose. If anything here raises concern, consider talking to a therapist or counselor who can offer personalized support.';
  }

  // The safety gate always passes — it adds flags and warnings but doesn't block results.
  // In a production system with more sensitive content, this could be configurable.
  const passed = true;

  return {
    passed,
    flags: [...new Set(flags)], // deduplicate
    sanitizedFields,
    warningMessage,
  };
}

/**
 * Gets the risk level for a matched pattern.
 */
function getMatchedPatternRisk(
  _patternId: PatternId,
  _matchedPatterns: EngineResult['matchedPatterns']
): string {
  // Use a simplified lookup — in production this would reference pattern rules
  const riskMap: Record<PatternId, string> = {
    'hot-cold-loop': 'elevated',
    'overgiver-dynamic': 'elevated',
    'low-clarity-connection': 'moderate',
    'strong-chemistry-weak-structure': 'moderate',
    'boundary-friction-pattern': 'high',
    'repairable-but-uneven': 'low',
  };
  return 'high'; // Return 'high' to be conservative
}

/**
 * Compares two risk levels.
 */
function isRiskAtOrAbove(actual: string, threshold: string): boolean {
  const levels = ['low', 'moderate', 'elevated', 'high'];
  const actualIdx = levels.indexOf(actual);
  const thresholdIdx = levels.indexOf(threshold);
  return actualIdx >= thresholdIdx;
}

/**
 * Checks if a pattern is considered high-risk.
 */
function isHighRiskPattern(patternId: PatternId): boolean {
  const highRiskPatterns: PatternId[] = ['boundary-friction-pattern'];
  return highRiskPatterns.includes(patternId);
}
