// ============================================================
// LoveCheck — Signal Extractor
// Aggregates signals from user answers across all questions
// ============================================================

import type { AnswerPayload, SignalMap, QuestionTree, SignalKey } from '@/types';

/**
 * Extracts and aggregates all signals from user answers.
 *
 * For each answer:
 * 1. Look up the question in the tree
 * 2. Find the selected option(s)
 * 3. Merge the option's signals with the running total
 * 4. Apply optional weight multiplier
 * 5. Sum signal values across all answers
 *
 * @param answers - The user's answers array
 * @param tree - The question tree to look up questions/options
 * @returns Aggregated SignalMap with summed values
 */
export function extractSignals(
  answers: AnswerPayload['answers'],
  tree: QuestionTree
): SignalMap {
  // Initialize empty signal map
  const aggregated: SignalMap = {};

  // Build a lookup map of all questions by ID for O(1) access
  const questionMap = buildQuestionMap(tree);

  // Edge case: no answers
  if (!answers || answers.length === 0) {
    return aggregated;
  }

  for (const answer of answers) {
    const question = questionMap[answer.questionId];
    if (!question) {
      // Silently skip unknown question IDs — defensive
      continue;
    }

    // Handle both single and multi-choice answers
    const optionIds = Array.isArray(answer.optionId)
      ? answer.optionId
      : [answer.optionId];

    for (const optId of optionIds) {
      const option = question.options.find((o) => o.id === optId);
      if (!option) {
        continue;
      }

      // Get weight (default to 1.0)
      const weight = option.weight ?? 1.0;

      // Merge signals with weight applied
      mergeSignals(aggregated, option.signals, weight);
    }
  }

  return aggregated;
}

/**
 * Builds a flat map of all questions in a tree by ID.
 */
function buildQuestionMap(tree: QuestionTree): Record<string, typeof tree.routingQuestion> {
  const map: Record<string, typeof tree.routingQuestion> = {};

  // Routing question
  map[tree.routingQuestion.id] = tree.routingQuestion;

  // Branch questions
  for (const questions of Object.values(tree.branches)) {
    for (const q of questions) {
      map[q.id] = q;
    }
  }

  // Universal questions
  for (const q of tree.universalQuestions ?? []) {
    map[q.id] = q;
  }

  // Final question
  if (tree.finalQuestion) {
    map[tree.finalQuestion.id] = tree.finalQuestion;
  }

  return map;
}

/**
 * Merges a source signal map into a target, applying a weight multiplier.
 * Values are summed. Negative values are allowed (they reduce the signal).
 */
function mergeSignals(
  target: SignalMap,
  source: SignalMap,
  weight: number
): void {
  for (const [key, value] of Object.entries(source)) {
    const signalKey = key as SignalKey;
    const weightedValue = value * weight;

    if (target[signalKey] === undefined) {
      target[signalKey] = weightedValue;
    } else {
      target[signalKey] = (target[signalKey] as number) + weightedValue;
    }

    // Clamp values at 0 if they're very close to zero (avoid floating-point noise)
    const current = target[signalKey] as number;
    if (Math.abs(current) < 0.01) {
      target[signalKey] = 0;
    }
  }
}

/**
 * Gets the count of non-zero signals in a signal map.
 */
export function getActiveSignalCount(signals: SignalMap): number {
  return Object.values(signals).filter((v) => v !== undefined && v > 0).length;
}

/**
 * Gets the total absolute value of all signals (used for relative scoring).
 */
export function getTotalSignalMagnitude(signals: SignalMap): number {
  return Object.values(signals).reduce(
    (sum, v) => sum + Math.abs(v ?? 0),
    0
  );
}
