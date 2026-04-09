// AI Integration Layer — barrel exports
//
// The AI layer ONLY enhances deterministic engine results.
// If AI fails for any reason, the system gracefully falls back
// to the engine's built-in outputs. No AI dependency.

export { enhanceResult } from "./client";
export { buildInsightPrompt } from "./prompts";
