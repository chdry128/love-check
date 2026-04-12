export type HubCategory = {
  slug: "tools" | "quizzes" | "relationship-tests" | "texting-tools" | "red-flags" | "green-flags" | "compatibility" | "blog";
  title: string;
  description: string;
  h1: string;
  intro: string;
  toolSlugs?: string[];
};

export const categories: HubCategory[] = [
  {
    slug: "tools",
    title: "Relationship Tools Hub | LoveCheck",
    description: "Browse all free LoveCheck relationship tools, quizzes, checkers, and calculators.",
    h1: "Relationship Tools",
    intro: "Explore all LoveCheck tools built for relationship clarity, communication, compatibility, and dating decisions.",
  },
  {
    slug: "quizzes",
    title: "Relationship Quizzes | LoveCheck",
    description: "Take free relationship quizzes for attachment style, love language, and dating clarity.",
    h1: "Relationship Quizzes",
    intro: "Take quick relationship quizzes to understand your habits, attraction patterns, and communication style.",
  },
  {
    slug: "relationship-tests",
    title: "Relationship Tests | LoveCheck",
    description: "Free relationship tests for risk, emotional availability, situationships, and long-term fit.",
    h1: "Relationship Tests",
    intro: "Use practical relationship tests to evaluate trust, communication, and long-term stability.",
  },
  {
    slug: "texting-tools",
    title: "Texting Tools | LoveCheck",
    description: "Texting analyzers and flirty reply tools for crushes, dating, and relationship chats.",
    h1: "Texting Tools",
    intro: "Check texting compatibility, decode mixed signals, and generate better flirty replies.",
  },
  {
    slug: "red-flags",
    title: "Red Flag Tools | LoveCheck",
    description: "Use red flag checkers and toxic relationship tests to spot unhealthy dating patterns.",
    h1: "Red Flag Tools",
    intro: "Find early warning signs and protect your emotional wellbeing with practical red flag tools.",
  },
  {
    slug: "green-flags",
    title: "Green Flag Tools | LoveCheck",
    description: "Find healthy relationship signs with green flag checkers and compatibility tools.",
    h1: "Green Flag Tools",
    intro: "Identify strong relationship foundations and healthy behaviors that support long-term connection.",
  },
  {
    slug: "compatibility",
    title: "Compatibility Tests | LoveCheck",
    description: "Free compatibility tests for relationships, crushes, and future alignment.",
    h1: "Compatibility Tests",
    intro: "Measure emotional fit, value alignment, and long-term relationship compatibility.",
  },
  {
    slug: "blog",
    title: "Relationship Advice Blog | LoveCheck",
    description: "Read practical relationship advice on red flags, green flags, attachment styles, and texting signals.",
    h1: "LoveCheck Blog",
    intro: "Read practical, evidence-informed relationship articles with clear examples and action steps.",
  },
];
