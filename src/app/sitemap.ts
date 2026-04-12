import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/canonical";
import { toolRegistry } from "@/data/tools";
import { blogRegistry } from "@/data/blog-posts-registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/tools",
    "/quizzes",
    "/relationship-tests",
    "/texting-tools",
    "/red-flags",
    "/green-flags",
    "/compatibility",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = toolRegistry.map((tool) => ({
    url: `${SITE_URL}/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogRegistry.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...toolEntries, ...blogEntries];
}
