// ============================================================
// LoveCheck — Tool Loader
// Loads and validates tool configurations from the registry
// ============================================================

import type { ToolConfig, ToolSlug } from '@/types';
import { toolRegistry } from '@/data/tool-registry';

/**
 * Loads a tool configuration by its slug.
 * Validates that the tool exists and returns its full config including question tree.
 *
 * @param slug - The unique identifier of the tool
 * @throws {Error} If the slug is invalid or tool not found
 * @returns Complete ToolConfig with question tree
 */
export function loadTool(slug: string): ToolConfig {
  if (!slug || typeof slug !== 'string') {
    throw new Error(
      `Invalid tool slug: expected a non-empty string, received ${typeof slug}`
    );
  }

  const tool = toolRegistry.find((t) => t.slug === slug);
  if (!tool) {
    throw new Error(`Tool not found: ${slug}`);
  }
  return tool;
}

/**
 * Checks if a tool slug exists in the registry without throwing.
 *
 * @param slug - The tool slug to check
 * @returns Whether the tool exists
 */
export function toolExists(slug: string): boolean {
  try {
    loadTool(slug);
    return true;
  } catch {
    return false;
  }
}
