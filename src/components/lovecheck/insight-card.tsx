"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  AlertTriangle,
  Eye,
  Lightbulb,
  Heart,
  Shield,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

interface InsightCardProps {
  title: string;
  items: string[];
  variant?: "strength" | "risk" | "watch" | "try" | "info" | "safe";
  className?: string;
}

const variantConfig: Record<string, { icon: LucideIcon; bulletIcon: LucideIcon; className: string; titleColor: string; bulletColor: string }> = {
  strength: {
    icon: Heart,
    bulletIcon: CheckCircle2,
    className: "border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/20",
    titleColor: "text-emerald-700 dark:text-emerald-400",
    bulletColor: "text-emerald-500 dark:text-emerald-400",
  },
  risk: {
    icon: AlertTriangle,
    bulletIcon: AlertTriangle,
    className: "border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20",
    titleColor: "text-amber-700 dark:text-amber-400",
    bulletColor: "text-amber-500 dark:text-amber-400",
  },
  watch: {
    icon: Eye,
    bulletIcon: Eye,
    className: "border-orange-200/60 bg-orange-50/50 dark:border-orange-800/40 dark:bg-orange-950/20",
    titleColor: "text-orange-700 dark:text-orange-400",
    bulletColor: "text-orange-500 dark:text-orange-400",
  },
  try: {
    icon: Lightbulb,
    bulletIcon: Lightbulb,
    className: "border-violet-200/60 bg-violet-50/50 dark:border-violet-800/40 dark:bg-violet-950/20",
    titleColor: "text-violet-700 dark:text-violet-400",
    bulletColor: "text-violet-500 dark:text-violet-400",
  },
  info: {
    icon: Sparkles,
    bulletIcon: Sparkles,
    className: "border-rose-200/60 bg-rose-50/50 dark:border-rose-800/40 dark:bg-rose-950/20",
    titleColor: "text-rose-700 dark:text-rose-400",
    bulletColor: "text-rose-500 dark:text-rose-400",
  },
  safe: {
    icon: Shield,
    bulletIcon: Shield,
    className: "border-sky-200/60 bg-sky-50/50 dark:border-sky-800/40 dark:bg-sky-950/20",
    titleColor: "text-sky-700 dark:text-sky-400",
    bulletColor: "text-sky-500 dark:text-sky-400",
  },
};

export function InsightCard({
  title,
  items,
  variant = "info",
  className,
}: InsightCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const BulletIcon = config.bulletIcon;

  return (
    <Card
      className={cn(
        "border transition-all duration-200 hover:shadow-sm",
        config.className,
        className
      )}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-current/10", config.titleColor)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h4 className={cn("text-sm font-semibold", config.titleColor)}>
            {title}
          </h4>
        </div>
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground leading-relaxed flex gap-2.5"
            >
              <BulletIcon className={cn("h-4 w-4 shrink-0 mt-0.5 opacity-60", config.bulletColor)} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
