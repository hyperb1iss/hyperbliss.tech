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

export function isSafeSlug(slug: string): boolean {
  return /^[\w.-]+$/.test(slug)
}

export function assertSafeSlug(slug: string): void {
  if (!isSafeSlug(slug)) {
    throw new ContentNotFoundError(slug)
  }
}

// Essay files carry a date prefix (2026.07.21_loop-engineering.md) so the
// directory reads chronologically; the public slug is everything after it.
const DATED_FILENAME = /^\d{4}\.\d{2}\.\d{1,2}_/

/** Public slug for a markdown filename in a collection. */
export function slugFromFilename(directory: MarkdownDirectory, filename: string): string {
  const base = filename.replace(/\.md$/, '')
  return directory === 'posts' ? base.replace(DATED_FILENAME, '') : base
}

const fileIndexes = new Map<MarkdownDirectory, Promise<Map<string, string>>>()

/**
 * Slug to filename for one collection. Cached per process in production;
 * re-read on every call in development so a new file shows up without a
 * restart.
 */
function fileIndex(directory: MarkdownDirectory): Promise<Map<string, string>> {
  const cached = fileIndexes.get(directory)
  if (cached && process.env.NODE_ENV === 'production') return cached
  const pending = (async () => {
    const files = await fs.readdir(contentPath(MARKDOWN_COLLECTIONS[directory].directory))
    const index = new Map<string, string>()
    for (const filename of files) {
      if (!filename.endsWith('.md')) continue
      const slug = slugFromFilename(directory, filename)
      const taken = index.get(slug)
      if (taken) throw new Error(`Duplicate ${directory} slug "${slug}": ${taken} and ${filename}`)
      index.set(slug, filename)
    }
    return index
  })()
  fileIndexes.set(directory, pending)
  // A failed listing must not be served from cache for the life of the process.
  pending.catch(() => fileIndexes.delete(directory))
  return pending
}

/** Content-relative path of the file behind a slug, or null when nothing backs it. */
export async function resolveMarkdownFileOrNull(directory: MarkdownDirectory, slug: string): Promise<string | null> {
  // A traversal attempt is "nothing here", not an exception, same as a bad path.
  if (!isSafeSlug(slug)) return null
  const filename = (await fileIndex(directory)).get(slug)
  return filename ? `${MARKDOWN_COLLECTIONS[directory].directory}/${filename}` : null
}

export async function resolveMarkdownFile(directory: MarkdownDirectory, slug: string): Promise<string> {
  const relativePath = await resolveMarkdownFileOrNull(directory, slug)
  if (!relativePath) throw new ContentNotFoundError(`${MARKDOWN_COLLECTIONS[directory].directory}/${slug}.md`)
  return relativePath
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
  return [...(await fileIndex(directory)).keys()]
}

export async function getMarkdownSource(directory: MarkdownDirectory, slug: string) {
  const relativePath = await resolveMarkdownFile(directory, slug)
  const { data, content } = await readMarkdown(relativePath)
  return { content, data, relativePath, slug }
}

export async function getRawMarkdownSource(directory: MarkdownDirectory, slug: string): Promise<string> {
  return readRawContentFile(await resolveMarkdownFile(directory, slug))
}
