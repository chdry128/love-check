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
  type LucideIcon,
} from "lucide-react";

interface InsightCardProps {
  title: string;
  items: string[];
  variant?: "strength" | "risk" | "watch" | "try" | "info" | "safe";
  className?: string;
}

const variantConfig: Record<string, { icon: LucideIcon; className: string; titleColor: string }> = {
  strength: {
    icon: Heart,
    className: "border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-800/40 dark:bg-emerald-950/20",
    titleColor: "text-emerald-700 dark:text-emerald-400",
  },
  risk: {
    icon: AlertTriangle,
    className: "border-amber-200/60 bg-amber-50/50 dark:border-amber-800/40 dark:bg-amber-950/20",
    titleColor: "text-amber-700 dark:text-amber-400",
  },
  watch: {
    icon: Eye,
    className: "border-orange-200/60 bg-orange-50/50 dark:border-orange-800/40 dark:bg-orange-950/20",
    titleColor: "text-orange-700 dark:text-orange-400",
  },
  try: {
    icon: Lightbulb,
    className: "border-violet-200/60 bg-violet-50/50 dark:border-violet-800/40 dark:bg-violet-950/20",
    titleColor: "text-violet-700 dark:text-violet-400",
  },
  info: {
    icon: Sparkles,
    className: "border-rose-200/60 bg-rose-50/50 dark:border-rose-800/40 dark:bg-rose-950/20",
    titleColor: "text-rose-700 dark:text-rose-400",
  },
  safe: {
    icon: Shield,
    className: "border-sky-200/60 bg-sky-50/50 dark:border-sky-800/40 dark:bg-sky-950/20",
    titleColor: "text-sky-700 dark:text-sky-400",
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
          <Icon className="h-4 w-4 shrink-0" />
          <h4 className={cn("text-sm font-semibold", config.titleColor)}>
            {title}
          </h4>
        </div>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground leading-relaxed pl-6 relative"
            >
              <span className="absolute left-0 top-2.5 h-1 w-1 rounded-full bg-current opacity-30" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
