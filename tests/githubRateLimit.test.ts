import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLatestRelease, getRepoStats, isGitHubRateLimited, resetGitHubRateLimit } from '@/lib/github'

const limited = (status: number, headers: Record<string, string> = {}) =>
  new Response('{"message":"API rate limit exceeded"}', { headers, status })

describe('GitHub rate-limit backoff', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    resetGitHubRateLimit()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.stubEnv('GITHUB_TOKEN', '')
    vi.stubEnv('GH_TOKEN', '')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    resetGitHubRateLimit()
  })

  it('parks every GitHub call until the reset after one rate-limited response', async () => {
    const reset = String(Math.floor(Date.now() / 1000) + 600)
    fetchMock.mockResolvedValueOnce(limited(403, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': reset }))

    expect(await getLatestRelease('https://github.com/hyperb1iss/one')).toBeNull()
    expect(isGitHubRateLimited()).toBe(true)

    expect(await getLatestRelease('https://github.com/hyperb1iss/two')).toBeNull()
    expect(await getRepoStats('https://github.com/hyperb1iss/three')).toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('treats a 403 with retry-after as the secondary limit even with budget left', async () => {
    fetchMock.mockResolvedValueOnce(limited(403, { 'retry-after': '30', 'x-ratelimit-remaining': '900' }))
    expect(await getRepoStats('https://github.com/hyperb1iss/burst')).toBeNull()
    expect(isGitHubRateLimited()).toBe(true)
    // Not cached: the next window retries instead of holding a null for an hour.
    fetchMock.mockResolvedValueOnce(new Response('{"stargazers_count":3}', { status: 200 }))
    resetGitHubRateLimit()
    expect((await getRepoStats('https://github.com/hyperb1iss/burst'))?.stars).toBe(3)
  })

  it('still parks calls when the reset GitHub reports is already in the past', async () => {
    const stale = String(Math.floor(Date.now() / 1000) - 5)
    fetchMock.mockResolvedValueOnce(limited(403, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': stale }))
    expect(await getRepoStats('https://github.com/hyperb1iss/edge')).toBeNull()
    expect(isGitHubRateLimited()).toBe(true)
    expect(isGitHubRateLimited(Date.now() + 59_000)).toBe(true)
    expect(isGitHubRateLimited(Date.now() + 61_000)).toBe(false)
  })

  it('treats a 403 with budget remaining as forbidden, not rate limited', async () => {
    fetchMock.mockResolvedValueOnce(limited(403, { 'x-ratelimit-remaining': '42' }))
    expect(await getRepoStats('https://github.com/hyperb1iss/private')).toBeNull()
    expect(isGitHubRateLimited()).toBe(false)
  })

  it('sends GH_TOKEN when GITHUB_TOKEN is unset', async () => {
    vi.stubEnv('GH_TOKEN', 'gho_test')
    fetchMock.mockResolvedValueOnce(new Response('{"stargazers_count":1}', { status: 200 }))
    await getRepoStats('https://github.com/hyperb1iss/tokened')
    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>
    expect(headers.Authorization).toBe('token gho_test')
  })
})
