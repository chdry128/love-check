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
  {
    id: 'anxious-avoidant-trap',
    name: 'Anxious-Avoidant Trap',
    description:
      'A classic attachment dynamic where one person pursues closeness and reassurance while the other withdraws — creating a painful cycle that reinforces both patterns.',
    requiredSignals: {
      trust_instability: 3,
      mixed_signals_high: 2,
    },
    optionalSignals: {
      boundary_friction: 2,
      effort_imbalance: 1,
      consistency_low: 1,
      emotional_availability_low: 1,
    },
    riskLevel: 'elevated',
    weight: 8,
    summaryTemplate:
      'Your answers suggest an anxious-avoidant dynamic — one of you may reach for closeness while the other pulls away, creating a cycle where neither person feels heard or met. The more one pursues, the more the other retreats, and vice versa.',
    strengthsTemplate:
      'The fact that you can see this pattern is a real strength. Most people trapped in this cycle don\'t even realize it\'s happening — they just feel frustrated and misunderstood.',
    risksTemplate:
      'Without awareness, this cycle tends to intensify over time. The anxious partner feels abandoned, the avoidant partner feels suffocated, and both end up proving their worst fears right.',
    watchNextTemplate:
      'Watch what happens after conflict — does one of you reach out while the other needs space? The pattern usually shows up most clearly in those moments.',
    tryNextTemplate:
      'Try our Communication Pattern Check to understand how this dynamic plays out in the way you actually talk to each other.',
    safeSuggestion:
      'Breaking this cycle starts with one person pausing — not to withdraw, but to notice. The book "Attached" by Amir Levine and Rachel Heller is a gentle, non-clinical starting point.',
  },
  {
    id: 'self-reliance-shield',
    name: 'Self-Reliance Shield',
    description:
      'A pattern where independence — normally a healthy quality — has become a protective barrier against vulnerability, emotional dependence, and the risk of being let down.',
    requiredSignals: {
      emotional_availability_low: 4,
    },
    optionalSignals: {
      boundary_friction: 2,
      consistency_low: 1,
      effort_imbalance: 1,
      trust_instability: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your responses suggest that self-reliance may be serving as a shield — you might be using independence to protect yourself from the vulnerability of truly needing someone. It\'s a strategy that probably served you well at some point, but it may now be limiting the depth of your connections.',
    strengthsTemplate:
      'Your independence and self-sufficiency are real assets — the world rewards those qualities. The question isn\'t whether they\'re useful, but whether they\'re blocking something you also want.',
    risksTemplate:
      'When self-reliance becomes a defense, it can quietly create distance in relationships — not through conflict, but through a ceiling on how close anyone is allowed to get.',
    watchNextTemplate:
      'Watch for the moment right after someone does something genuinely caring — do you let it in, or does a voice say "don\'t get used to this"?',
    tryNextTemplate:
      'Try our Attachment Style Lens to explore whether this pattern connects to earlier experiences of needing someone who wasn\'t there.',
    safeSuggestion:
      'Consider one small experiment: let someone help you with something this week — not because you can\'t do it yourself, but to practice receiving. Notice what comes up.',
  },
  {
    id: 'stonewall-cycle',
    name: 'Stonewall Cycle',
    description:
      'A pattern where one person withdraws or shuts down during conflict while the other pursues resolution, creating a painful and exhausting loop that rarely gets resolved.',
    requiredSignals: {
      emotional_availability_low: 4,
    },
    optionalSignals: {
      trust_instability: 2,
      boundary_friction: 2,
      clarity_low: 1,
    },
    riskLevel: 'elevated',
    weight: 8,
    summaryTemplate:
      'Your answers suggest a stonewalling dynamic — when things get tense, one of you pulls away while the other tries harder to connect. This pursue-withdraw cycle is one of the most common and exhausting communication patterns in relationships.',
    strengthsTemplate:
      'The fact that one person is still trying to connect shows there\'s care and investment in the relationship — even if the approach isn\'t working right now.',
    risksTemplate:
      'Over time, the pursuer burns out from chasing and the withdrawer feels increasingly pressured, which can push both people further apart.',
    watchNextTemplate:
      'Watch for whether the stonewalling happens more around specific topics — that can reveal what\'s really beneath the surface.',
    tryNextTemplate:
      'Try our Relationship Risk Radar for a broader view of how this pattern affects the overall health of your connection.',
    safeSuggestion:
      'Research by Dr. John Gottman shows that stonewalling is one of the strongest predictors of relationship breakdown — but it\'s also one of the most treatable with the right support. Couples therapy can make a real difference here.',
  },
  {
    id: 'misaligned-expectations',
    name: 'Misaligned Expectations',
    description:
      'A pattern where partners have fundamentally different assumptions about how communication should work — how often to check in, how deep conversations should go, or how quickly to address problems.',
    requiredSignals: {
      clarity_low: 4,
      mixed_signals_high: 3,
    },
    optionalSignals: {
      effort_imbalance: 2,
      consistency_low: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your answers point to misaligned communication expectations — you and your partner may have different ideas about what "good communication" looks like, which creates frustration even when both of you are trying.',
    strengthsTemplate:
      'Misalignment doesn\'t mean incompatibility — it usually just means nobody has clearly defined what they need. That\'s fixable.',
    risksTemplate:
      'When expectations are unspoken, each person judges the other by their own internal standard, which leads to feeling unheard, uncared for, or inadequate.',
    watchNextTemplate:
      'Watch whether you\'ve ever actually discussed what good communication looks like for each of you — not just what\'s wrong, but what you both want.',
    tryNextTemplate:
      'Try our Compatibility Compass to explore whether deeper values and lifestyle differences might be driving the communication gap.',
    safeSuggestion:
      'Try this exercise: each of you writes down your top 3 communication needs (e.g., daily check-in texts, no phone during dinner, space before discussing conflict) and then share them. You might be surprised by how simple the gap really is.',
  },
  {
    id: 'communication-withdrawal',
    name: 'Communication Withdrawal',
    description:
      'A pattern where important conversations get progressively avoided over time, leaving both partners feeling disconnected, unheard, and emotionally distant without a clear breaking point.',
    requiredSignals: {
      clarity_low: 5,
      consistency_low: 4,
    },
    optionalSignals: {
      emotional_availability_low: 2,
      trust_instability: 1,
      follow_through_low: 1,
    },
    riskLevel: 'high',
    weight: 9,
    summaryTemplate:
      'Your answers indicate significant communication withdrawal — important conversations seem to be getting avoided more and more, and the emotional distance may be growing without either of you fully realizing how far apart you\'ve drifted.',
    strengthsTemplate:
      'The fact that you\'re here, taking this check, suggests you haven\'t given up — and that awareness is a crucial first step.',
    risksTemplate:
      'Communication withdrawal is subtle because there\'s no explosion — just a quiet erosion. Over time, couples in this pattern often describe feeling like they\'re "roommates" rather than partners.',
    watchNextTemplate:
      'Watch for whether you\'ve started replacing real conversations with logistics — talking about schedules, errands, and plans while avoiding anything emotional.',
    tryNextTemplate:
      'Try our Attachment Style Lens to explore whether deeper attachment needs might be driving the withdrawal pattern.',
    safeSuggestion:
      'Start small. Instead of tackling the big things, try sharing one genuine feeling today — even something as simple as "I had a hard day and I just need a hug." Small openings can lead to bigger ones.',
  },
];

export function getPatternRule(id: string): PatternRule | undefined {
  return patternRules.find((p) => p.id === id);
}

export default patternRules;
