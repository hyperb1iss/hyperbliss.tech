// T3.1 — boot state machine + sequence.

import { isValidElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { runBootSequence } from '@/components/terminal/boot'
import { resolveBootPhase } from '@/components/terminal/bootState'
import { testBroadcast } from './_harness'

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
  const base = { broadcast: testBroadcast, isCancelled: () => false, shouldSkip: () => true }

  it('full boot prints POST lines with real counts, then runs the finale', async () => {
    const c = collector()
    await runBootSequence({ ...base, finale: () => c.run('neofetch'), phase: 'full-boot', print: c.print })
    const out = c.out()
    expect(out).toContain('POST')
    expect(out).toContain('[OK]')
    expect(out).toContain(`projects (${testBroadcast.projectCount})`)
    expect(c.ran).toEqual(['neofetch'])
  })

  it('skip-to-end prints a compact banner then the finale', async () => {
    const c = collector()
    await runBootSequence({ ...base, finale: () => c.run('neofetch'), phase: 'skip-to-end', print: c.print })
    expect(c.out()).toContain('hyperbliss terminal')
    expect(c.ran).toEqual(['neofetch'])
  })

  it('stops immediately when cancelled (no output, no finale)', async () => {
    const c = collector()
    await runBootSequence({
      ...base,
      finale: () => c.run('neofetch'),
      isCancelled: () => true,
      phase: 'full-boot',
      print: c.print,
    })
    expect(c.lines).toEqual([])
    expect(c.ran).toEqual([])
  })
})
