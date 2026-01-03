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

/**
 * Convert TinaMarkdown AST node to markdown string.
 * Handles various node types that TinaCMS generates.
 */
function astNodeToMarkdown(node: Record<string, unknown>, depth = 0): string {
  if (!node || typeof node !== 'object') return ''

  const type = node.type as string | undefined
  const children = node.children as Record<string, unknown>[] | undefined
  const text = node.text as string | undefined
  const value = node.value as string | undefined

  // Text node
  if (text !== undefined) {
    let result = text
    if (node.bold) result = `**${result}**`
    if (node.italic) result = `_${result}_`
    if (node.code) result = `\`${result}\``
    return result
  }

  // Raw markdown (invalid_markdown type from TinaCMS local mode)
  if (type === 'invalid_markdown' && value) {
    return value
  }

  // Process children recursively
  const childContent = children?.map((c) => astNodeToMarkdown(c, depth)).join('') ?? ''

  switch (type) {
    case 'root':
      return childContent
    case 'h1':
      return `# ${childContent}\n\n`
    case 'h2':
      return `## ${childContent}\n\n`
    case 'h3':
      return `### ${childContent}\n\n`
    case 'h4':
      return `#### ${childContent}\n\n`
    case 'h5':
      return `##### ${childContent}\n\n`
    case 'h6':
      return `###### ${childContent}\n\n`
    case 'p':
      return `${childContent}\n\n`
    case 'ul':
      return `${children?.map((c) => `- ${astNodeToMarkdown(c, depth + 1).trim()}\n`).join('') ?? ''}\n`
    case 'ol':
      return `${children?.map((c, i) => `${i + 1}. ${astNodeToMarkdown(c, depth + 1).trim()}\n`).join('') ?? ''}\n`
    case 'li':
      return childContent
    case 'lic': // List item content
      return childContent
    case 'blockquote':
      return `> ${childContent.trim()}\n\n`
    case 'code_block': {
      const lang = (node.lang as string) || ''
      return `\`\`\`${lang}\n${value || childContent}\`\`\`\n\n`
    }
    case 'a': {
      const url = node.url as string
      return `[${childContent}](${url})`
    }
    case 'img': {
      const src = node.url as string
      const alt = (node.alt as string) || ''
      return `![${alt}](${src})`
    }
    case 'strong':
      return `**${childContent}**`
    case 'em':
    case 'emphasis':
      return `_${childContent}_`
    case 'hr':
      return '---\n\n'
    case 'br':
      return '\n'
    default:
      return childContent
  }
}

/**
 * Convert TinaMarkdownContent AST to raw markdown string.
 * Used when we need to process markdown with custom parsers (like resume parser).
 */
export function tinaMarkdownToString(content: TinaMarkdownContent | string | null): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  // Handle AST object
  if (typeof content === 'object' && 'children' in content) {
    return astNodeToMarkdown(content as Record<string, unknown>).trim()
  }

  return ''
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
  const result = await getPostWithQuery(slug)
  return result.post
}

/**
 * Get post with raw query data for visual editing support.
 * Returns both processed post data and the raw query/variables for useTina.
 */
