"use client";

import { useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Homepage } from "@/components/lovecheck/homepage";
import { ToolIntro } from "@/components/lovecheck/tool-intro";
import { ToolFlow } from "@/components/lovecheck/tool-flow";
import { ResultPage, ResultLoading } from "@/components/lovecheck/result-page";
import { useLoveCheckStore } from "@/lib/store";
import { loadTool } from "@/lib/engine";
import type { ToolSlug, FinalResult } from "@/types";

export default function Home() {
  const {
    view,
    activeTool,
    answers,
    finalResult,
    isLoading,
    startToolIntro,
    beginToolFlow,
    setView,
    setIsLoading,
    setFinalResult,
    resetSession,
  } = useLoveCheckStore();

  // Handle starting a tool (navigate to intro)
  const handleStartTool = useCallback(
    (slug: ToolSlug) => {
      try {
        const tool = loadTool(slug);
        if (tool.comingSoon) return;
        startToolIntro(slug);
      } catch {
        // Tool not found
      }
    },
    [startToolIntro]
  );

  // Handle beginning the tool flow
  const handleBeginFlow = useCallback(() => {
    beginToolFlow();
  }, [beginToolFlow]);

  // Handle finishing the tool flow — submit to API
  const handleFinishFlow = useCallback(async () => {
    const currentTool = activeTool;
    const currentAnswers = answers;
    if (!currentTool) return;

    setIsLoading(true);
    setView("results");

    try {
      const payload = {
        toolSlug: currentTool,
        sessionId: crypto.randomUUID(),
        answers: currentAnswers,
        timestamp: new Date().toISOString(),
      };

      const res = await fetch("/api/run-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setFinalResult(data.data as FinalResult);
      } else {
        setFinalResult(null);
      }
    } catch {
      setFinalResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTool, answers, setIsLoading, setView, setFinalResult]);

  // Get tool config for intro
  const toolConfig = activeTool ? (() => {
    try {
      return loadTool(activeTool);
    } catch {
      return null;
    }
  })() : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onGoHome={resetSession} />

      <main className="flex-1">
        {view === "home" && <Homepage onStartTool={handleStartTool} />}

        {view === "tool-intro" && toolConfig && (
          <ToolIntro
            tool={toolConfig}
            onStart={handleBeginFlow}
            onBack={resetSession}
          />
        )}

        {view === "tool-flow" && activeTool && (
          <ToolFlow toolSlug={activeTool} onFinish={handleFinishFlow} />
        )}

        {view === "results" && (
          <>
            {isLoading && <ResultLoading />}
            {!isLoading && finalResult && <ResultPage result={finalResult} />}
            {!isLoading && !finalResult && (
              <div className="mx-auto max-w-lg px-4 py-16 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Something went wrong while processing your results.
                </p>
                <button
                  onClick={resetSession}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Go back home
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
