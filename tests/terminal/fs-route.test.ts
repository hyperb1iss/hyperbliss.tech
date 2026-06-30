// @vitest-environment node

import { beforeAll, describe, expect, it } from 'vitest'
import { GET } from '@/api/fs/route'

const request = (url: string) => new Request(url)

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

describe('/api/fs', () => {
  it('serves a known virtual filesystem body', async () => {
    const response = await GET(request('https://hyperbliss.tech/api/fs?path=/now.md'))
    expect(response.status).toBe(200)
    const body = (await response.json()) as Record<string, string>
    expect(body['/now.md']).toEqual(expect.any(String))
  })

  it('rejects off-manifest paths before reading bodies', async () => {
    const response = await GET(request('https://hyperbliss.tech/api/fs?path=/etc/passwd'))
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'invalid filesystem path request' })
  })

  it('rejects huge path arrays', async () => {
    const paths = Array.from({ length: 65 }, () => '/now.md')
    const response = await GET(
      request(`https://hyperbliss.tech/api/fs?paths=${encodeURIComponent(JSON.stringify(paths))}`),
    )
    expect(response.status).toBe(400)
  })
})
