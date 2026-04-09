import { createLLM } from "z-ai-web-dev-sdk";
import type { AIPayload, AIOutput } from "@/types";
import { buildInsightPrompt } from "./prompts";

// ── Configuration ───────────────────────────────────────────

const AI_TIMEOUT_MS = 8_000; // 8-second hard timeout

// ── JSON extraction helper ──────────────────────────────────
// AI models sometimes wrap JSON in markdown fences or add preamble text.
// This robustly extracts the JSON object from any surrounding noise.

function extractJSON(raw: string): string | null {
  // Try to find a JSON object bounded by curly braces
  // Greedy scan: find the outermost { ... } block
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }

  const candidate = raw.slice(firstBrace, lastBrace + 1);

  // Quick sanity: try to parse it
  try {
    const parsed = JSON.parse(candidate);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return candidate;
    }
  } catch {
    // Not valid JSON — continue below
  }

  return null;
}

// ── Response parser ─────────────────────────────────────────

function parseAIResponse(raw: string): AIOutput | null {
  const jsonStr = extractJSON(raw);
  if (!jsonStr) return null;

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;

    const explanation = typeof parsed.personalizedExplanation === "string"
      ? parsed.personalizedExplanation.trim()
      : "";

    if (!explanation) return null;

    const output: AIOutput = {
      personalizedExplanation: explanation,
    };

    if (typeof parsed.enhancedSummary === "string" && parsed.enhancedSummary.trim()) {
      output.enhancedSummary = parsed.enhancedSummary.trim();
    }

    if (typeof parsed.additionalInsights === "string" && parsed.additionalInsights.trim()) {
      output.additionalInsights = parsed.additionalInsights.trim();
    }

    return output;
  } catch {
    return null;
  }
}

// ── Safety post-check ───────────────────────────────────────
// Ensures the AI output doesn't contain prohibited clinical language.

const FORBIDDEN_TERMS = [
  "diagnosis", "disorder", "toxic", "abusive", "narcissist",
  "gaslight", "trauma", "pathological", "clinical", "syndrome",
  "personality disorder", "bipolar", "borderline", "sociopath",
  "psychopath", "dsm-", "icd-",
];

function containsForbiddenTerms(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_TERMS.some((term) => lower.includes(term));
}

// ── Main entry point ────────────────────────────────────────

/**
 * Calls the AI to enhance a deterministic engine result with a personalized,
 * empathetic explanation.
 *
 * DESIGN PRINCIPLES:
 * - AI ONLY enhances — it never determines the result.
 * - If AI fails for ANY reason (timeout, parse error, safety flag), returns null.
 * - The engine's deterministic output is always used as the foundation.
 *
 * @param payload - The engine's processed signals, patterns, and context.
 * @returns AIOutput with personalized explanation, or null on any failure.
 */
export async function enhanceResult(
  payload: AIPayload
): Promise<AIOutput | null> {
  try {
    const { systemPrompt, userPrompt } = buildInsightPrompt(payload);

    // Create an AbortController for the timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

    let rawResponse: string;

    try {
      const llm = createLLM();
      rawResponse = await llm.chat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        maxTokens: 500,
      }, {
        signal: controller.signal as unknown as AbortSignal,
      });

      // Type-safe: ensure we have a string response
      if (typeof rawResponse !== "string" || !rawResponse.trim()) {
        return null;
      }
    } finally {
      clearTimeout(timeoutId);
    }

    // Parse the AI response
    const parsed = parseAIResponse(rawResponse);
    if (!parsed) return null;

    // Safety post-check: reject if forbidden clinical terms are present
    const allText = [
      parsed.personalizedExplanation,
      parsed.enhancedSummary,
      parsed.additionalInsights,
    ]
      .filter(Boolean)
      .join(" ");

    if (containsForbiddenTerms(allText)) {
      // Silently reject — fall back to deterministic results
      return null;
    }

    return parsed;
  } catch {
    // ANY error (timeout, network, SDK, parse, etc.) → null
    // The engine's deterministic output is always the safety net
    return null;
  }
}
