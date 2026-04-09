import { NextRequest, NextResponse } from "next/server";
import type { AnswerPayload, ToolSlug, FinalResult, EngineResult } from "@/types";
import { runEngine, buildAIPayload } from "@/lib/engine";
import { enhanceResult } from "@/lib/ai";
import { patternRules } from "@/data/patterns";

// ── Validation ──────────────────────────────────────────────

const VALID_SLUGS: ToolSlug[] = [
  "relationship-risk-radar",
  "attachment-style-lens",
  "communication-pattern-check",
  "compatibility-compass",
  "red-flag-scanner",
];

function isValidPayload(data: unknown): data is AnswerPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  if (typeof d.toolSlug !== "string" || !VALID_SLUGS.includes(d.toolSlug as ToolSlug)) {
    return false;
  }

  if (typeof d.sessionId !== "string" || d.sessionId.length === 0) {
    return false;
  }

  if (!Array.isArray(d.answers) || d.answers.length === 0) {
    return false;
  }

  for (const answer of d.answers) {
    const a = answer as Record<string, unknown>;
    if (typeof a.questionId !== "string") return false;
    if (typeof a.optionId !== "string" && !Array.isArray(a.optionId)) return false;
  }

  return true;
}

// ── POST Handler ────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate payload
    const body = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload. Required fields: toolSlug, sessionId, answers[].",
        },
        { status: 400 }
      );
    }

    const payload: AnswerPayload = {
      ...body,
      timestamp: body.timestamp ?? new Date().toISOString(),
    };

    // 2. Run deterministic engine
    const engineResult = runEngine(payload);

    // 3. Optionally enhance with AI (non-blocking, graceful fallback)
    let aiOutput = null;
    try {
      const aiPayload = buildAIPayload(engineResult, payload);
      aiOutput = await enhanceResult(aiPayload);
    } catch {
      // AI failure is non-critical — proceed with deterministic results
      aiOutput = null;
    }

    // 4. Build final result
    const finalResult: FinalResult = buildFinalResult(engineResult, aiOutput);

    // 5. Return final result
    return NextResponse.json({
      success: true,
      data: finalResult,
    });
  } catch (error) {
    console.error("[run-tool] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

// ── Result Builder ──────────────────────────────────────────

function buildFinalResult(engineResult: EngineResult, aiOutput: ReturnType<typeof enhanceResult> extends Promise<infer T> ? T : never): FinalResult {
  // Generate summary
  const summary = engineResult.dominantPattern
    ? patternRules.find((r) => r.id === engineResult.dominantPattern!.id)?.summaryTemplate ??
      "Your results have been analyzed. See the details below."
    : "Your results suggest a mix of dynamics at play. See the details below for your personalized insights.";

  // Generate personalized explanation
  const personalizedExplanation = aiOutput?.personalizedExplanation
    ?? generateDefaultExplanation(engineResult);

  return {
    ...engineResult,
    summary,
    personalizedExplanation,
    aiEnhanced: aiOutput !== null,
    aiInsights: aiOutput?.additionalInsights,
  };
}

function generateDefaultExplanation(result: EngineResult): string {
  const parts: string[] = [];

  if (result.dominantPattern) {
    parts.push(
      `The most prominent pattern we detected is "${result.dominantPattern.name}" with ${result.dominantPattern.confidence} confidence.`
    );
  }

  if (result.strengths.length > 0) {
    parts.push("There are meaningful strengths in your connection worth recognizing.");
  }

  if (result.risks.length > 0) {
    parts.push("Some areas may benefit from your attention and reflection.");
  }

  if (result.safeSuggestion) {
    parts.push(result.safeSuggestion);
  }

  return parts.join("\n\n");
}
