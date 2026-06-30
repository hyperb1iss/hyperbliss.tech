// @vitest-environment node

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/api/activity/route'

// The node-env Response polyfill lacks .json(); mirror the fs-route setup.
beforeAll(() => {
  const ResponseCtor = globalThis.Response as typeof Response & {
    json?: (data: unknown, init?: ResponseInit) => Response
  }
  ResponseCtor.json ??= (data: unknown, init?: ResponseInit) => {
    const response = new Response(JSON.stringify(data), {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers as Record<string, string> | undefined) },
    })
    Object.defineProperty(response, 'status', { configurable: true, value: init?.status ?? 200 })
    return response
  }
  ResponseCtor.prototype.json ??= function json(this: Response) {
    return this.text().then((text) => JSON.parse(text) as unknown)
  }
  if (!Object.getOwnPropertyDescriptor(ResponseCtor.prototype, 'status')) {
    Object.defineProperty(ResponseCtor.prototype, 'status', {
      configurable: true,
      get(this: Response & { options?: ResponseInit }) {
        return this.options?.status ?? 200
      },
    })
  }
})

const pushEvent = {
  created_at: '2026-06-18T10:00:00Z',
  payload: { before: 'aaa', head: 'abc', push_id: 1, ref: 'refs/heads/main', repository_id: 1 },
  repo: { name: 'hyperb1iss/sibyl' },
  type: 'PushEvent',
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-06-18T12:00:00Z'))
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('/api/activity', () => {
  it('returns a normalized activity summary', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => [pushEvent], ok: true }))
    const response = await GET()
    expect(response.status).toBe(200)
    const body = (await response.json()) as { ok: boolean; events: unknown[]; totalPushes: number }
    expect(body.ok).toBe(true)
    expect(body.events).toHaveLength(1)
    expect(body.totalPushes).toBe(1)
  })

  it('still responds with ok:false when upstream fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    const response = await GET()
    expect(response.status).toBe(200)
    const body = (await response.json()) as { ok: boolean; events: unknown[] }
    expect(body.ok).toBe(false)
    expect(body.events).toEqual([])
  })
})
