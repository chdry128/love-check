// ============================================================
// LoveCheck — Universal Adaptive Engine
// Core processing pipeline orchestrator
// ============================================================

import type {
  AnswerPayload,
  EngineResult,
  AIPayload,
  AIOutput,
  FinalResult,
  PatternId,
  RiskLevel,
  ConfidenceLevel,
  RecommendedTool,
} from '@/types';

// ── Engine Modules ──────────────────────────────────────────

export { loadTool, toolExists } from './tool-loader';
export {
  getRoutingQuestion,
  getBranchQuestions,
  getUniversalQuestions,
  getFinalQuestion,
  getNextQuestion,
  getTotalQuestionCount,
} from './question-router';
export {
  extractSignals,
  getActiveSignalCount,
  getTotalSignalMagnitude,
} from './signal-extractor';
export { detectPatterns, getPatternRiskLevel } from './pattern-detector';
export { evaluateRisk, getRiskLabel } from './risk-evaluator';
export { evaluateConfidence, getConfidenceLabel } from './confidence-evaluator';
export { runSafetyGate } from './safety-gate';
export { recommendNextTools } from './next-tool-recommender';
export { buildAIPayload } from './ai-payload-builder';
export { mergeResults, populateResultArrays } from './result-merger';

// ── Internal Imports ────────────────────────────────────────

import { loadTool } from './tool-loader';
import { extractSignals } from './signal-extractor';
import { detectPatterns } from './pattern-detector';
import { evaluateRisk } from './risk-evaluator';
import { evaluateConfidence } from './confidence-evaluator';
import { runSafetyGate } from './safety-gate';
import { recommendNextTools } from './next-tool-recommender';
import { buildAIPayload } from './ai-payload-builder';
import { mergeResults, populateResultArrays } from './result-merger';
import { patternRules } from '@/data/patterns';

// ── Pipeline Orchestrator ───────────────────────────────────

/**
 * Runs the full Universal Adaptive Engine pipeline.
 *
 * Pipeline steps:
 * 1. Load tool config (validate slug)
 * 2. Extract signals from answers
 * 3. Detect patterns from signals
 * 4. Evaluate overall risk level
 * 5. Evaluate confidence in results
 * 6. Run safety gate (flag concerns, add disclaimers)
 * 7. Recommend next tools based on dominant pattern
 * 8. Assemble the complete EngineResult
 *
 * This function is PURE — no side effects, no database calls.
 * All processing is deterministic based on the input payload.
 *
 * @param payload - The user's answer payload
 * @returns Complete EngineResult with signals, patterns, risk, and recommendations
 */
export function runEngine(payload: AnswerPayload): EngineResult {
  // ── Step 1: Load Tool ───────────────────────────────────
  const tool = loadTool(payload.toolSlug);
  const tree = tool.questionTree;

  // ── Step 2: Extract Signals ────────────────────────────
  const signals = extractSignals(payload.answers, tree);

  // ── Step 3: Detect Patterns ────────────────────────────
  const matchedPatterns = detectPatterns(signals);

  // ── Step 4: Determine Dominant Pattern ──────────────────
  const dominantPattern = resolveDominantPattern(matchedPatterns);

  // ── Step 5: Evaluate Risk ──────────────────────────────
  const overallRisk = evaluateRisk(signals, matchedPatterns);

  // ── Step 6: Evaluate Confidence ────────────────────────
  const overallConfidence = evaluateConfidence(
    matchedPatterns,
    payload.answers.length
  );

  // Update dominant pattern with the overall risk and confidence
  const enrichedDominantPattern = dominantPattern
    ? {
        ...dominantPattern,
        riskLevel: dominantPattern.riskLevel,
        confidence: overallConfidence,
      }
    : null;

  // ── Step 7: Populate Result Arrays ─────────────────────
  const { strengths, risks, watchNext, tryNext, safeSuggestion } =
    populateResultArrays(matchedPatterns, dominantPattern?.id ?? null);

  // ── Step 8: Run Safety Gate ────────────────────────────
  const partialResult: EngineResult = {
    toolSlug: payload.toolSlug,
    signals,
    matchedPatterns,
    dominantPattern: enrichedDominantPattern,
    strengths,
    risks,
    watchNext,
    tryNext,
    safeSuggestion,
    recommendedTools: [], // populated below
    timestamp: new Date().toISOString(),
  };

  const safetyDecision = runSafetyGate(partialResult, payload);

  // Add safety warning to risks if flagged
  if (safetyDecision.warningMessage && !risks.includes(safetyDecision.warningMessage)) {
    risks.push(safetyDecision.warningMessage);
  }

  // ── Step 9: Recommend Next Tools ───────────────────────
  const recommendedTools = recommendNextTools(
    dominantPattern?.id ?? null,
    payload.toolSlug
  );

  // ── Assemble Final EngineResult ────────────────────────
  return {
    toolSlug: payload.toolSlug,
    signals,
    matchedPatterns,
    dominantPattern: enrichedDominantPattern,
    strengths,
    risks,
    watchNext,
    tryNext,
    safeSuggestion,
    recommendedTools,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Resolves the dominant pattern from matched patterns.
 * The dominant pattern is the one with the highest score and at least moderate confidence.
 */
function resolveDominantPattern(matchedPatterns: EngineResult['matchedPatterns']): {
  id: PatternId;
  name: string;
  riskLevel: RiskLevel;
  confidence: ConfidenceLevel;
} | null {
  if (matchedPatterns.length === 0) {
    return null;
  }

  // Find the top pattern (already sorted by score desc from detectPatterns)
  const top = matchedPatterns[0];

  // Only consider as dominant if confidence is at least moderate
  if (top.confidence === 'low') {
    return null;
  }

  const rule = patternRules.find((r) => r.id === top.patternId);
  if (!rule) {
    return null;
  }

  return {
    id: rule.id,
    name: rule.name,
    riskLevel: rule.riskLevel,
    confidence: top.confidence,
  };
}

// ── Convenience: Full Pipeline with AI Merge ───────────────

/**
 * Runs the full engine pipeline AND merges with AI output.
 * Use this when AI enhancement is available.
 *
 * @param payload - The user's answer payload
 * @param aiOutput - AI-generated enhancement (or null for template-only)
 * @returns Complete FinalResult with summary and personalization
 */
export function runEngineWithAI(
  payload: AnswerPayload,
  aiOutput: AIOutput | null
): FinalResult {
  const engineResult = runEngine(payload);
  return mergeResults(engineResult, aiOutput);
}

/**
 * Runs the engine and builds the AI payload for enhancement.
 * Use this to get both the engine result and the AI payload
 * (to send to the AI service separately).
 *
 * @param payload - The user's answer payload
 * @returns Tuple of [EngineResult, AIPayload]
 */
export function runEngineForAI(
  payload: AnswerPayload
): { engineResult: EngineResult; aiPayload: AIPayload } {
  const engineResult = runEngine(payload);
  const aiPayload = buildAIPayload(engineResult, payload);
  return { engineResult, aiPayload };
}
