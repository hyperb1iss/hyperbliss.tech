// The front-page feed: everything that happened, newest first. Essays, lab
// experiments, GitHub releases, and project launches fold into one list so the
// landing page can lead with the newest long-form piece and run the rest
// underneath it. Pure functions, server-safe, no React.

import type { LabSummary, PostSummary, ProjectSummary } from './content'

export type FeedKind = 'essay' | 'lab' | 'release' | 'launch'

export interface FeedItem {
  id: string
  kind: FeedKind
  /** ISO calendar date, YYYY-MM-DD. */
  date: string
  title: string
  summary: string | null
  /** Route for the item: internal for essays, lab, and launches; the GitHub release page for releases. */
  href: string
  /** True when `href` leaves the site. */
  external: boolean
  /** Release tag without the leading v, for release items only. */
  version: string | null
  /** Project title the item belongs to, for release and launch items. */
  project: string | null
}

export interface FeedRelease {
  version: string
  publishedAt: string
  url: string
  summary?: string | null
}

export interface FeedInput {
  posts: PostSummary[]
  lab: LabSummary[]
  projects: ProjectSummary[]
  /** Project slug → latest release. */
  releases: Map<string, FeedRelease>
}

export interface FeedOptions {
  /** Include project launches (first publish date). Defaults to true. */
  launches?: boolean
}

const LONG_FORM: readonly FeedKind[] = ['essay', 'lab']

/**
 * Project titles carry a tagline after a colon ("Sibyl: Build With Agents That
 * Remember"). The feed and rail want the name alone.
 */
export function shortName(title: string): string {
  const idx = title.indexOf(':')
  const name = idx > 0 ? title.slice(0, idx) : title
  return name.trim() || title
}

/** The part of a project title after the colon, or null when there is none. */
export function tagline(title: string): string | null {
  const idx = title.indexOf(':')
  if (idx < 0) return null
  const rest = title.slice(idx + 1).trim()
  return rest || null
}

/** Essays only, newest first, for the Blog index. */
export function essayFeed(posts: PostSummary[]): FeedItem[] {
  return buildFeed({ lab: [], posts, projects: [], releases: new Map() }, { launches: false })
}

/** Lab experiments only, newest first, for the Lab index. */
export function labFeed(lab: LabSummary[]): FeedItem[] {
  return buildFeed({ lab, posts: [], projects: [], releases: new Map() }, { launches: false })
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Normalize any parseable date to YYYY-MM-DD, or null when it isn't one.
 * Date-only input must round-trip exactly, so "2026-02-30" is rejected rather
 * than silently rolled into March.
 */
export function toIsoDay(value: string | null | undefined): string | null {
  if (!value) return null
  const time = new Date(value).getTime()
  if (Number.isNaN(time)) return null
  const day = new Date(time).toISOString().slice(0, 10)
  if (DATE_ONLY.test(value) && day !== value) return null
  return day
}

/** Build the merged feed, newest first. Items without a usable date are dropped. */
export function buildFeed(input: FeedInput, options: FeedOptions = {}): FeedItem[] {
  const { launches = true } = options
  const items: FeedItem[] = []

  for (const post of input.posts) {
    const date = toIsoDay(post.date)
    if (!date) continue
    items.push({
      date,
      external: false,
      href: `/blog/${post.slug}/`,
      id: `essay:${post.slug}`,
      kind: 'essay',
      project: null,
      summary: post.excerpt,
      title: post.title,
      version: null,
    })
  }

  for (const experiment of input.lab) {
    const date = toIsoDay(experiment.date)
    if (!date) continue
    items.push({
      date,
      external: false,
      href: `/lab/${experiment.slug}/`,
      id: `lab:${experiment.slug}`,
      kind: 'lab',
      project: null,
      summary: experiment.excerpt,
      title: experiment.title,
      version: null,
    })
  }

  const projectsBySlug = new Map(input.projects.map((project) => [project.slug, project]))

  for (const [slug, release] of input.releases) {
    const project = projectsBySlug.get(slug)
    if (!project) continue
    const date = toIsoDay(release.publishedAt)
    if (!date) continue
    const name = shortName(project.title)
    items.push({
      date,
      external: true,
      href: release.url,
      id: `release:${slug}@${release.version}`,
      kind: 'release',
      project: name,
      summary: release.summary ?? null,
      title: `${name} v${release.version}`,
      version: release.version,
    })
  }

  if (launches) {
    for (const project of input.projects) {
      const date = toIsoDay(project.date)
      if (!date) continue
      items.push({
        date,
        external: false,
        href: `/projects/${project.slug}/`,
        id: `launch:${project.slug}`,
        kind: 'launch',
        project: shortName(project.title),
        summary: project.description,
        title: project.title,
        version: null,
      })
    }
  }

  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id)))
  return items
}

export interface FrontPageFeed {
  /** Newest long-form piece (essay or lab), or the newest item if there is none. */
  lead: FeedItem | null
  /** Everything else, newest first, capped by `limit`. */
  items: FeedItem[]
}

/** Split the newest long-form piece off as the lead and cap the rest. */
export function splitLead(feed: FeedItem[], limit = 10): FrontPageFeed {
  if (feed.length === 0) return { items: [], lead: null }
  const lead = feed.find((item) => LONG_FORM.includes(item.kind)) ?? feed[0]
  const rest = feed.filter((item) => item.id !== lead.id)
  return { items: rest.slice(0, limit), lead }
}

/** Projects with a known release, newest release first, for the Shipping rail. */
export function shippingList(
  projects: ProjectSummary[],
  releases: Map<string, FeedRelease>,
  limit = 6,
): Array<{ slug: string; title: string; version: string; href: string; publishedAt: string }> {
  const rows: Array<{ slug: string; title: string; version: string; href: string; publishedAt: string }> = []
  for (const project of projects) {
    const release = releases.get(project.slug)
    if (!release) continue
    rows.push({
      href: `/projects/${project.slug}/`,
      publishedAt: release.publishedAt,
      slug: project.slug,
      title: shortName(project.title),
      version: release.version,
    })
  }
  rows.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return rows.slice(0, limit)
}
