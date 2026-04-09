// app/lib/content.ts
// Filesystem-based content library

import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

// ============================================================
// Helpers
// ============================================================

/** Resolve a content path relative to the project root */
function contentPath(...segments: string[]): string {
  return path.join(process.cwd(), 'content', ...segments)
}

/** Read and parse a JSON content file */
async function readJson<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(contentPath(relativePath), 'utf-8')
  return JSON.parse(raw) as T
}

/** Read a markdown file and split frontmatter from body */
async function readMarkdown(relativePath: string): Promise<{ data: Record<string, unknown>; content: string }> {
  const raw = await fs.readFile(contentPath(relativePath), 'utf-8')
  return matter(raw)
}

/** Format display title with optional emoji prefix */
export function formatDisplayTitle(emoji: string | null | undefined, title: string): string {
  return emoji ? `${emoji} ${title}` : title
}

// ============================================================
// Posts (Blog)
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
  body: string | null
}

export async function getAllPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(contentPath('posts'))
  return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getAllPostSlugs()
  const posts: PostSummary[] = []

  for (const slug of slugs) {
    const { data } = await readMarkdown(`posts/${slug}.md`)
    posts.push({
      author: (data.author as string) ?? null,
      coverImage: (data.coverImage as string) ?? null,
      date: (data.date as string) ?? null,
      displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
      emoji: (data.emoji as string) ?? null,
      excerpt: (data.excerpt as string) ?? null,
      slug,
      tags: (data.tags as string[]) ?? null,
      title: data.title as string,
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

export async function getPost(slug: string): Promise<PostDetail> {
  const { data, content } = await readMarkdown(`posts/${slug}.md`)

  return {
    author: (data.author as string) ?? null,
    body: content || null,
    coverImage: (data.coverImage as string) ?? null,
    date: (data.date as string) ?? null,
    displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
    emoji: (data.emoji as string) ?? null,
    excerpt: (data.excerpt as string) ?? null,
    slug,
    tags: (data.tags as string[]) ?? null,
    title: data.title as string,
  }
}

// ============================================================
// Lab Experiments
// ============================================================

export interface LabSummary {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  date: string | null
  author: string | null
  excerpt: string | null
  tags: (string | null)[] | null
  status: string | null
}

export interface LabDetail {
  slug: string
  emoji: string | null
  title: string
  displayTitle: string
  date: string | null
  author: string | null
  excerpt: string | null
  tags: (string | null)[] | null
  status: string | null
  body: string | null
}

export async function getAllLabSlugs(): Promise<string[]> {
  const files = await fs.readdir(contentPath('lab'))
  return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
}

export async function getAllLab(): Promise<LabSummary[]> {
  const slugs = await getAllLabSlugs()
  const experiments: LabSummary[] = []

  for (const slug of slugs) {
    const { data } = await readMarkdown(`lab/${slug}.md`)
    experiments.push({
      author: (data.author as string) ?? null,
      date: (data.date as string) ?? null,
      displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
      emoji: (data.emoji as string) ?? null,
      excerpt: (data.excerpt as string) ?? null,
      slug,
      status: (data.status as string) ?? null,
      tags: (data.tags as string[]) ?? null,
      title: data.title as string,
    })
  }

  experiments.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return experiments
}

export async function getLabExperiment(slug: string): Promise<LabDetail> {
  const { data, content } = await readMarkdown(`lab/${slug}.md`)

  return {
    author: (data.author as string) ?? null,
    body: content || null,
    date: (data.date as string) ?? null,
    displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
    emoji: (data.emoji as string) ?? null,
    excerpt: (data.excerpt as string) ?? null,
    slug,
    status: (data.status as string) ?? null,
    tags: (data.tags as string[]) ?? null,
    title: data.title as string,
  }
}

// ============================================================
// Projects
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
  latestVersion?: string | null
  releaseDate?: string | null
  releaseUrl?: string | null
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
  body: string | null
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const files = await fs.readdir(contentPath('projects'))
  return files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const slugs = await getAllProjectSlugs()
  const projects: ProjectSummary[] = []

  for (const slug of slugs) {
    const { data } = await readMarkdown(`projects/${slug}.md`)
    projects.push({
      category: (data.category as string) ?? null,
      coverImage: (data.coverImage as string) ?? null,
      date: (data.date as string) ?? null,
      description: (data.description as string) ?? null,
      displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
      emoji: (data.emoji as string) ?? null,
      github: (data.github as string) ?? null,
      image: (data.image as string) ?? null,
      slug,
      status: (data.status as string) ?? null,
      tags: (data.tags as string[]) ?? null,
      title: data.title as string,
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

export async function getProject(slug: string): Promise<ProjectDetail> {
  const { data, content } = await readMarkdown(`projects/${slug}.md`)

  return {
    body: content || null,
    category: (data.category as string) ?? null,
    coverImage: (data.coverImage as string) ?? null,
    date: (data.date as string) ?? null,
    description: (data.description as string) ?? null,
    displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
    emoji: (data.emoji as string) ?? null,
    github: (data.github as string) ?? null,
    image: (data.image as string) ?? null,
    slug,
    status: (data.status as string) ?? null,
    tags: (data.tags as string[]) ?? null,
    title: data.title as string,
  }
}

// ============================================================
// Pages (Home, About, etc.)
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

/** Raw JSON shape — matches the files in content/pages/ */
interface RawPageJson {
  slug: string
  title: string
  description: string
  hero?: {
    welcomeText?: string
    name?: string
    subtitle?: string
    primaryCtaText?: string
    primaryCtaLink?: string
    secondaryCtaText?: string
    secondaryCtaLink?: string
    scrollText?: string
  }
  about?: {
    profileImage?: string
    profileImageAlt?: string
    intro?: {
      greeting?: string
      name?: string
      highlightText?: string
      introText?: string
    }
    bio?: string
    contactIntro?: string
    contactReasons?: Array<{ title?: string; description?: string }>
  }
  featuredProjects?: {
    title?: string
    subtitle?: string
    ctaText?: string
  }
  latestPosts?: {
    title?: string
    emptyStateText?: string
  }
}

export async function getPage(slug: string): Promise<PageData> {
  const raw = await readJson<RawPageJson>(`pages/${slug}.json`)

  return {
    about: raw.about
      ? {
          bio: raw.about.bio ?? null,
          contactIntro: raw.about.contactIntro ?? null,
          contactReasons: raw.about.contactReasons
            ? raw.about.contactReasons.map((r) => ({
                description: r.description ?? '',
                title: r.title ?? '',
              }))
            : null,
          intro: raw.about.intro
            ? {
                greeting: raw.about.intro.greeting ?? null,
                highlightText: raw.about.intro.highlightText ?? null,
                introText: raw.about.intro.introText ?? null,
                name: raw.about.intro.name ?? null,
              }
            : null,
          profileImage: raw.about.profileImage ?? null,
          profileImageAlt: raw.about.profileImageAlt ?? null,
        }
      : null,
    description: raw.description,
    featuredProjects: raw.featuredProjects
      ? {
          ctaText: raw.featuredProjects.ctaText ?? null,
          subtitle: raw.featuredProjects.subtitle ?? null,
          title: raw.featuredProjects.title ?? null,
        }
      : null,
    hero: raw.hero
      ? {
          name: raw.hero.name ?? null,
          primaryCtaLink: raw.hero.primaryCtaLink ?? null,
          primaryCtaText: raw.hero.primaryCtaText ?? null,
          scrollText: raw.hero.scrollText ?? null,
          secondaryCtaLink: raw.hero.secondaryCtaLink ?? null,
          secondaryCtaText: raw.hero.secondaryCtaText ?? null,
          subtitle: raw.hero.subtitle ?? null,
          welcomeText: raw.hero.welcomeText ?? null,
        }
      : null,
    latestPosts: raw.latestPosts
      ? {
          emptyStateText: raw.latestPosts.emptyStateText ?? null,
          title: raw.latestPosts.title ?? null,
        }
      : null,
    slug: raw.slug,
    title: raw.title,
  }
}

// ============================================================
// Resume
// ============================================================

export interface ResumeData {
  title: string
  description: string | null
  body: string | null
}

export async function getResume(): Promise<ResumeData> {
  const { data, content } = await readMarkdown('resume/resume.md')

  return {
    body: content || null,
    description: (data.description as string) ?? null,
    title: (data.title as string) ?? 'Resume',
  }
}

// ============================================================
// Site Config
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

/** Raw JSON shape — matches content/config/site.json */
interface RawSiteConfigJson {
  seo?: {
    siteTitle?: string
    siteDescription?: string
    siteName?: string
    authorName?: string
    twitterHandle?: string
    keywords?: string[]
    ogImage?: string
  }
  navigation?: Array<{ label?: string; href?: string }>
  socialLinks?: Array<{ label?: string; href?: string; icon?: string }>
  techTags?: string[]
  notFound?: {
    title?: string
    subtitle?: string
    description?: string
    messages?: string[]
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
  }
  footer?: {
    brandText?: string
    copyrightName?: string
    copyrightYear?: number
    madeWithText?: string
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = await readJson<RawSiteConfigJson>('config/site.json')

  return {
    footer: raw.footer
      ? {
          brandText: raw.footer.brandText ?? null,
          copyrightName: raw.footer.copyrightName ?? null,
          copyrightYear: raw.footer.copyrightYear ?? null,
          madeWithText: raw.footer.madeWithText ?? null,
        }
      : null,
    navigation: (raw.navigation ?? []).map((n) => ({
      href: n.href ?? '',
      label: n.label ?? '',
    })),
    notFound: raw.notFound
      ? {
          description: raw.notFound.description ?? null,
          messages: raw.notFound.messages ?? null,
          primaryButtonLink: raw.notFound.primaryButtonLink ?? null,
          primaryButtonText: raw.notFound.primaryButtonText ?? null,
          secondaryButtonLink: raw.notFound.secondaryButtonLink ?? null,
          secondaryButtonText: raw.notFound.secondaryButtonText ?? null,
          subtitle: raw.notFound.subtitle ?? null,
          title: raw.notFound.title ?? null,
        }
      : null,
    seo: {
      authorName: raw.seo?.authorName ?? '',
      keywords: raw.seo?.keywords ?? null,
      ogImage: raw.seo?.ogImage ?? null,
      siteDescription: raw.seo?.siteDescription ?? '',
      siteName: raw.seo?.siteName ?? '',
      siteTitle: raw.seo?.siteTitle ?? '',
      twitterHandle: raw.seo?.twitterHandle ?? null,
    },
    socialLinks: (raw.socialLinks ?? []).map((s) => ({
      href: s.href ?? '',
      icon: s.icon ?? null,
      label: s.label ?? '',
    })),
    techTags: raw.techTags ?? null,
  }
}
