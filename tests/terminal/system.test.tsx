// The Unix staples resolve natively (registry wins over the shell) and answer
// plainly instead of a "command not found".

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
  it('uptime reports the session and the real content counts', async () => {
    const out = await run('uptime')
    expect(out).toMatch(/up .*1 guest/)
    expect(out).toContain('projects')
  })

  it('ps lists the real projects as processes, with top and htop as aliases', async () => {
    for (const cmd of ['ps', 'top', 'htop']) {
      const out = await run(cmd)
      expect(out).toContain('CMD')
      expect(out).toContain('sibyl')
    }
  })

  it('dmesg prints the page boot log with the real file count', async () => {
    const out = await run('dmesg')
    expect(out).toContain('hyperbliss console booting')
    expect(out).toMatch(/vfs: mounted \d+ files/)
    expect(out).toContain('console: you ran dmesg')
  })

  it('df sizes the content tree by directory', async () => {
    const out = await run('df')
    expect(out).toContain('Mounted on')
    expect(out).toContain('/projects')
    expect(out).toContain('/blog')
  })

  it('free, uname, and cal answer natively', async () => {
    expect(await run('free')).not.toContain('command not found')
    expect(await run('uname')).toContain('Hyperbliss console')
    expect(await run('cal')).toContain('Su Mo Tu We Th Fr Sa')
  })

  it('exit presses Escape, which is what closes the console', async () => {
    let pressed = ''
    const onKey = (e: KeyboardEvent) => {
      pressed = e.key
    }
    window.addEventListener('keydown', onKey)
    await run('exit')
    window.removeEventListener('keydown', onKey)
    expect(pressed).toBe('Escape')
  })

  it('whoami and date resolve natively', async () => {
    expect(await run('whoami')).toContain('guest')
    expect(await run('date')).not.toContain('command not found')
  })
})
