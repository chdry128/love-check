"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Shield,
  TrendingUp,
  Sparkles,
  Star,
  Leaf,
  Sun,
  Moon,
  Coffee,
  BookOpen,
  PenLine,
  Eye,
  Ear,
  HandHeart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Category config ───────────────────────────────────────────

type TipCategory = "Communication" | "Intimacy" | "Trust" | "Growth" | "Self-Care";

interface CategoryConfig {
  borderColor: string;
  badgeClass: string;
  iconClass: string;
  icon: LucideIcon;
}

const categoryConfig: Record<TipCategory, CategoryConfig> = {
  Communication: {
    borderColor: "border-l-sky-500 dark:border-l-sky-400",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    iconClass: "text-sky-500 dark:text-sky-400",
    icon: MessageCircle,
  },
  Intimacy: {
    borderColor: "border-l-rose-500 dark:border-l-rose-400",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    iconClass: "text-rose-500 dark:text-rose-400",
    icon: Heart,
  },
  Trust: {
    borderColor: "border-l-amber-500 dark:border-l-amber-400",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    iconClass: "text-amber-500 dark:text-amber-400",
    icon: Shield,
  },
  Growth: {
    borderColor: "border-l-emerald-500 dark:border-l-emerald-400",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    iconClass: "text-emerald-500 dark:text-emerald-400",
    icon: TrendingUp,
  },
  "Self-Care": {
    borderColor: "border-l-violet-500 dark:border-l-violet-400",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    iconClass: "text-violet-500 dark:text-violet-400",
    icon: Leaf,
  },
};

// ── Icon map ──────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Heart,
  Shield,
  TrendingUp,
  Sparkles,
  Star,
  Leaf,
  Sun,
  Moon,
  Coffee,
  BookOpen,
  PenLine,
  Eye,
  Ear,
  HandHeart,
};

// ── 31 Daily Tips ─────────────────────────────────────────────

interface DailyTipData {
  text: string;
  category: TipCategory;
  iconName: string;
}

