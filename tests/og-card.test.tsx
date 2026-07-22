// @vitest-environment node

import { writeFile } from 'node:fs/promises'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { GET } from '@/api/og/route'

// Set OG_VISUAL_OUT to a directory to dump rendered PNGs for visual review.
const visualOut = process.env.OG_VISUAL_OUT

const variants: Record<string, string> = {
  'og-blog-long':
    'kind=blog&title=Loop%20Engineering%3A%20Building%20Self-Improving%20Agent%20Pipelines%20That%20Actually%20Converge&subtitle=What%20612%20debugging%20sessions%20taught%20me%20about%20verification%20cadence%2C%20drift%2C%20and%20the%20art%20of%20letting%20agents%20check%20their%20own%20work.&meta=July%2022%2C%202026&path=cat%20blog/loop-engineering.md',
  'og-blog-short':
    'kind=blog&title=Terminal%20Renaissance&subtitle=Why%20the%20command%20line%20is%20eating%20the%20web%20again.&meta=April%204%2C%202026&path=cat%20blog/terminal-renaissance.md',
  'og-project':
    'kind=project&title=chromacat&subtitle=A%20turbocharged%20terminal%20colorizer%20written%20in%20Rust.&path=hyperbliss%20projects%20--show%20chromacat',
  'og-site': 'kind=site',
}

describe('og card generation', () => {
  for (const [name, query] of Object.entries(variants)) {
    it(`renders ${name} as a real PNG`, async () => {
      const response = await GET(new NextRequest(`https://hyperbliss.tech/api/og?${query}`))
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('image/png')
      expect(response.headers.get('cache-control')).toContain('s-maxage')
      const bytes = Buffer.from(await response.arrayBuffer())
      expect(bytes.length).toBeGreaterThan(10_000)
      expect(bytes.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      if (visualOut) await writeFile(`${visualOut}/${name}.png`, bytes)
    }, 30_000)
  }

  it('falls back to the site card on an unknown kind', async () => {
    const response = await GET(new NextRequest('https://hyperbliss.tech/api/og?kind=nonsense'))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/png')
  }, 30_000)
})
