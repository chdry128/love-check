// ============================================================
// LoveCheck — Analytics Abstraction Layer
// ============================================================

// Lightweight analytics abstraction — logs to console in development,
// ready to be connected to any real analytics provider later.

import type { AnalyticsEventPayload, AnalyticsEvent } from "@/types";

type AnalyticsHandler = (payload: AnalyticsEventPayload) => void;

const handlers: AnalyticsHandler[] = [];

// Default console logger (dev only)
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  handlers.push((payload) => {
    console.log(`[LoveCheck Analytics] ${payload.event}`, payload);
  });
}

export function trackEvent(
  event: AnalyticsEvent,
  metadata?: Record<string, string | number | boolean>,
  toolSlug?: string,
  questionId?: string
): void {
  const payload: AnalyticsEventPayload = {
    event,
    toolSlug,
    questionId,
    metadata,
    timestamp: Date.now(),
  };
  handlers.forEach((handler) => handler(payload));
}

// Convenience methods
export const analytics = {
  toolViewed: (slug: string) => trackEvent("tool_viewed", undefined, slug),
  toolStarted: (slug: string) => trackEvent("tool_started", undefined, slug),
  questionAnswered: (slug: string, questionId: string) =>
    trackEvent("question_answered", undefined, slug, questionId),
  toolCompleted: (slug: string) =>
    trackEvent("tool_completed", undefined, slug),
  resultViewed: (slug: string) => trackEvent("result_viewed", undefined, slug),
  nextToolClicked: (from: string, to: string) =>
    trackEvent("next_tool_clicked", { from, to }, from),
  shareClicked: (slug: string, platform: string) =>
    trackEvent("share_clicked", { platform }, slug),
  copyClicked: (slug: string) => trackEvent("copy_clicked", undefined, slug),
  aiSuccess: (slug: string) => trackEvent("ai_success", undefined, slug),
  aiFallback: (slug: string) => trackEvent("ai_fallback", undefined, slug),
  blogViewed: (slug: string) => trackEvent("blog_viewed", undefined),
};
