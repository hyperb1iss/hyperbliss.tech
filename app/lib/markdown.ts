// app/lib/markdown.ts
// Compatibility helpers over the canonical content collection registry.

import { getMarkdownSlugs, getMarkdownSource, type MarkdownDirectory } from './contentCollections'

export type { MarkdownDirectory } from './contentCollections'

/**
 * Base interface for common frontmatter fields.
 */
export interface BaseFrontmatter extends Record<string, unknown> {
  title: string
  date: string
  excerpt: string
}

/**
 * Generic type for frontmatter that extends BaseFrontmatter.
 */
export type Frontmatter<T extends Record<string, unknown> = Record<string, unknown>> = BaseFrontmatter & T

/**
 * Interface for markdown files with a flexible frontmatter type.
 */
export interface MarkdownFile<T extends Record<string, unknown> = Record<string, unknown>> {
  slug: string
  frontmatter: Frontmatter<T>
  content: string
}

export async function getMarkdownContent<T extends Record<string, unknown> = Record<string, unknown>>(
  directory: MarkdownDirectory,
  slug: string,
): Promise<MarkdownFile<T>> {
  const { content, data } = await getMarkdownSource(directory, slug)
  return {
    content,
    frontmatter: data as Frontmatter<T>,
    slug,
  }
}

export async function getAllMarkdownSlugs(directory: MarkdownDirectory): Promise<string[]> {
  return getMarkdownSlugs(directory)
}
