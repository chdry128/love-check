import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | LoveCheck",
  description: "Read the LoveCheck privacy policy to understand how we handle data, cookies, and user privacy.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: 2026-04-12</p>
      <p className="text-muted-foreground">
        LoveCheck is privacy-first. Our relationship tools are designed to minimize data collection and keep user interactions lightweight.
      </p>
      <p className="text-muted-foreground">
        We do not sell personal data. Where analytics are used, they are limited to performance and product quality improvements.
      </p>
    </main>
  );
}
