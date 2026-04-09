import type { ToolConfig } from "@/types";

/**
 * Master registry for all LoveCheck tools.
 *
 * Each tool has a full configuration including a question tree.
 * Only the flagship tool (relationship-risk-radar) currently has
 * an active question tree; the others use an empty placeholder
 * until they're built out.
 */

export const toolRegistry: ToolConfig[] = [
  // ════════════════════════════════════════════════════════════════
  // 1. Relationship Risk Radar  (FLAGSHIP — active)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "relationship-risk-radar",
    name: "Relationship Risk Radar",
    tagline: "See your relationship patterns clearly — without judgment.",
    description:
      "Answer a few honest questions about how you feel in your connection, and the Risk Radar maps out the patterns at play, highlights strengths, and suggests where to focus your attention next. Think of it as a gentle mirror, not a verdict.",
    mode: "check",
    version: "1.0.0",
    icon: "Radar",
    color: "rose",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Self-Reflection",
    featured: true,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "rr-routing",
        kind: "routing",
        type: "single-choice",
        text: "What best describes where you are right now?",
        subtitle: "There's no wrong answer — just pick what feels closest.",
        options: [
          {
            id: "rr-r-new",
            label: "Something new or early-stage",
            description:
              "We've been talking or seeing each other but it's still fresh.",
            signals: { clarity_low: 1, future_ambiguity: 2, mixed_signals_high: 1 },
            weight: 1,
            branchRef: "early",
          },
          {
            id: "rr-r-established",
            label: "An established relationship",
            description:
              "We've been together for a while and know each other well.",
            signals: { consistency_low: 1, repair_potential_high: 1 },
            weight: 1,
            branchRef: "established",
          },
          {
            id: "rr-r-unsure",
            label: "Honestly, I'm not sure what this is",
            description:
              "It's complicated — we might be more than friends but I can't tell.",
            signals: {
              clarity_low: 2,
              mixed_signals_high: 2,
              future_ambiguity: 1,
            },
            weight: 1,
            branchRef: "unsure",
          },
          {
            id: "rr-r-healing",
            label: "Reflecting on something that's ended",
            description:
              "I'm looking back to understand what happened.",
            signals: {
              consistency_low: 2,
              trust_instability: 1,
              clarity_low: 1,
            },
            weight: 1,
            branchRef: "reflection",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Early Stage ──────────────────────────────────
        early: [
          {
            id: "rr-e1",
            kind: "branch",
            type: "single-choice",
            text: "How consistent is their communication?",
            subtitle:
              "Think about the overall pattern, not just the best or worst days.",
            branchId: "early",
            sortOrder: 1,
            options: [
              {
                id: "rr-e1-very",
                label: "Very consistent — they reach out regularly",
                signals: { consistency_low: 0, effort_imbalance: -1 },
                weight: 0.5,
              },
              {
                id: "rr-e1-mostly",
                label: "Mostly consistent, with occasional gaps",
                signals: { consistency_low: 1, mixed_signals_high: 1 },
                weight: 1,
              },
              {
                id: "rr-e1-unpredictable",
                label: "Unpredictable — some days very engaged, others quiet",
                signals: { consistency_low: 2, mixed_signals_high: 2 },
                weight: 1.5,
              },
              {
                id: "rr-e1-volatile",
                label: "All over the place — I never know what to expect",
                signals: { consistency_low: 3, mixed_signals_high: 3 },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-e2",
            kind: "branch",
            type: "single-choice",
            text: "How does this person respond when you express a need or feeling?",
            branchId: "early",
            sortOrder: 2,
            options: [
              {
                id: "rr-e2-listens",
                label: "They listen and respond with care",
                signals: { repair_potential_high: 2, emotional_availability_low: -1 },
                weight: 1,
              },
              {
                id: "rr-e2-sometimes",
                label: "Sometimes — depends on their mood",
                signals: { emotional_availability_low: 1, consistency_low: 1 },
                weight: 1.2,
              },
              {
                id: "rr-e2-dismisses",
                label: "They tend to brush it off or change the subject",
                signals: { emotional_availability_low: 2, boundary_friction: 1 },
                weight: 1.5,
              },
              {
                id: "rr-e2-defensive",
                label: "They get defensive or make it about themselves",
                signals: {
                  emotional_availability_low: 2,
                  repair_potential_high: -1,
                  boundary_friction: 2,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-e3",
            kind: "branch",
            type: "scale",
            text: "How clearly have they communicated what they want with you?",
            subtitle: "1 = very unclear, 5 = completely clear",
            branchId: "early",
            sortOrder: 3,
            min: 1,
            max: 5,
            step: 1,
            minLabel: "Very unclear",
            maxLabel: "Completely clear",
            options: [], // scale uses value
          },
        ],

        // ── Branch: Established ──────────────────────────────────
        established: [
          {
            id: "rr-es1",
            kind: "branch",
            type: "single-choice",
            text: "When disagreements happen, what usually follows?",
            branchId: "established",
            sortOrder: 1,
            options: [
              {
                id: "rr-es1-repair",
                label: "We talk it through and reconnect",
                signals: { repair_potential_high: 3, trust_instability: -1 },
                weight: 1,
              },
              {
                id: "rr-es1-cool",
                label: "One of us cools off, then we move on",
                signals: { repair_potential_high: 1, emotional_availability_low: 1 },
                weight: 1,
              },
              {
                id: "rr-es1-same",
                label: "We kind of make up, but the same issue keeps coming back",
                signals: { consistency_low: 2, repair_potential_high: 1, follow_through_low: 1 },
                weight: 1.5,
              },
              {
                id: "rr-es1-avoid",
                label: "We avoid it or sweep it under the rug",
                signals: {
                  consistency_low: 2,
                  repair_potential_high: -1,
                  trust_instability: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-es2",
            kind: "branch",
            type: "single-choice",
            text: "Do you feel like effort is balanced between you?",
            branchId: "established",
            sortOrder: 2,
            options: [
              {
                id: "rr-es2-yes",
                label: "Yes, it feels pretty even",
                signals: { effort_imbalance: 0 },
                weight: 0.5,
              },
              {
                id: "rr-es2-mostly",
                label: "Mostly, though it ebbs and flows",
                signals: { effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "rr-es2-iamore",
                label: "I think I give more than I get",
                signals: { effort_imbalance: 2, follow_through_low: 1 },
                weight: 1.5,
              },
              {
                id: "rr-es2-carrying",
                label: "I feel like I'm carrying most of the weight",
                signals: { effort_imbalance: 3, follow_through_low: 2, consistency_low: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-es3",
            kind: "branch",
            type: "single-choice",
            text: "How secure do you feel about the future of this relationship?",
            branchId: "established",
            sortOrder: 3,
            options: [
              {
                id: "rr-es3-very",
                label: "Very secure — I can see a clear path forward",
                signals: {
                  trust_instability: -1,
                  future_ambiguity: -1,
                  repair_potential_high: 2,
                },
                weight: 1,
              },
              {
                id: "rr-es3-hopeful",
                label: "Hopeful, though there are some uncertainties",
                signals: { future_ambiguity: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "rr-es3-uncertain",
                label: "Uncertain — I'm not sure where this is heading",
                signals: { future_ambiguity: 2, clarity_low: 2 },
                weight: 1.5,
              },
              {
                id: "rr-es3-anxious",
                label: "Anxious — I worry a lot about whether we'll make it",
                signals: {
                  future_ambiguity: 3,
                  trust_instability: 2,
                  clarity_low: 2,
                },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Unsure ───────────────────────────────────────
        unsure: [
          {
            id: "rr-u1",
            kind: "branch",
            type: "single-choice",
            text: "Do they ever make plans with you, or is it always last-minute?",
            branchId: "unsure",
            sortOrder: 1,
            options: [
              {
                id: "rr-u1-plans",
                label: "They plan ahead and follow through",
                signals: { follow_through_low: -1, consistency_low: -1, effort_imbalance: -1 },
                weight: 1,
              },
              {
                id: "rr-u1-sometimes",
                label: "Sometimes — it's a mix",
                signals: { follow_through_low: 1, consistency_low: 1 },
                weight: 1,
              },
              {
                id: "rr-u1-rarely",
                label: "Rarely — everything feels spontaneous or on their terms",
                signals: { follow_through_low: 2, effort_imbalance: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "rr-u1-never",
                label: "Never — I'm always the one initiating",
                signals: { follow_through_low: 3, effort_imbalance: 3 },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-u2",
            kind: "branch",
            type: "single-choice",
            text: "How does it feel when you're apart for a while?",
            branchId: "unsure",
            sortOrder: 2,
            options: [
              {
                id: "rr-u2-fine",
                label: "Fine — I feel secure even when we're not in contact",
                signals: { trust_instability: -1, consistency_low: -1 },
                weight: 0.5,
              },
              {
                id: "rr-u2-slight",
                label: "A little uncertain, but I manage",
                signals: { trust_instability: 1, mixed_signals_high: 1 },
                weight: 1,
              },
              {
                id: "rr-u2-anxious",
                label: "Anxious — I find myself checking for signs they still care",
                signals: { trust_instability: 2, mixed_signals_high: 2, clarity_low: 1 },
                weight: 1.5,
              },
              {
                id: "rr-u2-ruminating",
                label: "I spend a lot of energy overthinking and re-reading messages",
                signals: {
                  trust_instability: 3,
                  mixed_signals_high: 3,
                  consistency_low: 2,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-u3",
            kind: "branch",
            type: "single-choice",
            text: "Have they introduced you to the important people in their life?",
            branchId: "unsure",
            sortOrder: 3,
            options: [
              {
                id: "rr-u3-yes",
                label: "Yes — friends, family, or both",
                signals: { clarity_low: -1, future_ambiguity: -1, trust_instability: -1 },
                weight: 1,
              },
              {
                id: "rr-u3-some",
                label: "Some — I've met a few people",
                signals: { clarity_low: 1 },
                weight: 1,
              },
              {
                id: "rr-u3-not-yet",
                label: "Not yet, but they've mentioned it",
                signals: { clarity_low: 2, future_ambiguity: 1 },
                weight: 1,
              },
              {
                id: "rr-u3-no",
                label: "No — I'm not really part of that side of their life",
                signals: { clarity_low: 3, future_ambiguity: 2, mixed_signals_high: 1 },
                weight: 1.5,
              },
            ],
          },
        ],

        // ── Branch: Reflection (post-relationship) ───────────────
        reflection: [
          {
            id: "rr-rf1",
            kind: "branch",
            type: "single-choice",
            text: "Looking back, what would you say was the biggest source of tension?",
            branchId: "reflection",
            sortOrder: 1,
            options: [
              {
                id: "rr-rf1-trust",
                label: "Trust — I never fully felt like I could rely on them",
                signals: { trust_instability: 3, consistency_low: 2, follow_through_low: 2 },
                weight: 2,
              },
              {
                id: "rr-rf1-effort",
                label: "Effort — I felt like I was doing most of the work",
                signals: { effort_imbalance: 3, follow_through_low: 2 },
                weight: 2,
              },
              {
                id: "rr-rf1-space",
                label: "Space — we struggled with closeness vs. independence",
                signals: { boundary_friction: 3, mixed_signals_high: 1 },
                weight: 2,
              },
              {
                id: "rr-rf1-clarity",
                label: "Clarity — I never really knew where we stood",
                signals: { clarity_low: 3, future_ambiguity: 3, mixed_signals_high: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "rr-rf2",
            kind: "branch",
            type: "single-choice",
            text: "At your best moments, did you feel emotionally safe?",
            branchId: "reflection",
            sortOrder: 2,
            options: [
              {
                id: "rr-rf2-mostly",
                label: "Mostly — there were real good parts too",
                signals: { repair_potential_high: 2, trust_instability: -1 },
                weight: 1,
              },
              {
                id: "rr-rf2-sometimes",
                label: "Sometimes — but the bad moments overshadowed them",
                signals: { repair_potential_high: 1, trust_instability: 1 },
                weight: 1,
              },
              {
                id: "rr-rf2-rarely",
                label: "Rarely — I was always on edge",
                signals: {
                  trust_instability: 2,
                  emotional_availability_low: 2,
                  boundary_friction: 1,
                },
                weight: 1.5,
              },
              {
                id: "rr-rf2-never",
                label: "Not really — looking back, I don't think I was",
                signals: {
                  trust_instability: 3,
                  emotional_availability_low: 3,
                  boundary_friction: 2,
                },
                weight: 2,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "rr-uni1",
          kind: "universal",
          type: "single-choice",
          text: "Do you feel like you can be your full, authentic self around this person?",
          sortOrder: 10,
          options: [
            {
              id: "rr-uni1-yes",
              label: "Yes — I feel accepted for who I am",
              signals: { emotional_availability_low: -1, trust_instability: -1 },
              weight: 1,
            },
            {
              id: "rr-uni1-mostly",
              label: "Mostly — I hold back on a few things",
              signals: { boundary_friction: 1, clarity_low: 1 },
              weight: 1,
            },
            {
              id: "rr-uni1-sometimes",
              label: "Sometimes — I filter myself a lot around them",
              signals: { boundary_friction: 2, emotional_availability_low: 1 },
              weight: 1.5,
            },
            {
              id: "rr-uni1-rarely",
              label: "Rarely — I feel like I have to perform or hide parts of myself",
              signals: {
                boundary_friction: 3,
                emotional_availability_low: 2,
                trust_instability: 1,
              },
              weight: 2,
            },
          ],
        },
        {
          id: "rr-uni2",
          kind: "universal",
          type: "scale",
          text: "On a scale of 1–5, how much does this connection add to your overall happiness?",
          subtitle: "1 = it drains me, 5 = it genuinely enriches my life",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Drains me",
          maxLabel: "Enriches my life",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "rr-final",
        kind: "final",
        type: "open-ended",
        text: "Is there anything else you'd like to share about this connection?",
        subtitle:
          "This is optional — but sometimes the details that matter most don't fit into multiple choice.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 2. Attachment Style Lens  (active)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "attachment-style-lens",
    name: "Attachment Style Lens",
    tagline: "Understand your emotional patterns — and how they shape love.",
    description:
      "We all have an attachment style that influences how we connect, communicate, and respond to closeness. This tool helps you identify yours with care, so you can build relationships that feel secure and fulfilling instead of confusing or exhausting.",
    mode: "insight",
    version: "1.0.0",
    icon: "Heart",
    color: "violet",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Self-Discovery",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "asl-routing",
        kind: "routing",
        type: "single-choice",
        text: "In your closest relationships, which of these feels most familiar to you?",
        subtitle:
          "There's no right or wrong answer — go with what resonates, even if it's uncomfortable.",
        options: [
          {
            id: "asl-r-anxious",
            label: "I often worry about whether they really care about me",
            description:
              "I can feel secure one moment and then something small sends me spiraling into doubt.",
            signals: {
              trust_instability: 2,
              mixed_signals_high: 1,
              effort_imbalance: 1,
            },
            weight: 1,
            branchRef: "anxious-preoccupied",
          },
          {
            id: "asl-r-avoidant",
            label: "I value my independence and sometimes feel crowded",
            description:
              "I need a lot of space, and when people get too close I can feel suffocated or restless.",
            signals: {
              emotional_availability_low: 2,
              boundary_friction: 1,
              consistency_low: 1,
            },
            weight: 1,
            branchRef: "dismissive-avoidant",
          },
          {
            id: "asl-r-fearful",
            label: "I want closeness but it also scares me",
            description:
              "I crave deep connection, but the closer someone gets the more I feel the urge to pull away — or push them away first.",
            signals: {
              trust_instability: 2,
              boundary_friction: 2,
              mixed_signals_high: 1,
            },
            weight: 1,
            branchRef: "fearful-avoidant",
          },
          {
            id: "asl-r-secure",
            label: "I generally feel comfortable with intimacy and trust",
            description:
              "I can express my needs, handle disagreements, and don't typically obsess over whether someone's going to leave.",
            signals: {
              repair_potential_high: 2,
              trust_instability: -1,
              clarity_low: -1,
            },
            weight: 1,
            branchRef: "secure-base",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Anxious-Preoccupied ────────────────────────
        // Based on Levine/Heller — hyperactivation of attachment system,
        // hypervigilance to signs of rejection, excessive reassurance-seeking
        "anxious-preoccupied": [
          {
            id: "asl-ap1",
            kind: "branch",
            type: "single-choice",
            text: "When someone you care about takes a long time to reply, what usually happens inside you?",
            subtitle:
              "Think about your immediate emotional reaction — not what you'd tell a friend.",
            branchId: "anxious-preoccupied",
            sortOrder: 1,
            options: [
              {
                id: "asl-ap1-calm",
                label: "I barely notice — I figure they're busy",
                signals: { trust_instability: -1, mixed_signals_high: -1 },
                weight: 0.5,
              },
              {
                id: "asl-ap1-slight",
                label: "A small flicker of worry, but I let it go",
                signals: { trust_instability: 1 },
                weight: 1,
              },
              {
                id: "asl-ap1-spiral",
                label: "I start overthinking — checking last messages, re-reading tone",
                signals: { trust_instability: 2, mixed_signals_high: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "asl-ap1-overwhelm",
                label: "I feel anxious and sometimes reach out again to make sure everything's okay",
                signals: {
                  trust_instability: 3,
                  mixed_signals_high: 2,
                  effort_imbalance: 1,
                  clarity_low: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-ap2",
            kind: "branch",
            type: "single-choice",
            text: "How do you usually let someone know you need more from the relationship?",
            branchId: "anxious-preoccupied",
            sortOrder: 2,
            options: [
              {
                id: "asl-ap2-direct",
                label: "I say it clearly — 'I need more of this'",
                signals: { clarity_low: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "asl-ap2-hint",
                label: "I drop hints and hope they pick up on it",
                signals: { clarity_low: 1, effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "asl-ap2-withdraw",
                label: "I pull back a little and hope they notice and come closer",
                signals: {
                  clarity_low: 2,
                  mixed_signals_high: 2,
                  effort_imbalance: 1,
                  boundary_friction: 1,
                },
                weight: 1.5,
              },
              {
                id: "asl-ap2-burst",
                label: "I hold it in until it comes out all at once — usually at the worst moment",
                signals: {
                  clarity_low: 2,
                  boundary_friction: 2,
                  consistency_low: 1,
                  effort_imbalance: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-ap3",
            kind: "branch",
            type: "single-choice",
            text: "When you feel disconnected from someone you love, what's your first instinct?",
            branchId: "anxious-preoccupied",
            sortOrder: 3,
            options: [
              {
                id: "asl-ap3-reach",
                label: "I reach out and try to reconnect",
                signals: { repair_potential_high: 1, effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "asl-ap3-analyze",
                label: "I try to figure out what I did wrong",
                signals: {
                  trust_instability: 2,
                  effort_imbalance: 2,
                  clarity_low: 1,
                },
                weight: 1.5,
              },
              {
                id: "asl-ap3-cling",
                label: "I try to get closer — sometimes more than they seem to want",
                signals: {
                  boundary_friction: 2,
                  effort_imbalance: 2,
                  mixed_signals_high: 1,
                  consistency_low: 1,
                },
                weight: 2,
              },
              {
                id: "asl-ap3-shutdown",
                label: "I feel so hurt I shut down and wait for them to come to me",
                signals: {
                  trust_instability: 2,
                  emotional_availability_low: 1,
                  consistency_low: 1,
                },
                weight: 1.5,
              },
            ],
          },
        ],

        // ── Branch: Dismissive-Avoidant ─────────────────────────
        // Based on Levine/Heller — deactivation of attachment system,
        // self-reliance as defense, discomfort with vulnerability and need
        "dismissive-avoidant": [
          {
            id: "asl-da1",
            kind: "branch",
            type: "single-choice",
            text: "When someone starts getting emotionally close to you, what do you tend to feel?",
            subtitle: "Be honest — the first unfiltered reaction, not what sounds best.",
            branchId: "dismissive-avoidant",
            sortOrder: 1,
            options: [
              {
                id: "asl-da1-welcome",
                label: "Warm and open — I welcome it",
                signals: { emotional_availability_low: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "asl-da1-cautious",
                label: "Cautious but curious — I let it develop slowly",
                signals: { emotional_availability_low: 1 },
                weight: 1,
              },
              {
                id: "asl-da1-uneasy",
                label: "A bit uneasy — like they're getting too close too fast",
                signals: {
                  emotional_availability_low: 2,
                  boundary_friction: 2,
                  clarity_low: 1,
                },
                weight: 1.5,
              },
              {
                id: "asl-da1-suffocated",
                label: "Suffocated or trapped — I start looking for an exit",
                signals: {
                  emotional_availability_low: 3,
                  boundary_friction: 3,
                  consistency_low: 1,
                  follow_through_low: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-da2",
            kind: "branch",
            type: "single-choice",
            text: "How do you usually handle it when someone expresses a strong emotional need to you?",
            branchId: "dismissive-avoidant",
            sortOrder: 2,
            options: [
              {
                id: "asl-da2-showup",
                label: "I show up for them — I want to be there",
                signals: { emotional_availability_low: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "asl-da2-practical",
                label: "I try to fix it with practical solutions",
                signals: { emotional_availability_low: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "asl-da2-uncomfortable",
                label: "I feel uncomfortable and try to lighten the mood or change the subject",
                signals: { emotional_availability_low: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "asl-da2-withdraw",
                label: "I feel overwhelmed and create some distance",
                signals: {
                  emotional_availability_low: 3,
                  boundary_friction: 2,
                  follow_through_low: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-da3",
            kind: "branch",
            type: "single-choice",
            text: "What does the idea of really relying on someone feel like to you?",
            branchId: "dismissive-avoidant",
            sortOrder: 3,
            options: [
              {
                id: "asl-da3-natural",
                label: "Natural — I like having someone I can lean on",
                signals: { trust_instability: -1, emotional_availability_low: -1 },
                weight: 0.5,
              },
              {
                id: "asl-da3-sometimes",
                label: "Good in theory, but I don't do it often in practice",
                signals: { emotional_availability_low: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "asl-da3-weak",
                label: "It makes me feel weak or like I'm losing my edge",
                signals: { emotional_availability_low: 2, boundary_friction: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "asl-da3-risky",
                label: "Dangerous — people always let you down when you need them most",
                signals: {
                  trust_instability: 3,
                  emotional_availability_low: 2,
                  boundary_friction: 2,
                  consistency_low: 1,
                },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Fearful-Avoidant (Disorganized) ─────────────
        // Based on Main & Solomon — simultaneous activation and
        // deactivation, oscillating between approach and avoidance
        "fearful-avoidant": [
          {
            id: "asl-fa1",
            kind: "branch",
            type: "single-choice",
            text: "What happens inside you when someone starts to really understand you?",
            subtitle:
              "Not just small talk — when they see the parts you usually keep hidden.",
            branchId: "fearful-avoidant",
            sortOrder: 1,
            options: [
              {
                id: "asl-fa1-accepted",
                label: "I feel seen and grateful — it's relieving",
                signals: { trust_instability: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "asl-fa1-nervous",
                label: "A mix of relief and nervousness — I'm glad but also exposed",
                signals: { trust_instability: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "asl-fa1-conflicted",
                label: "Part of me wants more of this, another part wants to pull back",
                signals: {
                  trust_instability: 2,
                  boundary_friction: 2,
                  mixed_signals_high: 2,
                },
                weight: 1.5,
              },
              {
                id: "asl-fa1-selfsabotage",
                label: "I often do something to push them away right after that moment",
                signals: {
                  trust_instability: 3,
                  boundary_friction: 3,
                  consistency_low: 2,
                  mixed_signals_high: 2,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-fa2",
            kind: "branch",
            type: "single-choice",
            text: "How do you usually handle the time after a disagreement with someone close?",
            branchId: "fearful-avoidant",
            sortOrder: 2,
            options: [
              {
                id: "asl-fa2-repair",
                label: "We talk it through and I feel closer afterward",
                signals: { repair_potential_high: 2, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "asl-fa2-process",
                label: "I need time alone to process, then I come back",
                signals: { repair_potential_high: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "asl-fa2-oscillate",
                label: "I go back and forth — I want to fix it but then get angry and withdraw",
                signals: {
                  consistency_low: 2,
                  mixed_signals_high: 2,
                  trust_instability: 1,
                  boundary_friction: 1,
                },
                weight: 1.5,
              },
              {
                id: "asl-fa2-shutdown",
                label: "I shut down completely and sometimes consider ending the relationship",
                signals: {
                  trust_instability: 3,
                  consistency_low: 2,
                  emotional_availability_low: 2,
                  follow_through_low: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-fa3",
            kind: "branch",
            type: "single-choice",
            text: "What's your relationship with trust been like — the kind where you can fully let your guard down?",
            branchId: "fearful-avoidant",
            sortOrder: 3,
            options: [
              {
                id: "asl-fa3-possible",
                label: "I trust the right people and know I can open up",
                signals: { trust_instability: -1, emotional_availability_low: -1 },
                weight: 0.5,
              },
              {
                id: "asl-fa3-selective",
                label: "I trust selectively — a very small number of people",
                signals: { trust_instability: 1 },
                weight: 1,
              },
              {
                id: "asl-fa3-hard",
                label: "I want to trust but something always stops me at the last moment",
                signals: { trust_instability: 2, emotional_availability_low: 1, clarity_low: 1 },
                weight: 1.5,
              },
              {
                id: "asl-fa3-impossible",
                label: "Honest truth? It feels impossible — I've been burned too many times",
                signals: {
                  trust_instability: 3,
                  emotional_availability_low: 2,
                  consistency_low: 1,
                  follow_through_low: 1,
                },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Secure Base ────────────────────────────────
        // Based on Bowlby/Ainsworth — earned or natural security,
        // comfortable with both closeness and autonomy
        "secure-base": [
          {
            id: "asl-sb1",
            kind: "branch",
            type: "single-choice",
            text: "When something goes wrong in a close relationship, what's your instinct?",
            branchId: "secure-base",
            sortOrder: 1,
            options: [
              {
                id: "asl-sb1-talk",
                label: "I bring it up calmly and try to work through it together",
                signals: {
                  repair_potential_high: 2,
                  trust_instability: -1,
                  clarity_low: -1,
                },
                weight: 0.5,
              },
              {
                id: "asl-sb1-brief",
                label: "I might get upset briefly, but I recover and re-engage",
                signals: { repair_potential_high: 1 },
                weight: 1,
              },
              {
                id: "asl-sb1-internalize",
                label: "I tend to process it internally first before saying anything",
                signals: {
                  clarity_low: 1,
                  emotional_availability_low: 1,
                  repair_potential_high: 1,
                },
                weight: 1,
              },
              {
                id: "asl-sb1-avoid",
                label: "I avoid conflict and hope it resolves on its own",
                signals: {
                  consistency_low: 1,
                  clarity_low: 2,
                  repair_potential_high: -1,
                },
                weight: 1.5,
              },
            ],
          },
          {
            id: "asl-sb2",
            kind: "branch",
            type: "single-choice",
            text: "How do you feel about depending on someone emotionally?",
            branchId: "secure-base",
            sortOrder: 2,
            options: [
              {
                id: "asl-sb2-comfortable",
                label: "Comfortable — interdependence feels natural and healthy",
                signals: {
                  repair_potential_high: 1,
                  trust_instability: -1,
                  emotional_availability_low: -1,
                },
                weight: 0.5,
              },
              {
                id: "asl-sb2-mostly",
                label: "Mostly okay, though I keep a small part of myself guarded",
                signals: { boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "asl-sb2-prefer",
                label: "I prefer to be the strong one — I don't love admitting I need help",
                signals: {
                  emotional_availability_low: 1,
                  boundary_friction: 1,
                  effort_imbalance: 1,
                },
                weight: 1.5,
              },
              {
                id: "asl-sb2-struggle",
                label: "I struggle with it — I'd rather handle everything on my own",
                signals: {
                  emotional_availability_low: 2,
                  boundary_friction: 2,
                  effort_imbalance: 1,
                },
                weight: 2,
              },
            ],
          },
          {
            id: "asl-sb3",
            kind: "branch",
            type: "single-choice",
            text: "When someone you care about needs space, how does that usually land with you?",
            branchId: "secure-base",
            sortOrder: 3,
            options: [
              {
                id: "asl-sb3-respect",
                label: "I respect it and use the time for myself too",
                signals: {
                  trust_instability: -1,
                  boundary_friction: -1,
                  repair_potential_high: 1,
                },
                weight: 0.5,
              },
              {
                id: "asl-sb3-fine",
                label: "Mostly fine — occasionally I wonder if they're pulling away, but I don't spiral",
                signals: { trust_instability: 1 },
                weight: 1,
              },
              {
                id: "asl-sb3-worry",
                label: "I try to be okay with it but I worry it means something more",
                signals: { trust_instability: 2, mixed_signals_high: 1, clarity_low: 1 },
                weight: 1.5,
              },
              {
                id: "asl-sb3-personal",
                label: "I take it personally and start wondering if I did something wrong",
                signals: {
                  trust_instability: 2,
                  effort_imbalance: 1,
                  clarity_low: 2,
                  consistency_low: 1,
                },
                weight: 2,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "asl-uni1",
          kind: "universal",
          type: "single-choice",
          text: "Can you remember a time when you felt truly safe with someone? What was that like for you?",
          subtitle:
            "If no moment comes to mind, that's okay — that's also meaningful information.",
          sortOrder: 10,
          options: [
            {
              id: "asl-uni1-yes",
              label: "Yes — I can think of a clear time or relationship",
              signals: { trust_instability: -1, repair_potential_high: 1 },
              weight: 1,
            },
            {
              id: "asl-uni1-fleeting",
              label: "Fleeting moments, but nothing that lasted long",
              signals: { trust_instability: 1, consistency_low: 1 },
              weight: 1,
            },
            {
              id: "asl-uni1-rarely",
              label: "Rarely — I'm not sure I've ever fully felt that",
              signals: {
                trust_instability: 2,
                emotional_availability_low: 1,
                consistency_low: 1,
              },
              weight: 1.5,
            },
            {
              id: "asl-uni1-never",
              label: "Never — safety in a relationship feels unfamiliar to me",
              signals: {
                trust_instability: 3,
                emotional_availability_low: 2,
                boundary_friction: 1,
                consistency_low: 1,
              },
              weight: 2,
            },
          ],
        },
        {
          id: "asl-uni2",
          kind: "universal",
          type: "scale",
          text: "On a scale of 1–5, how well do you understand your own emotional patterns in relationships?",
          subtitle: "1 = I'm just starting to notice, 5 = I have deep self-awareness",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Just starting to notice",
          maxLabel: "Deep self-awareness",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "asl-final",
        kind: "final",
        type: "open-ended",
        text: "Is there a specific relationship moment that keeps coming to mind while answering these questions?",
        subtitle:
          "Sharing it is entirely optional — but sometimes the moment that surfaces on its own is the one that matters most.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 3. Communication Pattern Check  (ACTIVE)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "communication-pattern-check",
    name: "Communication Pattern Check",
    tagline: "Decode the way you and your partner actually talk.",
    description:
      "Communication is where most relationship challenges either get resolved or get worse. This tool maps your communication habits — how you express needs, handle disagreements, and listen (or don't) — so you can spot patterns that help or hurt your connection.",
    mode: "check",
    version: "1.0.0",
    icon: "MessagesSquare",
    color: "amber",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Communication",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "cpc-routing",
        kind: "routing",
        type: "single-choice",
        text: "How would you describe the way you and your partner communicate?",
        subtitle:
          "Think about the overall dynamic — not just one conversation, but the pattern over time.",
        options: [
          {
            id: "cpc-r-direct",
            label: "Pretty direct and open",
            description:
              "We generally say what we mean, even when it's uncomfortable.",
            signals: { clarity_low: -1, consistency_low: -1, repair_potential_high: 1 },
            weight: 1,
            branchRef: "direct",
          },
          {
            id: "cpc-r-avoidant",
            label: "We tend to avoid the hard stuff",
            description:
              "Things are fine on the surface, but we steer clear of deeper or uncomfortable topics.",
            signals: { clarity_low: 2, emotional_availability_low: 1, consistency_low: 1 },
            weight: 1,
            branchRef: "avoidant",
          },
          {
            id: "cpc-r-passive-aggressive",
            label: "There's a lot of indirect communication",
            description:
              "Things get said sideways — sarcasm, hints, silent treatment, or small jabs.",
            signals: { mixed_signals_high: 2, boundary_friction: 1, clarity_low: 1 },
            weight: 1,
            branchRef: "passive-aggressive",
          },
          {
            id: "cpc-r-improving",
            label: "We're actively working on it",
            description:
              "It hasn't always been great, but we're trying to communicate better.",
            signals: { repair_potential_high: 2, effort_imbalance: 1 },
            weight: 1,
            branchRef: "improving",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Direct Communicators ────────────────────────
        direct: [
          {
            id: "cpc-d1",
            kind: "branch",
            type: "single-choice",
            text: "When you bring up something that's bothering you, how does your partner usually respond?",
            subtitle:
              "Think about their first reaction, not how things end up.",
            branchId: "direct",
            sortOrder: 1,
            options: [
              {
                id: "cpc-d1-listens",
                label: "They listen and take it seriously",
                signals: { emotional_availability_low: -1, repair_potential_high: 2 },
                weight: 1,
              },
              {
                id: "cpc-d1-consider",
                label: "They consider it, though sometimes get defensive first",
                signals: { repair_potential_high: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "cpc-d1-dismiss",
                label: "They tend to dismiss it or minimize how I feel",
                signals: { emotional_availability_low: 2, boundary_friction: 1, clarity_low: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-d1-counter",
                label: "They usually counter with their own complaint",
                signals: { emotional_availability_low: 2, boundary_friction: 2, effort_imbalance: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "cpc-d2",
            kind: "branch",
            type: "single-choice",
            text: "How comfortable do you feel bringing up sensitive topics?",
            subtitle:
              "Even direct communicators can feel a cost to being honest.",
            branchId: "direct",
            sortOrder: 2,
            options: [
              {
                id: "cpc-d2-very",
                label: "Very comfortable — it feels safe to be honest",
                signals: { trust_instability: -1, boundary_friction: -1 },
                weight: 1,
              },
              {
                id: "cpc-d2-mostly",
                label: "Mostly, but I rehearse what I want to say first",
                signals: { trust_instability: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "cpc-d2-walk-eggshells",
                label: "I walk on eggshells with certain topics",
                signals: { trust_instability: 2, boundary_friction: 2, emotional_availability_low: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-d2-avoid",
                label: "I've started avoiding certain topics altogether",
                signals: { trust_instability: 3, clarity_low: 2, boundary_friction: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "cpc-d3",
            kind: "branch",
            type: "scale",
            text: "When you disagree, how often does the conversation end with both of you feeling heard?",
            subtitle: "1 = rarely, 5 = almost always",
            branchId: "direct",
            sortOrder: 3,
            min: 1,
            max: 5,
            step: 1,
            minLabel: "Rarely",
            maxLabel: "Almost always",
            options: [], // scale uses value
          },
        ],

        // ── Branch: Avoidant ────────────────────────────────────
        avoidant: [
          {
            id: "cpc-a1",
            kind: "branch",
            type: "single-choice",
            text: "What usually happens when a difficult topic comes up?",
            subtitle:
              "Think about the pattern, not the one time it went differently.",
            branchId: "avoidant",
            sortOrder: 1,
            options: [
              {
                id: "cpc-a1-discuss",
                label: "We actually do discuss it, just with some hesitation",
                signals: { repair_potential_high: 1, consistency_low: 1 },
                weight: 1,
              },
              {
                id: "cpc-a1-deflect",
                label: "One of us deflects or changes the subject",
                signals: { clarity_low: 2, emotional_availability_low: 1, consistency_low: 1 },
                weight: 1.2,
              },
              {
                id: "cpc-a1-shut-down",
                label: "Things get quiet and tense until it just... passes",
                signals: { emotional_availability_low: 2, clarity_low: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-a1-blow-up",
                label: "We avoid it until it blows up later",
                signals: { emotional_availability_low: 3, clarity_low: 3, trust_instability: 2, follow_through_low: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "cpc-a2",
            kind: "branch",
            type: "single-choice",
            text: "Do you feel like your partner truly knows how you're feeling on a regular day?",
            subtitle:
              "Not during big moments — just in ordinary life.",
            branchId: "avoidant",
            sortOrder: 2,
            options: [
              {
                id: "cpc-a2-yes",
                label: "Yes — they can usually tell",
                signals: { emotional_availability_low: -1, clarity_low: -1 },
                weight: 0.5,
              },
              {
                id: "cpc-a2-sometimes",
                label: "Sometimes — when I make an effort to show it",
                signals: { clarity_low: 1, effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "cpc-a2-rarely",
                label: "Rarely — I feel like I have to spell everything out",
                signals: { clarity_low: 2, emotional_availability_low: 2, effort_imbalance: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-a2-no",
                label: "Not really — I've stopped expecting them to",
                signals: { clarity_low: 3, emotional_availability_low: 3, trust_instability: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "cpc-a3",
            kind: "branch",
            type: "single-choice",
            text: "When was the last time you had a genuinely open, honest conversation about something that mattered?",
            subtitle:
              "Not small talk — something real.",
            branchId: "avoidant",
            sortOrder: 3,
            options: [
              {
                id: "cpc-a3-recent",
                label: "Within the past week or so",
                signals: { repair_potential_high: 2, clarity_low: -1 },
                weight: 1,
              },
              {
                id: "cpc-a3-few-weeks",
                label: "A few weeks ago",
                signals: { consistency_low: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "cpc-a3-months",
                label: "It's been months, honestly",
                signals: { consistency_low: 2, clarity_low: 2, emotional_availability_low: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-a3-cant-remember",
                label: "I can't actually remember",
                signals: { consistency_low: 3, clarity_low: 3, emotional_availability_low: 2, trust_instability: 1 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Passive-Aggressive ──────────────────────────
        passive_aggressive: [
          {
            id: "cpc-pa1",
            kind: "branch",
            type: "single-choice",
            text: "Which of these feels most familiar in your communication?",
            subtitle:
              "Pick the one that happens most often, even if others do too.",
            branchId: "passive-aggressive",
            sortOrder: 1,
            options: [
              {
                id: "cpc-pa1-jabs",
                label: "Small sarcastic comments that sting but are 'just jokes'",
                signals: { mixed_signals_high: 2, boundary_friction: 2 },
                weight: 1.5,
              },
              {
                id: "cpc-pa1-silent",
                label: "Silent treatment or pulling away until the other person notices",
                signals: { emotional_availability_low: 2, mixed_signals_high: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-pa1-express",
                label: "We mostly talk things through, with occasional edge",
                signals: { mixed_signals_high: 1, repair_potential_high: 1 },
                weight: 1,
              },
              {
                id: "cpc-pa1-complaining",
                label: "Complaining to others instead of bringing it to the person",
                signals: { clarity_low: 2, mixed_signals_high: 1, trust_instability: 2 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "cpc-pa2",
            kind: "branch",
            type: "single-choice",
            text: "After an indirect conflict (like sarcasm or coldness), what usually happens next?",
            branchId: "passive-aggressive",
            sortOrder: 2,
            options: [
              {
                id: "cpc-pa2-resolve",
                label: "We eventually talk it out and reconnect",
                signals: { repair_potential_high: 2, trust_instability: -1 },
                weight: 1,
              },
              {
                id: "cpc-pa2-move-on",
                label: "We just move on without really addressing it",
                signals: { consistency_low: 2, clarity_low: 1, follow_through_low: 1 },
                weight: 1.2,
              },
              {
                id: "cpc-pa2-escalate",
                label: "It escalates — more indirect comments, more distance",
                signals: { mixed_signals_high: 3, boundary_friction: 2, trust_instability: 2 },
                weight: 1.5,
              },
              {
                id: "cpc-pa2-stone-wall",
                label: "One person stonewalls and the other eventually gives up",
                signals: { emotional_availability_low: 3, trust_instability: 2, boundary_friction: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "cpc-pa3",
            kind: "branch",
            type: "single-choice",
            text: "Do you feel like your partner understands the impact of their indirect communication?",
            subtitle:
              "Or does it feel like they don't see how it affects you?",
            branchId: "passive-aggressive",
            sortOrder: 3,
            options: [
              {
                id: "cpc-pa3-aware",
                label: "Yes — they've acknowledged it and are trying to be more direct",
                signals: { repair_potential_high: 2, effort_imbalance: -1 },
                weight: 1,
              },
              {
                id: "cpc-pa3-somewhat",
                label: "Somewhat — but they still fall into old habits",
                signals: { repair_potential_high: 1, consistency_low: 1, follow_through_low: 1 },
                weight: 1,
              },
              {
                id: "cpc-pa3-not-really",
                label: "Not really — they don't think it's a big deal",
                signals: { emotional_availability_low: 2, boundary_friction: 2, clarity_low: 1 },
                weight: 1.5,
              },
              {
                id: "cpc-pa3-gaslight",
                label: "They say I'm overreacting or being too sensitive",
                signals: { emotional_availability_low: 3, boundary_friction: 3, trust_instability: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Improving ───────────────────────────────────
        improving: [
          {
            id: "cpc-i1",
            kind: "branch",
            type: "single-choice",
            text: "What triggered the decision to work on communication?",
            subtitle:
              "Something specific, or a gradual realization?",
            branchId: "improving",
            sortOrder: 1,
            options: [
              {
                id: "cpc-i1-mutual",
                label: "We both realized things needed to change",
                signals: { repair_potential_high: 3, effort_imbalance: -1 },
                weight: 1,
              },
              {
                id: "cpc-i1-big-fight",
                label: "A particularly bad argument or blowup",
                signals: { repair_potential_high: 2, trust_instability: 1, boundary_friction: 1 },
                weight: 1,
              },
              {
                id: "cpc-i1-i-initiated",
                label: "I brought it up — they weren't thinking about it",
                signals: { repair_potential_high: 1, effort_imbalance: 2 },
                weight: 1.2,
              },
              {
                id: "cpc-i1-therapy",
                label: "A therapist, book, or outside resource helped us see it",
                signals: { repair_potential_high: 3, clarity_low: -1 },
                weight: 1,
              },
            ],
          },
          {
            id: "cpc-i2",
            kind: "branch",
            type: "single-choice",
            text: "What's the biggest change you've noticed so far?",
            branchId: "improving",
            sortOrder: 2,
            options: [
              {
                id: "cpc-i2-listening",
                label: "We listen to each other more, actually hear each other",
                signals: { emotional_availability_low: -1, repair_potential_high: 2 },
                weight: 1,
              },
              {
                id: "cpc-i2-less-avoiding",
                label: "We address things sooner instead of letting them build up",
                signals: { consistency_low: -1, repair_potential_high: 2, clarity_low: -1 },
                weight: 1,
              },
              {
                id: "cpc-i2-more-honest",
                label: "We're more honest about how we really feel",
                signals: { clarity_low: -1, trust_instability: -1, repair_potential_high: 1 },
                weight: 1,
              },
              {
                id: "cpc-i2-not-sure",
                label: "Honestly, I'm not sure if anything has really changed yet",
                signals: { consistency_low: 2, follow_through_low: 2, effort_imbalance: 1 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "cpc-i3",
            kind: "branch",
            type: "single-choice",
            text: "When old communication habits flare up, what happens now?",
            subtitle:
              "Old habits are normal — it's how you handle them that matters.",
            branchId: "improving",
            sortOrder: 3,
            options: [
              {
                id: "cpc-i3-acknowledge",
                label: "One of us catches it and we course-correct",
                signals: { repair_potential_high: 3, consistency_low: -1, trust_instability: -1 },
                weight: 1,
              },
              {
                id: "cpc-i3-talk-after",
                label: "We talk about it afterward and try to learn from it",
                signals: { repair_potential_high: 2, consistency_low: 1 },
                weight: 1,
              },
              {
                id: "cpc-i3-frustrated",
                label: "It feels frustrating — like we're back to square one",
                signals: { consistency_low: 2, trust_instability: 1, repair_potential_high: 1 },
                weight: 1.2,
              },
              {
                id: "cpc-i3-same-pattern",
                label: "We fall right back into the old pattern",
                signals: { consistency_low: 3, follow_through_low: 2, clarity_low: 1 },
                weight: 1.5,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "cpc-uni1",
          kind: "universal",
          type: "single-choice",
          text: "Do you feel like your partner understands what you need from them in conversation?",
          sortOrder: 10,
          options: [
            {
              id: "cpc-uni1-yes",
              label: "Yes — they know what I need and usually try to meet it",
              signals: { clarity_low: -1, emotional_availability_low: -1, effort_imbalance: -1 },
              weight: 1,
            },
            {
              id: "cpc-uni1-mostly",
              label: "Mostly — though I sometimes wish they'd check in more",
              signals: { emotional_availability_low: 1, clarity_low: 1 },
              weight: 1,
            },
            {
              id: "cpc-uni1-sometimes",
              label: "Sometimes — they try, but the approach doesn't quite match what I need",
              signals: { mixed_signals_high: 1, clarity_low: 2 },
              weight: 1.2,
            },
            {
              id: "cpc-uni1-rarely",
              label: "Rarely — I feel like we're speaking different languages sometimes",
              signals: { clarity_low: 3, mixed_signals_high: 2, emotional_availability_low: 1 },
              weight: 1.5,
            },
          ],
        },
        {
          id: "cpc-uni2",
          kind: "universal",
          type: "scale",
          text: "On a scale of 1–5, how much does your day-to-day communication bring you closer together?",
          subtitle: "1 = it pushes us apart, 5 = it genuinely connects us",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Pushes us apart",
          maxLabel: "Genuinely connects us",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "cpc-final",
        kind: "final",
        type: "open-ended",
        text: "Is there a specific communication moment — good or bad — that's been on your mind?",
        subtitle:
          "This is optional. Sometimes the details that matter most don't fit into multiple choice.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 4. Compatibility Compass  (coming soon)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "compatibility-compass",
    name: "Compatibility Compass",
    tagline: "Find out if your values, goals, and rhythms actually align.",
    description:
      "Love and compatibility aren't the same thing — and that's okay. This tool goes beyond chemistry to check whether you and your partner align on the things that matter long-term: values, lifestyle, communication style, and vision for the future.",
    mode: "compare",
    version: "0.1.0",
    icon: "Compass",
    color: "emerald",
    estimatedQuestions: "12–15",
    estimatedTime: "6–10 min",
    category: "Compatibility",
    featured: false,
    comingSoon: true,
    questionTree: {
      routingQuestion: {
        id: "cc-routing",
        kind: "routing",
        type: "single-choice",
        text: "Coming soon — we're building this tool with care.",
        options: [
          {
            id: "cc-placeholder",
            label: "Stay tuned",
            signals: {},
            branchRef: "placeholder",
          },
        ],
        sortOrder: 0,
      },
      branches: {},
      universalQuestions: [],
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 5. Red Flag Scanner  (coming soon)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "red-flag-scanner",
    name: "Red Flag Scanner",
    tagline: "A quiet, honest look at the warning signs you might be overlooking.",
    description:
      "Not every uncomfortable moment is a red flag — and not every red flag is obvious. This tool helps you distinguish between normal relationship friction and genuine warning signs, with clear, compassionate language and actionable guidance.",
    mode: "deep-dive",
    version: "0.1.0",
    icon: "ShieldAlert",
    color: "orange",
    estimatedQuestions: "8–10",
    estimatedTime: "4–6 min",
    category: "Safety",
    featured: false,
    comingSoon: true,
    questionTree: {
      routingQuestion: {
        id: "rfs-routing",
        kind: "routing",
        type: "single-choice",
        text: "Coming soon — we're building this tool with care.",
        options: [
          {
            id: "rfs-placeholder",
            label: "Stay tuned",
            signals: {},
            branchRef: "placeholder",
          },
        ],
        sortOrder: 0,
      },
      branches: {},
      universalQuestions: [],
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 6. Texting Energy Match  (active)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "texting-energy-match",
    name: "Texting Energy Match",
    tagline: "See if your texting vibes are actually aligned.",
    description:
      "Texting says more than we realize — it reveals effort, enthusiasm, and emotional investment. This tool reads between the lines of your texting dynamic to help you understand whether you're both on the same wavelength or if the energy gap is telling you something important.",
    mode: "insight",
    version: "1.0.0",
    icon: "MessageCircle",
    color: "teal",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Communication",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "tem-routing",
        kind: "routing",
        type: "single-choice",
        text: "How would you describe the texting dynamic between you?",
        subtitle:
          "Go with your gut — the vibe you feel most days, not just the best or worst ones.",
        options: [
          {
            id: "tem-r-balanced",
            label: "Pretty balanced — we match each other's energy",
            description:
              "It feels natural. Neither of us is always chasing or always pulling away.",
            signals: { enthusiasm_mismatch: -1, effort_imbalance: -1 },
            weight: 1,
            branchRef: "balanced",
          },
          {
            id: "tem-r-overinvested",
            label: "I feel like I'm more invested in the conversation",
            description:
              "I initiate more, type more, and wait more than they probably realize.",
            signals: { effort_imbalance: 2, enthusiasm_mismatch: 2 },
            weight: 1,
            branchRef: "overinvested",
          },
          {
            id: "tem-r-casual",
            label: "Pretty casual — we text but it's not a big thing",
            description:
              "Neither of us is glued to our phone. We talk when we talk.",
            signals: { dry_texting: 1, breadcrumbing_pattern: 1 },
            weight: 1,
            branchRef: "casual",
          },
          {
            id: "tem-r-uncertain",
            label: "Honestly, I can never tell where they're at",
            description:
              "Some days they're super engaged, other days they're barely there. It keeps me guessing.",
            signals: { mixed_signals_high: 2, consistency_low: 2 },
            weight: 1,
            branchRef: "uncertain",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Balanced ────────────────────────────────────
        balanced: [
          {
            id: "tem-b1",
            kind: "branch",
            type: "single-choice",
            text: "When one of you sends a longer, more personal message, how does the other usually respond?",
            branchId: "balanced",
            sortOrder: 1,
            options: [
              {
                id: "tem-b1-match",
                label: "They match the energy — we go back and forth with real substance",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "tem-b1-acknowledge",
                label: "They acknowledge it but keep their response shorter",
                signals: { enthusiasm_mismatch: 1 },
                weight: 1,
              },
              {
                id: "tem-b1-surface",
                label: "They kind of skim past the deep part and keep it light",
                signals: { enthusiasm_mismatch: 2, dry_texting: 1 },
                weight: 1.5,
              },
              {
                id: "tem-b1-ignore",
                label: "They often don't respond to the emotional part at all",
                signals: { enthusiasm_mismatch: 3, dry_texting: 2, consistency_low: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-b2",
            kind: "branch",
            type: "single-choice",
            text: "How often do you find yourself re-reading their messages for hidden meaning?",
            branchId: "balanced",
            sortOrder: 2,
            options: [
              {
                id: "tem-b2-never",
                label: "Rarely — I usually take their messages at face value",
                signals: { mixed_signals_high: -1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "tem-b2-occasionally",
                label: "Occasionally — but I catch myself and move on",
                signals: { mixed_signals_high: 1 },
                weight: 1,
              },
              {
                id: "tem-b2-sometimes",
                label: "Sometimes — especially when their tone feels off",
                signals: { mixed_signals_high: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "tem-b2-often",
                label: "Often — I analyze the tone, the timing, the word choice",
                signals: { mixed_signals_high: 3, consistency_low: 2, trust_instability: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-b3",
            kind: "branch",
            type: "scale",
            text: "How much does your texting dynamic reflect how you feel about the relationship overall?",
            subtitle: "1 = texting is just texting, 5 = texting tells me everything",
            branchId: "balanced",
            sortOrder: 3,
            min: 1,
            max: 5,
            step: 1,
            minLabel: "Just texting",
            maxLabel: "Tells me everything",
            options: [], // scale uses value
          },
        ],

        // ── Branch: Overinvested ────────────────────────────────
        overinvested: [
          {
            id: "tem-o1",
            kind: "branch",
            type: "single-choice",
            text: "After you send a message, how long does it typically take them to reply?",
            branchId: "overinvested",
            sortOrder: 1,
            options: [
              {
                id: "tem-o1-quick",
                label: "Pretty quickly — they're usually responsive",
                signals: { effort_imbalance: -1, consistency_low: -1 },
                weight: 0.5,
              },
              {
                id: "tem-o1-hours",
                label: "A few hours, which is fine — people are busy",
                signals: { effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "tem-o1-variable",
                label: "It varies a lot — sometimes minutes, sometimes the next day",
                signals: { consistency_low: 2, effort_imbalance: 2, breadcrumbing_pattern: 1 },
                weight: 1.5,
              },
              {
                id: "tem-o1-rarely",
                label: "They rarely initiate and often take a long time to get back to me",
                signals: { effort_imbalance: 3, breadcrumbing_pattern: 3, dry_texting: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-o2",
            kind: "branch",
            type: "single-choice",
            text: "When they do text back, how does it usually feel?",
            branchId: "overinvested",
            sortOrder: 2,
            options: [
              {
                id: "tem-o2-warm",
                label: "Warm and engaged — they show they're happy to hear from me",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "tem-o2-fine",
                label: "Fine — they respond, but it's often short or practical",
                signals: { dry_texting: 2, enthusiasm_mismatch: 1 },
                weight: 1.2,
              },
              {
                id: "tem-o2-one-word",
                label: "Low-effort — lots of one-word replies or emojis with no substance",
                signals: { dry_texting: 3, effort_imbalance: 2, enthusiasm_mismatch: 3 },
                weight: 1.8,
              },
              {
                id: "tem-o2-guilt",
                label: "Like they're doing me a favor — it carries a hint of guilt or obligation",
                signals: { dry_texting: 2, effort_imbalance: 3, pressure_signal: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-o3",
            kind: "branch",
            type: "single-choice",
            text: "Do you ever find yourself sending follow-up texts just to keep the conversation going?",
            subtitle: "No judgment — most of us have been there.",
            branchId: "overinvested",
            sortOrder: 3,
            options: [
              {
                id: "tem-o3-rarely",
                label: "Rarely — if they go quiet, I let it be",
                signals: { effort_imbalance: -1, pressure_signal: -1 },
                weight: 0.5,
              },
              {
                id: "tem-o3-occasionally",
                label: "Occasionally — just a quick check-in or meme",
                signals: { effort_imbalance: 1, pressure_signal: 1 },
                weight: 1,
              },
              {
                id: "tem-o3-often",
                label: "More than I'd like to admit — I hate the silence",
                signals: { effort_imbalance: 2, pressure_signal: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "tem-o3-always",
                label: "Constantly — I feel like I'm always the one keeping it alive",
                signals: { effort_imbalance: 3, pressure_signal: 2, breadcrumbing_pattern: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Casual ──────────────────────────────────────
        casual: [
          {
            id: "tem-c1",
            kind: "branch",
            type: "single-choice",
            text: "When you don't hear from them for a day or two, how does that feel?",
            branchId: "casual",
            sortOrder: 1,
            options: [
              {
                id: "tem-c1-fine",
                label: "Totally fine — we both have our own lives",
                signals: { consistency_low: -1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "tem-c1-slight",
                label: "A tiny bit off, but nothing major",
                signals: { consistency_low: 1 },
                weight: 1,
              },
              {
                id: "tem-c1-wonder",
                label: "I start wondering if they're losing interest",
                signals: { consistency_low: 2, breadcrumbing_pattern: 1, mixed_signals_high: 1 },
                weight: 1.5,
              },
              {
                id: "tem-c1-anxious",
                label: "It makes me anxious — I check their socials to see if they're active",
                signals: { consistency_low: 2, breadcrumbing_pattern: 2, mixed_signals_high: 2, trust_instability: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-c2",
            kind: "branch",
            type: "single-choice",
            text: "Does the casualness feel mutual — like you're both on the same page about how much you text?",
            branchId: "casual",
            sortOrder: 2,
            options: [
              {
                id: "tem-c2-yes",
                label: "Yes — neither of us expects daily check-ins",
                signals: { effort_imbalance: -1, mixed_signals_high: -1 },
                weight: 0.5,
              },
              {
                id: "tem-c2-mostly",
                label: "Mostly, but sometimes I wish they'd reach out first",
                signals: { effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "tem-c2-not-sure",
                label: "I'm not sure — I can't tell if they're genuinely casual or just not that into texting me",
                signals: { mixed_signals_high: 2, breadcrumbing_pattern: 1, dry_texting: 1 },
                weight: 1.5,
              },
              {
                id: "tem-c2-no",
                label: "No — I want to text more but I don't want to seem clingy",
                signals: { effort_imbalance: 2, dry_texting: 1, pressure_signal: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-c3",
            kind: "branch",
            type: "scale",
            text: "How well does the way you text match the kind of connection you actually want?",
            subtitle: "1 = texting doesn't matter to me, 5 = I wish we texted differently",
            branchId: "casual",
            sortOrder: 3,
            min: 1,
            max: 5,
            step: 1,
            minLabel: "Doesn't matter",
            maxLabel: "Wish it were different",
            options: [], // scale uses value
          },
        ],

        // ── Branch: Uncertain ───────────────────────────────────
        uncertain: [
          {
            id: "tem-u1",
            kind: "branch",
            type: "single-choice",
            text: "What does a typical week of texting look like with this person?",
            branchId: "uncertain",
            sortOrder: 1,
            options: [
              {
                id: "tem-u1-consistent",
                label: "Fairly consistent — some days more than others, but there's a rhythm",
                signals: { consistency_low: -1, mixed_signals_high: -1 },
                weight: 0.5,
              },
              {
                id: "tem-u1-rollercoaster",
                label: "A rollercoaster — amazing one day, ghost-like the next",
                signals: { mixed_signals_high: 3, consistency_low: 3, breadcrumbing_pattern: 1 },
                weight: 1.8,
              },
              {
                id: "tem-u1-push-pull",
                label: "They come on strong for a few days, then go quiet — then come back",
                signals: { mixed_signals_high: 2, breadcrumbing_pattern: 3, fast_intensity: 1 },
                weight: 2,
              },
              {
                id: "tem-u1-mia",
                label: "They disappear for stretches and then pop back in like nothing happened",
                signals: { breadcrumbing_pattern: 3, consistency_low: 3, mixed_signals_high: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "tem-u2",
            kind: "branch",
            type: "single-choice",
            text: "When they send a long, thoughtful message after being distant, what's your honest reaction?",
            branchId: "uncertain",
            sortOrder: 2,
            options: [
              {
                id: "tem-u2-happy",
                label: "Happy — I appreciate it and it feels genuine",
                signals: { mixed_signals_high: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "tem-u2-cautious",
                label: "Cautiously optimistic — but part of me wonders how long it'll last",
                signals: { mixed_signals_high: 1, trust_instability: 1 },
                weight: 1,
              },
              {
                id: "tem-u2-anxious",
                label: "A rush of relief mixed with anxiety — like I've been holding my breath",
                signals: { mixed_signals_high: 2, trust_instability: 2, breadcrumbing_pattern: 1 },
                weight: 1.5,
              },
              {
                id: "tem-u2-resentful",
                label: "Honest truth? Kind of resentful — I wish they were like this all the time",
                signals: { mixed_signals_high: 2, consistency_low: 2, effort_imbalance: 2 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "tem-u3",
            kind: "branch",
            type: "single-choice",
            text: "Have you ever changed how you text (shorter, less eager, more casual) to match their energy?",
            subtitle: "Like mirroring them to avoid seeming too interested.",
            branchId: "uncertain",
            sortOrder: 3,
            options: [
              {
                id: "tem-u3-no",
                label: "No — I text how I want to text",
                signals: { pressure_signal: -1, effort_imbalance: -1 },
                weight: 0.5,
              },
              {
                id: "tem-u3-once",
                label: "Maybe once or twice — I caught myself doing it",
                signals: { pressure_signal: 1, effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "tem-u3-often",
                label: "Yeah, I do it pretty often — I don't want to come off too strong",
                signals: { pressure_signal: 2, effort_imbalance: 2, enthusiasm_mismatch: 1 },
                weight: 1.5,
              },
              {
                id: "tem-u3-always",
                label: "Constantly — I carefully calculate every message I send",
                signals: { pressure_signal: 3, effort_imbalance: 2, mixed_signals_high: 2 },
                weight: 2,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "tem-uni1",
          kind: "universal",
          type: "single-choice",
          text: "After a good texting exchange, do you feel more connected or more confused?",
          sortOrder: 10,
          options: [
            {
              id: "tem-uni1-connected",
              label: "More connected — good conversations make me feel closer to them",
              signals: { repair_potential_high: 1, mixed_signals_high: -1 },
              weight: 0.5,
            },
            {
              id: "tem-uni1-same",
              label: "About the same — texting doesn't really change how I feel",
              signals: { dry_texting: 1 },
              weight: 1,
            },
            {
              id: "tem-uni1-more-confused",
              label: "More confused — sometimes good texts leave me with more questions",
              signals: { mixed_signals_high: 2, clarity_low: 1 },
              weight: 1.5,
            },
            {
              id: "tem-uni1-exhausted",
              label: "Honestly? Exhausted — I overthink everything they said afterward",
              signals: { mixed_signals_high: 3, consistency_low: 2, trust_instability: 1 },
              weight: 2,
            },
          ],
        },
        {
          id: "tem-uni2",
          kind: "universal",
          type: "scale",
          text: "How honestly can you say what you actually feel over text?",
          subtitle: "1 = I hold back a lot, 5 = I'm completely myself",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "I hold back a lot",
          maxLabel: "Completely myself",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "tem-final",
        kind: "final",
        type: "open-ended",
        text: "Is there a specific text exchange — recent or old — that's been on your mind?",
        subtitle:
          "Optional, but sometimes the message that sticks with you is the one that matters most.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 7. Love Bombing Detector  (active)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "love-bombing-detector",
    name: "Love Bombing Detector",
    tagline: "Learn to spot the difference between excitement and overload.",
    description:
      "Not all intensity is love — and not all love bombing starts with bad intentions. This tool helps you observe patterns in how a connection began and evolved, so you can distinguish between genuine enthusiasm and the kind of intensity that often fades or shifts in ways that leave you questioning everything.",
    mode: "check",
    version: "1.0.0",
    icon: "ShieldAlert",
    color: "orange",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Safety",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "lbd-routing",
        kind: "routing",
        type: "single-choice",
        text: "How would you describe the beginning of this connection?",
        subtitle:
          "Think about the first few weeks — what was the energy like?",
        options: [
          {
            id: "lbd-r-intense",
            label: "Very intense — everything happened fast",
            description:
              "They came on strong: constant attention, big declarations, lots of future talk.",
            signals: { fast_intensity: 3, future_promises_high: 1 },
            weight: 1,
            branchRef: "intense-start",
          },
          {
            id: "lbd-r-gradual",
            label: "Gradual — it built up naturally over time",
            description:
              "Things unfolded at a comfortable pace. No big rush.",
            signals: { fast_intensity: -1, consistency_low: -1 },
            weight: 1,
            branchRef: "gradual",
          },
          {
            id: "lbd-r-reconsidering",
            label: "I'm reconsidering — some things from the beginning feel different now",
            description:
              "Looking back, I'm starting to question whether the early intensity was genuine.",
            signals: { mixed_signals_high: 2, trust_instability: 2 },
            weight: 1,
            branchRef: "reconsidering",
          },
          {
            id: "lbd-r-post-bombing",
            label: "The intensity faded — and now things feel really different",
            description:
              "They were all-in at first, then pulled way back. I'm trying to make sense of the contrast.",
            signals: { fast_intensity: 2, consistency_low: 3, mixed_signals_high: 2 },
            weight: 1,
            branchRef: "post-bombing",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Intense Start ───────────────────────────────
        "intense-start": [
          {
            id: "lbd-is1",
            kind: "branch",
            type: "single-choice",
            text: "Early on, how did they express their interest in you?",
            subtitle: "Think about the first few weeks.",
            branchId: "intense-start",
            sortOrder: 1,
            options: [
              {
                id: "lbd-is1-gradual",
                label: "Gradually — they showed interest through actions over time",
                signals: { fast_intensity: -1, consistency_low: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "lbd-is1-sweet",
                label: "Sweet and enthusiastic — they were clearly excited but it felt natural",
                signals: { fast_intensity: 1, repair_potential_high: 1 },
                weight: 1,
              },
              {
                id: "lbd-is1-grand",
                label: "Grand gestures and big declarations — they said things that felt almost too good to be true",
                signals: { fast_intensity: 3, future_promises_high: 2, pressure_signal: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-is1-idealize",
                label: "They idealized me — like I was perfect and they'd been waiting for someone like me",
                signals: { fast_intensity: 3, future_promises_high: 3, pressure_signal: 2, effort_imbalance: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-is2",
            kind: "branch",
            type: "single-choice",
            text: "How quickly did they want to define the relationship or make future plans?",
            branchId: "intense-start",
            sortOrder: 2,
            options: [
              {
                id: "lbd-is2-patient",
                label: "They were patient — no rush at all",
                signals: { fast_intensity: -1, pressure_signal: -1, future_promises_high: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-is2-normal",
                label: "A normal pace — they brought it up when it felt right",
                signals: { fast_intensity: 1 },
                weight: 1,
              },
              {
                id: "lbd-is2-early",
                label: "Very early — they talked about the future before we'd even gone on a few dates",
                signals: { fast_intensity: 2, future_promises_high: 3, pressure_signal: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-is2-immediate",
                label: "Almost immediately — trips, moving in, meeting family, all within weeks",
                signals: { fast_intensity: 3, future_promises_high: 3, pressure_signal: 2, effort_imbalance: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-is3",
            kind: "branch",
            type: "single-choice",
            text: "Did they try to spend all their time with you early on, or talk constantly?",
            branchId: "intense-start",
            sortOrder: 3,
            options: [
              {
                id: "lbd-is3-balance",
                label: "No, they had their own life and respected mine too",
                signals: { fast_intensity: -1, boundary_friction: -1, pressure_signal: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-is3-enthusiastic",
                label: "They were eager but it didn't feel overwhelming",
                signals: { fast_intensity: 1 },
                weight: 1,
              },
              {
                id: "lbd-is3-a-lot",
                label: "Yeah, they wanted to talk or see me all the time",
                signals: { fast_intensity: 2, pressure_signal: 1, boundary_friction: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-is3-all-consuming",
                label: "It was all-consuming — they made me the center of their world immediately",
                signals: { fast_intensity: 3, pressure_signal: 2, boundary_friction: 2, effort_imbalance: 1 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Gradual ────────────────────────────────────
        gradual: [
          {
            id: "lbd-g1",
            kind: "branch",
            type: "single-choice",
            text: "Even though things started naturally, have there been moments that felt unexpectedly intense?",
            branchId: "gradual",
            sortOrder: 1,
            options: [
              {
                id: "lbd-g1-no",
                label: "Not really — it's been fairly consistent throughout",
                signals: { fast_intensity: -1, mixed_signals_high: -1, consistency_low: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-g1-small",
                label: "Small moments — nothing that alarmed me",
                signals: { fast_intensity: 1 },
                weight: 1,
              },
              {
                id: "lbd-g1-some",
                label: "A few times — I noticed it but figured it was just enthusiasm",
                signals: { fast_intensity: 2, mixed_signals_high: 1 },
                weight: 1.2,
              },
              {
                id: "lbd-g1-looking-back",
                label: "Looking back, there were more red flags than I realized at the time",
                signals: { fast_intensity: 2, mixed_signals_high: 2, trust_instability: 1 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "lbd-g2",
            kind: "branch",
            type: "single-choice",
            text: "How do they handle it when you want space or don't respond right away?",
            branchId: "gradual",
            sortOrder: 2,
            options: [
              {
                id: "lbd-g2-respect",
                label: "They respect it — no problem at all",
                signals: { pressure_signal: -1, boundary_friction: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "lbd-g2-fine",
                label: "Mostly fine, though they might check in once",
                signals: { pressure_signal: 1 },
                weight: 1,
              },
              {
                id: "lbd-g2-guilty",
                label: "They act hurt or make me feel guilty for not being available",
                signals: { pressure_signal: 2, boundary_friction: 2, effort_imbalance: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-g2-bombard",
                label: "They bombard me with messages or show up unannounced",
                signals: { pressure_signal: 3, boundary_friction: 3, trust_instability: 1 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-g3",
            kind: "branch",
            type: "single-choice",
            text: "Do they often bring up big commitments early — like exclusivity, moving in, or long-term plans?",
            branchId: "gradual",
            sortOrder: 3,
            options: [
              {
                id: "lbd-g3-no",
                label: "No — they let things develop at their own pace",
                signals: { future_promises_high: -1, pressure_signal: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-g3-sometimes",
                label: "Occasionally — it feels like thinking ahead, not pressure",
                signals: { future_promises_high: 1 },
                weight: 1,
              },
              {
                id: "lbd-g3-often",
                label: "Fairly often — it sometimes feels like they're trying to lock things down",
                signals: { future_promises_high: 2, pressure_signal: 2 },
                weight: 1.5,
              },
              {
                id: "lbd-g3-very-early",
                label: "Yes — and it feels premature, like they're skipping steps",
                signals: { future_promises_high: 3, fast_intensity: 2, pressure_signal: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Reconsidering ───────────────────────────────
        reconsidering: [
          {
            id: "lbd-rc1",
            kind: "branch",
            type: "single-choice",
            text: "What specifically made you start rethinking the beginning of this connection?",
            branchId: "reconsidering",
            sortOrder: 1,
            options: [
              {
                id: "lbd-rc1-small-things",
                label: "Small inconsistencies — things they said early on that don't add up now",
                signals: { consistency_low: 2, mixed_signals_high: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-rc1-changed",
                label: "They changed — the person I met at the beginning feels gone",
                signals: { consistency_low: 3, mixed_signals_high: 2, trust_instability: 2, effort_imbalance: 1 },
                weight: 1.8,
              },
              {
                id: "lbd-rc1-others-noticed",
                label: "People close to me pointed things out I hadn't noticed",
                signals: { consistency_low: 1, trust_instability: 1 },
                weight: 1.2,
              },
              {
                id: "lbd-rc1-just-feeling",
                label: "Just a gut feeling — something felt off and I can't fully explain it",
                signals: { mixed_signals_high: 2, trust_instability: 2 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "lbd-rc2",
            kind: "branch",
            type: "single-choice",
            text: "Do they still do the sweet things they did at the beginning, or has that faded?",
            branchId: "reconsidering",
            sortOrder: 2,
            options: [
              {
                id: "lbd-rc2-yes",
                label: "Yes — they're still thoughtful and consistent",
                signals: { consistency_low: -1, effort_imbalance: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "lbd-rc2-settled",
                label: "It's shifted — but in a natural, settled way",
                signals: { consistency_low: 1 },
                weight: 1,
              },
              {
                id: "lbd-rc2-dropped",
                label: "A lot of it has dropped off — they used to do so much more",
                signals: { consistency_low: 2, effort_imbalance: 2, mixed_signals_high: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-rc2-gone",
                label: "Almost completely gone — it's like a different person now",
                signals: { consistency_low: 3, effort_imbalance: 3, trust_instability: 2, mixed_signals_high: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-rc3",
            kind: "branch",
            type: "single-choice",
            text: "Have they ever told you that you're the only one who truly understands them?",
            subtitle: "Or made you feel like your bond is special in a way that separates you from others.",
            branchId: "reconsidering",
            sortOrder: 3,
            options: [
              {
                id: "lbd-rc3-no",
                label: "No, they haven't framed it like that",
                signals: { pressure_signal: -1, boundary_friction: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-rc3-sweetly",
                label: "In a sweet, genuine way — it felt natural",
                signals: { pressure_signal: 1 },
                weight: 1,
              },
              {
                id: "lbd-rc3-isolated",
                label: "Yeah — and it kind of isolated me from my friends or support system",
                signals: { pressure_signal: 2, boundary_friction: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-rc3-us-against",
                label: "All the time — it feels like it's 'us against the world' in a way that's intense",
                signals: { pressure_signal: 3, boundary_friction: 3, fast_intensity: 2, trust_instability: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Post-Bombing ────────────────────────────────
        "post-bombing": [
          {
            id: "lbd-pb1",
            kind: "branch",
            type: "single-choice",
            text: "When the intensity dropped, what did that look like?",
            subtitle: "The contrast between 'then' and 'now' is what matters here.",
            branchId: "post-bombing",
            sortOrder: 1,
            options: [
              {
                id: "lbd-pb1-settled",
                label: "It settled into something more natural and comfortable",
                signals: { consistency_low: -1, repair_potential_high: 2, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-pb1-slight-drop",
                label: "A slight drop in attention — but still present and caring",
                signals: { consistency_low: 1, effort_imbalance: 1 },
                weight: 1,
              },
              {
                id: "lbd-pb1-big-shift",
                label: "A big shift — way less effort, fewer sweet texts, less interest",
                signals: { consistency_low: 3, effort_imbalance: 3, mixed_signals_high: 2, trust_instability: 2 },
                weight: 1.8,
              },
              {
                id: "lbd-pb1-gone",
                label: "They went cold almost overnight — like a switch flipped",
                signals: { consistency_low: 3, trust_instability: 3, mixed_signals_high: 3, effort_imbalance: 3 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-pb2",
            kind: "branch",
            type: "single-choice",
            text: "When you mention the change, how do they respond?",
            branchId: "post-bombing",
            sortOrder: 2,
            options: [
              {
                id: "lbd-pb2-listen",
                label: "They listen and acknowledge it — maybe explain what's going on",
                signals: { repair_potential_high: 2, trust_instability: -1, emotional_availability_low: -1 },
                weight: 0.5,
              },
              {
                id: "lbd-pb2-dismiss",
                label: "They say I'm overthinking it or being needy",
                signals: { boundary_friction: 2, trust_instability: 2, emotional_availability_low: 1 },
                weight: 1.5,
              },
              {
                id: "lbd-pb2-blame",
                label: "They blame me — say I'm the one who changed",
                signals: { boundary_friction: 3, trust_instability: 2, effort_imbalance: 2 },
                weight: 2,
              },
              {
                id: "lbd-pb2-bomb-again",
                label: "They briefly ramp up the intensity again — but it doesn't last",
                signals: { consistency_low: 3, mixed_signals_high: 3, trust_instability: 2, fast_intensity: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "lbd-pb3",
            kind: "branch",
            type: "single-choice",
            text: "Right now, do you feel like the version of them you first met was the real them?",
            subtitle: "There's no wrong answer — this is about trusting your own observations.",
            branchId: "post-bombing",
            sortOrder: 3,
            options: [
              {
                id: "lbd-pb3-yes",
                label: "Yes — I think they were just really excited and have settled since",
                signals: { trust_instability: -1, consistency_low: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "lbd-pb3-unsure",
                label: "I'm unsure — it's hard to tell",
                signals: { trust_instability: 1, mixed_signals_high: 2 },
                weight: 1,
              },
              {
                id: "lbd-pb3-different",
                label: "No — I think they showed me who they wanted to be, not who they are",
                signals: { trust_instability: 3, mixed_signals_high: 2, consistency_low: 2, effort_imbalance: 2 },
                weight: 1.8,
              },
              {
                id: "lbd-pb3-manipulated",
                label: "I feel like I was manipulated — and I'm still trying to accept that",
                signals: { trust_instability: 3, mixed_signals_high: 3, consistency_low: 3, emotional_availability_low: 2 },
                weight: 2,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "lbd-uni1",
          kind: "universal",
          type: "single-choice",
          text: "Do you feel like you can set boundaries with this person without fear of how they'll react?",
          sortOrder: 10,
          options: [
            {
              id: "lbd-uni1-yes",
              label: "Yes — they respect my boundaries",
              signals: { boundary_friction: -1, trust_instability: -1, repair_potential_high: 1 },
              weight: 0.5,
            },
            {
              id: "lbd-uni1-mostly",
              label: "Mostly — occasional pushback but nothing major",
              signals: { boundary_friction: 1 },
              weight: 1,
            },
            {
              id: "lbd-uni1-anxious",
              label: "I feel anxious about it — like I have to prepare for their reaction",
              signals: { boundary_friction: 2, trust_instability: 2, pressure_signal: 1 },
              weight: 1.5,
            },
            {
              id: "lbd-uni1-cant",
              label: "I can't — every time I try, it turns into a big issue",
              signals: { boundary_friction: 3, trust_instability: 3, pressure_signal: 2, emotional_availability_low: 1 },
              weight: 2,
            },
          ],
        },
        {
          id: "lbd-uni2",
          kind: "universal",
          type: "scale",
          text: "How much do you feel like yourself around this person?",
          subtitle: "1 = I feel like a version of myself I don't recognize, 5 = I'm fully myself",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Don't recognize myself",
          maxLabel: "Fully myself",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "lbd-final",
        kind: "final",
        type: "open-ended",
        text: "Is there anything from the early days of this connection that keeps replaying in your mind?",
        subtitle:
          "Optional. Sometimes the moments we glossed over at first become the most important ones in hindsight.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 8. Future Alignment Checker  (active)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "future-alignment-checker",
    name: "Future Alignment Checker",
    tagline: "See if you're actually walking in the same direction.",
    description:
      "Being in love doesn't automatically mean being aligned. This tool helps you explore whether you and your partner see eye to eye on the things that shape a shared future — values, timing, lifestyle, and the bigger picture — without judgment or pressure to have it all figured out.",
    mode: "insight",
    version: "1.0.0",
    icon: "Compass",
    color: "emerald",
    estimatedQuestions: "6–8",
    estimatedTime: "3–5 min",
    category: "Compatibility",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "fac-routing",
        kind: "routing",
        type: "single-choice",
        text: "How aligned do you feel about the future with this person?",
        subtitle:
          "Not just logistics — the bigger picture of where you're both heading.",
        options: [
          {
            id: "fac-r-aligned",
            label: "Pretty aligned — we see things similarly",
            description:
              "We've talked about the future and it generally feels like we're on the same page.",
            signals: { future_ambiguity: -1, clarity_low: -1 },
            weight: 1,
            branchRef: "aligned",
          },
          {
            id: "fac-r-gaps",
            label: "Some gaps — nothing major, but a few things don't quite line up",
            description:
              "We agree on a lot, but there are specific areas where we're not totally synced.",
            signals: { future_ambiguity: 1, mixed_signals_high: 1 },
            weight: 1,
            branchRef: "some-gaps",
          },
          {
            id: "fac-r-uncertain",
            label: "I'm not sure — we haven't really talked about it deeply",
            description:
              "The future has come up, but it's still vague. I don't know exactly where they stand.",
            signals: { future_ambiguity: 2, clarity_low: 2 },
            weight: 1,
            branchRef: "uncertain",
          },
          {
            id: "fac-r-misaligned",
            label: "Misaligned — our visions for the future seem pretty different",
            description:
              "We've talked and I can see meaningful gaps in what we both want long-term.",
            signals: { future_ambiguity: 3, clarity_low: 2, mixed_signals_high: 2 },
            weight: 1,
            branchRef: "misaligned",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Aligned ────────────────────────────────────
        aligned: [
          {
            id: "fac-a1",
            kind: "branch",
            type: "single-choice",
            text: "How did you and this person figure out you were on the same page about the future?",
            branchId: "aligned",
            sortOrder: 1,
            options: [
              {
                id: "fac-a1-organic",
                label: "Organically — it came up naturally in conversation",
                signals: { clarity_low: -1, future_ambiguity: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "fac-a1-direct",
                label: "We had an intentional conversation about it",
                signals: { clarity_low: -1, future_ambiguity: -1 },
                weight: 0.5,
              },
              {
                id: "fac-a1-assumed",
                label: "We kind of assumed — we haven't talked about it in detail",
                signals: { future_ambiguity: 1, clarity_low: 2 },
                weight: 1.5,
              },
              {
                id: "fac-a1-one-person",
                label: "One of us brought it up more than the other",
                signals: { effort_imbalance: 1, future_ambiguity: 1 },
                weight: 1,
              },
            ],
          },
          {
            id: "fac-a2",
            kind: "branch",
            type: "single-choice",
            text: "When you picture your life 3–5 years from now, does this person fit naturally into that vision?",
            branchId: "aligned",
            sortOrder: 2,
            options: [
              {
                id: "fac-a2-absolutely",
                label: "Absolutely — I can see us clearly in that picture",
                signals: { future_ambiguity: -1, trust_instability: -1, clarity_low: -1 },
                weight: 0.5,
              },
              {
                id: "fac-a2-mostly",
                label: "Mostly — there are a few question marks but overall yes",
                signals: { future_ambiguity: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-a2-hopefully",
                label: "Hopefully — I want them to be there but I'm not 100% sure",
                signals: { future_ambiguity: 2, clarity_low: 1, mixed_signals_high: 1 },
                weight: 1.5,
              },
              {
                id: "fac-a2-hard",
                label: "Honestly, it's hard to picture — things feel uncertain",
                signals: { future_ambiguity: 3, clarity_low: 2, trust_instability: 1 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "fac-a3",
            kind: "branch",
            type: "single-choice",
            text: "Have there been any moments where their actions contradicted what they said about the future?",
            branchId: "aligned",
            sortOrder: 3,
            options: [
              {
                id: "fac-a3-no",
                label: "No — their actions match their words",
                signals: { consistency_low: -1, follow_through_low: -1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-a3-minor",
                label: "Minor things — nothing that really worried me",
                signals: { consistency_low: 1, follow_through_low: 1 },
                weight: 1,
              },
              {
                id: "fac-a3-some",
                label: "A few times — I've noticed and it's made me wonder",
                signals: { consistency_low: 2, follow_through_low: 2, future_promises_high: 1 },
                weight: 1.5,
              },
              {
                id: "fac-a3-pattern",
                label: "Yeah — there's a pattern of saying the right thing but not following through",
                signals: { consistency_low: 3, follow_through_low: 3, future_promises_high: 2, trust_instability: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Some Gaps ──────────────────────────────────
        "some-gaps": [
          {
            id: "fac-sg1",
            kind: "branch",
            type: "single-choice",
            text: "What's the biggest area where you don't quite see eye to eye?",
            branchId: "some-gaps",
            sortOrder: 1,
            options: [
              {
                id: "fac-sg1-timing",
                label: "Timing — one of us is ready for the next step, the other isn't",
                signals: { future_ambiguity: 2, mixed_signals_high: 1 },
                weight: 1.2,
              },
              {
                id: "fac-sg1-lifestyle",
                label: "Lifestyle — city vs. country, career ambitions, how we want to live",
                signals: { future_ambiguity: 2, clarity_low: 1 },
                weight: 1.2,
              },
              {
                id: "fac-sg1-values",
                label: "Values — we differ on something that feels important (family, money, etc.)",
                signals: { future_ambiguity: 2, clarity_low: 2, mixed_signals_high: 1 },
                weight: 1.5,
              },
              {
                id: "fac-sg1-commitment",
                label: "Commitment level — we're not on the same page about how serious this is",
                signals: { future_ambiguity: 3, clarity_low: 2, mixed_signals_high: 2, trust_instability: 1 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "fac-sg2",
            kind: "branch",
            type: "single-choice",
            text: "When you bring up these differences, how does the conversation usually go?",
            branchId: "some-gaps",
            sortOrder: 2,
            options: [
              {
                id: "fac-sg2-open",
                label: "Open and productive — we actually talk through it",
                signals: { repair_potential_high: 2, clarity_low: -1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-sg2-avoid",
                label: "We kind of avoid it — it's an uncomfortable topic",
                signals: { clarity_low: 2, consistency_low: 1, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "fac-sg2-dismiss",
                label: "They brush it off like it's not a big deal",
                signals: { clarity_low: 2, emotional_availability_low: 1, effort_imbalance: 1 },
                weight: 1.5,
              },
              {
                id: "fac-sg2-argue",
                label: "It turns into an argument — we can never seem to get on the same page",
                signals: { trust_instability: 2, consistency_low: 2, clarity_low: 2 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "fac-sg3",
            kind: "branch",
            type: "single-choice",
            text: "Do you feel like these gaps are things you can work through together?",
            subtitle: "Gaps don't have to be dealbreakers — it depends on willingness.",
            branchId: "some-gaps",
            sortOrder: 3,
            options: [
              {
                id: "fac-sg3-confident",
                label: "Confident — we're both willing to figure it out",
                signals: { repair_potential_high: 2, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-sg3-hopeful",
                label: "Hopeful, but I'm not sure how",
                signals: { repair_potential_high: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-sg3-worried",
                label: "Worried — I want to but I don't think they see it the same way",
                signals: { effort_imbalance: 2, future_ambiguity: 2, mixed_signals_high: 1 },
                weight: 1.5,
              },
              {
                id: "fac-sg3-doubtful",
                label: "Doubtful — it feels like we're fundamentally different on this",
                signals: { future_ambiguity: 3, clarity_low: 2, trust_instability: 2 },
                weight: 1.8,
              },
            ],
          },
        ],

        // ── Branch: Uncertain ──────────────────────────────────
        uncertain: [
          {
            id: "fac-uc1",
            kind: "branch",
            type: "single-choice",
            text: "Why do you think you two haven't had a deeper conversation about the future?",
            branchId: "uncertain",
            sortOrder: 1,
            options: [
              {
                id: "fac-uc1-early",
                label: "It's still early — it hasn't felt like the right time yet",
                signals: { future_ambiguity: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-uc1-scared",
                label: "I've been scared to bring it up — I don't want to hear something I don't like",
                signals: { future_ambiguity: 2, clarity_low: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "fac-uc1-them",
                label: "They seem to avoid it when I try",
                signals: { future_ambiguity: 2, clarity_low: 2, consistency_low: 1, effort_imbalance: 1 },
                weight: 1.5,
              },
              {
                id: "fac-uc1-both",
                label: "We both kind of dodge it — like we're afraid of what we might find out",
                signals: { future_ambiguity: 3, clarity_low: 3, mixed_signals_high: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "fac-uc2",
            kind: "branch",
            type: "single-choice",
            text: "When the topic of the future does come up casually (movies, weddings, etc.), how do they react?",
            branchId: "uncertain",
            sortOrder: 2,
            options: [
              {
                id: "fac-uc2-open",
                label: "Openly — they're comfortable with the conversation",
                signals: { future_ambiguity: -1, clarity_low: -1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-uc2-joke",
                label: "They joke about it or keep it light",
                signals: { future_ambiguity: 1, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-uc2-shut",
                label: "They shut it down or pivot quickly",
                signals: { future_ambiguity: 2, clarity_low: 2, consistency_low: 1 },
                weight: 1.5,
              },
              {
                id: "fac-uc2-uncomfortable",
                label: "They get visibly uncomfortable — body language says a lot",
                signals: { future_ambiguity: 3, clarity_low: 2, emotional_availability_low: 1 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "fac-uc3",
            kind: "branch",
            type: "single-choice",
            text: "If you had to guess, what does their hesitation about the future say to you?",
            subtitle: "Your interpretation matters — even if you're not sure it's accurate.",
            branchId: "uncertain",
            sortOrder: 3,
            options: [
              {
                id: "fac-uc3-genuine",
                label: "They genuinely just need more time — and that's okay",
                signals: { future_ambiguity: 1, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-uc3-dont-know",
                label: "They honestly don't know what they want yet",
                signals: { future_ambiguity: 2, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-uc3-not-with-me",
                label: "I worry they know, but it might not be with me",
                signals: { future_ambiguity: 2, trust_instability: 2, mixed_signals_high: 2, clarity_low: 1 },
                weight: 1.8,
              },
              {
                id: "fac-uc3-keeping-options",
                label: "I think they're keeping their options open",
                signals: { future_ambiguity: 3, trust_instability: 3, mixed_signals_high: 2, effort_imbalance: 1 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Misaligned ─────────────────────────────────
        misaligned: [
          {
            id: "fac-m1",
            kind: "branch",
            type: "single-choice",
            text: "When you realized you were misaligned, what was your first reaction?",
            branchId: "misaligned",
            sortOrder: 1,
            options: [
              {
                id: "fac-m1-accept",
                label: "I accepted it as a difference we could work through",
                signals: { repair_potential_high: 2, trust_instability: -1 },
                weight: 0.5,
              },
              {
                id: "fac-m1-shock",
                label: "Shock — I honestly didn't see it coming",
                signals: { mixed_signals_high: 2, clarity_low: 2, trust_instability: 1 },
                weight: 1.5,
              },
              {
                id: "fac-m1-sad",
                label: "Sadness — because I really wanted this to work",
                signals: { future_ambiguity: 2, trust_instability: 1, clarity_low: 1 },
                weight: 1.2,
              },
              {
                id: "fac-m1-denial",
                label: "I tried to convince myself it wasn't that big a deal",
                signals: { clarity_low: 2, future_ambiguity: 2, mixed_signals_high: 1, consistency_low: 1 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "fac-m2",
            kind: "branch",
            type: "single-choice",
            text: "Has the misalignment gotten clearer over time, or has it stayed fuzzy?",
            branchId: "misaligned",
            sortOrder: 2,
            options: [
              {
                id: "fac-m2-clearer",
                label: "Clearer — the gap has become more obvious",
                signals: { future_ambiguity: 2, clarity_low: 1, mixed_signals_high: 1 },
                weight: 1.2,
              },
              {
                id: "fac-m2-stayed",
                label: "Stayed about the same — neither better nor worse",
                signals: { consistency_low: 1, future_ambiguity: 1 },
                weight: 1,
              },
              {
                id: "fac-m2-fuzzier",
                label: "Fuzzier — sometimes it feels fine, other times it feels really off",
                signals: { mixed_signals_high: 3, consistency_low: 2, future_ambiguity: 2 },
                weight: 1.8,
              },
              {
                id: "fac-m2-denial-more",
                label: "I've stopped thinking about it — it's easier not to",
                signals: { clarity_low: 3, consistency_low: 2, future_ambiguity: 2 },
                weight: 2,
              },
            ],
          },
          {
            id: "fac-m3",
            kind: "branch",
            type: "single-choice",
            text: "If nothing changes, how do you see this playing out in a year?",
            subtitle: "This is a tough question — but your honest answer matters.",
            branchId: "misaligned",
            sortOrder: 3,
            options: [
              {
                id: "fac-m3-will-figure",
                label: "I think we'll figure it out — we're both willing",
                signals: { repair_potential_high: 2, trust_instability: -1, future_ambiguity: -1 },
                weight: 0.5,
              },
              {
                id: "fac-m3-hope",
                label: "I hope things align, but I'm not sure they will",
                signals: { future_ambiguity: 2, clarity_low: 1 },
                weight: 1,
              },
              {
                id: "fac-m3-resigned",
                label: "I feel resigned — like I'll have to compromise more than I want to",
                signals: { effort_imbalance: 2, future_ambiguity: 2, clarity_low: 2 },
                weight: 1.5,
              },
              {
                id: "fac-m3-wont-work",
                label: "Honestly? I don't think it'll work if this stays the same",
                signals: { future_ambiguity: 3, clarity_low: 2, trust_instability: 2 },
                weight: 1.8,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "fac-uni1",
          kind: "universal",
          type: "single-choice",
          text: "When you think about your future, how much does this person's vision overlap with yours?",
          sortOrder: 10,
          options: [
            {
              id: "fac-uni1-a-lot",
              label: "A lot — we're heading in the same direction",
              signals: { future_ambiguity: -1, clarity_low: -1 },
              weight: 0.5,
            },
            {
              id: "fac-uni1-some",
              label: "Some — there's overlap but also some divergence",
              signals: { future_ambiguity: 1, mixed_signals_high: 1 },
              weight: 1,
            },
            {
              id: "fac-uni1-not-sure",
              label: "I'm not sure — I don't fully know what their vision is",
              signals: { future_ambiguity: 2, clarity_low: 2 },
              weight: 1.5,
            },
            {
              id: "fac-uni1-very-little",
              label: "Very little — our futures feel like they're on different tracks",
              signals: { future_ambiguity: 3, clarity_low: 2, mixed_signals_high: 2 },
              weight: 1.8,
            },
          ],
        },
        {
          id: "fac-uni2",
          kind: "universal",
          type: "scale",
          text: "How much does the uncertainty (or alignment) about the future affect your day-to-day happiness?",
          subtitle: "1 = it barely crosses my mind, 5 = it's on my mind constantly",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Barely crosses my mind",
          maxLabel: "Constantly on my mind",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "fac-final",
        kind: "final",
        type: "open-ended",
        text: "If you could fast-forward 5 years and see how this turns out, what would you want the answer to be?",
        subtitle:
          "Optional — but sometimes the future we secretly hope for tells us a lot about the present.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },

  // ════════════════════════════════════════════════════════════════
  // 9. Flirty Reply Coach  (active — play mode)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "flirty-reply-coach",
    name: "Flirty Reply Coach",
    tagline: "Decode the vibe, craft the reply, own the conversation.",
    description:
      "Staring at a message trying to figure out what to say? This playful tool helps you read the energy, understand the subtext, and respond in a way that matches the vibe you want — whether that's flirty, mysterious, warm, or casually confident. No overthinking required.",
    mode: "play",
    version: "1.0.0",
    icon: "Sparkles",
    color: "pink",
    estimatedQuestions: "5–7",
    estimatedTime: "2–3 min",
    category: "Communication",
    featured: false,
    comingSoon: false,
    questionTree: {
      // ── Routing Question ─────────────────────────────────────
      routingQuestion: {
        id: "frc-routing",
        kind: "routing",
        type: "single-choice",
        text: "What's the vibe of the conversation?",
        subtitle:
          "Go with your gut — you know the energy better than anyone.",
        options: [
          {
            id: "frc-r-flirty",
            label: "Definitely flirty — the energy is building",
            description:
              "Playful banter, teasing, maybe some boldness. You're feeling it.",
            signals: { enthusiasm_mismatch: -1 },
            weight: 1,
            branchRef: "flirty",
          },
          {
            id: "frc-r-testing",
            label: "Testing the waters — not sure if they're flirting or just being friendly",
            description:
              "There's something there but you can't quite read it yet.",
            signals: { mixed_signals_high: 1, enthusiasm_mismatch: 1 },
            weight: 1,
            branchRef: "testing-waters",
          },
          {
            id: "frc-r-after-date",
            label: "After a date — the first (or latest) one just happened",
            description:
              "You had a great time and now you're in the post-date texting phase.",
            signals: { enthusiasm_mismatch: 1 },
            weight: 1,
            branchRef: "after-date",
          },
          {
            id: "frc-r-spark",
            label: "Keeping the spark alive — we've been talking for a while",
            description:
              "Things are good but you want to keep the energy fresh and fun.",
            signals: { consistency_low: 1 },
            weight: 1,
            branchRef: "keeping-spark",
          },
        ],
        required: true,
        sortOrder: 0,
      },

      // ── Adaptive Branches ─────────────────────────────────────
      branches: {
        // ── Branch: Flirty ─────────────────────────────────────
        flirty: [
          {
            id: "frc-f1",
            kind: "branch",
            type: "single-choice",
            text: "What did they say that made you pause and think 'okay, what do I do with this?'",
            subtitle: "The message that got you here — what was the energy?",
            branchId: "flirty",
            sortOrder: 1,
            options: [
              {
                id: "frc-f1-bold",
                label: "Something bold and direct — they made their interest clear",
                signals: { enthusiasm_mismatch: -1, dry_texting: -1 },
                weight: 0.5,
              },
              {
                id: "frc-f1-tease",
                label: "Something teasing — they're poking at you in a fun way",
                signals: { enthusiasm_mismatch: -1 },
                weight: 0.5,
              },
              {
                id: "frc-f1-sweet",
                label: "Something sweet but slightly ambiguous — you can't tell how serious they are",
                signals: { mixed_signals_high: 2, enthusiasm_mismatch: 1 },
                weight: 1.2,
              },
              {
                id: "frc-f1-mixed",
                label: "Something that felt like a mix — flirty one minute, distant the next",
                signals: { mixed_signals_high: 3, consistency_low: 2, dry_texting: 1 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "frc-f2",
            kind: "branch",
            type: "single-choice",
            text: "What vibe do you want to send back?",
            subtitle: "No wrong answer — just what feels right for you right now.",
            branchId: "flirty",
            sortOrder: 2,
            options: [
              {
                id: "frc-f2-match",
                label: "Match their energy — meet them where they're at",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "frc-f2-playful",
                label: "Playful and a little mysterious — keep them guessing",
                signals: { enthusiasm_mismatch: 1 },
                weight: 1,
              },
              {
                id: "frc-f2-sweet",
                label: "Warm and genuine — let them know I'm feeling it too",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "frc-f2-pressured",
                label: "Honestly? I feel pressured to respond a certain way",
                signals: { pressure_signal: 2, dry_texting: 1, enthusiasm_mismatch: 2 },
                weight: 2,
              },
            ],
          },
        ],

        // ── Branch: Testing Waters ─────────────────────────────
        "testing-waters": [
          {
            id: "frc-tw1",
            kind: "branch",
            type: "single-choice",
            text: "What's making it hard to tell if they're flirting or just being friendly?",
            branchId: "testing-waters",
            sortOrder: 1,
            options: [
              {
                id: "frc-tw1-naturally-friendly",
                label: "They're naturally friendly — so everything feels like it could go either way",
                signals: { mixed_signals_high: 2, enthusiasm_mismatch: 1 },
                weight: 1.2,
              },
              {
                id: "frc-tw1-hot-cold",
                label: "They're hot and cold — interested one minute, pulling back the next",
                signals: { mixed_signals_high: 3, consistency_low: 2 },
                weight: 1.5,
              },
              {
                id: "frc-tw1-subtle",
                label: "It's subtle — small signs that could mean something or nothing",
                signals: { mixed_signals_high: 2, clarity_low: 1 },
                weight: 1.2,
              },
              {
                id: "frc-tw1-my-head",
                label: "It might just be in my head — I tend to overthink these things",
                signals: { mixed_signals_high: 1, trust_instability: 1, dry_texting: 1 },
                weight: 1,
              },
            ],
          },
          {
            id: "frc-tw2",
            kind: "branch",
            type: "single-choice",
            text: "If you had to guess the worst-case scenario for sending a flirty reply, what would it be?",
            subtitle: "Sometimes knowing the fear helps you move past it.",
            branchId: "testing-waters",
            sortOrder: 2,
            options: [
              {
                id: "frc-tw2-nothing-bad",
                label: "Honestly, nothing that bad — they'd probably be into it",
                signals: { enthusiasm_mismatch: -1, pressure_signal: -1 },
                weight: 0.5,
              },
              {
                id: "frc-tw2-awkward",
                label: "It'd be a little awkward — but survivable",
                signals: { enthusiasm_mismatch: 1 },
                weight: 1,
              },
              {
                id: "frc-tw2-friend-zone",
                label: "They'd friend-zone me even harder",
                signals: { enthusiasm_mismatch: 2, mixed_signals_high: 1 },
                weight: 1.2,
              },
              {
                id: "frc-tw2-ruin-it",
                label: "I'd ruin whatever we have going right now",
                signals: { pressure_signal: 2, enthusiasm_mismatch: 2, trust_instability: 2 },
                weight: 1.8,
              },
            ],
          },
        ],

        // ── Branch: After Date ─────────────────────────────────
        "after-date": [
          {
            id: "frc-ad1",
            kind: "branch",
            type: "single-choice",
            text: "How did the date actually go — the real version, not the one you'd tell your friends?",
            branchId: "after-date",
            sortOrder: 1,
            options: [
              {
                id: "frc-ad1-great",
                label: "Really great — genuine connection, good vibes, definitely want to see them again",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1, dry_texting: -1 },
                weight: 0.5,
              },
              {
                id: "frc-ad1-good",
                label: "Good — fun but I'm not 100% sure if there was romantic chemistry",
                signals: { enthusiasm_mismatch: 1, mixed_signals_high: 1 },
                weight: 1,
              },
              {
                id: "frc-ad1-mixed",
                label: "Mixed — some moments were amazing, others were a little off",
                signals: { mixed_signals_high: 2, consistency_low: 1 },
                weight: 1.2,
              },
              {
                id: "frc-ad1-meh",
                label: "Honestly? Not as great as I hoped — but I don't want to write them off yet",
                signals: { enthusiasm_mismatch: 2, dry_texting: 1, consistency_low: 1 },
                weight: 1.5,
              },
            ],
          },
          {
            id: "frc-ad2",
            kind: "branch",
            type: "single-choice",
            text: "What's the message you're trying to craft right now — in one sentence?",
            subtitle: "Just the vibe, not the exact words.",
            branchId: "after-date",
            sortOrder: 2,
            options: [
              {
                id: "frc-ad2-had-fun",
                label: "I had a great time — let's do this again",
                signals: { enthusiasm_mismatch: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "frc-ad2-thank-you",
                label: "Thank you for a lovely evening — warm and sweet",
                signals: { enthusiasm_mismatch: 1 },
                weight: 1,
              },
              {
                id: "frc-ad2-throw-ball",
                label: "Something casual that throws the ball back in their court",
                signals: { enthusiasm_mismatch: 1, mixed_signals_high: 1 },
                weight: 1.2,
              },
              {
                id: "frc-ad2-dont-know",
                label: "I genuinely don't know — that's why I'm here",
                signals: { enthusiasm_mismatch: 2, mixed_signals_high: 1, dry_texting: 1 },
                weight: 1.5,
              },
            ],
          },
        ],

        // ── Branch: Keeping Spark ──────────────────────────────
        "keeping-spark": [
          {
            id: "frc-ks1",
            kind: "branch",
            type: "single-choice",
            text: "What does your typical texting rhythm look like these days?",
            branchId: "keeping-spark",
            sortOrder: 1,
            options: [
              {
                id: "frc-ks1-good",
                label: "Good — we text regularly and it still feels fun",
                signals: { consistency_low: -1, dry_texting: -1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "frc-ks1-routine",
                label: "A bit routine — good morning, good night, how was your day",
                signals: { dry_texting: 2, consistency_low: 1 },
                weight: 1.2,
              },
              {
                id: "frc-ks1-slipping",
                label: "It's slipping — less effort, shorter replies, less excitement",
                signals: { dry_texting: 3, consistency_low: 2, enthusiasm_mismatch: 2 },
                weight: 1.8,
              },
              {
                id: "frc-ks1-one-sided",
                label: "One-sided — I feel like I'm carrying the conversation lately",
                signals: { effort_imbalance: 2, dry_texting: 2, enthusiasm_mismatch: 2 },
                weight: 1.8,
              },
            ],
          },
          {
            id: "frc-ks2",
            kind: "branch",
            type: "single-choice",
            text: "What would make texting feel exciting again?",
            subtitle: "The thing you're craving but maybe haven't asked for.",
            branchId: "keeping-spark",
            sortOrder: 2,
            options: [
              {
                id: "frc-ks2-more-flirty",
                label: "More playfulness and flirtation — I miss the banter",
                signals: { dry_texting: 1, repair_potential_high: 1 },
                weight: 0.5,
              },
              {
                id: "frc-ks2-more-deep",
                label: "More depth — I want real conversations, not just updates",
                signals: { dry_texting: 2, enthusiasm_mismatch: 1 },
                weight: 1,
              },
              {
                id: "frc-ks2-more-initiation",
                label: "More initiation from them — I want to feel pursued again",
                signals: { effort_imbalance: 2, dry_texting: 1, enthusiasm_mismatch: 2 },
                weight: 1.5,
              },
              {
                id: "frc-ks2-not-sure",
                label: "I'm not sure — the spark just feels faded and I don't know how to get it back",
                signals: { dry_texting: 2, consistency_low: 2, mixed_signals_high: 2 },
                weight: 1.8,
              },
            ],
          },
        ],
      },

      // ── Universal Questions (asked in every branch) ──────────
      universalQuestions: [
        {
          id: "frc-uni1",
          kind: "universal",
          type: "single-choice",
          text: "Right now, what's your biggest worry about how you'll come across?",
          sortOrder: 10,
          options: [
            {
              id: "frc-uni1-too-eager",
              label: "Too eager or desperate",
              signals: { pressure_signal: 1, enthusiasm_mismatch: 1 },
              weight: 1,
            },
            {
              id: "frc-uni1-too-cold",
              label: "Too cold or uninterested",
              signals: { enthusiasm_mismatch: 1, dry_texting: 1 },
              weight: 1,
            },
            {
              id: "frc-uni1-try-hard",
              label: "Like I'm trying too hard to be clever",
              signals: { pressure_signal: 1, mixed_signals_high: 1 },
              weight: 1,
            },
            {
              id: "frc-uni1-nothing",
              label: "Honestly, nothing — I'm just vibing and going with it",
              signals: { pressure_signal: -1, enthusiasm_mismatch: -1, repair_potential_high: 1 },
              weight: 0.5,
            },
          ],
        },
        {
          id: "frc-uni2",
          kind: "universal",
          type: "scale",
          text: "How much are you enjoying the texting dynamic right now?",
          subtitle: "1 = it's stressing me out, 5 = I'm genuinely having fun",
          sortOrder: 11,
          min: 1,
          max: 5,
          step: 1,
          minLabel: "Stressing me out",
          maxLabel: "Genuinely having fun",
          options: [], // scale uses value
        },
      ],

      // ── Optional Final Question ──────────────────────────────
      finalQuestion: {
        id: "frc-final",
        kind: "final",
        type: "open-ended",
        text: "What's the exact message you're trying to reply to? (You can paste it here if you want.)",
        subtitle:
          "Totally optional — but if you share it, we'll give you a vibe read and some reply ideas.",
        sortOrder: 20,
        options: [],
        required: false,
      },
    },
  },
];
