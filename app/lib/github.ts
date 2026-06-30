// app/lib/github.ts
// GitHub API utilities for fetching release information

interface GitHubRelease {
  tag_name: string
  published_at: string
  html_url: string
}

interface ReleaseInfo {
  version: string
  publishedAt: string
  url: string
}

// Cache for GitHub release data (in-memory for build time)
const releaseCache = new Map<string, { data: ReleaseInfo | null; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

/**
 * Extract owner and repo from a GitHub URL
 * Supports: https://github.com/owner/repo, github.com/owner/repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/i)
  if (!match) return null
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  }
}

/**
 * Fetch the latest release for a GitHub repository
 */
export async function getLatestRelease(githubUrl: string): Promise<ReleaseInfo | null> {
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) return null

  const cacheKey = `${parsed.owner}/${parsed.repo}`

  // Check cache
  const cached = releaseCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Add token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      // Cache for 1 hour in Next.js fetch cache
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      // No releases or repo not found - cache the null result
      releaseCache.set(cacheKey, { data: null, timestamp: Date.now() })
      return null
    }

    const release: GitHubRelease = await response.json()

    const releaseInfo: ReleaseInfo = {
      publishedAt: release.published_at,
      url: release.html_url,
      version: release.tag_name.replace(/^v/, ''),
    }

    // Cache the result
    releaseCache.set(cacheKey, { data: releaseInfo, timestamp: Date.now() })

    return releaseInfo
  } catch (error) {
    console.error(`Failed to fetch release for ${cacheKey}:`, error)
    releaseCache.set(cacheKey, { data: null, timestamp: Date.now() })
    return null
  }
}

/**
 * Fetch releases for multiple GitHub URLs in parallel
 */
export async function getReleasesForProjects(
  projects: Array<{ slug: string; github: string | null }>,
): Promise<Map<string, ReleaseInfo>> {
  const releaseMap = new Map<string, ReleaseInfo>()

  const results = await Promise.all(
    projects.map(async (project) => {
      if (!project.github) return { release: null, slug: project.slug }
      const release = await getLatestRelease(project.github)
      return { release, slug: project.slug }
    }),
  )

  for (const { slug, release } of results) {
    if (release) {
      releaseMap.set(slug, release)
    }
  }

  return releaseMap
}

// ─── Live activity ────────────────────────────────────────────────────────────
// The public events feed answers "what projects am I active in, and when." We
// proxy it through /api/activity with a token so all visitors share one cached
// upstream call every 5 minutes instead of burning their own 60 req/hr per-IP
// budget. Key constraint (verified against the live API): the events/public
// PushEvent payload is summarized down to {before, head, push_id, ref,
// repository_id} — no commit count, no commit list. So we count PUSHES, not
// commits; real commit counts would need a per-push compare API call.

export const GITHUB_USERNAME = 'hyperb1iss'

const ACTIVITY_WINDOW_DAYS = 14
const ACTIVITY_FEED_LIMIT = 12
const ACTIVITY_REPOS_LIMIT = 8
const DAY_MS = 86_400_000

export type ActivityKind = 'push' | 'pr' | 'release' | 'create'

/** One normalized, client-safe activity item (raw event payloads are huge). */
export interface ActivityEvent {
  kind: ActivityKind
  /** Short repo name, e.g. "sibyl". */
  repo: string
  /** Owner-qualified name, e.g. "hyperb1iss/sibyl". */
  repoFull: string
  createdAt: string
  /** Human summary line, e.g. "pushed 4× to main". */
  title: string
  /** Secondary line: PR/issue title (pushes have none on this endpoint). */
  detail: string | null
  url: string
  /** Branch, push events only — used to merge consecutive pushes. */
  branch?: string
  /** Number of pushes folded into this item, push events only. */
  count?: number
}

export interface ActivitySummary {
  /** False when the upstream fetch failed — callers fall back, never throw. */
  ok: boolean
  events: ActivityEvent[]
  /** Distinct repos touched in the window, recency order. */
  repos: string[]
  /** Pushes/day over the window, oldest → newest, for a sparkline. */
  pushesPerDay: number[]
  totalPushes: number
  windowDays: number
  generatedAt: string
}

interface RawPayload {
  ref?: string
  ref_type?: string
  head?: string
  action?: string
  number?: number
  pull_request?: { title?: string; number?: number; merged?: boolean; html_url?: string }
  release?: { tag_name?: string; html_url?: string }
}

interface RawGitHubEvent {
  type?: string
  repo?: { name?: string }
  payload?: RawPayload
  created_at?: string
}

const repoUrl = (full: string): string => `https://github.com/${full}`
const truncate = (s: string, max: number): string => (s.length > max ? `${s.slice(0, max - 1)}…` : s)
const shortRepo = (full: string): string => full.slice(full.indexOf('/') + 1) || full
const pushTitle = (count: number, branch: string): string =>
  count === 1 ? `pushed to ${branch}` : `pushed ${count}× to ${branch}`

