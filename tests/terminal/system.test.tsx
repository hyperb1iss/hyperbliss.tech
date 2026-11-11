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
  it('whoami and date resolve natively', async () => {
    expect(await run('whoami')).toContain('guest')
    expect(await run('date')).not.toContain('command not found')
  })
})
