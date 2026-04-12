import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact LoveCheck",
  description: "Contact LoveCheck for support, feedback, and partnership requests.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact</h1>
      <p className="text-muted-foreground">
        For support, editorial feedback, or business inquiries, email us at support@lovecheck.app.
      </p>
      <p className="text-muted-foreground">
        We usually respond within 2 business days.
      </p>
    </main>
  );
}
