// ============================================================
// LoveCheck — AI Payload Builder
// Constructs the payload sent to AI for personalized enhancement
// ============================================================

import type { EngineResult, AnswerPayload, AIPayload, RiskLevel } from '@/types';

/**
 * Builds the payload for AI enhancement from engine results and user answers.
 *
 * The AI payload includes:
 * - Signals and their values
 * - Dominant pattern info
 * - Extracted strengths and risks
 * - User's original answers (for personalization context)
 * - Tone directive based on risk level
 * - Max length for output control
 *
 * @param engineResult - The deterministic engine output
 * @param payload - The original user answers
 * @returns Structured AIPayload ready for the AI layer
 */
export function buildAIPayload(
  engineResult: EngineResult,
  payload: AnswerPayload
): AIPayload {
  const tone = determineTone(engineResult);

  return {
    toolSlug: engineResult.toolSlug,
    signals: engineResult.signals,
    dominantPattern: engineResult.dominantPattern,
    strengths: engineResult.strengths,
    risks: engineResult.risks,
    userAnswers: payload.answers,
    tone,
    maxLength: determineMaxLength(tone),
  };
}

/**
 * Determines the appropriate tone for AI output based on risk level.
 *
 * - high → cautious: measured, careful language with focus on safety
 * - elevated → neutral-warm: balanced, supportive but not dismissive
 * - moderate → warm: friendly and encouraging
 * - low → warm: warm and affirming
 */
function determineTone(engineResult: EngineResult): 'warm' | 'neutral' | 'cautious' {
  // Check dominant pattern's risk level first
  if (engineResult.dominantPattern) {
    const riskLevel = engineResult.dominantPattern.riskLevel;
    return riskToTone(riskLevel);
  }

  // Fall back to checking any matched patterns
  for (const matched of engineResult.matchedPatterns) {
    // Find the pattern rule to get risk level
    const riskLevel = getPatternRiskFromId(matched.patternId);
    const tone = riskToTone(riskLevel);
    if (tone === 'cautious') return tone;
  }

  return 'warm';
}

/**
 * Maps a risk level to an AI tone directive.
 */
function riskToTone(riskLevel: RiskLevel): 'warm' | 'neutral' | 'cautious' {
  switch (riskLevel) {
    case 'high':
      return 'cautious';
    case 'elevated':
      return 'neutral';
    case 'moderate':
    case 'low':
    default:
      return 'warm';
  }
}

/**
 * Determines max output length based on tone.
 * Cautious outputs should be shorter and more focused.
 */
function determineMaxLength(tone: 'warm' | 'neutral' | 'cautious'): number {
  switch (tone) {
    case 'cautious':
      return 300; // Shorter, focused
    case 'neutral':
      return 500; // Moderate
    case 'warm':
    default:
      return 600; // Can be more expansive
  }
}

/**
 * Gets risk level for a pattern ID.
 */
function getPatternRiskFromId(patternId: string): RiskLevel {
  const map: Record<string, RiskLevel> = {
    'hot-cold-loop': 'elevated',
    'overgiver-dynamic': 'elevated',
    'low-clarity-connection': 'moderate',
    'strong-chemistry-weak-structure': 'moderate',
    'boundary-friction-pattern': 'high',
    'repairable-but-uneven': 'low',
  };
  return map[patternId] ?? 'low';
}
