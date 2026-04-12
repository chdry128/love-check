import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer | LoveCheck",
  description: "LoveCheck disclaimer about educational use, self-reflection tools, and mental health support boundaries.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Disclaimer</h1>
      <p className="text-muted-foreground">
        LoveCheck tools and articles are for self-reflection, education, and entertainment.
      </p>
      <p className="text-muted-foreground">
        LoveCheck does not provide medical, psychiatric, or legal advice. If you are in distress or unsafe, contact local emergency services or a licensed professional.
      </p>
      <p className="text-muted-foreground">
        Tool outputs are guidance only and should not be used as a sole basis for major personal decisions.
      </p>
    </main>
  );
}
