// ============================================================
// LoveCheck — Question Router
// Navigates the adaptive question tree based on answers
// ============================================================

import type { ToolConfig, Question, QuestionTree } from '@/types';

/**
 * Returns the routing question for a given tool.
 * The routing question determines which branch the user enters.
 *
 * @param tool - The tool configuration
 * @returns The routing Question
 */
export function getRoutingQuestion(tool: ToolConfig): Question {
  return tool.questionTree.routingQuestion;
}

/**
 * Returns all questions for a specific branch.
 * Returns an empty array if the branch doesn't exist.
 *
 * @param tool - The tool configuration
 * @param branchId - The branch identifier (from routing option's branchRef)
 * @returns Array of branch-specific Questions
 */
export function getBranchQuestions(tool: ToolConfig, branchId: string): Question[] {
  return tool.questionTree.branches[branchId] ?? [];
}

/**
 * Returns universal cross-check questions that apply regardless of branch.
 * These are used for validation and signal triangulation.
 *
 * @param tool - The tool configuration
 * @returns Array of universal Questions
 */
export function getUniversalQuestions(tool: ToolConfig): Question[] {
  return tool.questionTree.universalQuestions ?? [];
}

/**
 * Returns the optional final question for a tool, if defined.
 *
 * @param tool - The tool configuration
 * @returns The final Question or null
 */
export function getFinalQuestion(tool: ToolConfig): Question | null {
  return tool.questionTree.finalQuestion ?? null;
}

/**
 * Intelligently routes to the next question based on progress through the tree.
 *
 * Flow:
 * 1. If no branch is selected yet, return the routing question (if not answered)
 * 2. If on a branch, return the next branch question by index
 * 3. After branch questions, move to universal questions
 * 4. After universal questions, optionally show the final question
 * 5. Return null when all questions are exhausted
 *
 * @param tree - The question tree to navigate
 * @param branchId - The selected branch (null if routing not yet answered)
 * @param currentIndex - Current position in the flow
 * @param answers - All answers given so far
 * @returns The next Question to present, or null if complete
 */
export function getNextQuestion(
  tree: QuestionTree,
  branchId: string | null,
  currentIndex: number,
  answers: Array<{ questionId: string; optionId: string }>
): Question | null {
  const answeredIds = new Set(answers.map((a) => a.questionId));

  // Step 1: Return routing question if not yet answered
  const routingQuestion = tree.routingQuestion;
  if (!answeredIds.has(routingQuestion.id)) {
    return routingQuestion;
  }

  // Step 2: If no branch yet determined, we need the routing answer
  if (!branchId) {
    // Try to determine branch from answers
    const routingAnswer = answers.find((a) => a.questionId === routingQuestion.id);
    if (routingAnswer) {
      const selectedOption = routingQuestion.options.find(
        (o) => o.id === routingAnswer.optionId
      );
      if (selectedOption?.branchRef) {
        branchId = selectedOption.branchRef;
      }
    }
  }

  // If still no branch, something is wrong — return null
  if (!branchId) {
    return null;
  }

  // Step 3: Get branch questions and find the next unanswered one
  const branchQuestions = tree.branches[branchId] ?? [];
  const unansweredBranch = branchQuestions.filter((q) => !answeredIds.has(q.id));

  if (currentIndex < unansweredBranch.length) {
    return unansweredBranch[currentIndex] ?? null;
  }

  // Step 4: Move to universal questions
  const universalQuestions = tree.universalQuestions ?? [];
  const unansweredUniversal = universalQuestions.filter((q) => !answeredIds.has(q.id));
  const universalIndex = currentIndex - unansweredBranch.length;

  if (universalIndex < unansweredUniversal.length) {
    return unansweredUniversal[universalIndex] ?? null;
  }

  // Step 5: Return final question if it exists and hasn't been answered
  if (tree.finalQuestion && !answeredIds.has(tree.finalQuestion.id)) {
    return tree.finalQuestion;
  }

  // All questions exhausted
  return null;
}

/**
 * Gets the total count of questions for a given branch path.
 * Useful for progress calculation.
 *
 * @param tree - The question tree
 * @param branchId - The branch being taken
 * @returns Total number of questions in the path
 */
export function getTotalQuestionCount(tree: QuestionTree, branchId: string | null): number {
  let count = 1; // routing question
  count += (tree.branches[branchId] ?? []).length;
  count += (tree.universalQuestions ?? []).length;
  if (tree.finalQuestion) count += 1;
  return count;
}
