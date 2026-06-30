// Meta / UI commands: help, clear, theme, history. Self-registers on import.

import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import { OutputText, text } from '../render'
import type { CommandGroup, TerminalContext } from '../types'
import { Accent, Block, Heading, Muted, Pink } from './ui'

const GROUP_LABELS: Record<CommandGroup, string> = {
  content: 'content',
  fun: 'fun',
  meta: 'core',
  shell: 'shell',
}
const GROUP_ORDER: CommandGroup[] = ['meta', 'content', 'fun', 'shell']

const CmdGrid = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: var(--space-4);
  row-gap: 1px;
  margin-bottom: var(--space-2);

  & .name {
    color: var(--silk-circuit-cyan);
  }
  & .sum {
    color: var(--text-secondary);
  }
`

export const TERMINAL_THEMES = ['silk', 'matrix', 'amber'] as const
export type TerminalTheme = (typeof TERMINAL_THEMES)[number]

function HelpAll({ ctx }: { ctx: TerminalContext }) {
  const groups = new Map<CommandGroup, { name: string; summary: string }[]>()
  for (const cmd of ctx.registry.visible()) {
    const g = cmd.group ?? 'meta'
    if (!groups.has(g)) groups.set(g, [])
    groups.get(g)?.push({ name: cmd.name, summary: cmd.summary })
  }

  return (
    <Block>
      <Heading>hyperbliss terminal — type a command, or tap a chip below</Heading>
      {GROUP_ORDER.filter((g) => groups.has(g)).map((g) => (
        <div key={g}>
          <Muted>{GROUP_LABELS[g]}</Muted>
          <CmdGrid>
            {groups.get(g)?.map((c) => (
              <div key={c.name} style={{ display: 'contents' }}>
                <span className="name">{c.name}</span>
                <span className="sum">{c.summary}</span>
              </div>
            ))}
          </CmdGrid>
        </div>
      ))}
      <div>
        <Muted>tips</Muted>
        <div>
          <Accent>↑/↓</Accent> history · <Accent>Tab</Accent> completion · <Accent>⌘K</Accent> palette ·{' '}
          <Pink>!cmd</Pink> forces shell · <Pink>:cmd</Pink> forces native
        </div>
        <div>
          real shell commands work too: <Accent>ls</Accent> <Accent>cat</Accent> <Accent>grep</Accent>{' '}
          <Accent>find</Accent> <Accent>echo</Accent> over the content tree · <Accent>share</Accent> a session
        </div>
      </div>
    </Block>
  )
}

function HelpOne({ ctx, name }: { ctx: TerminalContext; name: string }) {
  const cmd = ctx.registry.get(name)
  if (!cmd) return text(`help: no such command: ${name}`, 'stderr')
  return (
    <Block>
      <Heading>{cmd.name}</Heading>
      <div>{cmd.summary}</div>
      {cmd.usage && (
        <div>
          <Muted>usage: </Muted>
          <Accent>{cmd.usage}</Accent>
        </div>
      )}
      {cmd.aliases && cmd.aliases.length > 0 && (
        <div>
          <Muted>aliases: </Muted>
          {cmd.aliases.join(', ')}
        </div>
      )}
    </Block>
  )
}

registry.register({
  group: 'meta',
  name: 'help',
  run: (args, ctx) => (args[0] ? <HelpOne ctx={ctx} name={args[0]} /> : <HelpAll ctx={ctx} />),
  summary: 'list commands, or `help <command>`',
  usage: 'help [command]',
})

registry.register({
  aliases: ['cls'],
  group: 'meta',
  name: 'clear',
  run: (_args, ctx) => {
    ctx.clear()
  },
  summary: 'clear the screen',
})

registry.register({
  group: 'meta',
  name: 'theme',
  run: (args, ctx) => {
    const name = args[0]
    if (!name) return text(`themes: ${TERMINAL_THEMES.join(', ')} · usage: theme <name>`)
    if (!TERMINAL_THEMES.includes(name as TerminalTheme)) {
      return text(`theme: unknown theme '${name}' (try: ${TERMINAL_THEMES.join(', ')})`, 'stderr')
    }
    ctx.setTheme(name)
    return text(`theme → ${name}`, 'ok')
  },
  summary: 'switch the terminal color theme',
  usage: 'theme <silk|matrix|amber>',
})

registry.register({
  group: 'meta',
  name: 'agent',
  run: async () => {
    const { getRegisteredAgentToolNames, isWebMcpEnabled } = await import('../webmcp')
    if (!isWebMcpEnabled()) return text('WebMCP: disabled on this build', 'system')
    let toolNames: string[] | null
    try {
      toolNames = await getRegisteredAgentToolNames()
    } catch {
      return text('WebMCP: tools unavailable', 'system')
    }
    if (toolNames === null) return text('WebMCP: unsupported in this browser', 'system')
    if (toolNames.length === 0) return text('WebMCP: available, no tools registered yet', 'system')
    return text(`WebMCP: ready · ${toolNames.length} tools\n${toolNames.join('\n')}`, 'system')
  },
  summary: 'show WebMCP agent interface status',
})

registry.register({
  group: 'meta',
  name: 'history',
  run: (_args, ctx) => {
    if (ctx.history.length === 0) return text('no history yet — start typing')
    return (
      <Block>
        {ctx.history.map((line, i) => (
          <div key={`${i}-${line}`}>
            <Muted>{String(i + 1).padStart(3, ' ')} </Muted>
            <OutputText>{line}</OutputText>
          </div>
        ))}
      </Block>
    )
  },
  summary: 'show command history',
})
