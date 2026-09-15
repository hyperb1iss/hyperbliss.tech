import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildFactsQuery,
  getLatestRelease,
  getReleasesForProjects,
  getRepoFacts,
  getRepoFactsForProjects,
  getRepoStatsForProjects,
  isGitHubRateLimited,
  resetGitHubFactsCache,
  resetGitHubRateLimit,
} from '@/lib/github'

const project = (slug: string, owner = 'hyperb1iss') => ({ github: `https://github.com/${owner}/${slug}`, slug })

const node = (stars: number, release: string | null = null, extra: Record<string, unknown> = {}) => ({
  forkCount: 2,
  isArchived: false,
  latestRelease: release
    ? {
        description: `${release} ships things.`,
        isDraft: false,
        isPrerelease: false,
        name: release,
        publishedAt: '2026-09-01T00:00:00Z',
        tagName: release,
        url: `https://github.com/hyperb1iss/x/releases/tag/${release}`,
      }
    : null,
  primaryLanguage: { name: 'Rust' },
  pushedAt: '2026-09-10T00:00:00Z',
  stargazerCount: stars,
  ...extra,
})

const graphql = (data: Record<string, unknown> | null, errors?: unknown[], headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ data, errors }), { headers, status: 200 })

describe('GitHub facts batch', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    resetGitHubRateLimit()
    resetGitHubFactsCache()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubEnv('GITHUB_TOKEN', 'ghp_test')
    vi.stubEnv('GH_TOKEN', '')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    resetGitHubRateLimit()
    resetGitHubFactsCache()
  })

  it('builds one aliased field per repo with quoted owner and name', () => {
    const query = buildFactsQuery(['hyperb1iss/sibyl', 'expatfile/next-runtime-env'])
    expect(query).toContain('r0: repository(owner: "hyperb1iss", name: "sibyl") { ...Facts }')
    expect(query).toContain('r1: repository(owner: "expatfile", name: "next-runtime-env") { ...Facts }')
    expect(query).toContain('fragment Facts on Repository')
    expect(query).toContain('latestRelease')
  })

  it('answers releases and stats for every project from one POST', async () => {
    // Keys are sorted into the query, so dotfiles is r0 and sibyl is r1.
    fetchMock.mockResolvedValueOnce(graphql({ r0: node(7), r1: node(59, 'v1.3.2') }))
    const facts = await getRepoFactsForProjects([project('sibyl'), project('dotfiles')])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.github.com/graphql')
    expect(init).toMatchObject({
      cache: 'force-cache',
      headers: expect.objectContaining({ Authorization: 'token ghp_test' }),
      method: 'POST',
    })
    expect(JSON.parse(String(init?.body)).query).toContain('name: "sibyl"')

    expect(facts.get('sibyl')?.release).toEqual({
      publishedAt: '2026-09-01T00:00:00Z',
      summary: 'v1.3.2 ships things.',
      url: 'https://github.com/hyperb1iss/x/releases/tag/v1.3.2',
      version: '1.3.2',
    })
    expect(facts.get('sibyl')?.stats).toMatchObject({ language: 'Rust', stars: 59 })
    expect(facts.get('dotfiles')).toEqual({ release: null, stats: expect.objectContaining({ stars: 7 }) })
  })

  it('serves the projections and single lookups from the same cached batch', async () => {
    fetchMock.mockResolvedValueOnce(graphql({ r0: node(7), r1: node(59, 'v1.3.2') }))
    const repos = [project('sibyl'), project('dotfiles')]
    const releases = await getReleasesForProjects(repos)
    const stats = await getRepoStatsForProjects(repos)
    const single = await getRepoFacts('https://github.com/hyperb1iss/sibyl')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect([...releases.keys()]).toEqual(['sibyl'])
    expect([...stats.keys()].sort()).toEqual(['dotfiles', 'sibyl'])
    expect(single.release?.version).toBe('1.3.2')
  })

  it('shares one request between concurrent callers for the same repos', async () => {
    let resolve!: (value: Response) => void
    fetchMock.mockReturnValueOnce(new Promise<Response>((r) => (resolve = r)))
    const repos = [project('sibyl')]
    const pending = Promise.all([getReleasesForProjects(repos), getRepoStatsForProjects(repos)])
    resolve(graphql({ r0: node(59, 'v1.3.2') }))
    const [releases, stats] = await pending
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(releases.get('sibyl')?.version).toBe('1.3.2')
    expect(stats.get('sibyl')?.stars).toBe(59)
  })

  it('caches an unresolvable repo as empty facts instead of asking again', async () => {
    fetchMock.mockResolvedValueOnce(
      graphql({ r0: null, r1: node(1) }, [{ message: 'Could not resolve', path: ['r0'], type: 'NOT_FOUND' }]),
    )
    const repos = [project('real'), project('gone')]
    const first = await getRepoFactsForProjects(repos)
    const second = await getRepoFactsForProjects(repos)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first.get('gone')).toEqual({ release: null, stats: null })
    expect(second.get('real')?.stats?.stars).toBe(1)
  })

  it('drops drafts and prereleases like the REST latest endpoint', async () => {
    fetchMock.mockResolvedValueOnce(
      graphql({
        r0: node(1, 'v2.0.0-rc.1', { latestRelease: { ...node(1, 'v2.0.0-rc.1').latestRelease, isPrerelease: true } }),
        r1: node(1, 'v0.1.0', { latestRelease: { ...node(1, 'v0.1.0').latestRelease, isDraft: true } }),
      }),
    )
    const facts = await getRepoFactsForProjects([project('rc'), project('draft')])
    expect(facts.get('rc')?.release).toBeNull()
    expect(facts.get('draft')?.release).toBeNull()
    expect(facts.get('rc')?.stats?.stars).toBe(1)
  })

  it('parks GitHub on an HTTP 403 and caches nothing', async () => {
    const reset = String(Math.floor(Date.now() / 1000) + 600)
    fetchMock.mockResolvedValueOnce(
      new Response('{"message":"limit"}', {
        headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': reset },
        status: 403,
      }),
    )
    expect((await getRepoFactsForProjects([project('sibyl')])).size).toBe(0)
    expect(isGitHubRateLimited()).toBe(true)
    expect((await getRepoFactsForProjects([project('sibyl')])).size).toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('parks GitHub on a 200 carrying a RATE_LIMITED error', async () => {
    fetchMock.mockResolvedValueOnce(graphql(null, [{ message: 'slow down', type: 'RATE_LIMITED' }]))
    expect((await getRepoFactsForProjects([project('sibyl')])).size).toBe(0)
    expect(isGitHubRateLimited()).toBe(true)
  })

  it('leaves a failed batch uncached so the next call retries', async () => {
    fetchMock.mockResolvedValueOnce(new Response('bad gateway', { status: 502 }))
    expect((await getRepoFactsForProjects([project('sibyl')])).size).toBe(0)
    expect(isGitHubRateLimited()).toBe(false)
    fetchMock.mockResolvedValueOnce(graphql({ r0: node(3) }))
    expect((await getRepoFactsForProjects([project('sibyl')])).get('sibyl')?.stats?.stars).toBe(3)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('splits more than fifty repos across requests', async () => {
    const repos = Array.from({ length: 60 }, (_, i) => project(`repo-${i}`))
    fetchMock.mockImplementation(async (_url, init) => {
      const count = (JSON.parse(String(init?.body)).query.match(/repository\(/g) ?? []).length
      const data: Record<string, unknown> = {}
      for (let i = 0; i < count; i += 1) data[`r${i}`] = node(i)
      return graphql(data)
    })
    const facts = await getRepoFactsForProjects(repos)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(facts.size).toBe(60)
  })

  it('sends one canonical sorted body no matter which subset a caller wants', async () => {
    fetchMock.mockImplementation(async (_url, init) => {
      const count = (JSON.parse(String(init?.body)).query.match(/repository\(/g) ?? []).length
      const data: Record<string, unknown> = {}
      for (let i = 0; i < count; i += 1) data[`r${i}`] = node(i)
      return graphql(data)
    })
    const repos = [project('zeta'), project('alpha'), project('mid')]
    await getRepoFactsForProjects(repos)
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body)).query
    expect(body.indexOf('name: "alpha"')).toBeLessThan(body.indexOf('name: "mid"'))
    expect(body.indexOf('name: "mid"')).toBeLessThan(body.indexOf('name: "zeta"'))
    // A reordered list is the same batch and the same cache; nothing new is fetched.
    await getRepoFactsForProjects([project('mid'), project('zeta'), project('alpha')])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fetches only the facts a tokenless caller asked for', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')
    fetchMock.mockImplementation(async (url) =>
      String(url).endsWith('/releases/latest')
        ? new Response(
            JSON.stringify({
              body: '',
              html_url: 'https://x/v1',
              name: null,
              published_at: '2026-01-01T00:00:00Z',
              tag_name: 'v1.0.0',
            }),
            { status: 200 },
          )
        : new Response(JSON.stringify({ stargazers_count: 4 }), { status: 200 }),
    )
    await getReleasesForProjects([project('sibyl')])
    expect(fetchMock.mock.calls.map(([u]) => String(u))).toEqual([
      'https://api.github.com/repos/hyperb1iss/sibyl/releases/latest',
    ])
    await getRepoStatsForProjects([project('other')])
    expect(fetchMock.mock.calls.map(([u]) => String(u))).toContain('https://api.github.com/repos/hyperb1iss/other')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('falls back to REST per repo without a token', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')
    fetchMock.mockImplementation(async (url) => {
      const u = String(url)
      if (u.endsWith('/releases/latest'))
        return new Response(
          JSON.stringify({
            body: '',
            html_url: 'https://x/v1',
            name: null,
            published_at: '2026-01-01T00:00:00Z',
            tag_name: 'v1.0.0',
          }),
          { status: 200 },
        )
      return new Response(JSON.stringify({ stargazers_count: 4 }), { status: 200 })
    })
    const facts = await getRepoFactsForProjects([project('sibyl')])
    const urls = fetchMock.mock.calls.map(([u]) => String(u))
    expect(urls).toEqual(
      expect.arrayContaining([
        'https://api.github.com/repos/hyperb1iss/sibyl/releases/latest',
        'https://api.github.com/repos/hyperb1iss/sibyl',
      ]),
    )
    expect(urls.some((u) => u.endsWith('/graphql'))).toBe(false)
    expect(facts.get('sibyl')).toEqual({
      release: { publishedAt: '2026-01-01T00:00:00Z', summary: null, url: 'https://x/v1', version: '1.0.0' },
      stats: expect.objectContaining({ stars: 4 }),
    })
    // The REST singles still answer on their own.
    expect((await getLatestRelease('https://github.com/hyperb1iss/sibyl'))?.version).toBe('1.0.0')
  })
})
