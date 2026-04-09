"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoveCheckStore } from "@/lib/store";
import {
  loadTool,
  getRoutingQuestion,
  getNextQuestion,
  getTotalQuestionCount,
} from "@/lib/engine";
import type { Question, QuestionOption, ToolSlug } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ToolFlowProps {
  toolSlug: ToolSlug;
  onFinish: () => void;
}

export function ToolFlow({ toolSlug, onFinish }: ToolFlowProps) {
  const {
    answers,
    addAnswer,
    branchId,
    setBranchId,
    questionIndex,
    setQuestionIndex,
    totalQuestions,
    setTotalQuestions,
    currentQuestion,
    setCurrentQuestion,
    setView,
  } = useLoveCheckStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scaleValue, setScaleValue] = useState<number>(3);
  const [openText, setOpenText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Initialize tool on mount
  if (!initialized) {
    try {
      const tool = loadTool(toolSlug);
      const routingQ = getRoutingQuestion(tool);
      setCurrentQuestion(routingQ);
      setQuestionIndex(0);
      setAnswers([]);
      setBranchId(null);
      setTotalQuestions(getTotalQuestionCount(tool.questionTree, null));
      setInitialized(true);
    } catch {
      setView("home");
    }
  }

  // Update total questions when branch changes
  const currentTotal = useMemo(() => {
    try {
      const tool = loadTool(toolSlug);
      return getTotalQuestionCount(tool.questionTree, branchId);
    } catch {
      return 1;
    }
  }, [branchId, toolSlug]);

  // Keep totalQuestions in sync with computed value
  if (totalQuestions !== currentTotal) {
    setTotalQuestions(currentTotal);
  }

  const handleAnswer = useCallback(() => {
    if (!currentQuestion) return;

    const isAnswered =
      currentQuestion.type === "scale"
        ? true // scale always has a value
        : currentQuestion.type === "open-ended"
          ? openText.trim().length > 0 || !currentQuestion.required
          : selectedOption !== null;

    if (!isAnswered) return;

    // Build answer
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

    // Add the answer
    addAnswer({
      questionId: currentQuestion.id,
      optionId,
      value,
    });

    // Set branch from routing question
    if (currentQuestion.kind === "routing" && selectedOption) {
      const option = currentQuestion.options.find(
        (o) => o.id === selectedOption
      );
      if (option?.branchRef) {
        setBranchId(option.branchRef);
      }
    }

    // Advance to next question
    setIsAnimating(true);
    setTimeout(() => {
      try {
        const tool = loadTool(toolSlug);
        const allAnswers = [
          ...answers,
          { questionId: currentQuestion.id, optionId },
        ];

        const nextQ = getNextQuestion(
          tool.questionTree,
          branchId && currentQuestion.kind === "routing"
            ? currentQuestion.options.find((o) => o.id === selectedOption)
                ?.branchRef ?? branchId
            : branchId,
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
          // All questions answered
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

  const progressPercent = totalQuestions > 0
    ? Math.min(((questionIndex + 1) / totalQuestions) * 100, 100)
    : 0;

  const canProceed =
    currentQuestion?.type === "scale"
      ? true
      : currentQuestion?.type === "open-ended"
        ? openText.trim().length > 0 || !currentQuestion.required
        : selectedOption !== null;

  return (
    <div className="fade-in mx-auto max-w-lg px-4 py-6 sm:py-10">
      {/* Progress bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Exit
          </button>
          <span className="text-xs text-muted-foreground">
            {questionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id ?? "empty"}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          {currentQuestion && (
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                {/* Question kind indicator */}
                {currentQuestion.kind === "routing" && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                      Let&apos;s start with a question to understand your situation
                    </span>
                  </div>
                )}

                {/* Question text */}
                <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-1.5">
                  {currentQuestion.text}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {currentQuestion.subtitle}
                  </p>
                )}

                {/* Scale question */}
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
                    <p className="text-center text-sm text-muted-foreground">
                      Selected: <span className="font-semibold text-foreground">{scaleValue}</span>
                    </p>
                  </div>
                )}

                {/* Open-ended question */}
                {currentQuestion.type === "open-ended" && (
                  <div className="mb-8">
                    <textarea
                      value={openText}
                      onChange={(e) => setOpenText(e.target.value)}
                      placeholder="Share whatever feels right..."
                      className="w-full min-h-[120px] rounded-xl border bg-card p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    {!currentQuestion.required && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        This is optional — skip if you prefer.
                      </p>
                    )}
                  </div>
                )}

                {/* Choice options */}
                {(currentQuestion.type === "single-choice" ||
                  currentQuestion.type === "multi-choice") && (
                  <div className="space-y-3 mb-8">
                    {currentQuestion.options.map((option: QuestionOption) => (
                      <OptionButton
                        key={option.id}
                        option={option}
                        selected={selectedOption === option.id}
                        onClick={() => setSelectedOption(option.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Continue button */}
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl h-12 text-base"
                  disabled={!canProceed || isAnimating}
                  onClick={handleAnswer}
                >
                  {isAnimating ? (
                    "Processing..."
                  ) : !currentQuestion ? (
                    "See Results"
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Option Button ───────────────────────────────────────────

interface OptionButtonProps {
  option: QuestionOption;
  selected: boolean;
  onClick: () => void;
}

function OptionButton({ option, selected, onClick }: OptionButtonProps) {
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
          <span
            className={cn(
              "text-sm font-medium leading-snug transition-colors",
              selected ? "text-primary" : "text-foreground"
            )}
          >
            {option.label}
          </span>
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
