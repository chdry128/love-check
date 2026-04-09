"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { ToolConfig } from "@/types";

interface ToolIntroProps {
  tool: ToolConfig;
  onStart: () => void;
  onBack: () => void;
}

export function ToolIntro({ tool, onStart, onBack }: ToolIntroProps) {
  return (
    <div className="fade-in mx-auto max-w-lg px-4 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
          <div className="text-4xl">
            {tool.slug === "relationship-risk-radar" && "📡"}
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {tool.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            {tool.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {tool.estimatedTime}
          </span>
          <span>{tool.estimatedQuestions} questions</span>
          <span>Adaptive</span>
        </div>

        {/* What to expect */}
        <div className="rounded-xl border bg-muted/30 p-5 text-left space-y-3">
          <h3 className="text-sm font-semibold">What to expect</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              Start with a routing question that sets your path
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              Answer 4–6 follow-up questions (one at a time)
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              Get your personalized pattern analysis
            </li>
          </ul>
        </div>

        {/* Reminder */}
        <p className="text-xs text-muted-foreground/80 max-w-sm mx-auto">
          There are no right or wrong answers. This tool identifies patterns —
          not diagnoses. Your answers stay private in your browser.
        </p>

        {/* CTA */}
        <Button
          size="lg"
          className="gap-2 px-10 text-base rounded-xl h-12"
          onClick={onStart}
        >
          Begin
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
