import type { ToolSeoRecord } from "@/data/tools";

export function ToolIntro({ tool }: { tool: ToolSeoRecord }) {
  return (
    <section className="space-y-3">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.h1}</h1>
      <p className="text-base text-muted-foreground">
        {tool.primaryKeyword} helps you understand your relationship patterns with clear, practical insights. {tool.shortDescription}
      </p>
    </section>
  );
}
