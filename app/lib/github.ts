// app/lib/github.ts
// GitHub facts for the site: latest releases, repo stats, and recent public
// activity. Pages should reach for getRepoFactsForProjects (one GraphQL call
// for every repo); the per-repo REST functions are its tokenless fallback.

interface GitHubRelease {
  tag_name: string
  name: string | null
  body: string | null
  published_at: string
  html_url: string
}

export interface ReleaseInfo {
  version: string
  publishedAt: string
  url: string
  /** One plain-text line describing the release, or null when the notes are empty or boilerplate. */
  summary: string | null
}

const RELEASE_SUMMARY_MAX = 160

/**
 * Reduce GitHub release notes to one plain line for the front-page feed.
 * Skips headings, badges, and changelog boilerplate, strips markdown from the
 * first real sentence, and falls back to the release title when it says more
 * than the tag does.
 */
export function summarizeRelease(name: string | null, body: string | null, version: string): string | null {
  const lines = (body ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const isNoise = (line: string) =>
    /^#{1,6}\s/.test(line) ||
    /^!\[/.test(line) ||
    /^<!--/.test(line) ||
    /^<[a-z!/]/i.test(line) ||
    /^\|/.test(line) ||
    /^(release|version)\s+v?\d+(\.\d+)*$/i.test(line) ||
    /^(\*\*)?full changelog/i.test(line) ||
    /^(what'?s changed|changelog|release notes|highlights)\s*:?$/i.test(line) ||
    /^released:?\s/i.test(line) ||
    /^-{3,}$/.test(line)

  // Test both the raw line and its stripped form, so "**Released:** date"
  // is recognized as boilerplate just like the plain version.
  // Skip fenced code blocks wholesale (a fence closes only on the same marker
  // at least as wide as the one that opened it, so a four-backtick fence can
  // wrap a three-backtick example), then apply the noise test to both the raw
  // line and its stripped form ("**Released:** date" counts as noise).
  const prose: string[] = []
  let fence: { char: string; width: number } | null = null
  for (const line of lines) {
    const marker = /^(`{3,}|~{3,})/.exec(line)
    if (marker) {
      const char = marker[1][0]
      const width = marker[1].length
      if (!fence) {
        fence = { char, width }
        continue
      }
      // A closer is the bare marker (trailing whitespace only); a marker
      // followed by text is content inside the fence.
      if (fence.char === char && width >= fence.width && /^(`{3,}|~{3,})\s*$/.test(line)) {
        fence = null
        continue
      }
    }
    if (!fence) prose.push(line)
  }
  const first = prose.find((line) => !isNoise(line) && !isNoise(stripMarkdown(line)))
  const cleaned = first ? firstSentence(stripMarkdown(first), RELEASE_SUMMARY_MAX) : ''
  if (cleaned) return truncateAtWord(cleaned, RELEASE_SUMMARY_MAX)

  const title = stripMarkdown((name ?? '').trim())
  if (!title || isNoise(title)) return null
  const bare = title.replace(/^v/i, '')
  if (bare === version || bare === `v${version}`) return null
  return truncateAtWord(title, RELEASE_SUMMARY_MAX)
}

function stripMarkdown(line: string): string {
  return line
    .replace(/^(>\s?)+/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/^\d+\.\s+/, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/\s+by\s+@[\w-]+\s+in\s+\S+$/i, '')
    .replace(/\s+\(#\d+\)$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Keep the whole first sentence when it fits, so a summary ends on a period instead of an ellipsis. */
function firstSentence(text: string, max: number): string {
  const match = /^(.+?[.!?])(?:\s|$)/.exec(text)
  if (match && match[1].length >= 24 && match[1].length <= max) return match[1]
  return text
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const at = cut.lastIndexOf(' ')
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).trimEnd()}…`
}

// Cache for GitHub release data (in-memory for build time)
const releaseCache = new Map<string, { data: ReleaseInfo | null; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

// Rate-limit backoff shared by every GitHub call in this process. A tokenless
// build used to log and retry one 403 per repo per route render (900+ warnings
// in a single build); now the first hit parks every call until GitHub's reset.
let rateLimitedUntil = 0

/** True while GitHub has told us to back off; callers answer null without a request. */
export function isGitHubRateLimited(now = Date.now()): boolean {
  return now < rateLimitedUntil
}

/** Forget the backoff window. Tests only. */
export function resetGitHubRateLimit(): void {
  rateLimitedUntil = 0
}

/**
 * 429 is always a limit. A 403 is the primary limit when the budget counter
 * reads zero or is missing, and the secondary limit when GitHub sends
 * retry-after (the counter can still be positive then). A 403 with budget
 * left and no retry-after is a forbidden repo and is cached like a 404.
 */
function isRateLimitResponse(response: Response): boolean {
  if (response.status === 429) return true
  if (response.status !== 403) return false
  if (response.headers.has('retry-after')) return true
  const remaining = response.headers.get('x-ratelimit-remaining')
  return remaining === null || remaining === '0'
}

function noteRateLimit(response: Response, what: string): void {
  const now = Date.now()
  const reset = Number(response.headers.get('x-ratelimit-reset')) * 1000
  const retryAfter = Number(response.headers.get('retry-after')) * 1000
  const newWindow = !isGitHubRateLimited(now)
  // Wait for the reset when GitHub names a future one, otherwise the minute
  // its docs ask for. A reset at or before now (window edge, clock skew) must
  // still park calls rather than reopen the floodgates.
  const until = Math.max(reset > now ? reset : 0, retryAfter > 0 ? now + retryAfter : 0, now + 60_000)
  rateLimitedUntil = until
  if (!newWindow) return
  console.warn(
    `GitHub rate limit hit fetching ${what} (HTTP ${response.status}); skipping GitHub until ${new Date(rateLimitedUntil).toISOString()}. Set GITHUB_TOKEN (or GH_TOKEN) in the deploy environment.`,
  )
}

/** Accept plus auth headers. Honors GITHUB_TOKEN and the gh CLI's GH_TOKEN. */
function githubHeaders(accept = 'application/vnd.github.v3+json'): Record<string, string> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  return { Accept: accept, ...(token && { Authorization: `token ${token}` }) }
}

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
 * Latest release for one repository over REST. Tokenless fallback for the
 * facts batch; pages should call getRepoFacts or getRepoFactsForProjects.
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

  if (isGitHubRateLimited()) return null

  try {
    const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases/latest`, {
      headers: githubHeaders(),
      // Cache for 1 hour in Next.js fetch cache
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      if (isRateLimitResponse(response)) {
        // Not cached, so the next revalidation retries instead of sitting on
        // an empty result for an hour.
        noteRateLimit(response, cacheKey)
        return null
      }
      // No releases or repo not found - cache the null result
      releaseCache.set(cacheKey, { data: null, timestamp: Date.now() })
      return null
    }

    const release: GitHubRelease = await response.json()

    const version = release.tag_name.replace(/^v/, '')
    const releaseInfo: ReleaseInfo = {
      publishedAt: release.published_at,
      summary: summarizeRelease(release.name, release.body, version),
      url: release.html_url,
      version,
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

// ─── Repo stats ───────────────────────────────────────────────────────────────

export interface RepoStats {
  stars: number
  forks: number
  language: string | null
  pushedAt: string | null
  archived: boolean
}

const statsCache = new Map<string, { data: RepoStats | null; timestamp: number }>()

/**
 * Stars, primary language, and last push for one repository over REST,
 * cached for an hour. Tokenless fallback for the facts batch.
 */
export async function getRepoStats(githubUrl: string): Promise<RepoStats | null> {
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) return null
  const cacheKey = `${parsed.owner}/${parsed.repo}`
  const cached = statsCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data
  if (isGitHubRateLimited()) return null

  try {
    const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers: githubHeaders(),
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      if (isRateLimitResponse(response)) {
        noteRateLimit(response, `repo stats for ${cacheKey}`)
        return null
      }
      statsCache.set(cacheKey, { data: null, timestamp: Date.now() })
      return null
    }
    const repo = (await response.json()) as {
      stargazers_count?: number
      forks_count?: number
      language?: string | null
      pushed_at?: string | null
      archived?: boolean
    }
    const stats: RepoStats = {
      archived: Boolean(repo.archived),
      forks: repo.forks_count ?? 0,
      language: repo.language ?? null,
      pushedAt: repo.pushed_at ?? null,
      stars: repo.stargazers_count ?? 0,
    }
    statsCache.set(cacheKey, { data: stats, timestamp: Date.now() })
    return stats
  } catch (error) {
    console.error(`Failed to fetch repo stats for ${cacheKey}:`, error)
    statsCache.set(cacheKey, { data: null, timestamp: Date.now() })
    return null
  }
}

// ─── Batched facts (GraphQL) ──────────────────────────────────────────────────
// Every page that shows GitHub facts wants the same thing for the same ~30
// repos: the latest release and the repo stats. One REST call per repo per
// fact meant ~60 requests an hour and a tokenless build blew the anonymous
// 60/hr budget in its first minute. With a token, GraphQL answers for every
// repo in a single request that costs one point of a 5000/hr budget, so a
// rate limit is no longer reachable from this site. GraphQL has no anonymous
// tier, so the REST calls above remain the tokenless fallback.

/** Latest release and repo stats for one repository; either may be null. */
export interface RepoFacts {
  release: ReleaseInfo | null
  stats: RepoStats | null
}

const EMPTY_FACTS: RepoFacts = { release: null, stats: null }
const factsCache = new Map<string, { data: RepoFacts; timestamp: number }>()
/** Concurrent callers for the same batch share one request. */
const factsInflight = new Map<string, Promise<Map<string, RepoFacts> | null>>()
/** Aliases per GraphQL request. Well under the 500k node limit; keeps the body small. */
const FACTS_BATCH = 50

const FACTS_FRAGMENT = `fragment Facts on Repository {
  stargazerCount
  forkCount
  pushedAt
  isArchived
  primaryLanguage { name }
  latestRelease { tagName name description publishedAt url isPrerelease isDraft }
}`

/** One aliased `repository` field per owner/repo key, plus the shared fragment. */
export function buildFactsQuery(keys: string[]): string {
  const fields = keys.map((key, index) => {
    const slash = key.indexOf('/')
    const owner = key.slice(0, slash)
    const repo = key.slice(slash + 1)
    return `  r${index}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(repo)}) { ...Facts }`
  })
  return `${FACTS_FRAGMENT}\nquery RepoFacts {\n${fields.join('\n')}\n}`
}

interface GraphQLRelease {
  tagName: string
  name: string | null
  description: string | null
  publishedAt: string | null
  url: string
  isPrerelease: boolean
  isDraft: boolean
}

interface GraphQLRepo {
  stargazerCount?: number
  forkCount?: number
  pushedAt?: string | null
  isArchived?: boolean
  primaryLanguage?: { name: string } | null
  latestRelease?: GraphQLRelease | null
}

interface GraphQLResponse {
  data?: Record<string, GraphQLRepo | null> | null
  errors?: Array<{ type?: string; message?: string; path?: string[] }>
}

/**
 * `latestRelease` mirrors the REST "latest" endpoint (no drafts, no
 * prereleases); the guards are belt and braces so a schema change cannot
 * promote a draft to the feed.
 */
function releaseFromNode(rel: GraphQLRelease | null | undefined): ReleaseInfo | null {
  if (!rel?.publishedAt || rel.isDraft || rel.isPrerelease) return null
  const version = rel.tagName.replace(/^v/, '')
  return {
    publishedAt: rel.publishedAt,
    summary: summarizeRelease(rel.name, rel.description, version),
    url: rel.url,
    version,
  }
}

/** Map one repository node to the REST-shaped facts. */
function factsFromNode(node: GraphQLRepo): RepoFacts {
  return {
    release: releaseFromNode(node.latestRelease),
    stats: {
      archived: Boolean(node.isArchived),
      forks: node.forkCount ?? 0,
      language: node.primaryLanguage?.name ?? null,
      pushedAt: node.pushedAt ?? null,
      stars: node.stargazerCount ?? 0,
    },
  }
}

/**
 * One GraphQL request for up to FACTS_BATCH repos. Resolves to a map for
 * every key on success (a repo GitHub cannot resolve maps to empty facts, so
 * it is not asked again for an hour) and to null when the request failed,
 * in which case nothing is cached and the next revalidation retries.
 */
async function fetchFactsBatch(keys: string[]): Promise<Map<string, RepoFacts> | null> {
  const label = `facts for ${keys.length} repos`
  let payload: GraphQLResponse
  let response: Response
  try {
    response = await fetch('https://api.github.com/graphql', {
      body: JSON.stringify({ query: buildFactsQuery(keys) }),
      // POST is only cached when asked; matched on URL, method, headers, body.
      cache: 'force-cache',
      headers: { ...githubHeaders('application/vnd.github+json'), 'Content-Type': 'application/json' },
      method: 'POST',
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      if (isRateLimitResponse(response)) noteRateLimit(response, label)
      else console.error(`GitHub GraphQL ${label} failed: HTTP ${response.status}`)
      return null
    }
    payload = (await response.json()) as GraphQLResponse
  } catch (error) {
    console.error(`Failed to fetch GitHub ${label}:`, error)
    return null
  }

  // A rate limit can also arrive as HTTP 200 with a typed error and no data.
  if (payload.errors?.some((e) => e.type === 'RATE_LIMITED')) {
    noteRateLimit(response, label)
    return null
  }
  if (!payload.data) {
    console.error(`GitHub GraphQL ${label} returned no data:`, payload.errors?.[0]?.message ?? 'unknown error')
    return null
  }

  const out = new Map<string, RepoFacts>()
  keys.forEach((key, index) => {
    const node = payload.data?.[`r${index}`]
    out.set(key, node ? factsFromNode(node) : EMPTY_FACTS)
  })
  return out
}

/** Fetch a batch once even when several renders ask for it at the same moment. */
function fetchFactsBatchShared(keys: string[]): Promise<Map<string, RepoFacts> | null> {
  const id = keys.join(',')
  const pending = factsInflight.get(id)
  if (pending) return pending
  const request = fetchFactsBatch(keys).finally(() => factsInflight.delete(id))
  factsInflight.set(id, request)
  return request
}

/** Tokenless fallback: the two REST calls, each with its own cache and backoff. */
async function fetchFactsRest(key: string): Promise<RepoFacts> {
  const url = `https://github.com/${key}`
  const [release, stats] = await Promise.all([getLatestRelease(url), getRepoStats(url)])
  return { release, stats }
}

/**
 * Latest release and repo stats for many projects, keyed by slug. With a
 * token this is one GraphQL request per 50 repos, memoized for an hour in
 * this process and in the fetch cache; without one it falls back to REST.
 * Projects whose repo GitHub cannot resolve get empty facts. Never throws.
 */
export async function getRepoFactsForProjects(
  projects: Array<{ slug: string; github: string | null }>,
): Promise<Map<string, RepoFacts>> {
  const keyBySlug = new Map<string, string>()
  for (const project of projects) {
    const parsed = project.github ? parseGitHubUrl(project.github) : null
    if (parsed) keyBySlug.set(project.slug, `${parsed.owner}/${parsed.repo}`)
  }

  const now = Date.now()
  const missing = [...new Set(keyBySlug.values())].filter((key) => {
    const cached = factsCache.get(key)
    return !cached || now - cached.timestamp >= CACHE_TTL
  })

  if (missing.length > 0 && !isGitHubRateLimited(now)) {
    if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
      const chunks: string[][] = []
      for (let i = 0; i < missing.length; i += FACTS_BATCH) chunks.push(missing.slice(i, i + FACTS_BATCH))
      const results = await Promise.all(chunks.map(fetchFactsBatchShared))
      for (const batch of results) {
        if (!batch) continue
        for (const [key, facts] of batch) factsCache.set(key, { data: facts, timestamp: Date.now() })
      }
    } else {
      // REST caches per call, so the facts cache only mirrors what came back.
      await Promise.all(
        missing.map(async (key) => {
          const facts = await fetchFactsRest(key)
          if (facts.release || facts.stats) factsCache.set(key, { data: facts, timestamp: Date.now() })
        }),
      )
    }
  }

  const out = new Map<string, RepoFacts>()
  for (const [slug, key] of keyBySlug) {
    const cached = factsCache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) out.set(slug, cached.data)
  }
  return out
}

/** Facts for one repository URL, through the same batch and caches. */
export async function getRepoFacts(githubUrl: string): Promise<RepoFacts> {
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) return EMPTY_FACTS
  const key = `${parsed.owner}/${parsed.repo}`
  const facts = await getRepoFactsForProjects([{ github: githubUrl, slug: key }])
  return facts.get(key) ?? EMPTY_FACTS
}

