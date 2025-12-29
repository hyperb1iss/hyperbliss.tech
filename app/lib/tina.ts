// app/lib/tina.ts
// TinaCMS client utilities for fetching content

import { TinaMarkdownContent } from 'tinacms/dist/rich-text'
import client from '../../tina/__generated__/client'

export type { TinaMarkdownContent } from 'tinacms/dist/rich-text'
// Re-export types for convenience
export type { Posts, Projects } from '../../tina/__generated__/types'

// Helper to format display title with emoji
export function formatDisplayTitle(emoji: string | null | undefined, title: string): string {
  return emoji ? `${emoji} ${title}` : title
}

// Helper to extract slug from relativePath (removes .md extension)
export function getSlugFromRelativePath(relativePath: string): string {
  return relativePath.replace(/\.md$/, '')
}

/**
 * Extract raw markdown from TinaCMS body content.
 * When using localContentPath, TinaCMS returns an AST with type: "invalid_markdown"
 * containing raw markdown in the "value" property. This function extracts
 * that raw markdown for use with MarkdownRenderer.
 */
function extractBodyContent(body: unknown): TinaMarkdownContent | string | null {
  if (!body) return null
  if (typeof body === 'string') return body
  if (typeof body !== 'object') return null

  const obj = body as Record<string, unknown>

  // Check for AST structure with children
  if ('children' in obj && Array.isArray(obj.children)) {
    const children = obj.children as Array<Record<string, unknown>>

    // Check for "invalid_markdown" type - TinaCMS returns this when markdown isn't parsed
    for (const child of children) {
      if (
        child &&
        typeof child === 'object' &&
        'type' in child &&
        child.type === 'invalid_markdown' &&
        'value' in child &&
        typeof child.value === 'string'
      ) {
        // Found raw markdown - return it as a string
        return child.value
      }
    }

    // Check if this is a proper parsed AST (has type: 'p', 'h1', etc.)
    const hasTypedNodes = children.some(
      (child) =>
        child &&
        typeof child === 'object' &&
        'type' in child &&
        typeof child.type === 'string' &&
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'code_block'].includes(child.type),
    )

    if (hasTypedNodes) {
      return body as TinaMarkdownContent
    }

    // Also check for text nodes (another possible format)
    for (const child of children) {
      if (child && typeof child === 'object' && 'text' in child && typeof child.text === 'string') {
        const text = child.text
        if (text.includes('##') || text.includes('**') || text.includes('```')) {
          return text
        }
      }
    }
  }

  // Return as-is if it seems like a proper AST
  return body as TinaMarkdownContent
}

// ============================================================
// Posts (Blog) functions
// ============================================================

export interface PostSummary {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  date: string | null
  author: string | null
  excerpt: string | null
  tags: (string | null)[] | null
  coverImage: string | null
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const response = await client.queries.postsConnection({
    sort: 'date',
  })

  const posts: PostSummary[] = []

  for (const edge of response.data.postsConnection.edges ?? []) {
    const node = edge?.node
    if (!node) continue

    posts.push({
      author: node.author ?? null,
      coverImage: node.coverImage ?? null,
      date: node.date ?? null,
      displayTitle: formatDisplayTitle(node.emoji, node.title),
      emoji: node.emoji ?? null,
      excerpt: node.excerpt ?? null,
      slug: getSlugFromRelativePath(node._sys.relativePath),
      tags: node.tags ?? null,
      title: node.title,
    })
  }

  // Sort by date descending (newest first)
  posts.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return posts
}

export interface PostDetail {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  date: string | null
  author: string | null
  excerpt: string | null
  tags: (string | null)[] | null
  coverImage: string | null
  body: TinaMarkdownContent | string | null
}

export async function getPost(slug: string): Promise<PostDetail> {
  const relativePath = `${slug}.md`
  const response = await client.queries.posts({ relativePath })
  const post = response.data.posts

  return {
    author: post.author ?? null,
    body: extractBodyContent(post.body),
    coverImage: post.coverImage ?? null,
    date: post.date ?? null,
    displayTitle: formatDisplayTitle(post.emoji, post.title),
    emoji: post.emoji ?? null,
    excerpt: post.excerpt ?? null,
    slug,
    tags: post.tags ?? null,
    title: post.title,
  }
}

export async function getAllPostSlugs(): Promise<string[]> {
  const response = await client.queries.postsConnection()

  return (response.data.postsConnection.edges ?? [])
    .map((edge) => edge?.node?._sys.relativePath)
    .filter((path): path is string => !!path)
    .map(getSlugFromRelativePath)
}

// ============================================================
// Projects functions
// ============================================================

export interface ProjectSummary {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  description: string | null
  github: string | null
  date: string | null
  tags: (string | null)[] | null
  category: string | null
  status: string | null
  image: string | null
  coverImage: string | null
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const response = await client.queries.projectsConnection({
    sort: 'date',
  })

  const projects: ProjectSummary[] = []

  for (const edge of response.data.projectsConnection.edges ?? []) {
    const node = edge?.node
    if (!node) continue

    projects.push({
      category: node.category ?? null,
      coverImage: node.coverImage ?? null,
      date: node.date ?? null,
      description: node.description ?? null,
      displayTitle: formatDisplayTitle(node.emoji, node.title),
      emoji: node.emoji ?? null,
      github: node.github ?? null,
      image: node.image ?? null,
      slug: getSlugFromRelativePath(node._sys.relativePath),
      status: node.status ?? null,
      tags: node.tags ?? null,
      title: node.title,
    })
  }

  // Sort by date descending (newest first)
  projects.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return projects
}

export interface ProjectDetail {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  description: string | null
  github: string | null
  date: string | null
  tags: (string | null)[] | null
  category: string | null
  status: string | null
  image: string | null
  coverImage: string | null
  body: TinaMarkdownContent | string | null
}

export async function getProject(slug: string): Promise<ProjectDetail> {
  const relativePath = `${slug}.md`
  const response = await client.queries.projects({ relativePath })
  const project = response.data.projects

  return {
    body: extractBodyContent(project.body),
    category: project.category ?? null,
    coverImage: project.coverImage ?? null,
    date: project.date ?? null,
    description: project.description ?? null,
    displayTitle: formatDisplayTitle(project.emoji, project.title),
    emoji: project.emoji ?? null,
    github: project.github ?? null,
    image: project.image ?? null,
    slug,
    status: project.status ?? null,
    tags: project.tags ?? null,
    title: project.title,
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const response = await client.queries.projectsConnection()

  return (response.data.projectsConnection.edges ?? [])
    .map((edge) => edge?.node?._sys.relativePath)
    .filter((path): path is string => !!path)
    .map(getSlugFromRelativePath)
}
