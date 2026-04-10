import { create } from "zustand";
import type {
  ToolSlug,
  Question,
  FinalResult,
} from "@/types";
import { loadTool, getRoutingQuestion, getTotalQuestionCount } from "@/lib/engine";

// ── View States ─────────────────────────────────────────────

export type ViewState =
  | "home"
  | "tool-intro"
  | "tool-flow"
  | "results"
  | "blog"
  | "blog-post"
  | "pattern-library";

// ── App Store ───────────────────────────────────────────────

interface LoveCheckState {
  // Navigation
  view: ViewState;
  setView: (view: ViewState) => void;

  // Blog
  blogPostSlug: string | null;
  openBlog: (slug: string) => void;

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

  // Composite actions (single set() call for atomic updates)
  startToolIntro: (slug: ToolSlug) => void;
  beginToolFlow: () => void;
  resetSession: () => void;
  goHome: () => void;
}

export const useLoveCheckStore = create<LoveCheckState>((set, get) => ({
  // Navigation
  view: "home",
  setView: (view) => set({ view }),

  // Blog
  blogPostSlug: null,
  openBlog: (slug: string) => {
    set({ view: "blog-post", blogPostSlug: slug });
  },

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

  // ── Composite Actions ────────────────────────────────────

  /** Navigate to tool intro — sets activeTool and view in one update */
  startToolIntro: (slug: ToolSlug) => {
    set({ activeTool: slug, view: "tool-intro" });
  },

  /** Start the tool flow — initializes all session state in one update */
  beginToolFlow: () => {
    const { activeTool } = get();
    if (!activeTool) return;

    try {
      const tool = loadTool(activeTool);
      const routingQ = getRoutingQuestion(tool);
      const total = getTotalQuestionCount(tool.questionTree, null);
      set({
        view: "tool-flow",
        currentQuestion: routingQ,
        answers: [],
        branchId: null,
        questionIndex: 0,
        totalQuestions: total,
        finalResult: null,
        isLoading: false,
      });
    } catch {
      set({ view: "home" });
    }
  },

  /** Reset everything to initial state */
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
      blogPostSlug: null,
    }),

  /** Navigate back to home (clears tool + blog state) */
  goHome: () =>
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
      blogPostSlug: null,
    }),
}));
