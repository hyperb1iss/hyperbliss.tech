// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { GET } from '@/api/fs/route'

const request = (url: string) => new Request(url)

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
