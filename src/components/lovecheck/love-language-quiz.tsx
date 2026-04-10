"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToolSlug } from "@/types";

// ── Love Languages ────────────────────────────────────────────

type LoveLanguage =
  | "Words of Affirmation"
  | "Quality Time"
  | "Acts of Service"
  | "Physical Touch"
  | "Gifts";

interface LoveLanguageInfo {
  name: LoveLanguage;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const loveLanguageInfo: Record<LoveLanguage, LoveLanguageInfo> = {
  "Words of Affirmation": {
    name: "Words of Affirmation",
    description:
      "You feel most loved through spoken kindness, compliments, and encouragement. Hearing \"I love you\" or receiving a heartfelt note fills your emotional tank more than almost anything else.",
    color: "text-sky-600 dark:text-sky-400",
    bgColor: "bg-sky-50 dark:bg-sky-950/30",
    borderColor: "border-sky-200 dark:border-sky-800",
  },
  "Quality Time": {
    name: "Quality Time",
    description:
      "Undivided attention is your love language. Whether it is a long walk or a quiet evening together, you feel most valued when your partner puts away distractions and is fully present with you.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  "Acts of Service": {
    name: "Acts of Service",
    description:
      "Actions speak louder than words for you. When your partner makes your morning coffee, runs an errand, or handles a chore without being asked, you feel deeply cared for and appreciated.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  "Physical Touch": {
    name: "Physical Touch",
    description:
      "You express and receive love through physical closeness. Holding hands, hugs, and other forms of touch make you feel secure, connected, and emotionally grounded in your relationship.",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  Gifts: {
    name: "Gifts",
    description:
      "For you, love is in the thoughtfulness behind a gift -- not its price tag. A picked flower, a favorite snack, or a surprise token of appreciation tells you that someone was thinking of you.",
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
};

// ── Questions ─────────────────────────────────────────────────

interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{
    text: string;
    language: LoveLanguage;
  }>;
}

const questions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Your partner had a hard day. What would feel most comforting to you?",
    options: [
      { text: "Hearing them say, \"I am here for you, no matter what.\"", language: "Words of Affirmation" },
      { text: "Sitting together in comfortable silence, just being close.", language: "Quality Time" },
      { text: "Having them handle dinner so you can rest.", language: "Acts of Service" },
      { text: "A long, warm hug that lingers.", language: "Physical Touch" },
    ],
  },
  {
    id: "q2",
    text: "What makes you feel most appreciated in a relationship?",
    options: [
      { text: "A heartfelt letter or unexpected compliment.", language: "Words of Affirmation" },
      { text: "Planning a special day just for the two of you.", language: "Quality Time" },
      { text: "Noticing and doing something helpful before you ask.", language: "Acts of Service" },
      { text: "A small, meaningful surprise they picked up for you.", language: "Gifts" },
    ],
  },
  {
    id: "q3",
    text: "You want to reconnect after a busy week apart. What sounds ideal?",
    options: [
      { text: "An evening of deep conversation, sharing everything.", language: "Words of Affirmation" },
      { text: "Unplugging phones and spending the whole day together.", language: "Quality Time" },
      { text: "Cooking a meal together, side by side in the kitchen.", language: "Acts of Service" },
      { text: "Cuddling on the couch watching your favorite show.", language: "Physical Touch" },
    ],
  },
  {
    id: "q4",
    text: "Which of these would make your heart melt the most?",
    options: [
      { text: "A voice message saying why they love you.", language: "Words of Affirmation" },
      { text: "Canceling other plans so they can spend time with you.", language: "Quality Time" },
      { text: "Waking up to find your car washed or a chore done.", language: "Acts of Service" },
      { text: "A thoughtful gift that shows they remember a small detail about you.", language: "Gifts" },
    ],
  },
  {
    id: "q5",
    text: "During an argument, what helps you feel most connected again?",
    options: [
      { text: "Hearing sincere words of apology and reassurance.", language: "Words of Affirmation" },
      { text: "Sitting down together to talk it through, face to face.", language: "Quality Time" },
      { text: "Seeing them make a change or fix the issue afterward.", language: "Acts of Service" },
      { text: "Physical closeness -- reaching for your hand or a hug.", language: "Physical Touch" },
    ],
  },
  {
    id: "q6",
    text: "Your love language is best expressed by...",
    options: [
      { text: "Telling your partner what you admire about them, often.", language: "Words of Affirmation" },
      { text: "Giving them your undivided, phone-free attention.", language: "Quality Time" },
      { text: "Doing things to make their day easier and lighter.", language: "Acts of Service" },
      { text: "Finding or creating little things you know they will enjoy.", language: "Gifts" },
    ],
  },
  {
    id: "q7",
    text: "What would hurt you the most?",
    options: [
      { text: "Harsh or dismissive words during a disagreement.", language: "Words of Affirmation" },
      { text: "Being cancelled on or feeling like a low priority.", language: "Quality Time" },
      { text: "Promises made but never followed through.", language: "Acts of Service" },
      { text: "Physical or emotional distance when you need closeness.", language: "Physical Touch" },
    ],
  },
  {
    id: "q8",
    text: "Which birthday celebration would mean the most?",
    options: [
      { text: "A speech or toast filled with genuine, personal compliments.", language: "Words of Affirmation" },
      { text: "A trip or experience you share together, just the two of you.", language: "Quality Time" },
      { text: "Friends and family gathering because your partner organized it all.", language: "Acts of Service" },
      { text: "A carefully chosen gift that shows they truly know you.", language: "Gifts" },
    ],
  },
  {
    id: "q9",
    text: "You feel most loved when your partner...",
    options: [
      { text: "Leaves encouraging notes for you to find.", language: "Words of Affirmation" },
      { text: "Plans regular date nights and guards that time fiercely.", language: "Quality Time" },
      { text: "Takes care of something stressful so you do not have to.", language: "Acts of Service" },
      { text: "Reaches for your hand or initiates physical affection.", language: "Physical Touch" },
    ],
  },
  {
    id: "q10",
    text: "How do you most naturally show love to someone you care about?",
    options: [
      { text: "Telling them how much they mean to you, in detail.", language: "Words of Affirmation" },
      { text: "Setting aside time to be fully present with them.", language: "Quality Time" },
      { text: "Helping them with tasks or solving problems for them.", language: "Acts of Service" },
      { text: "Giving thoughtful, personal gifts on random occasions.", language: "Gifts" },
    ],
  },
  {
    id: "q11",
    text: "Which scenario feels like the perfect expression of love?",
    options: [
      { text: "Looking into each other's eyes and saying \"I choose you.\"", language: "Words of Affirmation" },
      { text: "A weekend getaway with no agenda, just you and them.", language: "Quality Time" },
      { text: "Coming home to find they set up your space exactly how you like it.", language: "Acts of Service" },
      { text: "A surprise embrace from behind when you are busy.", language: "Physical Touch" },
    ],
  },
  {
    id: "q12",
    text: "When you think back to your happiest relationship memory, it probably involves...",
    options: [
      { text: "Something kind and specific they said that you still remember.", language: "Words of Affirmation" },
      { text: "A moment where time stood still because you were so present together.", language: "Quality Time" },
      { text: "Something they went out of their way to do, just for you.", language: "Acts of Service" },
      { text: "A meaningful gift that carries a story behind it.", language: "Gifts" },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────

const TOTAL_QUESTIONS = 5;

function getResult(scores: Record<LoveLanguage, number>): LoveLanguage {
  let maxScore = -1;
  let result: LoveLanguage = "Words of Affirmation";
  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      result = lang as LoveLanguage;
    }
  }
  return result;
}

// ── Component ─────────────────────────────────────────────────

interface LoveLanguageQuizProps {
  onStartTool: (slug: string) => void;
}

export function LoveLanguageQuiz({ onStartTool }: LoveLanguageQuizProps) {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<Record<LoveLanguage, number>>({
    "Words of Affirmation": 0,
    "Quality Time": 0,
    "Acts of Service": 0,
    "Physical Touch": 0,
    Gifts: 0,
  });
  const [result, setResult] = useState<LoveLanguage | null>(null);
  const [direction, setDirection] = useState(1);

  const question = questions[currentIndex];
  const isComplete = currentIndex >= TOTAL_QUESTIONS;
  const isStarted = currentIndex > 0 || result !== null;

  function handleSelect(language: LoveLanguage) {
    if (isComplete) return;

    const newScores = { ...scores, [language]: scores[language] + 1 };

    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      const finalResult = getResult(newScores);
      setResult(finalResult);
      setScores(newScores);
    } else {
      setScores(newScores);
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setScores({
      "Words of Affirmation": 0,
      "Quality Time": 0,
      "Acts of Service": 0,
      "Physical Touch": 0,
      Gifts: 0,
    });
    setResult(null);
    setDirection(1);
  }

  const fadeVariants = {
    enter: reduced
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: direction > 0 ? 30 : -30 },
    center: reduced
      ? { opacity: 1, x: 0 }
      : { opacity: 1, x: 0 },
    exit: reduced
      ? { opacity: 1, x: 0 }
      : { opacity: 0, x: direction > 0 ? -30 : 30 },
  };

