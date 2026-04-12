import { toolRegistry } from "@/data/tools";
import { blogRegistry } from "@/data/blog-posts-registry";

export function getToolBySlug(slug: string) {
  return toolRegistry.find((tool) => tool.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogRegistry.find((post) => post.slug === slug);
}
