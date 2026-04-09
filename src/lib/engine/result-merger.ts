// ============================================================
// LoveCheck — Result Merger
// Merges deterministic engine results with AI enhancement
// ============================================================

import type { EngineResult, FinalResult, AIOutput, PatternId } from '@/types';
import { patternRules } from '@/data/patterns';

/**
 * Merges deterministic engine results with optional AI output.
 *
 * Rules:
 * - AI output ENHANCES but never OVERRIDES deterministic results
 * - Patterns, risk level, and confidence come from the engine only
 * - AI provides personalized explanations and additional insights
 * - If no AI output, generate summary from templates alone
 *
 * @param engineResult - The deterministic engine output
 * @param aiOutput - Optional AI-generated enhancement
 * @returns Complete FinalResult ready for delivery
 */
export function mergeResults(
  engineResult: EngineResult,
  aiOutput: AIOutput | null
): FinalResult {
  // Generate the summary from the dominant pattern
  const summary = generateSummary(engineResult);

  // Generate personalized explanation — AI enhanced or template-based
  let personalizedExplanation: string;
  let aiInsights: string | undefined;

  if (aiOutput) {
    personalizedExplanation = aiOutput.personalizedExplanation;
    aiInsights = aiOutput.additionalInsights;
  } else {
    personalizedExplanation = generateTemplateExplanation(engineResult);
  }

  return {
    ...engineResult,
    summary,
    personalizedExplanation,
    aiEnhanced: aiOutput !== null,
    aiInsights,
  };
}

/**
 * Generates a summary string from the dominant pattern.
 */
function generateSummary(result: EngineResult): string {
  if (!result.dominantPattern) {
    return generateNoPatternSummary(result);
  }

  const rule = patternRules.find((r) => r.id === result.dominantPattern!.id);
  if (!rule) {
    return 'Your results have been analyzed. See the details below for your personalized insights.';
  }

  return rule.summaryTemplate;
}

/**
 * Generates a summary when no dominant pattern was detected.
 */
function generateNoPatternSummary(result: EngineResult): string {
  if (result.matchedPatterns.length === 0) {
    if (result.risks.length === 0 && result.strengths.length > 0) {
      return 'Your answers suggest a relationship with solid foundations. The insights below highlight what\'s working well and where there\'s room to grow.';
    }
    return 'Your results are still taking shape. With a few more answers, we can provide deeper, more personalized insights.';
  }

  // Multiple weak patterns but no dominant one
  return 'Your results suggest a mix of dynamics at play — no single pattern stands out strongly yet. The insights below highlight the themes we detected across your answers.';
}

/**
 * Generates a template-based explanation when AI is not available.
 * Uses the pattern rule templates to construct a useful explanation.
 */
function generateTemplateExplanation(result: EngineResult): string {
  const parts: string[] = [];

  if (result.dominantPattern) {
    const rule = patternRules.find((r) => r.id === result.dominantPattern!.id);

    if (rule) {
      // Strengths section
      if (rule.strengthsTemplate && result.strengths.length > 0) {
        parts.push(rule.strengthsTemplate);
      }

      // What to watch for
      if (result.watchNext.length > 0) {
        parts.push(result.watchNext.join(' '));
      }

      // Suggestion
      if (rule.safeSuggestion) {
        parts.push(rule.safeSuggestion);
      }
    }
  } else {
    // No dominant pattern — general guidance
    if (result.strengths.length > 0) {
      parts.push('There are some positive signals in your answers, which is encouraging.');
    }
    if (result.risks.length > 0) {
      parts.push('Some areas could benefit from attention and reflection.');
    }
    parts.push(
      'Try answering a few more questions or exploring another tool for deeper insights.'
    );
  }

  return parts.join('\n\n');
}

/**
 * Populates strengths, risks, watchNext, and tryNext arrays from pattern rules.
 * Called during engine result assembly (before merging).
 */
export function populateResultArrays(
  matchedPatterns: EngineResult['matchedPatterns'],
  dominantPatternId: PatternId | null
): {
  strengths: string[];
  risks: string[];
  watchNext: string[];
  tryNext: string[];
  safeSuggestion: string | null;
} {
  const strengths: string[] = [];
  const risks: string[] = [];
  const watchNext: string[] = [];
  const tryNext: string[] = [];
  let safeSuggestion: string | null = null;

  // Use the dominant pattern's templates
  if (dominantPatternId) {
    const rule = patternRules.find((r) => r.id === dominantPatternId);
    if (rule) {
      if (rule.strengthsTemplate) strengths.push(rule.strengthsTemplate);
      risks.push(rule.risksTemplate);
      watchNext.push(rule.watchNextTemplate);
      tryNext.push(rule.tryNextTemplate);
      safeSuggestion = rule.safeSuggestion ?? null;
    }
  }

  // Also add context from secondary patterns
  for (const matched of matchedPatterns) {
    if (matched.patternId === dominantPatternId) continue;
    if (matched.confidence === 'low') continue;

    const rule = patternRules.find((r) => r.id === matched.patternId);
    if (!rule) continue;

    // Only add secondary strengths/risks if confidence is fairly-high or high
    if (matched.confidence === 'fairly-high' || matched.confidence === 'high') {
      if (rule.strengthsTemplate && !strengths.includes(rule.strengthsTemplate)) {
        strengths.push(rule.strengthsTemplate);
      }
    }
  }

  return {
    strengths,
    risks,
    watchNext,
    tryNext,
    safeSuggestion,
  };
}
