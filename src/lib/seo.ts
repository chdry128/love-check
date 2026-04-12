import type { Metadata } from "next";
import { toCanonical } from "@/lib/canonical";

export type BuildMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function buildMetadata(input: BuildMetaInput): Metadata {
  const canonical = toCanonical(input.path);
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      url: canonical,
      siteName: "LoveCheck",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}
