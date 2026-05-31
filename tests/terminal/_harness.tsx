// Shared test harness for terminal unit tests: a fake TerminalContext that
// records side effects, plus minimal manifest/broadcast fixtures. Not a test
// file (no `.test.` in the name), so the glob skips it.

import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createContext } from '@/components/terminal/context'
import { Registry } from '@/components/terminal/registry'
import type { OutputStream, TerminalContext } from '@/components/terminal/types'
import type { Broadcast, Manifest, ManifestEntry } from '@/lib/terminal/types'

export const entry = (over: Partial<ManifestEntry> = {}): ManifestEntry => ({
  bytes: 100,
  date: '2026-01-01',
  emoji: null,
  github: null,
  href: '/x/',
  kind: 'post',
  latestVersion: null,
  path: '/blog/x.md',
  status: null,
  summary: 'summary',
  tags: ['tag'],
  title: 'Title',
  ...over,
})

export const testManifest: Manifest = {
  entries: [
    entry({ href: '/about/', kind: 'about', path: '/about.md', tags: ['about'], title: 'About' }),
    entry({ href: null, kind: 'now', path: '/now.md', tags: ['now'], title: 'Now' }),
    entry({ href: '/projects/sibyl/', kind: 'project', path: '/projects/sibyl.md', tags: ['Rust'], title: 'Sibyl' }),
    entry({
      href: '/projects/chromacat/',
      kind: 'project',
      path: '/projects/chromacat.md',
      tags: ['Rust', 'CLI'],
      title: 'ChromaCat',
    }),
    entry({ href: '/blog/how-i-ai/', kind: 'post', path: '/blog/how-i-ai.md', tags: ['ai'], title: 'How I AI' }),
    entry({ href: '/lab/regex/', kind: 'lab', path: '/lab/regex.md', tags: ['regex'], title: 'Regex Nightmares' }),
  ],
  generatedAt: '2026-05-31T00:00:00.000Z',
}

export const testBroadcast: Broadcast = {
  focus: 'Building a terminal hero',
  generatedAt: '2026-05-31T00:00:00.000Z',
  labCount: 1,
  latestPost: { date: '2026-05-27', href: '/blog/how-i-ai/', title: 'How I AI' },
  latestProject: { date: '2025-09-01', href: '/projects/sibyl/', title: 'Sibyl' },
  latestShip: { project: 'git-iris', publishedAt: '2026-05-20', slug: 'git-iris', url: 'https://x', version: '1.0.0' },
  location: 'Seattle, WA',
  nowBody: 'Building the terminal hero.',
  nowUpdated: '2026-05-31',
  postCount: 6,
  projectCount: 24,
}

export interface Harness {
  ctx: TerminalContext
  registry: Registry
  printed: Array<{ node: ReactNode; stream: OutputStream }>
  cleared: number
  navigated: string[]
  themed: string[]
  ran: string[]
  /** Combined text content of everything printed so far. */
  printedText(): string
}

export function makeHarness(
  over: Partial<{ cwd: string; registry: Registry; history: string[]; manifest: Manifest; broadcast: Broadcast }> = {},
): Harness {
  const registry = over.registry ?? new Registry()
  const printed: Array<{ node: ReactNode; stream: OutputStream }> = []
  const navigated: string[] = []
  const themed: string[] = []
  const ran: string[] = []
  let cleared = 0

  const ctx = createContext({
    broadcast: over.broadcast ?? testBroadcast,
    clear: () => {
      cleared += 1
    },
    cwd: over.cwd ?? '/',
    history: over.history ?? [],
    manifest: over.manifest ?? testManifest,
    navigate: (href) => navigated.push(href),
    print: (node, stream = 'stdout') => printed.push({ node, stream }),
    registry,
    run: async (line) => {
      ran.push(line)
    },
    setTheme: (name) => themed.push(name),
  })

  return {
    get cleared() {
      return cleared
    },
    ctx,
    navigated,
    printed,
    printedText() {
      const { container } = render(
        <div>
          {printed.map((p, i) => (
            <span key={i}>{p.node}</span>
          ))}
        </div>,
      )
      return container.textContent ?? ''
    },
    ran,
    registry,
    themed,
  }
}