const dailyTips: DailyTipData[] = [
  // Day 1-7
  {
    text: "Before bringing up something sensitive, try asking: \"Is this a good time to talk?\" This simple question signals respect and creates emotional space for a more productive conversation.",
    category: "Communication",
    iconName: "MessageCircle",
  },
  {
    text: "Research shows that small, consistent acts of affection matter more than grand gestures. A brief shoulder touch or a warm glance can reinforce your bond in ways gifts cannot.",
    category: "Intimacy",
    iconName: "HandHeart",
  },
  {
    text: "Trust is rebuilt through predictability, not promises. Following through on the smallest commitments -- even mundane ones -- compounds into a deep sense of reliability over time.",
    category: "Trust",
    iconName: "Shield",
  },
  {
    text: "Growth in a relationship does not mean growing apart. Couples who pursue individual passions alongside shared goals often report higher satisfaction and deeper connection.",
    category: "Growth",
    iconName: "TrendingUp",
  },
  {
    text: "Your emotional reserves are not infinite. Before you can show up fully for someone else, check in with yourself. A few minutes of stillness can reset your entire emotional state.",
    category: "Self-Care",
    iconName: "Leaf",
  },
  {
    text: "The way you listen matters more than what you say next. Practice reflective listening by repeating back what you heard before responding. It makes your partner feel truly seen.",
    category: "Communication",
    iconName: "Ear",
  },
  {
    text: "Physical closeness releases oxytocin, the bonding hormone. Even sitting on the same side of the couch or holding hands during a walk strengthens your emotional connection.",
    category: "Intimacy",
    iconName: "Heart",
  },
  // Day 8-14
  {
    text: "Vulnerability is not weakness -- it is the gateway to trust. Sharing a fear or insecurity with your partner, even a small one, invites them to meet you with empathy.",
    category: "Trust",
    iconName: "Sparkles",
  },
  {
    text: "Schedule a monthly \"state of us\" check-in. Not to air grievances, but to celebrate what is working and gently name what could grow. Couples who reflect together, thrive together.",
    category: "Growth",
    iconName: "BookOpen",
  },
  {
    text: "Perfection in relationships is a myth. What sustains love over time is not getting everything right -- it is repairing well after you get it wrong.",
    category: "Self-Care",
    iconName: "Moon",
  },
  {
    text: "Replace \"you always\" or \"you never\" with specific observations. Saying \"I noticed you did not text me when you arrived\" opens dialogue far more effectively than sweeping accusations.",
    category: "Communication",
    iconName: "PenLine",
  },
  {
    text: "Eye contact during conversation activates the same brain regions as touch. Looking into your partner's eyes for just a few seconds can reignite feelings of closeness and warmth.",
    category: "Intimacy",
    iconName: "Eye",
  },
  {
    text: "Keeping small secrets, even harmless ones, creates invisible walls. Transparency about your thoughts, spending, or schedule builds a foundation of trust that can weather any storm.",
    category: "Trust",
    iconName: "Sun",
  },
  {
    text: "Laughing together is one of the strongest predictors of relationship longevity. Shared humor creates inside worlds that belong only to the two of you.",
    category: "Growth",
    iconName: "Sparkles",
  },
  // Day 15-21
  {
    text: "Rest is not a luxury -- it is a prerequisite for healthy connection. When you are running on empty, irritability replaces patience. Prioritize sleep and downtime this week.",
    category: "Self-Care",
    iconName: "Moon",
  },
  {
    text: "Conflict is not the enemy of love -- stonewalling is. The next time tension rises, stay in the room emotionally. Even saying \"I need a break but I will come back\" preserves the connection.",
    category: "Communication",
    iconName: "MessageCircle",
  },
  {
    text: "Anticipating your partner's needs -- like making coffee before they ask or warming up the car -- communicates attentiveness. These micro-moments say \"I see you\" louder than words.",
    category: "Intimacy",
    iconName: "Coffee",
  },
  {
    text: "Apologize without caveats. Adding \"but\" after \"I am sorry\" negates the apology entirely. Own your part fully and let the repair do its work.",
    category: "Trust",
    iconName: "Shield",
  },
  {
    text: "Celebrate your partner's wins as if they were your own. Research on relationship satisfaction consistently shows that active, enthusiastic support for each other's achievements deepens love.",
    category: "Growth",
    iconName: "Star",
  },
  {
    text: "Setting boundaries is an act of care, not rejection. A healthy \"no\" creates the conditions for a more genuine \"yes\" later. Boundaries protect the relationship from resentment.",
    category: "Self-Care",
    iconName: "Leaf",
  },
  {
    text: "Ask open-ended questions instead of yes-or-no ones. \"What was the best part of your day?\" invites storytelling, while \"Was your day good?\" often gets a single word in return.",
    category: "Communication",
    iconName: "MessageCircle",
  },
  // Day 22-28
  {
    text: "Non-sexual touch is a cornerstone of lasting intimacy. A hand on the back, a forehead kiss, or an arm around the shoulder sustains warmth between more passionate moments.",
    category: "Intimacy",
    iconName: "HandHeart",
  },
  {
    text: "Forgiveness is a process, not a switch. If old hurts resurface, treat them with patience -- both for your partner and yourself. Healing is rarely linear.",
    category: "Trust",
    iconName: "Heart",
  },
  {
    text: "Write down three things you appreciate about your partner today. Gratitude journaling about your relationship has been shown to increase satisfaction and reduce conflict for weeks afterward.",
    category: "Growth",
    iconName: "PenLine",
  },
  {
    text: "Pursue a hobby or interest completely independent of your relationship. Maintaining your sense of self makes you more interesting and prevents the common trap of codependency.",
    category: "Self-Care",
    iconName: "BookOpen",
  },
  {
    text: "When your partner shares a problem, ask: \"Do you want me to just listen, or are you looking for advice?\" Most of the time, they just want to be heard, not fixed.",
    category: "Communication",
    iconName: "Ear",
  },
  {
    text: "Create small rituals together -- a Sunday morning walk, a weekly phone call, a shared playlist. Rituals become the rhythm that holds a relationship steady through uncertain times.",
    category: "Intimacy",
    iconName: "Sun",
  },
  {
    text: "Consistency in your words and actions is the slowest but most powerful way to build trust. When people know what to expect from you, anxiety dissolves and security grows.",
    category: "Trust",
    iconName: "TrendingUp",
  },
  // Day 29-31
  {
    text: "Learn your partner's stress language. Some people withdraw, others vent, and some need distraction. Responding to stress in the way they need -- not the way you would -- is a profound act of love.",
    category: "Growth",
    iconName: "Eye",
  },
  {
    text: "Saying \"I love you\" through actions, not just words, creates a lived experience of being cherished. Small daily behaviors speak far louder than occasional grand declarations.",
    category: "Self-Care",
    iconName: "Star",
  },
  {
    text: "The strongest relationships are not conflict-free -- they are repair-rich. The couples who last are not the ones who never fight, but the ones who always find their way back to each other.",
    category: "Communication",
    iconName: "Heart",
  },
];

// ── Component ─────────────────────────────────────────────────

export function DailyTip() {
  const reduced = useReducedMotion();

  // Deterministic selection: day of month (1-31), index 0-30
  const dayIndex = (new Date().getDate() - 1) % dailyTips.length;
  const tip = dailyTips[dayIndex];
  const config = categoryConfig[tip.category];

  // Pick icon by name from the static map
  const IconComponent = iconMap[tip.iconName] ?? config.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        <h2 className="text-base font-semibold">Daily Relationship Tip</h2>
        <span className="text-[11px] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        className={cn(
          "rounded-xl border-l-4 border bg-card p-5",
          config.borderColor
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/50",
              config.iconClass
            )}
          >
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                config.badgeClass
              )}
            >
              {tip.category}
            </span>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {tip.text}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
