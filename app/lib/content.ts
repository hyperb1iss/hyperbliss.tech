// app/lib/content.ts
// Filesystem-based content library

// ============================================================
// Helpers
// ============================================================

import {
  getMarkdownSlugs,
  readJsonContent,
  readMarkdown,
  readMarkdownOrNull,
  resolveMarkdownFile,
  resolveMarkdownFileOrNull,
} from './contentCollections'
import { extractHeadings } from './reading'

export { readRawContentFile } from './contentCollections'

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
  return getMarkdownSlugs('posts')
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getAllPostSlugs()
  const posts: PostSummary[] = []

  for (const slug of slugs) {
    const { data } = await readMarkdown(await resolveMarkdownFile('posts', slug))
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

export async function getPost(slug: string): Promise<PostDetail | null> {
  const relativePath = await resolveMarkdownFileOrNull('posts', slug)
  const parsed = relativePath ? await readMarkdownOrNull(relativePath) : null
  if (!parsed) return null
  const { data, content } = parsed

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
  return getMarkdownSlugs('lab')
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

export async function getLabExperiment(slug: string): Promise<LabDetail | null> {
  const parsed = await readMarkdownOrNull(`lab/${slug}.md`)
  if (!parsed) return null
  const { data, content } = parsed

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
  /** Pinned position in the flagship trio (1 is first); null when unpinned. */
  featured?: number | null
  /** One sentence that sells the product, shown big on its chapter; falls back to the title's tagline. */
  pitch?: string | null
  /** The product's own site, when it has one; the primary call to action. */
  website?: string | null
  /** A 16:10 product screenshot under /images, shown on flagship panels and the product page. */
  screenshot?: string | null
  screenshotAlt?: string | null
  /** Whether the body has a heading with the `install` id the product page's call to action links to. */
  hasInstall?: boolean
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
  website: string | null
  screenshot: string | null
  screenshotAlt: string | null
  body: string | null
}

/** True when the body renders a heading with the `install` id, the anchor product calls to action link to. */
export function hasInstallSection(markdown: string): boolean {
  return extractHeadings(markdown).some((heading) => heading.id === 'install')
}

export async function getAllProjectSlugs(): Promise<string[]> {
  return getMarkdownSlugs('projects')
}

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const slugs = await getAllProjectSlugs()
  const projects: ProjectSummary[] = []

  for (const slug of slugs) {
    const { data, content } = await readMarkdown(`projects/${slug}.md`)
    projects.push({
      category: (data.category as string) ?? null,
      coverImage: (data.coverImage as string) ?? null,
      date: (data.date as string) ?? null,
      description: (data.description as string) ?? null,
      displayTitle: formatDisplayTitle(data.emoji as string | undefined, data.title as string),
      emoji: (data.emoji as string) ?? null,
      featured: typeof data.featured === 'number' ? data.featured : null,
      github: (data.github as string) ?? null,
      hasInstall: hasInstallSection(content),
      image: (data.image as string) ?? null,
      pitch: (data.pitch as string) ?? null,
      screenshot: (data.screenshot as string) ?? null,
      screenshotAlt: (data.screenshotAlt as string) ?? null,
      slug,
      status: (data.status as string) ?? null,
      tags: (data.tags as string[]) ?? null,
      title: data.title as string,
      website: (data.website as string) ?? null,
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

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  const parsed = await readMarkdownOrNull(`projects/${slug}.md`)
  if (!parsed) return null
  const { data, content } = parsed

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
    screenshot: (data.screenshot as string) ?? null,
    screenshotAlt: (data.screenshotAlt as string) ?? null,
    slug,
    status: (data.status as string) ?? null,
    tags: (data.tags as string[]) ?? null,
    title: data.title as string,
    website: (data.website as string) ?? null,
  }
}

// ============================================================
// Pages (Home, About, etc.)
// ============================================================

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

/** The front page's opening: the hero headline, one line per entry, and the intro under it. */
export interface FrontSection {
  bio: string | null
  /** Hero headline lines; one of them is set in the accent colors. */
  headline: string[] | null
  /** Which headline line takes the accent, counted from 0. Defaults to the last. */
  headlineAccent: number | null
  /** The front page's opening sentence. `{hyperbliss}` and `{name}` are rendered as the brand mark and the About link. */
  tagline: string | null
}

export interface Principle {
  title: string
  description: string
}

/** The company half of the About page: who publishes the software, how it works, how to reach it. */
export interface CompanySection {
  lede: string | null
  principles: Principle[] | null
  contactIntro: string | null
  contactEmail: string | null
  legalName: string | null
  location: string | null
}

export interface PageData {
  slug: string
  title: string
  description: string
  front: FrontSection | null
  about: AboutSection | null
  company: CompanySection | null
}

/** Raw JSON shape — matches the files in content/pages/ */
interface RawPageJson {
  slug: string
  title: string
  description: string
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
  front?: {
    bio?: string
    headline?: string[]
    headlineAccent?: number
    tagline?: string
  }
  company?: {
    lede?: string
    principles?: Array<{ title?: string; description?: string }>
    contactIntro?: string
    contactEmail?: string
    legalName?: string
    location?: string
  }
}

export async function getPage(slug: string): Promise<PageData> {
  const raw = await readJsonContent<RawPageJson>(`pages/${slug}.json`)

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
    company: raw.company
      ? {
          contactEmail: raw.company.contactEmail ?? null,
          contactIntro: raw.company.contactIntro ?? null,
          lede: raw.company.lede ?? null,
          legalName: raw.company.legalName ?? null,
          location: raw.company.location ?? null,
          principles: raw.company.principles
            ? raw.company.principles.map((p) => ({ description: p.description ?? '', title: p.title ?? '' }))
            : null,
        }
      : null,
    description: raw.description,
    front: raw.front
      ? {
          bio: raw.front.bio ?? null,
          headline: Array.isArray(raw.front.headline) ? raw.front.headline : null,
          headlineAccent: typeof raw.front.headlineAccent === 'number' ? raw.front.headlineAccent : null,
          tagline: raw.front.tagline ?? null,
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
