"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { RecommendedTool, ToolSlug } from "@/types";

interface NextToolCardProps {
  tool: RecommendedTool;
  onStartTool: (slug: ToolSlug) => void;
  className?: string;
}

const toolNameMap: Record<string, string> = {
  "relationship-risk-radar": "Relationship Risk Radar",
  "attachment-style-lens": "Attachment Style Lens",
  "communication-pattern-check": "Communication Pattern Check",
  "compatibility-compass": "Compatibility Compass",
  "red-flag-scanner": "Red Flag Scanner",
};

export function NextToolCard({
  tool,
  onStartTool,
  className,
}: NextToolCardProps) {
  const name = toolNameMap[tool.slug] ?? tool.slug;

  return (
    <Card
      className={cn(
        "group cursor-pointer border hover:border-primary/30 transition-all duration-200 hover:shadow-md",
        className
      )}
      onClick={() => {
        if (!tool.slug.includes("coming")) {
          onStartTool(tool.slug);
        }
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">{name}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tool.reason}
            </p>
          </div>
          <div className="shrink-0 mt-1">
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/60 transition-all duration-500"
              style={{ width: `${Math.round(tool.relevance * 100)}%` }}
            />
          </div>
          <span className="ml-2 text-[10px] font-medium text-muted-foreground">
            {Math.round(tool.relevance * 100)}% match
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
