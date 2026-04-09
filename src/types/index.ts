// ============================================================
// LoveCheck — Shared Type System
// ============================================================

// ── Tool Configuration ──────────────────────────────────────

export type ToolSlug =
  // Part 1 tools
  | "relationship-risk-radar"
  | "attachment-style-lens"
  | "communication-pattern-check"
  | "compatibility-compass"
  | "red-flag-scanner"
  // Part 2 tools
  | "texting-energy-match"
  | "love-bombing-detector"
  | "future-alignment-checker"
  | "flirty-reply-coach";

export type ToolMode = "insight" | "check" | "compare" | "deep-dive" | "play";

export interface ToolConfig {
  slug: ToolSlug;
  name: string;
  tagline: string;
  description: string;
  mode: ToolMode;
  version: string;
  icon: string; // lucide icon name
  color: string; // tailwind color key
  estimatedQuestions: string; // e.g. "5–8"
  estimatedTime: string; // e.g. "3–5 min"
  category: string;
  featured: boolean;
  comingSoon: boolean;
  questionTree: QuestionTree;
}

// ── Question System ─────────────────────────────────────────

export type QuestionKind =
  | "routing"      // determines adaptive branch
  | "branch"       // branch-specific question
  | "universal"    // always asked (cross-check)
  | "final";       // optional closing question

export type QuestionType =
  | "single-choice"
  | "multi-choice"
  | "scale"
  | "open-ended";

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  signals: SignalMap;     // signals emitted when selected
  weight?: number;        // multiplier 0.5–2.0
  branchRef?: string;     // which branch this routes to
}

export interface Question {
  id: string;
  kind: QuestionKind;
  type: QuestionType;
  text: string;
  subtitle?: string;
  options: QuestionOption[];
  required?: boolean;
  branchId?: string;      // null = universal or root
  sortOrder: number;
  min?: number;           // for scale type
  max?: number;           // for scale type
  step?: number;          // for scale type
  minLabel?: string;      // for scale type
  maxLabel?: string;      // for scale type
}

export interface QuestionTree {
  routingQuestion: Question;
  branches: Record<string, Question[]>;
  universalQuestions: Question[];
  finalQuestion?: Question;
}

// ── Signals & Patterns ──────────────────────────────────────

export type SignalKey =
  // Core signals (Part 1)
  | "clarity_low"
  | "consistency_low"
  | "effort_imbalance"
  | "future_ambiguity"
  | "emotional_availability_low"
  | "repair_potential_high"
  | "boundary_friction"
  | "mixed_signals_high"
  | "trust_instability"
  | "follow_through_low"
  // Part 2: Texting & Communication Dynamics
  | "fast_intensity"
  | "enthusiasm_mismatch"
  | "dry_texting"
  | "breadcrumbing_pattern"
  | "pressure_signal"
  | "future_promises_high";

export type SignalMap = Partial<Record<SignalKey, number>>;

export type PatternId =
  // Core patterns (Part 1)
  | "hot-cold-loop"
  | "overgiver-dynamic"
  | "low-clarity-connection"
  | "strong-chemistry-weak-structure"
  | "boundary-friction-pattern"
  | "repairable-but-uneven"
  | "stonewall-cycle"
  | "misaligned-expectations"
  | "communication-withdrawal"
  | "anxious-avoidant-trap"
  | "self-reliance-shield"
  // Part 2: Texting patterns
  | "balanced-texting-match"
  | "overgiver-texting-dynamic"
  | "high-interest-low-follow-through"
  | "warm-but-casual-energy"
  | "mixed-signal-thread"
  | "breadcrumbing-risk"
  // Part 2: Love Bombing patterns
  | "fast-intensity-risk"
  | "future-faking-signal"
  | "intense-but-unstable"
  | "pacing-pressure-pattern"
  // Part 2: Future Alignment patterns
  | "strong-alignment"
  | "good-chemistry-some-friction"
  | "uneven-long-term-alignment"
  | "high-attraction-low-structural-fit"
  | "future-mismatch";

