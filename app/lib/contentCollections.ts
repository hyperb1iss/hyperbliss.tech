import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export const CONTENT_ROOT = path.join(process.cwd(), 'content')

export type MarkdownDirectory = keyof typeof MARKDOWN_COLLECTIONS

export interface MarkdownCollection {
  directory: 'lab' | 'posts' | 'projects'
  routeSegment: 'blog' | 'lab' | 'projects'
  virtualDir: '/blog' | '/lab' | '/projects'
}

export const MARKDOWN_COLLECTIONS = {
  lab: { directory: 'lab', routeSegment: 'lab', virtualDir: '/lab' },
  posts: { directory: 'posts', routeSegment: 'blog', virtualDir: '/blog' },
  projects: { directory: 'projects', routeSegment: 'projects', virtualDir: '/projects' },
} as const satisfies Record<string, MarkdownCollection>

export class ContentNotFoundError extends Error {
  constructor(relativePath: string) {
    super(`Content not found: ${relativePath}`)
    this.name = 'ContentNotFoundError'
  }
}

export function isMissingContent(err: unknown): boolean {
  if (err instanceof ContentNotFoundError) return true
  return typeof err === 'object' && err !== null && (err as NodeJS.ErrnoException).code === 'ENOENT'
}

export function contentPath(...segments: string[]): string {
  const resolved = path.resolve(CONTENT_ROOT, ...segments)
  if (resolved !== CONTENT_ROOT && !resolved.startsWith(`${CONTENT_ROOT}${path.sep}`)) {
    throw new ContentNotFoundError(segments.join('/'))
  }
  return resolved
}

export function assertSafeSlug(slug: string): void {
  if (!/^[\w.-]+$/.test(slug)) {
    throw new ContentNotFoundError(slug)
  }
}

export function markdownRelativePath(directory: MarkdownDirectory, slug: string): string {
  assertSafeSlug(slug)
  return `${MARKDOWN_COLLECTIONS[directory].directory}/${slug}.md`
}

export function markdownVirtualPath(directory: MarkdownDirectory, slug: string): string {
  assertSafeSlug(slug)
  return `${MARKDOWN_COLLECTIONS[directory].virtualDir}/${slug}.md`
}

export function markdownRouteHref(directory: MarkdownDirectory, slug: string): string {
  assertSafeSlug(slug)
  return `/${MARKDOWN_COLLECTIONS[directory].routeSegment}/${slug}/`
}

export function slugFromVirtualPath(virtualPath: string): { directory: MarkdownDirectory; slug: string } | null {
  for (const [directory, collection] of Object.entries(MARKDOWN_COLLECTIONS) as Array<
    [MarkdownDirectory, MarkdownCollection]
  >) {
    const prefix = `${collection.virtualDir}/`
    if (!virtualPath.startsWith(prefix) || !virtualPath.endsWith('.md')) continue
    const slug = virtualPath.slice(prefix.length, -3)
    assertSafeSlug(slug)
    return { directory, slug }
  }
  return null
}

export async function readJsonContent<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(contentPath(relativePath), 'utf-8')
  return JSON.parse(raw) as T
}

export async function readMarkdown(relativePath: string): Promise<{ data: Record<string, unknown>; content: string }> {
  const raw = await fs.readFile(contentPath(relativePath), 'utf-8')
  return matter(raw)
}

export async function readMarkdownOrNull(
  relativePath: string,
): Promise<{ data: Record<string, unknown>; content: string } | null> {
  try {
    return await readMarkdown(relativePath)
  } catch (err) {
    if (isMissingContent(err)) return null
    throw err
  }
}

export async function readRawContentFile(relativePath: string): Promise<string> {
  return fs.readFile(contentPath(relativePath), 'utf-8')
}

export async function getMarkdownSlugs(directory: MarkdownDirectory): Promise<string[]> {
  const files = await fs.readdir(contentPath(MARKDOWN_COLLECTIONS[directory].directory))
  return files.filter((filename) => filename.endsWith('.md')).map((filename) => filename.replace(/\.md$/, ''))
}

export async function getMarkdownSource(directory: MarkdownDirectory, slug: string) {
  const relativePath = markdownRelativePath(directory, slug)
  const { data, content } = await readMarkdown(relativePath)
  return { content, data, relativePath, slug }
}

export async function getRawMarkdownSource(directory: MarkdownDirectory, slug: string): Promise<string> {
  return readRawContentFile(markdownRelativePath(directory, slug))
}
