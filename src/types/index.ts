// ============================================================
// LoveCheck — Shared Type System
// ============================================================

// ── Tool Configuration ──────────────────────────────────────

export type ToolSlug =
  | "relationship-risk-radar"
  | "attachment-style-lens"
  | "communication-pattern-check"
  | "compatibility-compass"
  | "red-flag-scanner";

export type ToolMode = "insight" | "check" | "compare" | "deep-dive";

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
  | "clarity_low"
  | "consistency_low"
  | "effort_imbalance"
  | "future_ambiguity"
  | "emotional_availability_low"
  | "repair_potential_high"
  | "boundary_friction"
  | "mixed_signals_high"
  | "trust_instability"
  | "follow_through_low";

export type SignalMap = Partial<Record<SignalKey, number>>;

export type PatternId =
  | "hot-cold-loop"
  | "overgiver-dynamic"
  | "low-clarity-connection"
  | "strong-chemistry-weak-structure"
  | "boundary-friction-pattern"
  | "repairable-but-uneven";

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
  tone: "warm" | "neutral" | "cautious";
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
