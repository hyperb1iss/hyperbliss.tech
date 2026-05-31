// T2.3 — lazy-FS transport: one batched request, deduped and cached, with
// cache reset on failure so a later shell command can retry.

import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchFsBodies, resetFsCache } from '@/components/terminal/fsClient'

const okResponse = (body: Record<string, string>) => ({
  json: async () => body,
  ok: true,
  status: 200,
})
const errResponse = (status: number) => ({ json: async () => ({}), ok: false, status })

afterEach(() => {
  resetFsCache()
  vi.restoreAllMocks()
})

describe('fetchFsBodies', () => {
  it('dedupes concurrent callers into a single request', async () => {
    const fetchSpy = vi.fn(async () => okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)
    const [a, b] = await Promise.all([fetchFsBodies(), fetchFsBodies()])
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(a['/a.md']).toBe('A')
    expect(b).toBe(a)
  })

  it('caches across sequential calls', async () => {
    const fetchSpy = vi.fn(async () => okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)
    await fetchFsBodies()
    await fetchFsBodies()
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('resets the cache on failure so a retry refetches', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(errResponse(500))
      .mockResolvedValueOnce(okResponse({ '/a.md': 'A' }))
    vi.stubGlobal('fetch', fetchSpy)

    await expect(fetchFsBodies()).rejects.toThrow(/500/)
    const ok = await fetchFsBodies()
    expect(ok['/a.md']).toBe('A')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
