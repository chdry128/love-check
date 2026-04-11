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

  // ── Part 2: Texting Energy Match Patterns ───────────────────

  {
    id: 'balanced-texting-match',
    name: 'Balanced Texting Match',
    description:
      'A texting dynamic where both people feel comfortable with the pace, effort, and emotional tone of their digital communication — neither overthinking nor chasing.',
    requiredSignals: {
      effort_imbalance: 0,
      dry_texting: 0,
    },
    optionalSignals: {
      repair_potential_high: 1,
    },
    riskLevel: 'low',
    weight: 3,
    summaryTemplate:
      'Your texting dynamic seems genuinely balanced — both of you appear to be showing up with a similar level of interest and effort, and neither person is doing all the heavy lifting. That\'s a solid foundation to build on.',
    strengthsTemplate:
      'When texting feels natural and mutual, it usually means you\'re both communicating from a place of genuine interest rather than obligation or anxiety.',
    risksTemplate:
      'The main risk with a good thing is taking it for granted — texting balance can drift if life gets busy or one person starts pulling back without realizing it.',
    watchNextTemplate:
      'Watch for whether the balance stays consistent over time, or if one of you starts doing more initiating during busy or stressful periods.',
    tryNextTemplate:
      'Try our Communication Pattern Check to see how your texting dynamic translates into in-person conversations.',
    safeSuggestion:
      'Enjoy the ease of it. Not every dynamic needs fixing — sometimes the healthiest thing is to appreciate what\'s working and stay present to it.',
  },
  {
    id: 'overgiver-texting-dynamic',
    name: 'Overgiver Texting Dynamic',
    description:
      'A texting pattern where one person is consistently doing more of the initiating, elaborating, and carrying the conversation — while the other contributes just enough to keep it going.',
    requiredSignals: {
      effort_imbalance: 4,
      dry_texting: 1,
    },
    optionalSignals: {
      enthusiasm_mismatch: 2,
      consistency_low: 1,
    },
    riskLevel: 'elevated',
    weight: 7,
    summaryTemplate:
      'Your answers suggest an overgiver texting dynamic — you may be putting significantly more energy into keeping the conversation alive than you\'re getting back. It\'s not that they\'re not interested at all, but the effort ratio feels uneven, and that imbalance can quietly drain your confidence over time.',
    strengthsTemplate:
      'Your willingness to invest in connection shows real emotional generosity — you\'re not afraid to show interest, and that authenticity matters.',
    risksTemplate:
      'When you\'re always the one carrying the texting energy, it\'s easy to start second-guessing yourself and wondering if the interest is real. Over time, this can erode your self-esteem and make you feel like you\'re chasing something that isn\'t fully there.',
    watchNextTemplate:
      'Watch what happens when you pull back slightly — not as a test, but as a genuine pause. Notice whether they naturally step up or if the conversation stalls.',
    tryNextTemplate:
      'Try our Relationship Risk Radar to get a fuller picture of whether this texting imbalance is part of a larger pattern.',
    safeSuggestion:
      'You don\'t have to stop reaching out — but try matching their energy for a few days and see what shifts. The right person will notice the change and close the gap.',
  },
  {
    id: 'high-interest-low-follow-through',
    name: 'High Interest, Low Follow-Through',
    description:
      'A dynamic where early enthusiasm and promising conversations don\'t translate into consistent action — the words are there, but the follow-through keeps falling short.',
    requiredSignals: {
      dry_texting: 3,
      enthusiasm_mismatch: 2,
    },
    optionalSignals: {
      breadcrumbing_pattern: 2,
      consistency_low: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your answers point to a pattern of high interest with low follow-through — the sparks are there, but they don\'t seem to lead anywhere concrete. Plans get made and forgotten, excitement fades into silence, and you\'re left wondering what happened to all that energy they showed at first.',
    strengthsTemplate:
      'You\'re clearly someone who values follow-through, and that\'s not being picky — it\'s having standards. The things that matter to you in communication reveal what you need to feel safe.',
    risksTemplate:
      'When enthusiasm doesn\'t lead to action, it can create a cycle of hope and disappointment. You might find yourself getting excited every time they reach out, only to feel let down when nothing comes of it.',
    watchNextTemplate:
      'Watch for whether they follow through on specific plans — not vague "let\'s hang out sometime" energy, but actual dates, times, and commitments.',
    tryNextTemplate:
      'Try our Communication Pattern Check to understand how this pattern shows up beyond just texting.',
    safeSuggestion:
      'Next time they say something enthusiastic, try gently pinning it down: "That sounds great — what day works for you?" Their answer will tell you a lot.',
  },
  {
    id: 'warm-but-casual-energy',
    name: 'Warm but Casual Energy',
    description:
      'A texting dynamic that feels friendly and pleasant, but keeps things light in a way that makes it hard to tell where you really stand or whether the interest goes deeper.',
    requiredSignals: {
      effort_imbalance: 1,
      dry_texting: 1,
    },
    optionalSignals: {
      consistency_low: 0,
      mixed_signals_high: 1,
    },
    riskLevel: 'low',
    weight: 4,
    summaryTemplate:
      'Your texting dynamic seems warm but casual — there\'s friendliness and a pleasant back-and-forth, but it may not be giving you the depth or clarity you\'re looking for. It\'s not that anything is wrong, exactly — more that the connection hasn\'t found its footing yet.',
    strengthsTemplate:
      'A warm texting dynamic is a good starting point — it means there\'s comfort, rapport, and at least some genuine enjoyment of each other\'s company.',
    risksTemplate:
      'The risk with "warm but casual" is that it can stay in that zone indefinitely — pleasant enough that you don\'t want to walk away, but not deep enough to feel truly connected.',
    watchNextTemplate:
      'Watch whether the conversations ever move beyond the surface — do you talk about things that matter to you, or does it stay in safe, small-talk territory?',
    tryNextTemplate:
      'Try our Future Alignment Checker to explore whether your deeper values and goals align beneath the casual surface.',
    safeSuggestion:
      'Try sharing something real and slightly vulnerable — not dramatic, just honest. See if they meet you there or pivot back to something lighter. Their response will tell you a lot about where this is headed.',
  },
  {
    id: 'mixed-signal-thread',
    name: 'Mixed Signal Thread',
    description:
      'A texting pattern full of contradictions — long, engaged messages followed by hours of silence, deep emotional sharing one day and surface-level energy the next.',
    requiredSignals: {
      mixed_signals_high: 4,
      enthusiasm_mismatch: 2,
    },
    optionalSignals: {
      breadcrumbing_pattern: 2,
      consistency_low: 2,
    },
    riskLevel: 'elevated',
    weight: 8,
    summaryTemplate:
      'Your answers reveal a texting dynamic full of mixed signals — the warmth and connection feel real in the moment, but they\'re followed by periods of distance or disengagement that leave you confused and off-balance. This kind of emotional rollercoaster can make it hard to trust what you\'re experiencing.',
    strengthsTemplate:
      'The fact that you can see the contradictions — even while you\'re in them — shows strong emotional intelligence. You\'re not making excuses; you\'re paying attention.',
    risksTemplate:
      'Mixed signals create a state of chronic uncertainty that can be surprisingly exhausting. Your brain keeps trying to solve the puzzle of "do they or don\'t they," and that mental loop drains energy you could be spending on things that nourish you.',
    watchNextTemplate:
      'Watch for the pattern within the chaos — is there a rhythm to the pull-backs? Do they happen after moments of particular closeness, or during times when you express a need?',
    tryNextTemplate:
      'Try our Relationship Risk Radar to assess whether this mixed-signal dynamic reflects a broader pattern in the connection.',
    safeSuggestion:
      'You deserve someone whose interest you don\'t have to decode. While you\'re figuring things out, try redirecting some of that mental energy toward yourself — a hobby, a goal, something that\'s just for you.',
  },
  {
    id: 'breadcrumbing-risk',
    name: 'Breadcrumbing Risk',
    description:
      'A pattern of sporadic, low-effort contact designed to keep someone interested without any real commitment — just enough interaction to prevent the connection from fading.',
    requiredSignals: {
      breadcrumbing_pattern: 4,
      dry_texting: 2,
    },
    optionalSignals: {
      effort_imbalance: 2,
      consistency_low: 2,
    },
    riskLevel: 'moderate',
    weight: 7,
    summaryTemplate:
      'Your answers suggest a breadcrumbing pattern — the contact you\'re getting feels more like crumbs than a meal. There\'s just enough to keep you hoping, but not enough to feel genuinely valued or prioritized. It\'s a pattern that can keep you tethered to someone without the relationship ever actually moving forward.',
    strengthsTemplate:
      'You\'re perceptive enough to feel the difference between genuine engagement and going through the motions — trust that instinct. It\'s picking up on something real.',
    risksTemplate:
      'Breadcrumbing can quietly erode your self-worth by keeping you in a state of perpetual waiting. You might find yourself overanalyzing every message, rejoicing at small signs of interest, and minimizing long stretches of silence.',
    watchNextTemplate:
      'Watch whether the pattern changes when you pull back — breadcrumbing often intensifies briefly when someone senses you slipping away, only to return to the same low-effort baseline.',
    tryNextTemplate:
      'Try our Red Flag Scanner to explore whether this dynamic connects to other warning signs in the relationship.',
    safeSuggestion:
      'Ask yourself: if this level of communication stayed exactly the same for the next six months, would you be happy? If the answer is no, you already know what you need to know.',
  },

  // ── Part 2: Love Bombing Detector Patterns ──────────────────

  {
    id: 'fast-intensity-risk',
    name: 'Fast Intensity Risk',
    description:
      'A pattern where emotional intensity ramps up unusually quickly — declarations, grand gestures, and constant contact that feel intoxicating at first but may outpace genuine trust-building.',
    requiredSignals: {
      fast_intensity: 4,
      pressure_signal: 2,
    },
    optionalSignals: {
      future_promises_high: 2,
      consistency_low: 1,
    },
    riskLevel: 'elevated',
    weight: 8,
    summaryTemplate:
      'Your answers indicate that the emotional intensity has ramped up quickly — there\'s a lot of feeling, a lot of declarations, and a lot of energy being directed at you. That can feel wonderful and flattering, but when intensity moves faster than trust, it can also leave you feeling ungrounded and unsure what\'s real.',
    strengthsTemplate:
      'You\'re clearly someone who feels deeply and opens up to connection — that\'s a beautiful quality. The question isn\'t whether your openness is wrong, but whether the pace of this connection is right for you.',
    risksTemplate:
      'Fast intensity can make it hard to see red flags clearly because everything feels so exciting. It can also create a sense of obligation — like you owe them the same level of intensity back, even if your natural pace is slower.',
    watchNextTemplate:
      'Watch what happens when you set a gentle boundary or slow things down — does the intensity respect your pace, or does it push back against it?',
    tryNextTemplate:
      'Try our Pacing & Early Stage tools for a deeper look at whether this intensity is genuine excitement or something worth being cautious about.',
    safeSuggestion:
      'You\'re allowed to enjoy the excitement while also asking for a slower pace. Try saying something like "I\'m really enjoying this, and I also like taking things step by step." Their response will tell you everything.',
  },
  {
    id: 'future-faking-signal',
    name: 'Future-Faking Signal',
    description:
      'A pattern where someone paints vivid pictures of a shared future — trips, plans, milestones — that feel binding and meaningful but may be more fantasy than intention.',
    requiredSignals: {
      future_promises_high: 4,
      fast_intensity: 1,
    },
    optionalSignals: {
      pressure_signal: 2,
      mixed_signals_high: 1,
    },
    riskLevel: 'moderate',
    weight: 7,
    summaryTemplate:
      'Your answers suggest a future-faking pattern — there\'s been a lot of talk about the future together, and it might have felt like a promise. But talk about the future is only meaningful when it comes with follow-through. Right now, the beautiful vision may be running ahead of what\'s actually being built.',
    strengthsTemplate:
      'Your ability to envision a future with someone shows you take relationships seriously — you\'re not just looking for something casual. That kind of intentionality is valuable.',
    risksTemplate:
      'Future-faking can create a false sense of security. You might start planning your life around promises that were never really commitments, which makes the disappointment sharper when reality doesn\'t match the vision.',
    watchNextTemplate:
      'Watch whether the future talk comes with concrete steps — not "someday we\'ll go to Japan," but "let\'s start a travel fund and book something for next spring."',
    tryNextTemplate:
      'Try our Future Alignment Checker to explore whether your actual values and timelines align, beyond the exciting promises.',
    safeSuggestion:
      'Next time they paint a beautiful future picture, try gently asking: "That sounds amazing — what would be the first step to making that happen?" A real plan has a first step. A fantasy doesn\'t.',
  },
  {
    id: 'intense-but-unstable',
    name: 'Intense but Unstable',
    description:
      'A relationship pattern where high emotional intensity coexists with deep inconsistency — peaks that feel transcendent followed by drops that feel devastating.',
    requiredSignals: {
      fast_intensity: 3,
      consistency_low: 4,
    },
    optionalSignals: {
      mixed_signals_high: 2,
      pressure_signal: 2,
    },
    riskLevel: 'high',
    weight: 9,
    summaryTemplate:
      'Your answers point to an intense but unstable dynamic — the highs are high, and the connection can feel extraordinary in its best moments. But the inconsistency beneath it means you never quite feel on solid ground. One day it feels like everything you\'ve ever wanted; the next, you\'re not sure where you stand.',
    strengthsTemplate:
      'You clearly have the capacity for deep, passionate connection — that\'s not something everyone can say. The challenge isn\'t your ability to love deeply; it\'s finding someone who can hold that depth consistently.',
    risksTemplate:
      'This pattern is emotionally exhausting over time. The highs create a kind of addiction — you keep chasing that feeling of perfect connection — while the lows chip away at your trust, your self-worth, and your ability to feel secure.',
    watchNextTemplate:
      'Watch for the triggers behind the inconsistency — is it tied to external stress, conflict, or closeness itself? Understanding the pattern can help you decide if it\'s fixable or foundational.',
    tryNextTemplate:
      'Try our Red Flag Scanner to examine whether the instability connects to deeper warning signs that need your attention.',
    safeSuggestion:
      'This pattern often requires external support to break. Consider talking to a therapist or counselor who can help you untangle what\'s love and what\'s chaos. You deserve consistency — even if it feels less exciting at first.',
  },
  {
    id: 'pacing-pressure-pattern',
    name: 'Pacing Pressure Pattern',
    description:
      'A dynamic where the relationship feels like it\'s on a timeline someone else set — milestones, labels, and commitments that don\'t align with your natural rhythm.',
    requiredSignals: {
      pressure_signal: 3,
      fast_intensity: 2,
    },
    optionalSignals: {
      boundary_friction: 2,
      trust_instability: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your answers suggest a pacing pressure pattern — it feels like the relationship is being rushed or pushed forward faster than feels natural for you. Whether it\'s pressure to label things, meet milestones, or move to the next stage, the pace seems to be set by someone else\'s clock, not your own comfort.',
    strengthsTemplate:
      'Your awareness that the pace doesn\'t feel right is a sign of healthy instincts. Trusting your own timing — even when someone else\'s enthusiasm feels overwhelming — takes real self-knowledge.',
    risksTemplate:
      'When you move faster than you\'re comfortable with, you can end up committed to something you don\'t fully understand yet. The pressure can also make it harder to see problems because you\'re too busy keeping up with the pace.',
    watchNextTemplate:
      'Watch how your partner responds when you ask to slow down — do they respect your pace and reassure you, or do they make you feel like you\'re holding things back?',
    tryNextTemplate:
      'Try our Attachment Style Lens to explore whether the pacing pressure connects to deeper attachment patterns — yours or theirs.',
    safeSuggestion:
      'A healthy relationship has room for your pace. Try saying: "I really like where this is going, and I want to make sure we\'re both comfortable with how fast we move." If that causes friction, the friction is worth paying attention to.',
  },

  // ── Part 2: Future Alignment Patterns ──────────────────────

  {
    id: 'strong-alignment',
    name: 'Strong Alignment',
    description:
      'A relationship foundation where core values, life goals, and emotional needs are well-aligned, creating a solid platform for long-term growth.',
    requiredSignals: {
      repair_potential_high: 3,
    },
    optionalSignals: {
      future_ambiguity: 0,
      clarity_low: 0,
    },
    riskLevel: 'low',
    weight: 3,
    summaryTemplate:
      'Your answers point to strong alignment — the things that matter most to you both seem to line up well. There\'s clarity about where things are headed, a shared sense of what you\'re building, and the kind of mutual respect that makes the big conversations feel doable rather than daunting.',
    strengthsTemplate:
      'Strong alignment isn\'t luck — it usually means at least one of you has been thoughtful about what matters and brave enough to communicate it. That\'s a relationship skill worth celebrating.',
    risksTemplate:
      'The risk with strong alignment is complacency — assuming that because you\'re aligned now, you always will be. People grow, priorities shift, and what was true six months ago may need a refresh.',
    watchNextTemplate:
      'Watch for whether you\'re still checking in with each other about the future — not just assuming alignment, but actively confirming it as you both evolve.',
    tryNextTemplate:
      'Try our Communication Pattern Check to make sure your good alignment is supported by equally strong communication habits.',
    safeSuggestion:
      'Schedule a "state of us" conversation every few months — not because something\'s wrong, but because good things stay good when you tend to them intentionally.',
  },
  {
    id: 'good-chemistry-some-friction',
    name: 'Good Chemistry, Some Friction',
    description:
      'A connection with genuine spark and real care, where most things align well but a few areas of friction keep things from feeling completely effortless.',
    requiredSignals: {
      repair_potential_high: 2,
      clarity_low: 2,
    },
    optionalSignals: {
      future_ambiguity: 2,
      consistency_low: 1,
    },
    riskLevel: 'low',
    weight: 5,
    summaryTemplate:
      'Your answers suggest good chemistry with some friction — there\'s real connection and genuine care here, but a few areas aren\'t fully aligned yet. That doesn\'t mean the connection is flawed; it means it\'s real. Every relationship has edges where two different people have to figure out how to fit together.',
    strengthsTemplate:
      'The presence of repair potential alongside some friction is actually a healthy sign — it means there\'s enough goodwill and mutual investment to work through differences, which is far more valuable than friction-free alignment that has no depth.',
    risksTemplate:
      'The risk is that the friction points get ignored because everything else feels so good — and unaddressed friction has a way of quietly growing until it becomes the thing that defines the relationship.',
    watchNextTemplate:
      'Watch whether you\'re actively addressing the friction areas or just hoping they\'ll resolve on their own. Small, specific conversations now can prevent big, vague resentments later.',
    tryNextTemplate:
      'Try our Compatibility Compass to get a detailed look at where you align perfectly and where the edges need some sanding.',
    safeSuggestion:
      'Pick one area of friction and have a gentle, curious conversation about it this week — not to "solve" it, but to understand each other\'s perspective better. "I\'ve been thinking about X and I\'d love to hear how you see it" is a great opener.',
  },
  {
    id: 'uneven-long-term-alignment',
    name: 'Uneven Long-Term Alignment',
    description:
      'A relationship where fundamental areas of life direction — career, family, lifestyle, values — don\'t fully match up, creating uncertainty about whether a shared future is realistic.',
    requiredSignals: {
      future_ambiguity: 3,
      clarity_low: 3,
    },
    optionalSignals: {
      consistency_low: 2,
      mixed_signals_high: 1,
    },
    riskLevel: 'moderate',
    weight: 6,
    summaryTemplate:
      'Your answers point to uneven long-term alignment — there are some areas where you see eye to eye, but others where the picture of the future doesn\'t quite match. It\'s not that the feelings aren\'t real; it\'s that the roadmap might not lead to the same destination for both of you.',
    strengthsTemplate:
      'The fact that you\'re thinking about long-term alignment shows maturity and self-awareness — many people avoid these questions entirely because the answers might be uncomfortable.',
    risksTemplate:
      'Without alignment on the big things, even the strongest feelings can lead to painful crossroads — moments where one of you has to choose between the relationship and a life goal that matters deeply.',
    watchNextTemplate:
      'Watch whether the misaligned areas are dealbreakers or just differences that can coexist. Some things — like where to live or whether to have kids — require real agreement, while others — like hobbies or social styles — just require mutual respect.',
    tryNextTemplate:
      'Try our Future Alignment Checker for a structured look at where your futures align and where they diverge.',
    safeSuggestion:
      'Have one honest conversation this week about a future topic you\'ve been avoiding. You don\'t need to resolve it — you just need to know where the other person stands. "I want us to be honest about X because I care about where this is going" is a loving way in.',
  },
  {
    id: 'high-attraction-low-structural-fit',
    name: 'High Attraction, Low Structural Fit',
    description:
      'A connection with powerful chemistry and deep emotional pull, but where the practical realities of building a life together — timing, location, priorities — create significant challenges.',
    requiredSignals: {
      future_ambiguity: 4,
      consistency_low: 3,
    },
    optionalSignals: {
      clarity_low: 2,
      follow_through_low: 2,
    },
    riskLevel: 'elevated',
    weight: 7,
    summaryTemplate:
      'Your answers suggest high attraction with low structural fit — the chemistry and emotional connection feel significant, but the logistics of actually building a life together are creating real uncertainty. It\'s like having the right feeling with the wrong timing, or the right person in a chapter that doesn\'t quite fit.',
    strengthsTemplate:
      'The attraction you\'re feeling is real, and real chemistry isn\'t something to dismiss lightly. It means something — even if the structural challenges make you wonder whether that\'s enough.',
    risksTemplate:
      'Chemistry can create a kind of selective blindness where you minimize practical concerns because the feelings are so strong. Over time, the structural misalignment can create resentment and exhaustion that even great chemistry can\'t overcome.',
    watchNextTemplate:
      'Watch whether either of you is making real, concrete changes to address the structural gaps — or whether you\'re both just hoping the feelings will be strong enough to carry you through.',
    tryNextTemplate:
      'Try our Compatibility Compass to map out exactly where the structural fit breaks down and whether those gaps are bridgeable.',
    safeSuggestion:
      'Make a list of the top three structural challenges in this connection, and ask yourself honestly: if these never changed, could I be happy long-term? If the answer is no, the feelings alone won\'t be enough — and that\'s okay to acknowledge.',
  },
  {
    id: 'future-mismatch',
    name: 'Future Mismatch',
    description:
      'A fundamental misalignment in life direction, core values, or relationship goals that creates a growing divide between two people who may still care deeply about each other.',
    requiredSignals: {
      future_ambiguity: 5,
      clarity_low: 4,
    },
    optionalSignals: {
      trust_instability: 2,
      consistency_low: 2,
    },
    riskLevel: 'high',
    weight: 9,
    summaryTemplate:
      'Your answers indicate a significant future mismatch — the direction you want your life to go, and the direction this relationship is going, may not be compatible. This is one of the hardest dynamics to face because the disconnect isn\'t about how much you care — it\'s about where you\'re both headed.',
    strengthsTemplate:
      'Seeing a future mismatch clearly takes courage, especially when there are still real feelings involved. Many people spend years avoiding this exact realization because it means facing a difficult decision.',
    risksTemplate:
      'Future mismatches tend to get more painful the longer they\'re ignored, not less. The window where you can pivot without deep regret is real, and it closes slowly — not with a slam, but with the quiet weight of time and investment.',
    watchNextTemplate:
      'Watch whether you\'re slowly reshaping your own life goals to fit the relationship, or whether your partner is doing the same for you. Neither is sustainable without resentment.',
    tryNextTemplate:
      'Try our Future Alignment Checker for a thorough breakdown of where your futures align and where they diverge — so you can decide what\'s negotiable and what isn\'t.',
    safeSuggestion:
      'This is a decision that deserves space and reflection. Consider talking to someone you trust — a close friend, a therapist, or even journaling about what you truly want your life to look like in five years. You deserve a future that feels like yours.',
  },
];

export function getPatternRule(id: string): PatternRule | undefined {
  return patternRules.find((p) => p.id === id);
}

export default patternRules;
