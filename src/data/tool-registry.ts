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
];
