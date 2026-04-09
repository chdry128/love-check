import type { AIPayload, RiskLevel, SignalKey } from "@/types";

// ── Tone Mapping ────────────────────────────────────────────
// The prompt tone shifts based on the dominant pattern's risk level.

function riskToTone(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "warm, affirming, and lighthearted";
    case "moderate":
      return "warm and gently reflective";
    case "elevated":
      return "supportive and gently cautious";
    case "high":
      return "compassionate, grounding, and gently cautious";
  }
}

function riskToGuidance(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "Celebrate what's working. Offer an uplifting, encouraging take.";
    case "moderate":
      return "Validate their experience. Gently highlight areas to nurture without alarm.";
    case "elevated":
      return "Acknowledge that things may feel uncertain. Offer grounding language and concrete, small steps. Avoid being alarming.";
    case "high":
      return "Offer compassionate grounding. Focus on their agency and support options. Do NOT use dramatic language. Keep sentences short and calming.";
  }
}

// ── Human-readable signal summaries ─────────────────────────

const SIGNAL_LABELS: Record<SignalKey, string> = {
  clarity_low: "lack of clarity about where things stand",
  consistency_low: "inconsistent behavior or communication",
  effort_imbalance: "uneven effort or investment",
  future_ambiguity: "uncertainty about the future direction",
  emotional_availability_low: "limited emotional availability",
  repair_potential_high: "strong willingness to work through issues",
  boundary_friction: "friction around boundaries or personal space",
  mixed_signals_high: "mixed or confusing signals",
  trust_instability: "fluctuations in trust",
  follow_through_low: "difficulty following through on plans or promises",
};

function describeSignals(signals: Partial<Record<SignalKey, number>>): string {
  const entries = Object.entries(signals) as [SignalKey, number][];
  if (entries.length === 0) return "no strong signals detected";

  return entries
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => {
      const label = SIGNAL_LABELS[key] ?? key;
      const strength = value >= 3 ? "strong" : value >= 1.5 ? "moderate" : "subtle";
      return `- ${strength} ${label}`;
    })
    .join("\n");
}

// ── Build the prompt ────────────────────────────────────────

/**
 * Builds a system + user prompt for the AI to generate a personalized
 * relationship insight based on the engine's deterministic results.
 *
 * The AI is positioned as a **relationship pattern observer** —
 * explicitly NOT a therapist, counselor, or diagnostician.
 */
export function buildInsightPrompt(payload: AIPayload): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { signals, dominantPattern, strengths, risks, userAnswers } = payload;

  const risk = dominantPattern?.riskLevel ?? "moderate";
  const tone = riskToTone(risk);
  const guidance = riskToGuidance(risk);
  const patternName = dominantPattern?.name ?? "a developing dynamic";
  const patternId = dominantPattern?.id ?? "general";

  // Summarize user answer themes (extract option IDs for context)
  const answerThemes = userAnswers
    .slice(0, 8) // cap to avoid enormous prompts
    .map((a, i) => `Q${i + 1}: chose ${Array.isArray(a.optionId) ? a.optionId.join(", ") : a.optionId}`)
    .join("\n");

  // ── System prompt ──

  const systemPrompt = `You are a compassionate relationship pattern observer for LoveCheck, a self-reflection tool.

YOUR ROLE:
- You observe patterns in how people describe their relationship experiences.
- You offer warm, personalized perspectives — like a thoughtful friend who's good at noticing themes.
- You help people see their own situation more clearly.

WHAT YOU ARE NOT:
- You are NOT a therapist, counselor, psychologist, or mental health professional.
- You are NOT making a diagnosis or clinical assessment.
- You are NOT providing medical or psychological advice.

MANDATORY LANGUAGE RULES:
- Use phrases like "may suggest", "worth exploring", "this pattern might indicate", "some people in similar situations find"
- NEVER use: "diagnosis", "disorder", "toxic", "abusive", "narcissistic", "gaslighting", "trauma", "pathological", "clinical", "syndrome"
- NEVER label a person or a relationship with a clinical term
- NEVER give definitive medical or psychological advice

TONE: ${tone}.
${guidance}

OUTPUT FORMAT:
You MUST respond with a valid JSON object (and nothing else — no markdown, no backticks, no commentary) with these exact fields:
{
  "personalizedExplanation": "<2-4 sentences of personalized, warm explanation that references the specific pattern and signals>",
  "enhancedSummary": "<1 sentence that captures the overall situation in a relatable way>",
  "additionalInsights": "<1-2 sentences of gentle, optional insight or encouragement (may be null/empty if not applicable)>"
}`;

  // ── User prompt ──

  const userPrompt = `Here is the relationship reflection data to help you craft your personalized insight:

**Relationship Pattern Identified**: "${patternName}" (ID: ${patternId})
**Risk Level**: ${risk}

**Signals detected** (sorted by strength):
${describeSignals(signals)}

**Strengths observed**:
${strengths.length > 0 ? strengths.map(s => `- ${s}`).join("\n") : "- No specific strengths flagged by the engine"}

**Areas of attention**:
${risks.length > 0 ? risks.map(r => `- ${r}`).join("\n") : "- No specific risks flagged by the engine"}

**User's answer themes** (anonymized question responses):
${answerThemes || "(no answer themes available)"}

Please generate your JSON response now. Remember: warm tone, non-clinical language, focus on patterns and possibilities.`;

  return { systemPrompt, userPrompt };
}
