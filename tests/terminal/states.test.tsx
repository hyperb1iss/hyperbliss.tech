// T1.13 — empty / degraded states must render gracefully, never crash.

import { describe, expect, it } from 'vitest'
import '@/components/terminal/commands'
import { execute } from '@/components/terminal/executor'
import { registry as shared } from '@/components/terminal/registry'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { makeHarness, testBroadcast } from './_harness'

const emptyManifest: Manifest = { entries: [], generatedAt: 'x' }

const run = async (line: string, over: { manifest?: Manifest; broadcast?: Broadcast } = {}) => {
  const h = makeHarness({ registry: shared, ...over })
  await execute(line, h.ctx)
  return h
}

describe('degraded states', () => {
  it('neofetch omits the ship line when no release is available', async () => {
    const noShip: Broadcast = { ...testBroadcast, latestShip: null }
    const h = await run('neofetch', { broadcast: noShip })
    const out = h.printedText()
    expect(out).toContain('hyperbliss') // still renders the panel
    expect(out).toContain('24 projects') // counts still present
    expect(out).not.toContain('release') // release line dropped, no crash
  })

  it('neofetch survives an empty corpus', async () => {
    const empty: Broadcast = {
      flagships: [],
      generatedAt: 'x',
      labCount: 0,
      latestPost: null,
      latestShip: null,
      postCount: 0,
      projectCount: 0,
    }
    const h = await run('neofetch', { broadcast: empty, manifest: emptyManifest })
    expect(h.printedText()).toContain('0 projects · 0 posts · 0 lab')
  })

  it('projects renders a zero count on an empty manifest', async () => {
    const h = await run('projects', { manifest: emptyManifest })
    expect(h.printedText()).toContain('0 repos')
  })

  it('lab shows a friendly empty state', async () => {
    const h = await run('lab', { manifest: emptyManifest })
    expect(h.printedText()).toContain('nothing here yet')
  })
})