export async function getPostWithQuery(slug: string): Promise<{
  post: PostDetail
  query: string
  variables: { relativePath: string }
  data: object
}> {
  const relativePath = `${slug}.md`
  const response = await client.queries.posts({ relativePath })
  const postData = response.data.posts

  // Always convert body to string to avoid TinaMarkdown React 19 SSG issues
  const bodyContent = extractBodyContent(postData.body)
  const bodyString = typeof bodyContent === 'string' ? bodyContent : tinaMarkdownToString(bodyContent)

  const post: PostDetail = {
    author: postData.author ?? null,
    body: bodyString,
    coverImage: postData.coverImage ?? null,
    date: postData.date ?? null,
    displayTitle: formatDisplayTitle(postData.emoji, postData.title),
    emoji: postData.emoji ?? null,
    excerpt: postData.excerpt ?? null,
    slug,
    tags: postData.tags ?? null,
    title: postData.title,
  }

  return {
    data: response.data,
    post,
    query: response.query,
    variables: { relativePath },
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
  const result = await getProjectWithQuery(slug)
  return result.project
}

/**
 * Get project with raw query data for visual editing support.
 * Returns both processed project data and the raw query/variables for useTina.
 */
export async function getProjectWithQuery(slug: string): Promise<{
  project: ProjectDetail
  query: string
  variables: { relativePath: string }
  data: object
}> {
  const relativePath = `${slug}.md`
  const response = await client.queries.projects({ relativePath })
  const projectData = response.data.projects

  // Always convert body to string to avoid TinaMarkdown React 19 SSG issues
  const bodyContent = extractBodyContent(projectData.body)
  const bodyString = typeof bodyContent === 'string' ? bodyContent : tinaMarkdownToString(bodyContent)

  const project: ProjectDetail = {
    body: bodyString,
    category: projectData.category ?? null,
    coverImage: projectData.coverImage ?? null,
    date: projectData.date ?? null,
    description: projectData.description ?? null,
    displayTitle: formatDisplayTitle(projectData.emoji, projectData.title),
    emoji: projectData.emoji ?? null,
    github: projectData.github ?? null,
    image: projectData.image ?? null,
    slug,
    status: projectData.status ?? null,
    tags: projectData.tags ?? null,
    title: projectData.title,
  }

  return {
    data: response.data,
    project,
    query: response.query,
    variables: { relativePath },
  }
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const response = await client.queries.projectsConnection()

  return (response.data.projectsConnection.edges ?? [])
    .map((edge) => edge?.node?._sys.relativePath)
    .filter((path): path is string => !!path)
    .map(getSlugFromRelativePath)
}

// ============================================================
// Pages functions (Home, About, etc.)
// ============================================================

export interface HeroSection {
  welcomeText: string | null
  name: string | null
  subtitle: string | null
  primaryCtaText: string | null
  primaryCtaLink: string | null
  secondaryCtaText: string | null
  secondaryCtaLink: string | null
  scrollText: string | null
}

export interface ContactReason {
  title: string
  description: string
}

export interface AboutIntro {
  greeting: string | null
  name: string | null
  highlightText: string | null
  introText: string | null
}

export interface AboutSection {
  profileImage: string | null
  profileImageAlt: string | null
  intro: AboutIntro | null
  bio: string | null
  contactIntro: string | null
  contactReasons: ContactReason[] | null
}

export interface FeaturedProjectsSection {
  title: string | null
  subtitle: string | null
  ctaText: string | null
}

export interface LatestPostsSection {
  title: string | null
  emptyStateText: string | null
}

export interface PageData {
  slug: string
  title: string
  description: string
  hero: HeroSection | null
  about: AboutSection | null
  featuredProjects: FeaturedProjectsSection | null
  latestPosts: LatestPostsSection | null
}

export async function getPage(slug: string): Promise<PageData> {
  const relativePath = `${slug}.json`
  const response = await client.queries.pages({ relativePath })
  const page = response.data.pages

  return {
    about: page.about
      ? {
          bio: page.about.bio ?? null,
          contactIntro: page.about.contactIntro ?? null,
          contactReasons: page.about.contactReasons
            ? page.about.contactReasons.map((r) => ({
                description: r?.description ?? '',
                title: r?.title ?? '',
              }))
            : null,
          intro: page.about.intro
            ? {
                greeting: page.about.intro.greeting ?? null,
                highlightText: page.about.intro.highlightText ?? null,
                introText: page.about.intro.introText ?? null,
                name: page.about.intro.name ?? null,
              }
            : null,
          profileImage: page.about.profileImage ?? null,
          profileImageAlt: page.about.profileImageAlt ?? null,
        }
      : null,
    description: page.description,
    featuredProjects: page.featuredProjects
      ? {
          ctaText: page.featuredProjects.ctaText ?? null,
          subtitle: page.featuredProjects.subtitle ?? null,
          title: page.featuredProjects.title ?? null,
        }
      : null,
    hero: page.hero
      ? {
          name: page.hero.name ?? null,
          primaryCtaLink: page.hero.primaryCtaLink ?? null,
          primaryCtaText: page.hero.primaryCtaText ?? null,
          scrollText: page.hero.scrollText ?? null,
          secondaryCtaLink: page.hero.secondaryCtaLink ?? null,
          secondaryCtaText: page.hero.secondaryCtaText ?? null,
          subtitle: page.hero.subtitle ?? null,
          welcomeText: page.hero.welcomeText ?? null,
        }
      : null,
    latestPosts: page.latestPosts
      ? {
          emptyStateText: page.latestPosts.emptyStateText ?? null,
          title: page.latestPosts.title ?? null,
        }
      : null,
    slug: page.slug,
    title: page.title,
  }
}

// ============================================================
// Resume functions
// ============================================================

export interface ResumeData {
  title: string
  description: string | null
  body: TinaMarkdownContent | string | null
}

export async function getResume(): Promise<ResumeData> {
  const response = await client.queries.resume({ relativePath: 'resume.md' })
  const resume = response.data.resume

  // Always convert body to string to avoid TinaMarkdown React 19 SSG issues
  const bodyContent = extractBodyContent(resume.body)
  const bodyString = typeof bodyContent === 'string' ? bodyContent : tinaMarkdownToString(bodyContent)

  return {
    body: bodyString,
    description: resume.description ?? null,
    title: resume.title,
  }
}

// ============================================================
// Site Config functions
// ============================================================

export interface SiteConfig {
  seo: {
    siteTitle: string
    siteDescription: string
    siteName: string
    authorName: string
    twitterHandle: string | null
    keywords: string[] | null
    ogImage: string | null
  }
  navigation: Array<{ label: string; href: string }>
  socialLinks: Array<{ label: string; href: string; icon: string | null }>
  techTags: string[] | null
  notFound: {
    title: string | null
    subtitle: string | null
    description: string | null
    messages: string[] | null
    primaryButtonText: string | null
    primaryButtonLink: string | null
    secondaryButtonText: string | null
    secondaryButtonLink: string | null
  } | null
  footer: {
    brandText: string | null
    copyrightName: string | null
    copyrightYear: number | null
    madeWithText: string | null
  } | null
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const response = await client.queries.siteConfig({ relativePath: 'site.json' })
  const config = response.data.siteConfig

  return {
    footer: config.footer
      ? {
          brandText: config.footer.brandText ?? null,
          copyrightName: config.footer.copyrightName ?? null,
          copyrightYear: config.footer.copyrightYear ?? null,
          madeWithText: config.footer.madeWithText ?? null,
        }
      : null,
    navigation: (config.navigation ?? []).map((n) => ({
      href: n?.href ?? '',
      label: n?.label ?? '',
    })),
    notFound: config.notFound
      ? {
          description: config.notFound.description ?? null,
          messages: config.notFound.messages?.filter((m): m is string => m !== null) ?? null,
          primaryButtonLink: config.notFound.primaryButtonLink ?? null,
          primaryButtonText: config.notFound.primaryButtonText ?? null,
          secondaryButtonLink: config.notFound.secondaryButtonLink ?? null,
          secondaryButtonText: config.notFound.secondaryButtonText ?? null,
          subtitle: config.notFound.subtitle ?? null,
          title: config.notFound.title ?? null,
        }
      : null,
    seo: {
      authorName: config.seo?.authorName ?? '',
      keywords: config.seo?.keywords?.filter((k): k is string => k !== null) ?? null,
      ogImage: config.seo?.ogImage ?? null,
      siteDescription: config.seo?.siteDescription ?? '',
      siteName: config.seo?.siteName ?? '',
      siteTitle: config.seo?.siteTitle ?? '',
      twitterHandle: config.seo?.twitterHandle ?? null,
    },
    socialLinks: (config.socialLinks ?? []).map((s) => ({
      href: s?.href ?? '',
      icon: s?.icon ?? null,
      label: s?.label ?? '',
    })),
    techTags: config.techTags?.filter((t): t is string => t !== null) ?? null,
  }
}
