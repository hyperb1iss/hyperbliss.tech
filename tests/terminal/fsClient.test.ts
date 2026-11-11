// T2.3 — lazy-FS transport: path batches are deduped and cached, with cache
// reset on failure so a later shell command can retry.

import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchFsBodies, resetFsCache, setFsVersion } from '@/components/terminal/fsClient'

const okResponse = (body: Record<string, string>) => ({
  json: async () => body,
  ok: true,
  status: 200,
})
const errResponse = (status: number) => ({ json: async () => ({}), ok: false, status })
const requestedPaths = (url: unknown): string[] => {
  const paths = new URL(String(url), 'https://example.test').searchParams.get('paths')
  return paths ? (JSON.parse(paths) as string[]) : []
}

afterEach(() => {
  setFsVersion(undefined)
  resetFsCache()
  vi.restoreAllMocks()
})

describe('fetchFsBodies', () => {
  it('dedupes concurrent callers into a single request', async () => {
    const fetchSpy = vi.fn(async () => okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)
    const [a, b] = await Promise.all([fetchFsBodies(['/a.md']), fetchFsBodies(['/a.md'])])
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(a['/a.md']).toBe('A')
    expect(b['/a.md']).toBe('A')
  })

  it('sends the content version, and a new version refetches instead of serving the cache', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(okResponse({ '/a.md': 'old' }))
      .mockResolvedValueOnce(okResponse({ '/a.md': 'new' }))
    vi.stubGlobal('fetch', fetchSpy)

    setFsVersion('aaaa1111')
    expect((await fetchFsBodies(['/a.md']))['/a.md']).toBe('old')
    expect(String(fetchSpy.mock.calls[0][0])).toContain('v=aaaa1111')

    setFsVersion('bbbb2222')
    expect((await fetchFsBodies(['/a.md']))['/a.md']).toBe('new')
    expect(String(fetchSpy.mock.calls[1][0])).toContain('v=bbbb2222')
  })

  it('caches across sequential calls', async () => {
    const fetchSpy = vi.fn(async () => okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)
    await fetchFsBodies(['/a.md'])
    await fetchFsBodies(['/a.md'])
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('resets the cache on failure so a retry refetches', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(errResponse(500))
      .mockResolvedValueOnce(okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)

    await expect(fetchFsBodies(['/a.md'])).rejects.toThrow(/500/)
    const ok = await fetchFsBodies(['/a.md'])
    expect(ok['/a.md']).toBe('A')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('batches multiple missing paths into one request', async () => {
    const fetchSpy = vi.fn(async () => okResponse({ '/a.md': 'A', '/b.md': 'B' }))
    vi.stubGlobal('fetch', fetchSpy)
    const ok = await fetchFsBodies(['/a.md', '/b.md'])
    expect(ok['/a.md']).toBe('A')
    expect(ok['/b.md']).toBe('B')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(String(fetchSpy.mock.calls[0]?.[0])).toContain('paths=')
  })

  it('dedupes overlapping cold batches by path', async () => {
    const values: Record<string, string> = { '/a.md': 'A', '/b.md': 'B', '/c.md': 'C' }
    const fetchSpy = vi.fn(async (url: unknown) =>
      okResponse(Object.fromEntries(requestedPaths(url).map((path) => [path, values[path]]))),
    )
    vi.stubGlobal('fetch', fetchSpy)

    const [ab, bc] = await Promise.all([fetchFsBodies(['/a.md', '/b.md']), fetchFsBodies(['/b.md', '/c.md'])])

    expect(ab).toEqual({ '/a.md': 'A', '/b.md': 'B' })
    expect(bc).toEqual({ '/b.md': 'B', '/c.md': 'C' })
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy.mock.calls.map(([url]) => requestedPaths(url))).toEqual([['/a.md', '/b.md'], ['/c.md']])
  })
})
