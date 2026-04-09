/**
 * Advice Library — curated wisdom snippets organized by category.
 *
 * These are used by the engine to populate result sections (strengths,
 * risks, watch-next, try-next) with warm, relatable guidance. Each
 * snippet is designed to feel like something a wise, caring friend
 * would say — not clinical language or preachy advice.
 */

export interface AdviceSnippet {
  id: string;
  text: string;
  appliesWhen: string; // describes when this advice is relevant
}

export interface AdviceCategory {
  id: string;
  label: string;
  snippets: AdviceSnippet[];
}

export const adviceLibrary: AdviceCategory[] = [
  // ── Self-Worth ──────────────────────────────────────────────
  {
    id: "self_worth",
    label: "Self-Worth",
    snippets: [
      {
        id: "sw-1",
        text: "Your worth isn't determined by how much someone texts you back or how fast they respond. You are a whole person regardless of who is or isn't paying attention to you right now.",
        appliesWhen: "User is overinvesting or waiting on responses",
      },
      {
        id: "sw-2",
        text: "If you find yourself constantly wondering 'what did I do wrong?' — the answer might be 'nothing.' Sometimes people's behavior is about them, not you.",
        appliesWhen: "User internalizes blame for partner's behavior",
      },
      {
        id: "sw-3",
        text: "Wanting to be loved is not the same as being willing to be mistreated. You can hold out for both warmth and respect at the same time.",
        appliesWhen: "User confuses love with tolerating poor treatment",
      },
      {
        id: "sw-4",
        text: "The right person will not make you earn their consistency. It's not a reward for good behavior — it's the baseline of caring about someone.",
        appliesWhen: "User feels they must earn basic effort",
      },
      {
        id: "sw-5",
        text: "Leaving space for yourself isn't selfish — it's how you stay connected to who you are outside the relationship. The best version of you to bring to love is the one who knows themselves.",
        appliesWhen: "User has lost themselves in the relationship",
      },
      {
        id: "sw-6",
        text: "You teach people how to treat you — not by explaining it, but by what you accept. If something doesn't feel right, that feeling is information, not a flaw.",
        appliesWhen: "User accepts behavior that feels wrong",
      },
    ],
  },

  // ── Boundaries ──────────────────────────────────────────────
  {
    id: "boundaries",
    label: "Boundaries",
    snippets: [
      {
        id: "bn-1",
        text: "A boundary isn't about controlling someone else — it's about protecting your own peace. 'I need X' is not the same as 'You must do X.' The difference matters.",
        appliesWhen: "User feels guilty about setting boundaries",
      },
      {
        id: "bn-2",
        text: "If saying 'no' feels dangerous, that's important information. In a healthy dynamic, boundaries aren't punished — they're respected.",
        appliesWhen: "User fears consequences of setting boundaries",
      },
      {
        id: "bn-3",
        text: "Your boundaries are allowed to change as you grow. What was okay last month might not be okay now, and you don't need to justify that shift to anyone.",
        appliesWhen: "User's boundaries are evolving",
      },
      {
        id: "bn-4",
        text: "Someone who truly cares about you won't make your boundaries feel like an attack. They might need time to adjust, but the response should be curiosity, not resistance.",
        appliesWhen: "Partner responds poorly to boundaries",
      },
      {
        id: "bn-5",
        text: "You can love someone and still need space from them. Those two truths can coexist without either one being less real.",
        appliesWhen: "User feels torn between love and needing space",
      },
    ],
  },

  // ── Communication ───────────────────────────────────────────
  {
    id: "communication",
    label: "Communication",
    snippets: [
      {
        id: "cm-1",
        text: "The hardest conversations are usually the ones most worth having. You don't need to be perfect — you just need to be honest and kind.",
        appliesWhen: "User is avoiding a difficult conversation",
      },
      {
        id: "cm-2",
        text: "'I feel…' is almost always more powerful than 'You always…' One starts a dialogue; the other starts a defense.",
        appliesWhen: "User needs to express frustration constructively",
      },
      {
        id: "cm-3",
        text: "Sometimes the most loving thing you can say is 'I don't know how to say this, but I need to try.' That vulnerability is the foundation of real intimacy.",
        appliesWhen: "User struggles to articulate feelings",
      },
      {
        id: "cm-4",
        text: "If you've said something three times and nothing changes, the issue isn't a misunderstanding — it's a choice. You get to decide how you respond to that.",
        appliesWhen: "User keeps repeating the same request",
      },
      {
        id: "cm-5",
        text: "Listening without fixing is one of the most powerful gifts you can give. Sometimes people don't need advice — they just need to know they've been heard.",
        appliesWhen: "User defaults to problem-solving instead of listening",
      },
      {
        id: "cm-6",
        text: "Timing matters, but it shouldn't become an excuse for never having the conversation. There will never be a perfect moment — just a willing one.",
        appliesWhen: "User keeps postponing important talks",
      },
    ],
  },

  // ── Clarity ─────────────────────────────────────────────────
  {
    id: "clarity",
    label: "Clarity",
    snippets: [
      {
        id: "cl-1",
        text: "Ambiguity is not romantic. It's okay to want to know where you stand — that's not needy, it's human.",
        appliesWhen: "User is in an undefined relationship",
      },
      {
        id: "cl-2",
        text: "If someone says they're 'not ready for a label' but acts like they're in a relationship, you get to ask which one is real — their words or their actions.",
        appliesWhen: "Partner's words and actions don't match",
      },
      {
        id: "cl-3",
        text: "A relationship that could go either way eventually goes nowhere. At some point, someone has to choose — and if they won't, the waiting itself becomes the answer.",
        appliesWhen: "User has been waiting for a commitment",
      },
      {
        id: "cl-4",
        text: "You don't need to have the whole future figured out. But you do deserve to know that the person next to you sees you in theirs.",
        appliesWhen: "User lacks future visibility",
      },
      {
        id: "cl-5",
        text: "Being told 'let's see where this goes' is fine for the first few weeks. After months, it starts to sound more like 'I don't want to commit but I don't want you to leave either.'",
        appliesWhen: "Ambiguity has persisted for a long time",
      },
    ],
  },

  // ── Patience & Timing ───────────────────────────────────────
  {
    id: "patience",
    label: "Patience & Timing",
    snippets: [
      {
        id: "pt-1",
        text: "Patience is a beautiful quality — but there's a difference between giving someone time and giving someone permission to keep you waiting. You get to decide where that line is.",
        appliesWhen: "User has been patient for a very long time",
      },
      {
        id: "pt-2",
        text: "People show you who they are early on. The trick isn't in spotting the signs — it's in believing them the first time.",
        appliesWhen: "User keeps hoping someone will change",
      },
      {
        id: "pt-3",
        text: "A slow beginning doesn't mean a weak connection. Some of the best relationships are the ones that took their time to bloom.",
        appliesWhen: "User is anxious about a slow pace",
      },
      {
        id: "pt-4",
        text: "If you've been 'giving it time' for longer than you're comfortable with, that discomfort is valid. Time has a way of making us accept things we said we never would.",
        appliesWhen: "User rationalizes waiting too long",
      },
      {
        id: "pt-5",
        text: "Not every season of uncertainty leads to clarity. Sometimes it just leads to more of the same. It's okay to decide you've waited long enough.",
        appliesWhen: "User feels stuck in a waiting pattern",
      },
    ],
  },

  // ── Red Flags & Warning Signs ───────────────────────────────
  {
    id: "red_flags",
    label: "Red Flags & Warning Signs",
    snippets: [
      {
        id: "rf-1",
        text: "If your friends — the people who love you most — are all saying the same thing about your relationship, it's worth listening. They don't have an agenda. They just see what you might be too close to see.",
        appliesWhen: "User dismisses concerns from friends/family",
      },
      {
        id: "rf-2",
        text: "Love bombing and genuine enthusiasm can look similar at first. The difference is what happens a few months in — one fades into consistency, the other fades into control.",
        appliesWhen: "User experienced intense early attention",
      },
      {
        id: "rf-3",
        text: "If you find yourself hiding things about your relationship from people who care about you, ask yourself why. The answer might tell you something important.",
        appliesWhen: "User conceals relationship issues",
      },
      {
        id: "rf-4",
        text: "Apologies without behavior change are just words with good timing. A real apology shows up differently next time.",
        appliesWhen: "Partner apologizes but repeats the behavior",
      },
      {
        id: "rf-5",
        text: "Isolation is one of the quietest red flags — and one of the most dangerous. If someone slowly pulls you away from your support system, that's not love. That's control.",
        appliesWhen: "User has been isolated from friends/family",
      },
      {
        id: "rf-6",
        text: "You are allowed to leave. You don't need to wait for a 'good enough' reason, and you don't need someone else's permission. Your gut feeling counts as a reason.",
        appliesWhen: "User feels trapped or unsure about leaving",
      },
    ],
  },

  // ── Growth & Repair ─────────────────────────────────────────
  {
    id: "growth",
    label: "Growth & Repair",
    snippets: [
      {
        id: "gr-1",
        text: "A relationship that's never been tested isn't a strong relationship — it's just an untested one. How you both handle the hard moments says more than all the easy ones combined.",
        appliesWhen: "User is going through relationship difficulty",
      },
      {
        id: "gr-2",
        text: "Repair isn't about never making mistakes — it's about being willing to show up after you do. The willingness to try again, genuinely, is what makes relationships last.",
        appliesWhen: "User is working through conflict",
      },
      {
        id: "gr-3",
        text: "Growth doesn't mean fixing the other person. It means both of you becoming more aware, more honest, and more willing to meet in the middle.",
        appliesWhen: "User wants to improve the relationship",
      },
      {
        id: "gr-4",
        text: "Sometimes the bravest thing you can do in love is stay and work on it. And sometimes the bravest thing is to walk away. Both can be acts of self-respect.",
        appliesWhen: "User is weighing whether to stay or leave",
      },
      {
        id: "gr-5",
        text: "Every relationship that taught you something — even the painful ones — was not a waste. You're carrying wisdom forward, not baggage. Unless you choose to.",
        appliesWhen: "User feels regret about a past relationship",
      },
    ],
  },
];
