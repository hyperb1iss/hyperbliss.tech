import { describe, expect, it, vi } from 'vitest'
import { execute, levenshtein, nearestCommand } from '@/components/terminal/executor'
import { parseLine, tokenize } from '@/components/terminal/parser'
import type { Command } from '@/components/terminal/types'
import { makeHarness } from './_harness'

describe('tokenize', () => {
  it('splits on whitespace', () => {
    expect(tokenize('ls projects foo')).toEqual(['ls', 'projects', 'foo'])
  })
  it('respects double and single quotes', () => {
    expect(tokenize('echo "hello world" \'a b\'')).toEqual(['echo', 'hello world', 'a b'])
  })
  it('collapses runs of whitespace', () => {
    expect(tokenize('  a   b  ')).toEqual(['a', 'b'])
  })
})

describe('parseLine', () => {
  it('flags empty lines', () => {
    expect(parseLine('   ').empty).toBe(true)
  })
  it('parses name + args', () => {
    const p = parseLine('grep -r rust')
    expect(p.name).toBe('grep')
    expect(p.args).toEqual(['-r', 'rust'])
    expect(p.force).toBeNull()
    expect(p.line).toBe('grep -r rust')
  })
  it('strips the ! shell sentinel and forces shell', () => {
    const p = parseLine('!ls -la')
    expect(p.force).toBe('shell')
    expect(p.line).toBe('ls -la')
    expect(p.name).toBe('ls')
  })
  it('strips the : native sentinel and forces native', () => {
    const p = parseLine(':help')
    expect(p.force).toBe('native')
    expect(p.line).toBe('help')
    expect(p.name).toBe('help')
  })
})

describe('levenshtein + nearestCommand', () => {
  it('computes edit distance', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3)
    expect(levenshtein('help', 'help')).toBe(0)
  })
  it('suggests the nearest command within threshold', () => {
    expect(nearestCommand('hepl', ['help', 'projects', 'blog'])).toBe('help')
    expect(nearestCommand('xyzzy', ['help', 'projects'])).toBeNull()
  })
})

const fakeCmd = (name: string, run = vi.fn()): Command => ({ name, run, summary: `${name} cmd` })

describe('execute', () => {
  it('dispatches a native command and prints its returned node', async () => {
    const h = makeHarness()
    const run = vi.fn(() => 'native output')
    h.registry.register(fakeCmd('about', run))
    await execute('about', h.ctx)
    expect(run).toHaveBeenCalledOnce()
    expect(h.printedText()).toContain('native output')
  })

  it('does not print when a handler returns void (it printed itself)', async () => {
    const h = makeHarness()
    h.registry.register(
      fakeCmd(
        'clear',
        vi.fn(() => undefined),
      ),
    )
    await execute('clear', h.ctx)
    expect(h.printed).toHaveLength(0)
  })

  it('suggests a near command for an unknown token', async () => {
    const h = makeHarness()
    h.registry.register(fakeCmd('help'))
    await execute('hepl', h.ctx)
    expect(h.printedText()).toContain("did you mean 'help'")
  })

  it('native wins over shell with no force sentinel', async () => {
    const h = makeHarness()
    const native = vi.fn()
    h.registry.register(fakeCmd('now', native))
    const runShell = vi.fn(async () => {})
    await execute('now', h.ctx, runShell)
    expect(native).toHaveBeenCalledOnce()
    expect(runShell).not.toHaveBeenCalled()
  })

  it('routes unknown tokens to the shell when it is available', async () => {
    const h = makeHarness()
    const runShell = vi.fn(async () => {})
    await execute('ls -la /projects', h.ctx, runShell)
    expect(runShell).toHaveBeenCalledWith('ls -la /projects', h.ctx)
  })

  it('! forces the shell even when a native command shares the name', async () => {
    const h = makeHarness()
    const native = vi.fn()
    h.registry.register(fakeCmd('blog', native))
    const runShell = vi.fn(async () => {})
    await execute('!blog', h.ctx, runShell)
    expect(native).not.toHaveBeenCalled()
    expect(runShell).toHaveBeenCalledWith('blog', h.ctx)
  })

  it('! without a loaded shell prints a friendly error', async () => {
    const h = makeHarness()
    await execute('!ls', h.ctx)
    expect(h.printedText()).toContain('shell unavailable')
  })

  it(': forces native dispatch and falls back to did-you-mean if missing', async () => {
    const h = makeHarness()
    const runShell = vi.fn(async () => {})
    h.registry.register(fakeCmd('help'))
    await execute(':hepl', h.ctx, runShell)
    expect(runShell).not.toHaveBeenCalled()
    expect(h.printedText()).toContain("did you mean 'help'")
  })
})
