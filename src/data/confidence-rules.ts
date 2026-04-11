// ============================================================
// LoveCheck — Confidence Rules
// Determines how confident we can be in the engine results
// ============================================================

import type { ConfidenceRule } from '@/types';

export const confidenceRules: ConfidenceRule[] = [
  {
    minAnswers: 3,
    signalOverlap: 4,
    patternStrength: 2,
  },
  {
    minAnswers: 5,
    signalOverlap: 6,
    patternStrength: 4,
  },
  {
    minAnswers: 8,
    signalOverlap: 8,
    patternStrength: 6,
  },
];

export default confidenceRules;
