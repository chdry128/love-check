// ============================================================
// LoveCheck — Pattern Rules
// Each pattern defines required signal thresholds and templates
// ============================================================

import type { PatternRule } from '@/types';

export const patternRules: PatternRule[] = [
  {
    id: 'hot-cold-loop',
    name: 'Hot & Cold Loop',
    description:
      'A pattern of intense pull-and-push dynamics where closeness alternates with distance, creating emotional whiplash and chronic uncertainty.',
    requiredSignals: {
      mixed_signals_high: 4,
    },
    optionalSignals: {
      consistency_low: 2,
      clarity_low: 2,
      trust_instability: 2,
    },
    riskLevel: 'elevated',
    weight: 8,
    summaryTemplate:
      'Your answers suggest a hot-and-cold dynamic — one moment things feel close and certain, the next they feel distant and confusing. This push-pull pattern can make it hard to trust what\'s real.',
    strengthsTemplate:
      'You\'re clearly paying attention to how you feel, and that awareness is the first step toward clarity.',
    risksTemplate:
      'This pattern can erode your sense of trust over time and make it harder to feel secure, even when things are going well.',
    watchNextTemplate:
      'Watch for whether the cycle follows any predictable triggers — like moments of vulnerability or conflict.',
    tryNextTemplate:
      'Try our Communication Pattern Check to understand how these dynamics play out in conversation.',
    safeSuggestion:
      'Consider whether this pattern repeats across relationships — if so, journaling about when you first noticed it can be illuminating.',
  },
  {
    id: 'overgiver-dynamic',
    name: 'Overgiver Dynamic',
    description:
      'A pattern where one person consistently gives more — emotionally, logistically, or energetically — than they receive, leading to burnout and resentment.',
    requiredSignals: {
      effort_imbalance: 4,
    },
    optionalSignals: {
      follow_through_low: 2,
      emotional_availability_low: 1,
      boundary_friction: 1,
    },
    riskLevel: 'elevated',
    weight: 7,
    summaryTemplate:
      'Your responses point to an overgiver dynamic — you may be carrying more of the emotional weight in this relationship than feels sustainable.',
    strengthsTemplate:
      'Your capacity to give and care deeply is a genuine strength — it shows up in how attentively you track the relationship\'s health.',
    risksTemplate:
      'Over time, giving without receiving can lead to resentment, burnout, and a gradual loss of your own sense of self.',
    watchNextTemplate:
      'Pay attention to moments when you say "yes" but your body or instincts say "no" — those moments are worth exploring.',
    tryNextTemplate:
      'Try our Attachment Style Lens to explore how giving patterns might connect to deeper attachment needs.',
    safeSuggestion:
      'Gently experiment with setting one small boundary this week and notice how it feels — you deserve reciprocity.',
  },
  {
    id: 'low-clarity-connection',
    name: 'Low-Clarity Connection',
    description:
      'A relationship where the direction, expectations, and emotional reality remain ambiguous, making it hard to plan or feel secure.',
    requiredSignals: {
      clarity_low: 5,
    },
    optionalSignals: {
      future_ambiguity: 2,
      mixed_signals_high: 1,
      consistency_low: 1,
    },
    riskLevel: 'moderate',
    weight: 5,
    summaryTemplate:
      'Your answers indicate a connection that lacks clarity — you may be unsure where things stand, where they\'re headed, or what your partner truly wants.',
    strengthsTemplate:
      'The fact that you\'re seeking clarity shows you value honesty and transparency in relationships — that\'s something worth holding onto.',
    risksTemplate:
      'Without clarity, it\'s easy to fill in the gaps with your own hopes or fears, which can lead to misunderstandings and wasted time.',
    watchNextTemplate:
      'Watch for whether specific conversations keep getting avoided — those are usually the ones that matter most.',
    tryNextTemplate:
      'Try our Relationship Risk Radar for a broader view of how clarity issues affect your connection.',
    safeSuggestion:
      'Consider asking one direct question this week that you\'ve been putting off — even a small step toward clarity can feel relieving.',
  },
  {
    id: 'strong-chemistry-weak-structure',
    name: 'Strong Chemistry, Weak Structure',
    description:
      'A relationship with high emotional or physical chemistry but lacking the practical foundations — shared goals, communication, reliability — that sustain it long-term.',
    requiredSignals: {
      follow_through_low: 3,
      consistency_low: 3,
    },
    optionalSignals: {
      future_ambiguity: 2,
      mixed_signals_high: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your results suggest a connection with strong sparks but shaky ground — the chemistry might be real, but the day-to-day reliability and consistency may not be matching it.',
    strengthsTemplate:
      'Real chemistry is worth acknowledging — it means there\'s genuine attraction and energy between you. That\'s not nothing.',
    risksTemplate:
      'Chemistry without structure tends to create rollercoaster experiences — exciting in the moment but exhausting over time.',
    watchNextTemplate:
      'Watch whether big promises get followed by small actions, or if there\'s a gap between what\'s said and what\'s done.',
    tryNextTemplate:
      'Try our Compatibility Compass to explore whether your values and life goals align beneath the chemistry.',
    safeSuggestion:
      'Make a mental note of three specific things your partner has followed through on recently — the count might tell you something.',
  },
  {
    id: 'boundary-friction-pattern',
    name: 'Boundary Friction Pattern',
    description:
      'A pattern where personal boundaries are repeatedly tested, crossed, or dismissed, leading to feelings of being controlled, unheard, or diminished.',
    requiredSignals: {
      boundary_friction: 4,
    },
    optionalSignals: {
      emotional_availability_low: 2,
      trust_instability: 2,
      effort_imbalance: 1,
    },
    riskLevel: 'high',
    weight: 9,
    summaryTemplate:
      'Your answers point to significant boundary friction — it sounds like your personal boundaries may not be consistently respected in this relationship.',
    strengthsTemplate:
      'Your willingness to recognize this pattern takes real courage — many people stay in denial for far longer.',
    risksTemplate:
      'When boundaries aren\'t respected, it can chip away at your self-worth, autonomy, and emotional safety over time.',
    watchNextTemplate:
      'Watch for patterns of minimization — like being told you\'re "too sensitive" or "overreacting" when you express discomfort.',
    tryNextTemplate:
      'Try our Red Flag Scanner to go deeper into specific warning signs that might need attention.',
    safeSuggestion:
      'You deserve to feel safe and respected in your relationships. Consider reaching out to a trusted friend, therapist, or support resource.',
  },
  {
    id: 'repairable-but-uneven',
    name: 'Repairable but Uneven',
    description:
      'A relationship with genuine care and willingness to work on things, but where effort, emotional availability, or growth aren\'t equally shared.',
    requiredSignals: {
      repair_potential_high: 3,
      effort_imbalance: 2,
    },
    optionalSignals: {
      consistency_low: 1,
      follow_through_low: 1,
    },
    riskLevel: 'low',
    weight: 4,
    summaryTemplate:
      'Your answers suggest a relationship that has real repair potential — there\'s care and willingness to grow — but the effort and emotional investment may not feel evenly distributed.',
    strengthsTemplate:
      'The presence of repair potential is a strong foundation — it means both of you have something worth working toward.',
    risksTemplate:
      'Even repairable relationships can become exhausting when the effort gap stays wide for too long.',
    watchNextTemplate:
      'Watch whether the imbalance is a phase or a pattern — temporary unevenness is normal; chronic imbalance isn\'t.',
    tryNextTemplate:
      'Try our Communication Pattern Check to find ways to address the effort gap constructively.',
    safeSuggestion:
      'A single honest conversation about how you\'re experiencing the balance can shift things — your feelings about this are valid.',
  },
];

export function getPatternRule(id: string): PatternRule | undefined {
  return patternRules.find((p) => p.id === id);
}

export default patternRules;
