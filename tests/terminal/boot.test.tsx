// T3.1 — boot state machine + sequence.

import { isValidElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { runBootSequence } from '@/components/terminal/boot'
import { resolveBootPhase } from '@/components/terminal/bootState'

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children)
  return ''
}

function collector() {
  const lines: string[] = []
  const ran: string[] = []
  return {
    lines,
    out: () => lines.join('\n'),
    print: (node: ReactNode) => lines.push(nodeText(node)),
    ran,
    run: async (line: string) => {
      ran.push(line)
    },
  }
}

describe('resolveBootPhase', () => {
  it('skips to end under reduced motion', () => {
    expect(resolveBootPhase({ firstVisit: true, reducedMotion: true })).toBe('skip-to-end')
  })
  it('plays the full boot on a first visit', () => {
    expect(resolveBootPhase({ firstVisit: true, reducedMotion: false })).toBe('full-boot')
  })
  it('skips to end on a repeat visit', () => {
    expect(resolveBootPhase({ firstVisit: false, reducedMotion: false })).toBe('skip-to-end')
  })
})

describe('runBootSequence', () => {
  it('runs the finale and prints no preamble, on a first or a repeat visit', async () => {
    for (const phase of ['full-boot', 'skip-to-end'] as const) {
      const c = collector()
      await runBootSequence({ finale: () => c.run('welcome'), isCancelled: () => false, phase })
      expect(c.lines).toEqual([])
      expect(c.ran).toEqual(['welcome'])
    }
  })

  it('stops immediately when cancelled (no finale)', async () => {
    const c = collector()
    await runBootSequence({ finale: () => c.run('welcome'), isCancelled: () => true, phase: 'full-boot' })
    expect(c.ran).toEqual([])
  })
})
