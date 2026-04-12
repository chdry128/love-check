import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms Of Use | LoveCheck",
  description: "Read LoveCheck terms of use for platform access, user responsibilities, and limitations.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms Of Use</h1>
      <p className="text-muted-foreground">Last updated: 2026-04-12</p>
      <p className="text-muted-foreground">
        By using LoveCheck, you agree to use our tools responsibly for self-reflection and educational purposes.
      </p>
      <p className="text-muted-foreground">
        LoveCheck content does not replace professional therapy, legal advice, or emergency support services.
      </p>
    </main>
  );
}