/** Repo stats for many projects, keyed by slug. Projects without stats are omitted. */
export async function getRepoStatsForProjects(
  projects: Array<{ slug: string; github: string | null }>,
): Promise<Map<string, RepoStats>> {
  const out = new Map<string, RepoStats>()
  for (const [slug, facts] of await getRepoFactsForProjects(projects)) if (facts.stats) out.set(slug, facts.stats)
  return out
}

/** Latest releases for many projects, keyed by slug. Projects without a release are omitted. */
export async function getReleasesForProjects(
  projects: Array<{ slug: string; github: string | null }>,
): Promise<Map<string, ReleaseInfo>> {
  const out = new Map<string, ReleaseInfo>()
  for (const [slug, facts] of await getRepoFactsForProjects(projects)) if (facts.release) out.set(slug, facts.release)
  return out
}

/** Forget every in-memory facts cache. Tests only. */
export function resetGitHubFactsCache(): void {
  factsCache.clear()
  factsInflight.clear()
  releaseCache.clear()
  statsCache.clear()
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
  if (isGitHubRateLimited()) return emptyActivity(false)
  let raw: unknown
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
      headers: { ...githubHeaders('application/vnd.github+json'), 'User-Agent': 'hyperbliss.tech' },
      next: { revalidate: 300 },
    })
    if (!response.ok) {
      if (isRateLimitResponse(response)) noteRateLimit(response, `activity for ${username}`)
      return emptyActivity(false)
    }
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
