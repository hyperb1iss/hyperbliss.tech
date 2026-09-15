// Lanes, featuring, and small presentational helpers for the Projects page.
// Pure functions so the page can be a server component and the logic testable.

import type { ProjectSummary } from './content'
import type { RepoStats } from './github'

export type LaneId = 'agents' | 'terminal' | 'lighting' | 'web'

export interface Lane {
  id: LaneId
  label: string
  blurb: string
}

export const LANES: readonly Lane[] = [
  { blurb: 'Memory, orchestration, and tools for agents that actually ship work.', id: 'agents', label: 'Agents & AI' },
  { blurb: 'CLIs and TUIs that are fast, colorful, and pleasant to live in.', id: 'terminal', label: 'Terminal & CLI' },
  { blurb: 'RGB, LEDs, and the daemons that keep them alive on Linux.', id: 'lighting', label: 'Lighting & hardware' },
  {
    blurb: 'This site, the editor, the shell, and the glue between them.',
    id: 'web',
    label: 'Web, editors & environment',
  },
]

export interface ProjectEntry {
  project: ProjectSummary
  version: string | null
  releaseUrl: string | null
  releaseDate: string | null
  stats: RepoStats | null
}

export function laneOf(category: string | null | undefined): LaneId {
  switch (category) {
    case 'agents':
    case 'terminal':
    case 'lighting':
    case 'web':
      return category
    default:
      return 'web'
  }
}

const time = (iso: string | null | undefined): number => {
  if (!iso) return 0
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? 0 : t
}

/** Newest release first, then most recently pushed, then most starred, then by name. */
export function sortEntries(entries: ProjectEntry[]): ProjectEntry[] {
  return [...entries].sort((a, b) => {
    const byRelease = time(b.releaseDate) - time(a.releaseDate)
    if (byRelease !== 0) return byRelease
    const byPush = time(b.stats?.pushedAt) - time(a.stats?.pushedAt)
    if (byPush !== 0) return byPush
    const byStars = (b.stats?.stars ?? 0) - (a.stats?.stars ?? 0)
    if (byStars !== 0) return byStars
    return a.project.title.localeCompare(b.project.title)
  })
}

/** Non-empty lanes in canonical order, each with its entries sorted. */
export function groupByLane(entries: ProjectEntry[]): Array<{ lane: Lane; entries: ProjectEntry[] }> {
  return LANES.map((lane) => ({
    entries: sortEntries(entries.filter((e) => laneOf(e.project.category) === lane.id)),
    lane,
  })).filter((group) => group.entries.length > 0)
}

/**
 * The featured trio. Projects pinned with a `featured` rank in their
 * frontmatter come first, in rank order. Any remaining slots go to the most
 * starred repos, recent activity as the tiebreak, falling back to release
 * recency unless most repos answered with stats.
 */
export function pickFeatured(entries: ProjectEntry[], count = 3): ProjectEntry[] {
  const pinned = entries
    .filter((e) => typeof e.project.featured === 'number')
    .sort((a, b) => (a.project.featured ?? 0) - (b.project.featured ?? 0))
    .slice(0, count)
  if (pinned.length === count) return pinned
  const taken = new Set(pinned.map((e) => e.project.slug))
  const rest = rankEntries(entries.filter((e) => !taken.has(e.project.slug)))
  return [...pinned, ...rest.slice(0, count - pinned.length)]
}

/** Every entry in flagship order: stars when most repos answered, otherwise recency. */
function rankEntries(entries: ProjectEntry[]): ProjectEntry[] {
  const candidates = entries.filter((e) => e.project.github)
  const withStats = candidates.filter((e) => e.stats && !e.stats.archived)
  // A rate-limited build answers for a handful of repos and nulls the rest.
  // Ranking that subset would crown whichever repos got through, so anything
  // short of majority coverage is treated like no coverage at all.
  if (candidates.length === 0 || withStats.length < Math.ceil(candidates.length / 2)) {
    return sortEntries(entries)
  }
  return [...withStats].sort((a, b) => {
    const byStars = (b.stats?.stars ?? 0) - (a.stats?.stars ?? 0)
    if (byStars !== 0) return byStars
    return time(b.stats?.pushedAt) - time(a.stats?.pushedAt)
  })
}

/** "3d ago", "2h ago", "5mo ago", "2y ago"; null for unusable input. */
export function relativeTime(iso: string | null | undefined, now = Date.now()): string | null {
  const t = time(iso)
  if (!t) return null
  const s = Math.max(0, Math.floor((now - t) / 1000))
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo}mo ago`
  return `${Math.floor(d / 365)}y ago`
}

/** GitHub-flavored language colors, kept to the ones this portfolio uses. */
export const LANGUAGE_COLORS: Record<string, string> = {
  C: '#a8b9cc',
  'C++': '#f34b7d',
  CSS: '#663399',
  Go: '#00add8',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#a97bff',
  Lua: '#7f9cff',
  Python: '#3572a5',
  Rust: '#dea584',
  Shell: '#89e051',
  TypeScript: '#3178c6',
  Vue: '#41b883',
}

export function languageColor(language: string | null | undefined): string {
  return (language && LANGUAGE_COLORS[language]) || 'var(--silk-steel-500)'
}

export function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n)
}
