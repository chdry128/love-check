import type { SEOMetadata } from "@/types";

// ── Homepage SEO ─────────────────────────────────────────────────

export const siteSEO: SEOMetadata = {
  title: "LoveCheck — See Your Relationship Patterns Clearly",
  description:
    "LoveCheck helps you understand your relationship patterns through honest, judgment-free self-reflection tools. Spot dynamics like hot–cold loops, effort imbalances, and boundary friction — and get warm, actionable guidance on what to watch, try, and do next.",
  keywords: [
    "relationship patterns",
    "relationship advice",
    "healthy relationships",
    "red flags",
    "attachment style",
    "communication patterns",
    "relationship self-reflection",
    "love compatibility",
    "dating advice",
    "relationship intelligence",
    "effort imbalance",
    "hot and cold relationship",
    "relationship clarity",
    "emotional boundaries",
  ],
};

// ── Per-Tool SEO ─────────────────────────────────────────────────

export const toolSEO: Record<string, SEOMetadata> = {
  "relationship-risk-radar": {
    title: "Relationship Risk Radar — LoveCheck",
    description:
      "Map your relationship patterns in 3–5 minutes. The Risk Radar identifies dynamics like hot–cold loops, overgiver patterns, and boundary friction, then offers warm, personalized guidance for your next steps.",
    keywords: [
      "relationship risk assessment",
      "relationship patterns quiz",
      "is my relationship healthy",
      "relationship red flags",
      "relationship dynamics checker",
      "love pattern analysis",
      "relationship reflection tool",
    ],
  },
  "attachment-style-lens": {
    title: "Attachment Style Lens — LoveCheck",
    description:
      "Discover your attachment style and understand how it shapes the way you love, connect, and respond to closeness. A gentle, insightful tool for deeper self-awareness in relationships.",
    keywords: [
      "attachment style quiz",
      "attachment styles in relationships",
      "anxious attachment",
      "avoidant attachment",
      "secure attachment",
      "attachment theory",
      "relationship attachment patterns",
    ],
  },
  "communication-pattern-check": {
    title: "Communication Pattern Check — LoveCheck",
    description:
      "Decode how you and your partner actually communicate — from expressing needs to handling disagreements. Identify habits that strengthen your connection and patterns that might be holding it back.",
    keywords: [
      "relationship communication",
      "communication patterns",
      "how to communicate in a relationship",
      "healthy communication",
      "conflict resolution in relationships",
      "relationship dialogue",
      "expressing needs",
    ],
  },
  "compatibility-compass": {
    title: "Compatibility Compass — LoveCheck",
    description:
      "Go beyond chemistry to see if your values, goals, and daily rhythms truly align. The Compatibility Compass checks what matters for the long haul — lifestyle, vision, and the practical building blocks of lasting love.",
    keywords: [
      "relationship compatibility",
      "compatibility test",
      "are we compatible",
      "relationship values alignment",
      "long-term relationship compatibility",
      "dating compatibility",
      "love compatibility checker",
    ],
  },
  "red-flag-scanner": {
    title: "Red Flag Scanner — LoveCheck",
    description:
      "A quiet, honest look at the warning signs you might be overlooking. Learn to tell the difference between normal relationship friction and genuine red flags — with clear, compassionate language and real guidance.",
    keywords: [
      "red flags in a relationship",
      "red flag checker",
      "dating red flags",
      "relationship warning signs",
      "toxic relationship signs",
      "relationship safety",
      "is this a red flag",
    ],
  },
};
