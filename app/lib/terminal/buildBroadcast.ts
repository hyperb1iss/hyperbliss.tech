// Server-side builder: the "announce everything" broadcast painted by neofetch
// and read by native commands. Pure and synchronous. Releases are fetched by
// the caller (only a curated few — §5.10) and passed in; an empty/missing ship
// is a supported state (the broadcast still renders).

import type { LabSummary, NowData, PostSummary, ProjectSummary } from '../content'
import type { Broadcast, BroadcastShip } from './types'

export interface BuildBroadcastInput {
  now: NowData
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
  const { now, posts, projects, lab, latestShip = null, generatedAt } = input

  const latestPost = newest(posts)
  const latestProject = newest(projects)

  return {
    focus: now.focus ?? 'Building things, open source all the way down.',
    generatedAt,
    labCount: lab.length,
    latestPost: latestPost
      ? { date: latestPost.date, href: `/blog/${latestPost.slug}/`, title: latestPost.title }
      : null,
    latestProject: latestProject
      ? { date: latestProject.date, href: `/projects/${latestProject.slug}/`, title: latestProject.title }
      : null,
    latestShip,
    location: now.location,
    nowUpdated: now.updated,
    postCount: posts.length,
    projectCount: projects.length,
  }
}
