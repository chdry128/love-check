import { create } from "zustand";
import type {
  ToolSlug,
  Question,
  FinalResult,
  AnswerPayload,
} from "@/types";

// ── View States ─────────────────────────────────────────────

export type ViewState =
  | "home"
  | "tool-intro"
  | "tool-flow"
  | "results";

// ── App Store ───────────────────────────────────────────────

interface LoveCheckState {
  // Navigation
  view: ViewState;
  setView: (view: ViewState) => void;

  // Tool session
  activeTool: ToolSlug | null;
  setActiveTool: (slug: ToolSlug | null) => void;

  // Question flow
  currentQuestion: Question | null;
  setCurrentQuestion: (q: Question | null) => void;
  answers: Array<{ questionId: string; optionId: string | string[]; value?: number }>;
  addAnswer: (answer: { questionId: string; optionId: string | string[]; value?: number }) => void;
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  questionIndex: number;
  setQuestionIndex: (i: number) => void;
  totalQuestions: number;
  setTotalQuestions: (n: number) => void;

  // Results
  finalResult: FinalResult | null;
  setFinalResult: (result: FinalResult | null) => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  resetSession: () => void;
}

export const useLoveCheckStore = create<LoveCheckState>((set) => ({
  // Navigation
  view: "home",
  setView: (view) => set({ view }),

  // Tool session
  activeTool: null,
  setActiveTool: (slug) => set({ activeTool: slug }),

  // Question flow
  currentQuestion: null,
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  answers: [],
  addAnswer: (answer) =>
    set((state) => {
      const filtered = state.answers.filter(
        (a) => a.questionId !== answer.questionId
      );
      return { answers: [...filtered, answer] };
    }),
  branchId: null,
  setBranchId: (id) => set({ branchId: id }),
  questionIndex: 0,
  setQuestionIndex: (i) => set({ questionIndex: i }),
  totalQuestions: 1,
  setTotalQuestions: (n) => set({ totalQuestions: n }),

  // Results
  finalResult: null,
  setFinalResult: (result) => set({ finalResult: result }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Reset
  resetSession: () =>
    set({
      view: "home",
      activeTool: null,
      currentQuestion: null,
      answers: [],
      branchId: null,
      questionIndex: 0,
      totalQuestions: 1,
      finalResult: null,
      isLoading: false,
    }),
}));
