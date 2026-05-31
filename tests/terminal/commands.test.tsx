// Exercises the real registered commands against the shared registry.

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import '@/components/terminal/commands'
import { execute } from '@/components/terminal/executor'
import { registry as shared } from '@/components/terminal/registry'
import { makeHarness } from './_harness'

const run = async (line: string, history: string[] = []) => {
  const h = makeHarness({ history, registry: shared })
  await execute(line, h.ctx)
  return h
}

describe('registered command set', () => {
  it('registers the core commands', () => {
    for (const name of ['help', 'clear', 'neofetch', 'projects', 'blog', 'lab', 'now', 'about', 'contact', 'resume']) {
      expect(shared.get(name), name).toBeDefined()
    }
  })

  it('help lists commands and usage tips', async () => {
    const h = await run('help')
    const out = h.printedText()
    expect(out).toContain('projects')
    expect(out).toContain('neofetch')
    expect(out).toContain('forces shell')
  })

  it('help <command> shows usage', async () => {
    const h = await run('help theme')
    expect(h.printedText()).toContain('theme <silk|matrix|amber>')
  })

  it('neofetch paints the broadcast panel', async () => {
    const h = await run('neofetch')
    const out = h.printedText()
    expect(out).toContain('hyperbliss')
    expect(out).toContain('Building a terminal hero') // focus
    expect(out).toContain('24 projects · 6 posts · 1 lab')
    expect(out).toContain('How I AI') // latest post
  })

  it('projects lists project titles with a count', async () => {
    const h = await run('projects')
    const out = h.printedText()
    expect(out).toContain('Sibyl')
    expect(out).toContain('ChromaCat')
    expect(out).toContain('repos')
  })

  it('blog lists posts', async () => {
    const h = await run('blog')
    expect(h.printedText()).toContain('How I AI')
  })

  it('lab lists experiments', async () => {
    const h = await run('lab')
    expect(h.printedText()).toContain('Regex Nightmares')
  })

  it('now shows focus and prose', async () => {
    const h = await run('now')
    const out = h.printedText()
    expect(out).toContain('Building a terminal hero')
    expect(out).toContain('Building the terminal hero.') // nowBody
  })

  it('about links to the full story', async () => {
    const h = await run('about')
    const { container } = render(
      <div>
        {h.printed.map((p, i) => (
          <span key={i}>{p.node}</span>
        ))}
      </div>,
    )
    const link = container.querySelector('a[href="/about/"]')
    expect(link).not.toBeNull()
  })

  it('contact shows social channels and email', async () => {
    const h = await run('contact')
    const out = h.printedText()
    expect(out).toContain('GitHub')
    expect(out).toContain('stef@hyperbliss.tech')
  })

  it('clear empties the screen', async () => {
    const h = await run('clear')
    expect(h.cleared).toBe(1)
  })

  it('theme sets a known theme and rejects unknown ones', async () => {
    const ok = await run('theme matrix')
    expect(ok.themed).toContain('matrix')
    expect(ok.printedText()).toContain('matrix')
    const bad = await run('theme bogus')
    expect(bad.themed).not.toContain('bogus')
    expect(bad.printedText()).toContain('unknown theme')
  })

  it('history reports entries (or empty state)', async () => {
    const empty = await run('history')
    expect(empty.printedText()).toContain('no history yet')
    const filled = await run('history', ['help', 'neofetch'])
    expect(filled.printedText()).toContain('neofetch')
  })

  it('ssh greets for the right host and refuses others', async () => {
    const ok = await run('ssh hyperbliss.tech')
    expect(ok.printedText()).toContain('welcome to hyperbliss.tech')
    const refused = await run('ssh google.com')
    expect(refused.printedText()).toContain('Connection refused')
  })

  it('sudo denies politely', async () => {
    const h = await run('sudo rm -rf /')
    expect(h.printedText()).toContain('nice try')
  })
})