export type RiskLevel = "low" | "moderate" | "elevated" | "high";

export type ConfidenceLevel = "low" | "moderate" | "fairly-high" | "high";

export interface PatternRule {
  id: PatternId;
  name: string;
  description: string;
  requiredSignals: SignalMap;       // minimum thresholds
  optionalSignals?: SignalMap;      // bonus signals that strengthen
  riskLevel: RiskLevel;
  weight: number;                   // 1–10, for conflict resolution
  summaryTemplate: string;
  strengthsTemplate?: string;
  risksTemplate: string;
  watchNextTemplate: string;
  tryNextTemplate: string;
  safeSuggestion?: string;
}

// ── Answers & Engine ────────────────────────────────────────

export interface AnswerPayload {
  toolSlug: ToolSlug;
  sessionId: string;
  answers: Array<{
    questionId: string;
    optionId: string | string[];  // single or multi
    value?: number;               // for scale
  }>;
  timestamp: string;
}

export interface EngineResult {
  toolSlug: ToolSlug;
  signals: SignalMap;
  matchedPatterns: Array<{
    patternId: PatternId;
    score: number;
    confidence: ConfidenceLevel;
  }>;
  dominantPattern: {
    id: PatternId;
    name: string;
    riskLevel: RiskLevel;
    confidence: ConfidenceLevel;
  } | null;
  strengths: string[];
  risks: string[];
  watchNext: string[];
  tryNext: string[];
  safeSuggestion: string | null;
  recommendedTools: RecommendedTool[];
  timestamp: string;
}

export interface FinalResult extends EngineResult {
  summary: string;
  personalizedExplanation: string;
  aiEnhanced: boolean;
  aiInsights?: string;
}

// ── AI Layer ────────────────────────────────────────────────

export interface AIPayload {
  toolSlug: ToolSlug;
  signals: SignalMap;
  dominantPattern: EngineResult["dominantPattern"];
  strengths: string[];
  risks: string[];
  userAnswers: AnswerPayload["answers"];
  tone: "warm" | "neutral" | "cautious" | "playful";
  maxLength: number;
}

export interface AIOutput {
  personalizedExplanation: string;
  enhancedSummary?: string;
  additionalInsights?: string;
}

export interface SafetyDecision {
  passed: boolean;
  flags: string[];
  sanitizedFields: string[];
  warningMessage: string | null;
}

export interface RecommendedTool {
  slug: ToolSlug;
  reason: string;
  relevance: number; // 0–1
}

// ── Risk & Confidence Evaluator ─────────────────────────────

export interface RiskRule {
  signal: SignalKey;
  thresholds: {
    low: number;
    moderate: number;
    elevated: number;
    high: number;
  };
}

export interface ConfidenceRule {
  minAnswers: number;
  signalOverlap: number;     // how many signals needed for confidence
  patternStrength: number;   // minimum pattern score
}

// ── Tool Registry (for homepage) ───────────────────────────

export interface ToolCard {
  slug: ToolSlug;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  featured: boolean;
  comingSoon: boolean;
  estimatedTime: string;
}

// ── SEO ─────────────────────────────────────────────────────

export interface SEOMetadata {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  keywords: string[];
}

// ── Analytics ──────────────────────────────────────────────

export type AnalyticsEvent =
  | "tool_viewed"
  | "tool_started"
  | "question_answered"
  | "tool_completed"
  | "result_viewed"
  | "next_tool_clicked"
  | "share_clicked"
  | "copy_clicked"
  | "ai_success"
  | "ai_fallback"
  | "blog_viewed";

export interface AnalyticsEventPayload {
  event: AnalyticsEvent;
  toolSlug?: ToolSlug;
  questionId?: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: number;
}

// ── Blog ───────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  relatedTools: ToolSlug[];
  publishedAt: string;
  readTime: string;
  seo: SEOMetadata;
}
