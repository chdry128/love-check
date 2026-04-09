// ============================================================
// LoveCheck — Safety Rules
// Ensures output is non-clinical and non-diagnostic
// ============================================================

import type { RiskLevel, PatternId } from '@/types';

export interface SafetyRule {
  patternId: PatternId;
  requiresWarning: boolean;
  riskThreshold: RiskLevel;
  disallowedPhrases: string[];
  requiredDisclaimer: string | null;
}

export const safetyRules: SafetyRule[] = [
  {
    patternId: 'boundary-friction-pattern',
    requiresWarning: true,
    riskThreshold: 'high',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'narcissist',
      'gaslighting',
      'manipulation',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
      'victim',
    ],
    requiredDisclaimer:
      'This tool provides reflection, not diagnosis. If you feel unsafe, please reach out to a professional or a trusted person in your life.',
  },
  {
    patternId: 'hot-cold-loop',
    requiresWarning: false,
    riskThreshold: 'elevated',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'narcissist',
      'gaslighting',
      'manipulation',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
    ],
    requiredDisclaimer: null,
  },
  {
    patternId: 'overgiver-dynamic',
    requiresWarning: false,
    riskThreshold: 'elevated',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'codependent',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
      'enabler',
    ],
    requiredDisclaimer: null,
  },
  {
    patternId: 'low-clarity-connection',
    requiresWarning: false,
    riskThreshold: 'moderate',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
      'breadcrumbing',
      'situationship',
    ],
    requiredDisclaimer: null,
  },
  {
    patternId: 'strong-chemistry-weak-structure',
    requiresWarning: false,
    riskThreshold: 'moderate',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
      'love bombing',
      'trauma bond',
    ],
    requiredDisclaimer: null,
  },
  {
    patternId: 'repairable-but-uneven',
    requiresWarning: false,
    riskThreshold: 'low',
    disallowedPhrases: [
      'abusive',
      'toxic',
      'diagnosis',
      'personality disorder',
      'clinical',
      'syndrome',
      'pathology',
    ],
    requiredDisclaimer: null,
  },
];

export default safetyRules;
