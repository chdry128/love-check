"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Undo2, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoveCheckStore } from "@/lib/store";
import {
  loadTool,
  getNextQuestion,
  getTotalQuestionCount,
} from "@/lib/engine";
import type { QuestionOption, ToolSlug } from "@/types";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ToolFlowProps {
  toolSlug: ToolSlug;
  onFinish: () => void;
}

// ── Branch label mapping ──────────────────────────────────────
const BRANCH_LABELS: Record<string, string> = {
  established: "Established Relationship",
  "established-relationship": "Established Relationship",
  dating: "Dating / Getting to Know",
  "dating-new": "Dating / Getting to Know",
  situationship: "Situationship / Undefined",
  "situationship-undefined": "Situationship / Undefined",
  new: "New Connection",
  "new-connection": "New Connection",
  talking: "Talking / Early Stage",
  "talking-early": "Talking / Early Stage",
};

function getBranchLabel(branchId: string | null): string | null {
  if (!branchId) return null;
  return BRANCH_LABELS[branchId] ?? branchId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ToolFlow({ toolSlug, onFinish }: ToolFlowProps) {
  const {
    answers,
    addAnswer,
    branchId,
    setBranchId,
    questionIndex,
    setQuestionIndex,
    currentQuestion,
    setCurrentQuestion,
    setView,
  } = useLoveCheckStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(3);
  const [openText, setOpenText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  // Compute total questions (derived, no side effects)
  const currentTotal = useMemo(() => {
    try {
      const tool = loadTool(toolSlug);
      return getTotalQuestionCount(tool.questionTree, branchId);
    } catch {
      return 1;
    }
  }, [branchId, toolSlug]);

  const progressPercent = currentTotal > 0
    ? Math.min(((questionIndex + 1) / currentTotal) * 100, 100)
    : 0;

  // Derive previous answer info for the chip
  const previousAnswerChip = useMemo(() => {
    if (questionIndex === 0 || !currentQuestion) return null;
    // Look at the second-to-last answer
    const prevAnswer = answers[answers.length - 1];
    if (!prevAnswer) return null;

    // Try to find the label from the current question's context
    // The previous answer corresponds to the question before this one
    let prevQuestionText: string | null = null;
    try {
      const tool = loadTool(toolSlug);
      const allQuestions = [
        tool.questionTree.routingQuestion,
        ...(branchId ? (tool.questionTree.branches[branchId] ?? []) : []),
        ...(tool.questionTree.universalQuestions ?? []),
      ];
      const prevQ = allQuestions.find((q) => q.id === prevAnswer.questionId);
      if (prevQ) {
        let optionLabel: string | null = null;
        if (typeof prevAnswer.optionId === "string" && prevAnswer.optionId.startsWith("scale-")) {
          optionLabel = prevAnswer.value !== undefined ? String(prevAnswer.value) : prevAnswer.optionId;
        } else {
          const opt = prevQ.options.find((o) => o.id === prevAnswer.optionId);
          optionLabel = opt?.label ?? (typeof prevAnswer.optionId === "string" ? prevAnswer.optionId : "Answered");
        }
        prevQuestionText = optionLabel;
      }
    } catch {
      prevQuestionText = null;
    }

    return prevQuestionText;
  }, [answers, questionIndex, currentQuestion, toolSlug, branchId]);

  // Get branch label from routing answer
  const branchLabel = useMemo(() => {
    if (!branchId) return null;
    try {
      const tool = loadTool(toolSlug);
      const routingQ = tool.questionTree.routingQuestion;
      const routingAnswer = answers.find((a) => a.questionId === routingQ.id);
      if (routingAnswer) {
        const opt = routingQ.options.find((o) => o.id === routingAnswer.optionId);
        if (opt?.label) return opt.label;
      }
    } catch {
      // ignore
    }
    return getBranchLabel(branchId);
  }, [branchId, answers, toolSlug]);

  // ── Keyboard shortcuts ───────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isAnimating || !currentQuestion) return;

      // Enter → Continue
      if (e.key === "Enter") {
        e.preventDefault();
        continueButtonRef.current?.click();
        return;
      }

      // 1-4 → select option (single-choice / multi-choice only)
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        if (
          currentQuestion.type === "single-choice" ||
          currentQuestion.type === "multi-choice"
        ) {
          const options = currentQuestion.options;
          if (num <= options.length) {
            e.preventDefault();
            setSelectedOption(options[num - 1].id);
            setJustSelected(true);
            setTimeout(() => setJustSelected(false), 1200);
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, isAnimating]);

  const handleAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const isAnswered =
      currentQuestion.type === "scale"
        ? true
        : currentQuestion.type === "open-ended"
          ? openText.trim().length > 0 || !currentQuestion.required
          : selectedOption !== null;

    if (!isAnswered) return;

    let optionId: string | string[] = "";
    let value: number | undefined;

    if (currentQuestion.type === "scale") {
      optionId = `scale-${scaleValue}`;
      value = scaleValue;
    } else if (currentQuestion.type === "open-ended") {
      optionId = openText.trim() || "skipped";
    } else {
      optionId = selectedOption!;
    }

    addAnswer({
      questionId: currentQuestion.id,
      optionId,
      value,
    });

    let newBranchId = branchId;
    if (currentQuestion.kind === "routing" && selectedOption) {
      const option = currentQuestion.options.find(
        (o) => o.id === selectedOption
      );
      if (option?.branchRef) {
        newBranchId = option.branchRef;
        setBranchId(option.branchRef);
      }
    }

    setIsAnimating(true);
    setJustSelected(false);
    setTimeout(() => {
      try {
        const tool = loadTool(toolSlug);
        const allAnswers = [
          ...answers,
          { questionId: currentQuestion.id, optionId },
        ];

        const nextQ = getNextQuestion(
          tool.questionTree,
          newBranchId,
          questionIndex + 1,
          allAnswers
        );

        if (nextQ) {
          setCurrentQuestion(nextQ);
          setQuestionIndex(questionIndex + 1);
          setSelectedOption(null);
          setScaleValue(3);
          setOpenText("");
        } else {
          onFinish();
        }
      } catch {
        onFinish();
      }
      setIsAnimating(false);
    }, 300);
  }, [
    currentQuestion,
    selectedOption,
    scaleValue,
    openText,
    answers,
    branchId,
    questionIndex,
    toolSlug,
    addAnswer,
    setBranchId,
    setCurrentQuestion,
    setQuestionIndex,
    onFinish,
  ]);

  const canProceed =
    currentQuestion?.type === "scale"
      ? true
      : currentQuestion?.type === "open-ended"
        ? openText.trim().length > 0 || !currentQuestion.required
        : selectedOption !== null;

  // ── Step indicator dots ──────────────────────────────────────
  const stepDots = useMemo(() => {
    return Array.from({ length: currentTotal }, (_, i) => ({
      index: i,
      status: i < questionIndex ? "completed" : i === questionIndex ? "current" : "upcoming",
    }));
  }, [currentTotal, questionIndex]);

  // ── Kind badge config ────────────────────────────────────────
  const kindBadge = useMemo(() => {
    if (!currentQuestion) return null;
    switch (currentQuestion.kind) {
      case "routing":
        return {
          label: "Let's start with a question to understand your situation",
          className:
            "bg-gradient-to-r from-rose-50 to-orange-50 border-rose-200/60 text-rose-700 dark:from-rose-950/50 dark:to-orange-950/30 dark:border-rose-800/40 dark:text-rose-400",
        };
      case "universal":
        return {
          label: "Quick check-in",
          className:
            "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-700 dark:from-emerald-950/50 dark:to-teal-950/30 dark:border-emerald-800/40 dark:text-emerald-400",
        };
      case "branch":
        return {
          label: "Branch question",
          className:
            "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200/60 text-violet-700 dark:from-violet-950/50 dark:to-purple-950/30 dark:border-violet-800/40 dark:text-violet-400",
        };
      case "final":
        return {
          label: "Almost done",
          className:
            "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/60 text-amber-700 dark:from-amber-950/50 dark:to-yellow-950/30 dark:border-amber-800/40 dark:text-amber-400",
        };
    }
  }, [currentQuestion]);

  return (
    <div className="fade-in mx-auto max-w-lg px-4 py-6 sm:py-10">
      {/* Progress bar section */}
      <div className="mb-6 sm:mb-8">
        {/* Top row: Exit + Branch badge + Counter */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("home")}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Exit
            </button>
            {/* Branch badge */}
            {branchLabel && currentQuestion?.kind !== "routing" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge
                  variant="outline"
                  className="gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/5 border-primary/20 text-primary font-medium"
                >
                  <Route className="h-2.5 w-2.5" />
                  {branchLabel}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Question counter with flash animation */}
          <motion.span
            key={questionIndex}
            initial={{ scale: 1.3, color: "var(--color-primary)" }}
            animate={{
              scale: 1,
              color: "var(--color-muted-foreground)",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xs text-muted-foreground tabular-nums font-medium"
          >
            {questionIndex + 1}{" "}
            of {currentTotal}
          </motion.span>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center gap-1 mb-2.5">
          {stepDots.map((dot) => (
            <motion.div
              key={dot.index}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                dot.status === "completed"
                  ? "bg-primary"
                  : dot.status === "current"
                    ? "bg-primary/60"
                    : "bg-muted-foreground/15"
              )}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {dot.status === "current" && (
                <motion.div
                  className="h-full w-full rounded-full bg-primary"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress bar with heartbeat rose glow when user answers */}
        <div className="relative">
          <motion.div
            className="absolute -inset-1 rounded-full transition-opacity duration-300"
            animate={
              justSelected && !reduced
                ? {
                    boxShadow: [
                      "0 0 8px 2px rgba(244,63,94,0.3)",
                      "0 0 16px 4px rgba(244,63,94,0.5)",
                      "0 0 8px 2px rgba(244,63,94,0.3)",
                    ],
                  }
                : { boxShadow: "0 0 0 0 rgba(244,63,94,0)" }
            }
            transition={{ duration: 0.8, repeat: justSelected && !reduced ? 2 : 0, ease: "easeInOut" }}
          />
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id ?? "empty"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          {/* Typing indicator when transitioning */}
          {isAnimating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-center gap-3 py-16"
            >
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={!reduced ? { y: [0, -8, 0] } : { y: 0 }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">Finding your next question...</span>
            </motion.div>
          )}

          {currentQuestion && !isAnimating && (
            <Card className="border-0 shadow-none bg-transparent relative">
              {/* Warm gradient animated border around question card */}
              <motion.div
                className="pointer-events-none absolute -inset-[1.5px] rounded-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ zIndex: -1 }}
              >
                {!reduced && (
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "conic-gradient(from var(--border-angle, 0deg), rgba(244,63,94,0.3), rgba(251,113,133,0.15), rgba(249,115,22,0.2), rgba(244,63,94,0.3))",
                      animation: "romanticBorderRotate 4s linear infinite",
                    }}
                  />
                )}
              </motion.div>
              <CardContent className="p-0">
                {/* Previous answer chip */}
                {previousAnswerChip && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Undo2 className="h-3 w-3" />
                      <span>Previous answer:</span>
                      <Badge
                        variant="secondary"
                        className="text-[11px] px-2 py-0.5 rounded-full max-w-[200px] truncate"
                      >
                        {previousAnswerChip}
                      </Badge>
                    </div>
                  </motion.div>
                )}

                {/* Kind badge */}
                {kindBadge && (
                  <div className="mb-4">
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold",
                        kindBadge.className
                      )}
                    >
                      {kindBadge.label}
                    </motion.span>
                  </div>
                )}

                <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-1.5">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {currentQuestion.subtitle}
                  </p>
                )}

                {currentQuestion.type === "scale" && (
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{currentQuestion.minLabel ?? "1"}</span>
                      <span>{currentQuestion.maxLabel ?? "5"}</span>
                    </div>
                    <div className="flex justify-center gap-2">
                      {Array.from(
                        {
                          length:
                            ((currentQuestion.max ?? 5) - (currentQuestion.min ?? 1)) /
                              (currentQuestion.step ?? 1) +
                            1,
                        },
                        (_, i) => {
                          const val =
                            (currentQuestion.min ?? 1) +
                            i * (currentQuestion.step ?? 1);
                          return (
                            <button
                              key={val}
                              onClick={() => setScaleValue(val)}
                              className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-200",
                                scaleValue === val
                                  ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg"
                                  : "border-muted bg-card hover:border-primary/40"
                              )}
                            >
                              {val}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {currentQuestion.type === "open-ended" && (
                  <div className="mb-8">
                    <textarea
                      value={openText}
                      onChange={(e) => setOpenText(e.target.value)}
                      placeholder="Share whatever feels right..."
                      rows={4}
                      className="w-full rounded-xl border bg-card p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    {!currentQuestion.required && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        This is optional — skip if you prefer.
                      </p>
                    )}
                  </div>
                )}

                {(currentQuestion.type === "single-choice" ||
                  currentQuestion.type === "multi-choice") && (
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option: QuestionOption, idx: number) => (
                      <OptionButton
                        key={option.id}
                        option={option}
                        selected={selectedOption === option.id}
                        onClick={() => {
                          setSelectedOption(option.id);
                          setJustSelected(true);
                          setTimeout(() => setJustSelected(false), 1200);
                        }}
                        shortcutKey={idx + 1}
                      />
                    ))}
                  </div>
                )}

                {/* Continue button with romantic rose glow + bounce */}
                <motion.div
                  animate={
                    justSelected && canProceed && !reduced
                      ? { scale: [1, 1.04, 1] }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <Button
                    ref={continueButtonRef}
                    size="lg"
                    className={cn(
                      "w-full gap-2 rounded-xl h-12 text-base transition-all duration-300",
                      canProceed && !isAnimating &&
                        "shadow-lg shadow-rose-300/60 dark:shadow-rose-800/50 hover:shadow-xl hover:shadow-rose-300/80 dark:hover:shadow-rose-700/60",
                      justSelected && canProceed && !isAnimating && !reduced &&
                        "animate-[heartPulse_0.8s_ease-in-out_2]"
                    )}
                    disabled={!canProceed || isAnimating}
                    onClick={handleAnswer}
                  >
                    {isAnimating ? (
                      "Processing..."
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Keyboard hint */}
                {canProceed && !isAnimating && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-[11px] text-muted-foreground/60 mt-2.5"
                  >
                    Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">Enter</kbd> to continue
                    {currentQuestion?.type === "single-choice" && (
                      <>
                        {" "}· Press{" "}
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">1</kbd>
                        {"–"}
                        <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono border">
                          {Math.min(currentQuestion.options.length, 9)}
                        </kbd>{" "}
                        to select
                      </>
                    )}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface OptionButtonProps {
  option: QuestionOption;
  selected: boolean;
  onClick: () => void;
  shortcutKey?: number;
}

function OptionButton({ option, selected, onClick, shortcutKey }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all duration-200",
        "hover:shadow-sm active:scale-[0.99]",
        selected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
          : "border-border bg-card hover:border-primary/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
            selected
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          )}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium leading-snug transition-colors",
                selected ? "text-primary" : "text-foreground"
              )}
            >
              {option.label}
            </span>
            {shortcutKey !== undefined && !selected && (
              <kbd className="hidden sm:inline-flex items-center justify-center h-5 min-w-5 px-1 rounded bg-muted text-[10px] font-mono text-muted-foreground border">
                {shortcutKey}
              </kbd>
            )}
          </div>
          {option.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
