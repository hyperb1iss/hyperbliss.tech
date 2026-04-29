// app/lib/markdown.ts
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export type MarkdownDirectory = 'lab' | 'posts' | 'projects'

/**
 * Sanitizes a slug to prevent path traversal attacks.
 * Only allows alphanumeric characters, hyphens, underscores, and dots.
 * @param slug - The slug to sanitize
 * @returns The sanitized slug
 * @throws Error if slug contains invalid characters
 */
function sanitizeSlug(slug: string): string {
  // Remove any path traversal attempts
  const sanitized = slug.replace(/\.\./g, '').replace(/[/\\]/g, '')

  // Validate slug format (alphanumeric, hyphens, underscores, dots)
  if (!/^[a-zA-Z0-9._-]+$/.test(sanitized)) {
    throw new Error(`Invalid slug format: ${slug}`)
  }

  return sanitized
}

/**
 * Base interface for common frontmatter fields
 */
export interface BaseFrontmatter extends Record<string, unknown> {
  title: string
  date: string
  excerpt: string
}

/**
 * Generic type for frontmatter that extends BaseFrontmatter
 */
export type Frontmatter<T extends Record<string, unknown> = Record<string, unknown>> = BaseFrontmatter & T

/**
 * Interface for markdown files with a flexible frontmatter type
 */
export interface MarkdownFile<T extends Record<string, unknown> = Record<string, unknown>> {
  slug: string
  frontmatter: Frontmatter<T>
  content: string
}

/**
 * Reads the markdown content from the specified content section and filename.
 * @param directory - The content section containing the markdown files.
 * @param slug - The slug (filename without extension) of the markdown file.
 * @returns A Promise resolving to a MarkdownFile object.
 */
export async function getMarkdownContent<T extends Record<string, unknown> = Record<string, unknown>>(
  directory: MarkdownDirectory,
  slug: string,
): Promise<MarkdownFile<T>> {
  // Sanitize slug to prevent path traversal
  const sanitizedSlug = sanitizeSlug(slug)
  const expectedDir = path.resolve(process.cwd(), 'content', directory)
  const filePath = path.join(expectedDir, `${sanitizedSlug}.md`)

  // Additional safeguard: verify resolved path is within expected directory
  const resolvedPath = path.resolve(filePath)
  if (!resolvedPath.startsWith(`${expectedDir}${path.sep}`)) {
    throw new Error('Invalid file path')
  }

  const fileContents = await fs.readFile(resolvedPath, 'utf-8')
  const { data, content } = matter(fileContents)

  return {
    content,
    frontmatter: data as Frontmatter<T>,
    slug,
  }
}

/**
 * Retrieves all markdown files in a content section and generates their slugs.
 * @param directory - The content section containing the markdown files.
 * @returns A Promise resolving to an array of slugs.
 */
export async function getAllMarkdownSlugs(directory: MarkdownDirectory): Promise<string[]> {
  const files = await fs.readdir(path.join(process.cwd(), 'content', directory))
  return files.filter((filename) => filename.endsWith('.md')).map((filename) => filename.replace(/\.md$/, ''))
}
