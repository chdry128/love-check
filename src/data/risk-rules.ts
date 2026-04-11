// ============================================================
// LoveCheck — Risk Rules
// Signal thresholds for determining risk levels
// ============================================================

import type { RiskRule } from '@/types';

export const riskRules: RiskRule[] = [
  {
    signal: 'clarity_low',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'consistency_low',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'effort_imbalance',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'future_ambiguity',
    thresholds: {
      low: 0,
      moderate: 2,
      elevated: 5,
      high: 8,
    },
  },
  {
    signal: 'emotional_availability_low',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'repair_potential_high',
    thresholds: {
      low: 0,
      moderate: -1,
      elevated: -3,
      high: -5,
    },
  },
  {
    signal: 'boundary_friction',
    thresholds: {
      low: 0,
      moderate: 2,
      elevated: 5,
      high: 8,
    },
  },
  {
    signal: 'mixed_signals_high',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'trust_instability',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
  {
    signal: 'follow_through_low',
    thresholds: {
      low: 0,
      moderate: 3,
      elevated: 6,
      high: 9,
    },
  },
];

export default riskRules;
