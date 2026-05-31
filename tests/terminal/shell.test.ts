// @vitest-environment node
//
// T2.1 — the just-bash wrapper, run against the real engine over a small
// mounted FS. NOTE: this suite runs in the `node` environment, not jsdom.
// just-bash's browser bundle mis-decodes file content to raw byte codes under
// jsdom's globals (a test-env artifact only — the real browser decodes UTF-8
// correctly, verified live). Node matches real-browser decoding. We assert on
// the printed strings directly (no DOM render) so we don't need jsdom here.

import { isValidElement, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { createShellRunner } from '@/components/terminal/shell'
import type { TerminalContext } from '@/components/terminal/types'
import type { Broadcast, Manifest } from '@/lib/terminal/types'

const FS: Record<string, string> = {
  '/about.md': '# About\nStefanie builds tools.\n',
  '/blog/how-i-ai.md': '---\ntitle: How I AI\n---\nsibyl memory across sessions.\n',
  '/projects/chromacat.md': '---\ntitle: ChromaCat\n---\nRGB cat in Rust.\n',
  '/projects/sib/nested.md': 'deeply nested rust note.\n',
  '/projects/sibyl.md': '---\ntitle: Sibyl\ntags: [Rust]\n---\nMemory for agents.\n',
}

const manifest: Manifest = {
  entries: Object.keys(FS).map((path) => ({
    bytes: FS[path].length,
    date: null,
    emoji: null,
    github: null,
    href: null,
    kind: path.startsWith('/blog/') ? 'post' : path.startsWith('/projects/') ? 'project' : 'about',
    latestVersion: null,
    path,
    status: null,
    summary: '',
    tags: [],
    title: path,
  })),
  generatedAt: '2026-05-31T00:00:00.000Z',
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children)
  return ''
}

function shellCtx() {
  const printed: string[] = []
  const cwds: string[] = []
  const ctx = {
    broadcast: {} as Broadcast,
    clear: () => {},
    cwd: '/',
    history: [],
    manifest,
    navigate: () => {},
    print: (node: ReactNode) => printed.push(nodeText(node)),
    registry: { all: () => [], get: () => undefined, names: () => [], register: () => {}, visible: () => [] },
    run: async () => {},
    setCwd: (c: string) => cwds.push(c),
    setTheme: () => {},
  } as unknown as TerminalContext
  return { ctx, cwds, out: () => printed.join('\n'), printed }
}

const newShell = (fetchBodies = async () => FS) => createShellRunner({ fetchBodies })

describe('shell runner (just-bash)', () => {
  it('lists the mounted filesystem', async () => {
    const shell = newShell()
    const c = shellCtx()
    await shell('ls /projects', c.ctx)
    expect(c.out()).toContain('sibyl.md')
    expect(c.out()).toContain('chromacat.md')
  })

  it('does not fetch file bodies for directory-only commands', async () => {
    const fetchBodies = async () => {
      throw new Error('should not fetch bodies for ls')
    }
    const shell = newShell(fetchBodies)
    const c = shellCtx()
    await shell('ls /projects', c.ctx)
    expect(c.out()).toContain('sibyl.md')
  })

  it('cats a file verbatim, including frontmatter', async () => {
    const shell = newShell()
    const c = shellCtx()
    await shell('cat /projects/sibyl.md', c.ctx)
    expect(c.out()).toContain('title: Sibyl')
    expect(c.out()).toContain('Memory for agents.')
  })

  it('carries cwd across commands and reports it via setCwd', async () => {
    const shell = newShell()
    const cd = shellCtx()
    await shell('cd /projects', cd.ctx)
    expect(cd.cwds).toContain('/projects')

    const pwd = shellCtx()
    await shell('pwd', pwd.ctx)
    expect(pwd.out()).toContain('/projects')

    const ls = shellCtx()
    await shell('ls', ls.ctx) // relative to the carried cwd
    expect(ls.out()).toContain('sibyl.md')
  })

  it('persists exports across commands', async () => {
    const shell = newShell()
    await shell('export GREET=hi', shellCtx().ctx)
    const c = shellCtx()
    await shell('echo "g=$GREET"', c.ctx)
    expect(c.out()).toContain('g=hi')
  })

  it('runs pipes', async () => {
    const shell = newShell()
    const c = shellCtx()
    await shell('ls /projects | grep chroma', c.ctx)
    expect(c.out()).toContain('chromacat.md')
  })

  it('grep -r traverses the whole mounted subtree (no missed files)', async () => {
    const calls: Array<readonly string[] | undefined> = []
    const fetchBodies = async (paths?: readonly string[]) => {
      calls.push(paths)
      return FS
    }
    const shell = newShell(fetchBodies)
    const c = shellCtx()
    await shell('grep -ril rust /', c.ctx)
    expect(calls[0]).toEqual(Object.keys(FS))
    expect(c.out()).toContain('chromacat.md') // "RGB cat in Rust"
    expect(c.out()).toContain('nested.md') // "deeply nested rust note"
  })

  it('renders stderr for a missing file without crashing', async () => {
    const shell = newShell()
    const c = shellCtx()
    await shell('cat /does-not-exist.md', c.ctx)
    expect(c.out()).toMatch(/no such file/i)
  })

  it('prints a friendly error and retries when the FS fetch fails', async () => {
    let attempts = 0
    const shell = newShell(async () => {
      attempts += 1
      if (attempts === 1) throw new Error('offline')
      return FS
    })
    const fail = shellCtx()
    await shell('cat /about.md', fail.ctx)
    expect(fail.out()).toContain('shell unavailable')

    const ok = shellCtx()
    await shell('cat /about.md', ok.ctx)
    expect(ok.out()).toContain('Stefanie builds tools')
  })
})
