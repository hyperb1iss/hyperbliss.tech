// Helpers for folding GitHub releases into the broadcast. The caller fetches
// releases for only a curated few "currently shipping" repos (§5.10); these
// pure helpers pick the newest as the headline ship and map versions onto
// project entries. An empty map yields a null ship — a supported state.

import type { ProjectSummary } from '../content'
import type { BroadcastShip } from './types'

export interface ReleaseLike {
  version: string
  publishedAt: string
  url: string
}

/** Project slug → version, for annotating manifest entries. */
export function versionsMap(releases: Map<string, ReleaseLike>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [slug, release] of releases) out[slug] = release.version
  return out
}

/** Newest release across the curated set, or null if there are none. */
export function pickLatestShip(releases: Map<string, ReleaseLike>, projects: ProjectSummary[]): BroadcastShip | null {
  const titleBySlug = new Map(projects.map((p) => [p.slug, p.title]))
  let best: BroadcastShip | null = null
  for (const [slug, release] of releases) {
    const candidate: BroadcastShip = {
      project: titleBySlug.get(slug) ?? slug,
      publishedAt: release.publishedAt,
      slug,
      url: release.url,
      version: release.version,
    }
    if (!best || new Date(candidate.publishedAt).getTime() > new Date(best.publishedAt).getTime()) {
      best = candidate
    }
  }
  return best
}
