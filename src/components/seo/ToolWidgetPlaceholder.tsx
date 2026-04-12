import type { ToolSeoRecord } from "@/data/tools";

export function ToolWidgetPlaceholder({ tool }: { tool: ToolSeoRecord }) {
  const badge = tool.status === "live" ? "Live" : tool.status === "beta" ? "Beta" : "Placeholder";

  return (
    <section className="space-y-3 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{tool.seoName} tool</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{badge}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Interactive mode is available in staged rollout. This SEO page remains fully indexable with complete guidance and related resources.
      </p>
    </section>
  );
}
