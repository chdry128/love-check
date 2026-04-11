// ============================================================
// LoveCheck — Next Tool Recommendations
// Maps dominant patterns to recommended follow-up tools
// ============================================================

import type { PatternId, ToolSlug, RecommendedTool } from '@/types';

interface RecommendationEntry {
  patternId: PatternId;
  recommendations: RecommendedTool[];
}

export const nextToolRecommendations: RecommendationEntry[] = [
  {
    patternId: 'hot-cold-loop',
    recommendations: [
      {
        slug: 'communication-pattern-check',
        reason: 'Understanding your communication patterns can reveal what triggers the hot-and-cold cycle.',
        relevance: 0.95,
      },
      {
        slug: 'attachment-style-lens',
        reason: 'Attachment patterns often drive push-pull dynamics. Exploring yours could unlock important insights.',
        relevance: 0.85,
      },
      {
        slug: 'red-flag-scanner',
        reason: 'Some hot-cold patterns cross into territory that deserves closer attention.',
        relevance: 0.7,
      },
    ],
  },
  {
    patternId: 'overgiver-dynamic',
    recommendations: [
      {
        slug: 'attachment-style-lens',
        reason: 'Overgiving often connects to attachment patterns. Understanding yours can help you find balance.',
        relevance: 0.95,
      },
      {
        slug: 'boundary-friction-pattern' as ToolSlug,
        reason: 'Building healthier boundaries starts with recognizing where they get crossed.',
        relevance: 0.8,
      },
      {
        slug: 'compatibility-compass',
        reason: 'Check whether your relationship values align with the energy you\'re investing.',
        relevance: 0.65,
      },
    ],
  },
  {
    patternId: 'low-clarity-connection',
    recommendations: [
      {
        slug: 'relationship-risk-radar',
        reason: 'A broader risk assessment can help you see how clarity issues affect the bigger picture.',
        relevance: 0.9,
      },
      {
        slug: 'communication-pattern-check',
        reason: 'Clarity often starts with a single honest conversation. Learn what might be blocking it.',
        relevance: 0.85,
      },
      {
        slug: 'compatibility-compass',
        reason: 'Sometimes low clarity masks fundamental incompatibilities — or reveals alignment you didn\'t see.',
        relevance: 0.7,
      },
    ],
  },
  {
    patternId: 'strong-chemistry-weak-structure',
    recommendations: [
      {
        slug: 'compatibility-compass',
        reason: 'Chemistry is great, but shared values and goals are what make it last. Check your alignment.',
        relevance: 0.95,
      },
      {
        slug: 'communication-pattern-check',
        reason: 'Strong structure starts with strong communication. See where yours can grow.',
        relevance: 0.8,
      },
      {
        slug: 'relationship-risk-radar',
        reason: 'Understand whether the lack of structure is creating real risk in your connection.',
        relevance: 0.65,
      },
    ],
  },
  {
    patternId: 'boundary-friction-pattern',
    recommendations: [
      {
        slug: 'red-flag-scanner',
        reason: 'Boundary issues deserve careful attention. This scanner helps you tell normal friction from real concerns.',
        relevance: 0.95,
      },
      {
        slug: 'attachment-style-lens',
        reason: 'Understanding your attachment style can reveal why certain boundary patterns feel familiar.',
        relevance: 0.8,
      },
      {
        slug: 'communication-pattern-check',
        reason: 'Learning to communicate boundaries clearly is a skill — and this tool helps you practice.',
        relevance: 0.7,
      },
    ],
  },
  {
    patternId: 'repairable-but-uneven',
    recommendations: [
      {
        slug: 'communication-pattern-check',
        reason: 'Addressing the effort gap requires honest communication. This tool can help you find the right approach.',
        relevance: 0.95,
      },
      {
        slug: 'compatibility-compass',
        reason: 'Explore whether your shared values are strong enough to bridge the effort gap.',
        relevance: 0.75,
      },
    ],
  },
];

export function getRecommendations(patternId: PatternId | null): RecommendedTool[] {
  if (!patternId) return [];
  const entry = nextToolRecommendations.find((r) => r.patternId === patternId);
  return entry ? entry.recommendations : [];
}

export default nextToolRecommendations;
