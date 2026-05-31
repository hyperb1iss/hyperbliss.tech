// T2.2 — conflict-table routing (§5.3). Native command names resolve to their
// handler; real coreutils fall through to the shell; the !/: sentinels force
// the other side. One assertion per table row.

import { describe, expect, it, vi } from 'vitest'
import '@/components/terminal/commands'
import { execute } from '@/components/terminal/executor'
import { registry as shared } from '@/components/terminal/registry'
import { makeHarness } from './_harness'

// §5.3 conflict table.
const NATIVE_ROWS = [
  'help',
  'clear',
  'history',
  'theme',
  'neofetch',
  'projects',
  'blog',
  'lab',
  'now',
  'about',
  'contact',
  'resume',
]
const SHELL_ROWS = ['ls', 'cat', 'grep', 'pwd', 'cd', 'echo', 'find', 'head', 'tail', 'wc', 'env', 'which']

describe('native-wins precedence (conflict table)', () => {
  for (const name of NATIVE_ROWS) {
    it(`'${name}' resolves to the native handler, never the shell`, async () => {
      const h = makeHarness({ registry: shared })
      const shellRunner = vi.fn(async () => {})
      // sanity: the table claims this is native, so it must be registered
      expect(shared.get(name), `${name} should be a native command`).toBeDefined()
      await execute(name, h.ctx, shellRunner)
      expect(shellRunner, `${name} must not reach the shell`).not.toHaveBeenCalled()
    })
  }

  for (const name of SHELL_ROWS) {
    it(`'${name}' falls through to the shell`, async () => {
      const h = makeHarness({ registry: shared })
      const shellRunner = vi.fn(async () => {})
      expect(shared.get(name), `${name} should NOT be a native command`).toBeUndefined()
      await execute(`${name} arg`, h.ctx, shellRunner)
      expect(shellRunner).toHaveBeenCalledWith(`${name} arg`, h.ctx)
    })
  }
})

describe('force sentinels', () => {
  it('! forces a native-named command to the shell', async () => {
    const h = makeHarness({ registry: shared })
    const shellRunner = vi.fn(async () => {})
    await execute('!projects', h.ctx, shellRunner)
    expect(shellRunner).toHaveBeenCalledWith('projects', h.ctx)
  })

  it(': forces native dispatch (and a coreutil name with no native falls to did-you-mean)', async () => {
    const h = makeHarness({ registry: shared })
    const shellRunner = vi.fn(async () => {})
    await execute(':projects', h.ctx, shellRunner)
    expect(shellRunner).not.toHaveBeenCalled() // native projects ran

    const h2 = makeHarness({ registry: shared })
    await execute(':ls', h2.ctx, shellRunner)
    expect(shellRunner).not.toHaveBeenCalled() // : forces native; ls isn't native → no shell
  })

  it('never uses backslash or sh -c — only !/: sentinels exist in the parser', async () => {
    // guard: a line starting with a backslash is treated as a normal command
    // name, not an escape.
    const h = makeHarness({ registry: shared })
    const shellRunner = vi.fn(async () => {})
    await execute('\\ls', h.ctx, shellRunner)
    // '\ls' is not native and not a sentinel → goes to shell verbatim
    expect(shellRunner).toHaveBeenCalledWith('\\ls', h.ctx)
  })
})
