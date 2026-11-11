// The Unix staples a visitor types out of habit, answered with real numbers
// from this site instead of "command not found" (registry commands win over
// the shell). Self-registers on import.

import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import { text } from '../render'

const Pre = styled.pre`
  margin: 0;
  /* Opt out of the global boxed code block: this is plain console output. */
  font-size: inherit;
  line-height: inherit;
  background: none;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  font-family: var(--font-mono);
  white-space: pre;
  overflow-x: auto;
  color: var(--term-ink);
  padding: var(--space-1) 0;
`

const pad2 = (n: number) => n.toString().padStart(2, '0')
const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`

/** How long this page has been open, as uptime prints it. */
function sessionAge(): string {
  const mins = Math.floor((typeof performance === 'undefined' ? 0 : performance.now()) / 60000)
  if (mins < 1) return 'less than a minute'
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}:${pad2(mins % 60)}`
}

registry.register({
  group: 'fun',
  name: 'uptime',
  run: (_args, ctx) => {
    const now = new Date()
    const b = ctx.broadcast
    return text(
      ` ${pad2(now.getHours())}:${pad2(now.getMinutes())} up ${sessionAge()},  1 guest,  ${count(b.projectCount, 'project')}, ${count(b.postCount, 'essay')}, ${count(b.labCount, 'experiment')}`,
    )
  },
  summary: 'how long you have been here, and what is on the box',
})

registry.register({
  aliases: ['top', 'htop'],
  group: 'fun',
  name: 'ps',
  run: (_args, ctx) => {
    // The real projects, listed as if each were running here.
    const projects = ctx.manifest.entries.filter((e) => e.kind === 'project').slice(0, 8)
    const rows = [
      ['1', '?', 'init'],
      ...projects.map((p, i) => [String(42 + i * 61), 'tty1', p.path.replace(/^.*\//, '').replace(/\.md$/, '')]),
      [String(42 + projects.length * 61), 'pts/0', 'ps'],
    ]
    const header = `${'PID'.padEnd(6)} ${'TTY'.padEnd(7)} CMD`
    return (
      <Pre>{[header, ...rows.map(([pid, tty, cmd]) => `${pid.padEnd(6)} ${tty.padEnd(7)} ${cmd}`)].join('\n')}</Pre>
    )
  },
  summary: 'the projects, as running processes',
})

registry.register({
  group: 'fun',
  name: 'whoami',
  run: () => text('guest'),
  summary: 'who you are right now',
})

registry.register({
  group: 'fun',
  name: 'date',
  run: () => text(new Date().toString()),
  summary: 'the current date and time',
})
