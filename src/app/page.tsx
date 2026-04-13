"use client";

import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Homepage } from "@/components/lovecheck/homepage";
import { ToolIntro } from "@/components/lovecheck/tool-intro";
import { ToolFlow } from "@/components/lovecheck/tool-flow";
import { ResultPage, ResultLoading } from "@/components/lovecheck/result-page";
import { BlogPage } from "@/components/lovecheck/blog-page";
import { BlogPostPage } from "@/components/lovecheck/blog-post-page";
import { PatternLibrary } from "@/components/lovecheck/pattern-library";
import { ScrollToTop } from "@/components/lovecheck/scroll-to-top";
import { RomanticCursor } from "@/components/lovecheck/romantic-cursor";
import { HistorySheet } from "@/components/lovecheck/history-sheet";
import { useLoveCheckStore } from "@/lib/store";
import { loadTool } from "@/lib/engine";
import { saveToHistory } from "@/lib/history";
import { analytics } from "@/lib/analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { motion, AnimatePresence } from "framer-motion";
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

  const [historyOpen, setHistoryOpen] = useState(false);
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (scrollProgressRef.current) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle starting a tool (navigate to intro)
  const handleStartTool = useCallback(
    (slug: ToolSlug) => {
      try {
        const tool = loadTool(slug);
        if (tool.comingSoon) return;
        analytics.toolViewed(slug);
        startToolIntro(slug);
      } catch {
        // Tool not found
      }
    },
    [startToolIntro]
  );

  // Handle beginning the tool flow
  const handleBeginFlow = useCallback(() => {
    analytics.toolStarted(activeTool ?? "unknown");
    beginToolFlow();
  }, [beginToolFlow, activeTool]);

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
        const result = data.data as FinalResult;
        setFinalResult(result);
        analytics.toolCompleted(currentTool);
        analytics.resultViewed(currentTool);
        if (result.aiEnhanced) {
          analytics.aiSuccess(currentTool);
        } else {
          analytics.aiFallback(currentTool);
        }
        // Save to localStorage history
        try {
          saveToHistory(result, currentTool);
        } catch {
          // History save is non-critical
        }
      } else {
        setFinalResult(null);
      }
    } catch {
      setFinalResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTool, answers, setIsLoading, setView, setFinalResult]);

  // Handle opening journal/blog
  const handleOpenJournal = useCallback(() => {
    setView("blog");
  }, [setView]);

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
      <JsonLd data={websiteSchema()} />
      <JsonLd data={organizationSchema()} />

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" aria-hidden="true">
        <div className="scroll-progress-bar" ref={scrollProgressRef} />
      </div>

      {/* Romantic Cursor Trail */}
      <RomanticCursor />
      <Header
        onGoHome={resetSession}
        onOpenJournal={handleOpenJournal}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenPatterns={() => setView("pattern-library")}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <Homepage onStartTool={handleStartTool} />

                  <section className="mx-auto max-w-4xl px-4 pb-10 pt-2 sm:px-6">
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">Explore LoveCheck</h2>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Link href="/tools" className="rounded-full border px-3 py-1.5 hover:bg-muted">Relationship Tools</Link>
                      <Link href="/quizzes" className="rounded-full border px-3 py-1.5 hover:bg-muted">Relationship Quizzes</Link>
                      <Link href="/relationship-tests" className="rounded-full border px-3 py-1.5 hover:bg-muted">Relationship Tests</Link>
                      <Link href="/texting-tools" className="rounded-full border px-3 py-1.5 hover:bg-muted">Texting Tools</Link>
                      <Link href="/red-flags" className="rounded-full border px-3 py-1.5 hover:bg-muted">Red Flag Checker Tools</Link>
                      <Link href="/green-flags" className="rounded-full border px-3 py-1.5 hover:bg-muted">Green Flag Tools</Link>
                      <Link href="/compatibility" className="rounded-full border px-3 py-1.5 hover:bg-muted">Compatibility Tests</Link>
                      <Link href="/blog" className="rounded-full border px-3 py-1.5 hover:bg-muted">Relationship Advice Blog</Link>
                      <Link href="/disclaimer" className="rounded-full border px-3 py-1.5 hover:bg-muted">Disclaimer</Link>
                    </div>
                  </section>

                  <div className="ad-banner">
                    <a href="https://www.profitablecpmratenetwork.com/u1giby0jw?key=470e1e7d6942888dff155b3a7b564cc7" target="_blank" rel="noopener noreferrer">
                      <img src="/path-to-ad-image.jpg" alt="Advertisement" />
                    </a>
                  </div>

            </motion.div>
          )}

          {view === "tool-intro" && toolConfig && (
            <motion.div
              key="tool-intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ToolIntro
                tool={toolConfig}
                onStart={handleBeginFlow}
                onBack={resetSession}
              />
            </motion.div>
          )}

          {view === "tool-flow" && activeTool && (
            <motion.div
              key="tool-flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ToolFlow toolSlug={activeTool} onFinish={handleFinishFlow} />
            </motion.div>
          )}

          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
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
            </motion.div>
          )}

          {view === "blog" && (
            <motion.div
              key="blog"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <BlogPage />
            </motion.div>
          )}

          {view === "blog-post" && (
            <motion.div
              key="blog-post"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <BlogPostPage />
            </motion.div>
          )}

          {view === "pattern-library" && (
            <motion.div
              key="pattern-library"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <PatternLibrary onStartTool={handleStartTool} onBack={resetSession} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onOpenJournal={handleOpenJournal} />

      <ScrollToTop />

      <HistorySheet
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onStartTool={handleStartTool}
      />
    </div>
  );
}
