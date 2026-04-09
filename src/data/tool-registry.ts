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
  // 2. Attachment Style Lens  (coming soon)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "attachment-style-lens",
    name: "Attachment Style Lens",
    tagline: "Understand your emotional patterns — and how they shape love.",
    description:
      "We all have an attachment style that influences how we connect, communicate, and respond to closeness. This tool helps you identify yours with care, so you can build relationships that feel secure and fulfilling instead of confusing or exhausting.",
    mode: "insight",
    version: "0.1.0",
    icon: "Heart",
    color: "violet",
    estimatedQuestions: "10–12",
    estimatedTime: "5–8 min",
    category: "Self-Discovery",
    featured: false,
    comingSoon: true,
    questionTree: {
      routingQuestion: {
        id: "asl-routing",
        kind: "routing",
        type: "single-choice",
        text: "Coming soon — we're building this tool with care.",
        options: [
          {
            id: "asl-placeholder",
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
  // 3. Communication Pattern Check  (coming soon)
  // ════════════════════════════════════════════════════════════════
  {
    slug: "communication-pattern-check",
    name: "Communication Pattern Check",
    tagline: "Decode the way you and your partner actually talk.",
    description:
      "Communication is where most relationship challenges either get resolved or get worse. This tool maps your communication habits — how you express needs, handle disagreements, and listen (or don't) — so you can spot patterns that help or hurt your connection.",
    mode: "check",
    version: "0.1.0",
    icon: "MessagesSquare",
    color: "amber",
    estimatedQuestions: "8–10",
    estimatedTime: "4–6 min",
    category: "Communication",
    featured: false,
    comingSoon: true,
    questionTree: {
      routingQuestion: {
        id: "cpc-routing",
        kind: "routing",
        type: "single-choice",
        text: "Coming soon — we're building this tool with care.",
        options: [
          {
            id: "cpc-placeholder",
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