/** Map a raw event to a feed item, or null to drop it (noise / unknown type). */
function normalizeEvent(ev: RawGitHubEvent): ActivityEvent | null {
  const repoFull = ev.repo?.name
  const createdAt = ev.created_at
  if (!repoFull || !createdAt) return null
  const base = { createdAt, repo: shortRepo(repoFull), repoFull }
  const p = ev.payload ?? {}

  switch (ev.type) {
    case 'PushEvent': {
      // This endpoint omits commit count/list, so a push is one unit of work.
      const branch = (p.ref ?? '').replace('refs/heads/', '') || 'main'
      return {
        ...base,
        branch,
        count: 1,
        detail: null,
        kind: 'push',
        title: pushTitle(1, branch),
        url: p.head ? `${repoUrl(repoFull)}/commit/${p.head}` : repoUrl(repoFull),
      }
    }
    case 'PullRequestEvent': {
      const pr = p.pull_request
      const action = p.action === 'closed' && pr?.merged ? 'merged' : p.action
      if (action !== 'opened' && action !== 'merged' && action !== 'reopened') return null
      const num = p.number ?? pr?.number
      return {
        ...base,
        detail: pr?.title ? truncate(pr.title, 56) : null,
        kind: 'pr',
        title: `${action} PR${num ? ` #${num}` : ''}`,
        url: pr?.html_url ?? repoUrl(repoFull),
      }
    }
    case 'ReleaseEvent': {
      if (p.action !== 'published') return null
      const tag = p.release?.tag_name
      return {
        ...base,
        detail: null,
        kind: 'release',
        title: `released ${tag ?? ''}`.trimEnd(),
        url: p.release?.html_url ?? repoUrl(repoFull),
      }
    }
    case 'CreateEvent': {
      if (p.ref_type === 'branch')
        return { ...base, detail: null, kind: 'create', title: `created branch ${p.ref}`, url: repoUrl(repoFull) }
      if (p.ref_type === 'tag')
        return { ...base, detail: null, kind: 'create', title: `created tag ${p.ref}`, url: repoUrl(repoFull) }
      if (p.ref_type === 'repository')
        return { ...base, detail: null, kind: 'create', title: 'created repo', url: repoUrl(repoFull) }
      return null
    }
    default:
      return null
  }
}

/** Fold runs of consecutive pushes to the same repo into one counted item. */
function collapsePushes(events: ActivityEvent[]): ActivityEvent[] {
  const out: ActivityEvent[] = []
  for (const ev of events) {
    const prev = out[out.length - 1]
    if (ev.kind === 'push' && prev?.kind === 'push' && prev.repoFull === ev.repoFull) {
      prev.count = (prev.count ?? 1) + (ev.count ?? 1)
      prev.title = pushTitle(prev.count, prev.branch ?? 'main')
    } else {
      out.push({ ...ev })
    }
  }
  return out
}

function emptyActivity(ok: boolean): ActivitySummary {
  return {
    events: [],
    generatedAt: new Date().toISOString(),
    ok,
    pushesPerDay: new Array<number>(ACTIVITY_WINDOW_DAYS).fill(0),
    repos: [],
    totalPushes: 0,
    windowDays: ACTIVITY_WINDOW_DAYS,
  }
}

/**
 * Fetch and normalize a user's recent public activity. Never throws — on any
 * upstream failure it returns an empty summary with `ok: false` so the UI can
 * fall back gracefully. One upstream request; cached 5 minutes via Next.
 */
export async function getRecentActivity(username = GITHUB_USERNAME): Promise<ActivitySummary> {
  let raw: unknown
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'hyperbliss.tech',
        ...(process.env.GITHUB_TOKEN && { Authorization: `token ${process.env.GITHUB_TOKEN}` }),
      },
      next: { revalidate: 300 },
    })
    if (!response.ok) return emptyActivity(false)
    raw = await response.json()
  } catch (error) {
    console.error('Failed to fetch GitHub activity:', error)
    return emptyActivity(false)
  }
  if (!Array.isArray(raw)) return emptyActivity(false)

  const now = Date.now()
  const pushesPerDay = new Array<number>(ACTIVITY_WINDOW_DAYS).fill(0)
  const normalized: ActivityEvent[] = []

  for (const ev of raw as RawGitHubEvent[]) {
    // Push cadence counts every push in the window, even past the feed cap.
    // Clamp slightly-future timestamps (upstream clock skew) into today's
    // bucket rather than dropping them off the high end.
    if (ev.type === 'PushEvent' && ev.created_at) {
      const dayIdx = Math.min(
        ACTIVITY_WINDOW_DAYS - 1,
        ACTIVITY_WINDOW_DAYS - 1 - Math.floor((now - Date.parse(ev.created_at)) / DAY_MS),
      )
      if (dayIdx >= 0) pushesPerDay[dayIdx] += 1
    }
    const item = normalizeEvent(ev)
    if (item) normalized.push(item)
  }

  const collapsed = collapsePushes(normalized)
  // Distinct repos touched within the window only, so the summary never claims
  // "active in: <repo>" for a repo whose only event predates the window.
  // collapsed is newest-first (GitHub returns events newest-first; we never
  // reorder), so push order is already recency order.
  const windowStart = now - ACTIVITY_WINDOW_DAYS * DAY_MS
  const repos: string[] = []
  const seen = new Set<string>()
  for (const ev of collapsed) {
    if (Date.parse(ev.createdAt) < windowStart) continue
    if (!seen.has(ev.repo)) {
      seen.add(ev.repo)
      repos.push(ev.repo)
    }
  }

  return {
    events: collapsed.slice(0, ACTIVITY_FEED_LIMIT),
    generatedAt: new Date().toISOString(),
    ok: true,
    pushesPerDay,
    repos: repos.slice(0, ACTIVITY_REPOS_LIMIT),
    totalPushes: pushesPerDay.reduce((sum, n) => sum + n, 0),
    windowDays: ACTIVITY_WINDOW_DAYS,
  }
}