  const resultInfo = result ? loveLanguageInfo[result] : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-rose-500 dark:text-rose-400" />
        <h2 className="text-base font-semibold">Love Language Quiz</h2>
        <span className="text-[11px] text-muted-foreground">
          5 quick questions
        </span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {/* Header with progress dots */}
        <div className="border-b bg-muted/30 px-5 py-3">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i < currentIndex
                    ? "w-6 bg-primary"
                    : i === currentIndex && !isComplete
                      ? "w-6 bg-primary/60"
                      : "w-2 bg-muted-foreground/20"
                )}
              />
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* Start screen */}
          {!isStarted && !isComplete && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.4 }}
              className="text-center space-y-4"
            >
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Discover how you most naturally give and receive love. Answer five quick questions to find your love language.
              </p>
              <Button
                onClick={() => {
                  setDirection(1);
                  setCurrentIndex(1);
                }}
                className="gap-2 rounded-lg"
              >
                Start Quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          )}

          {/* Question flow */}
          <AnimatePresence mode="wait" custom={direction}>
            {isStarted && !isComplete && question && (
              <motion.div
                key={question.id}
                custom={direction}
                variants={fadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reduced ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {currentIndex} of {TOTAL_QUESTIONS}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {question.text}
                </p>
                <div className="space-y-2 pt-1">
                  {question.options.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => handleSelect(option.language)}
                      className={cn(
                        "w-full text-left rounded-lg border px-4 py-3 text-sm transition-all duration-200",
                        "hover:bg-muted/50 hover:border-muted-foreground/30",
                        "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      )}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result screen */}
          <AnimatePresence mode="wait">
            {isComplete && resultInfo && (
              <motion.div
                key="result"
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={reduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
                className="text-center space-y-5"
              >
                {/* Animated heart */}
                <div className="flex justify-center">
                  <motion.div
                    animate={
                      reduced
                        ? {}
                        : {
                            scale: [1, 1.2, 1],
                            transition: {
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }
                    }
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-2xl",
                      resultInfo.bgColor
                    )}
                  >
                    <Heart
                      className={cn("h-8 w-8", resultInfo.color)}
                      fill="currentColor"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Your Love Language
                  </p>
                  <h3 className={cn("text-xl font-bold", resultInfo.color)}>
                    {resultInfo.name}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  {resultInfo.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <Button
                    onClick={() => onStartTool("attachment-style-lens" as ToolSlug)}
                    variant="outline"
                    className="gap-2 rounded-lg"
                  >
                    Explore Attachment Patterns
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={handleRestart}
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground text-xs"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
