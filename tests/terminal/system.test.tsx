// Standard-ish unix commands resolve natively (registry wins over the shell)
// and render their themed output instead of a "command not found".

import { describe, expect, it } from 'vitest'
import '@/components/terminal/commands'
import { execute } from '@/components/terminal/executor'
import { registry as shared } from '@/components/terminal/registry'
import { makeHarness } from './_harness'

const run = async (line: string) => {
  const h = makeHarness({ registry: shared })
  await execute(line, h.ctx)
  return h.printedText()
}

describe('system commands', () => {
  it('uptime reports a load average', async () => {
    const out = await run('uptime')
    expect(out).toMatch(/load average/)
    expect(out).not.toContain('command not found')
  })

  it('ps lists hyperbliss processes', async () => {
    const out = await run('ps')
    expect(out).toContain('cyberscape')
    expect(out).toContain('CMD')
  })

  it('top and htop alias to ps', async () => {
    expect(await run('top')).toContain('cyberscape')
    expect(await run('htop')).toContain('cyberscape')
  })

  it('dmesg prints a boot log', async () => {
    const out = await run('dmesg')
    expect(out).toContain('hyperbliss kernel')
    expect(out).toContain('terminal: ready')
  })

  it('whoami, uname, free, df, date resolve natively', async () => {
    expect(await run('whoami')).toContain('guest')
    expect(await run('uname')).toContain('SilkCircuit')
    expect(await run('free')).toContain('Mem:')
    expect(await run('df')).toContain('Filesystem')
    expect(await run('date')).not.toContain('command not found')
  })
})
