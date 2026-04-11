// ============================================================
// LoveCheck — Next Tool Recommender
// Recommends follow-up tools based on detected patterns
// ============================================================

import type { PatternId, ToolSlug, RecommendedTool } from '@/types';
import { getRecommendations } from '@/data/next-tool-recommendations';

/**
 * Recommends next tools to try based on the dominant pattern and current tool.
 *
 * Logic:
 * 1. Look up recommendations for the dominant pattern
 * 2. Filter out the current tool (don't recommend what they just used)
 * 3. Sort by relevance score descending
 *
 * @param dominantPattern - The ID of the dominant detected pattern (or null)
 * @param currentTool - The slug of the tool just completed
 * @returns Array of recommended tools sorted by relevance
 */
export function recommendNextTools(
  dominantPattern: PatternId | null,
  currentTool: ToolSlug
): RecommendedTool[] {
  // If no dominant pattern, return empty
  if (!dominantPattern) {
    return getDefaultRecommendations(currentTool);
  }

  // Get pattern-based recommendations
  const recommendations = getRecommendations(dominantPattern);

  // Filter out the current tool
  const filtered = recommendations.filter((r) => r.slug !== currentTool);

  // Sort by relevance descending
  filtered.sort((a, b) => b.relevance - a.relevance);

  return filtered;
}

/**
 * Returns default recommendations when no dominant pattern is detected.
 * These are broadly applicable tools based on the current one.
 */
function getDefaultRecommendations(currentTool: ToolSlug): RecommendedTool[] {
  // Default recommendations based on current tool
  const defaults: Record<ToolSlug, RecommendedTool[]> = {
    'relationship-risk-radar': [
      {
        slug: 'communication-pattern-check',
        reason: 'Communication is often at the heart of relationship dynamics. Understanding yours can clarify a lot.',
        relevance: 0.8,
      },
      {
        slug: 'attachment-style-lens',
        reason: 'Understanding your attachment style can explain patterns you keep experiencing.',
        relevance: 0.75,
      },
    ],
    'attachment-style-lens': [
      {
        slug: 'communication-pattern-check',
        reason: 'Attachment styles shape how we communicate. See the connection in action.',
        relevance: 0.8,
      },
      {
        slug: 'relationship-risk-radar',
        reason: 'Get a broader view of how attachment dynamics affect your relationship health.',
        relevance: 0.7,
      },
    ],
    'communication-pattern-check': [
      {
        slug: 'attachment-style-lens',
        reason: 'Communication patterns often stem from deeper attachment wiring.',
        relevance: 0.8,
      },
      {
        slug: 'relationship-risk-radar',
        reason: 'See how your communication patterns connect to overall relationship health.',
        relevance: 0.7,
      },
    ],
    'compatibility-compass': [
      {
        slug: 'communication-pattern-check',
        reason: 'Even compatible partners need strong communication. Check yours.',
        relevance: 0.8,
      },
      {
        slug: 'relationship-risk-radar',
        reason: 'Understand how compatibility factors into your relationship\'s overall health.',
        relevance: 0.65,
      },
    ],
    'red-flag-scanner': [
      {
        slug: 'attachment-style-lens',
        reason: 'Understanding your attachment style can help you make sense of the patterns you\'ve spotted.',
        relevance: 0.85,
      },
      {
        slug: 'communication-pattern-check',
        reason: 'Communication patterns often reveal or mask red flags. Worth a closer look.',
        relevance: 0.75,
      },
    ],
  };

  return defaults[currentTool] ?? [];
}
