// Server-side builder: the "announce everything" broadcast painted by neofetch
// and read by native commands. Pure and synchronous. Releases are fetched by
// the caller (only a curated few — §5.10) and passed in; an empty/missing ship
// is a supported state (the broadcast still renders).

import type { LabSummary, PostSummary, ProjectSummary } from '../content'
import type { Broadcast, BroadcastShip } from './types'

export interface BuildBroadcastInput {
  posts: PostSummary[]
  projects: ProjectSummary[]
  lab: LabSummary[]
  /** Curated "currently shipping" release, or null when none/rate-limited. */
  latestShip?: BroadcastShip | null
  generatedAt: string
}

const newest = <T extends { date: string | null }>(items: T[]): T | null => {
  let best: T | null = null
  for (const item of items) {
    if (!item.date) continue
    if (!best || new Date(item.date).getTime() > new Date(best.date as string).getTime()) {
      best = item
    }
  }
  return best ?? items[0] ?? null
}

export function buildBroadcast(input: BuildBroadcastInput): Broadcast {
  const { posts, projects, lab, latestShip = null, generatedAt } = input

  const latestPost = newest(posts)
  // The pinned flagships (frontmatter `featured: N`), named without taglines.
  const flagships = projects
    .filter((p) => typeof p.featured === 'number')
    .sort((a, b) => (a.featured as number) - (b.featured as number))
    .map((p) => ({ date: p.date, href: `/projects/${p.slug}/`, title: p.title.split(':')[0].trim() }))

  return {
    flagships,
    generatedAt,
    labCount: lab.length,
    latestPost: latestPost
      ? { date: latestPost.date, href: `/blog/${latestPost.slug}/`, title: latestPost.title }
      : null,
    latestShip,
    postCount: posts.length,
    projectCount: projects.length,
  }
}
