// neofetch: the site at a glance. The newest release, essay, and project,
// each a link, over the content counts.

import type { Broadcast } from '@/lib/terminal/types'
import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import type { TerminalContext } from '../types'
import { Block, Heading, TermLink } from './ui'

const Stat = styled.div`
  & .k { color: #ff9bdc; }
  & .v { color: #f4f0ff; }
`

const KEY_WIDTH = 9

function Line({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <Stat>
      <span className="k">{k.padEnd(KEY_WIDTH, ' ')}</span>
      <span className="v">{children}</span>
    </Stat>
  )
}

function NeofetchView({ ctx }: { ctx: TerminalContext }) {
  const b: Broadcast = ctx.broadcast
  return (
    <Block>
      <Heading>hyperbliss.tech</Heading>
      {b.latestShip && (
        <Line k="release">
          <TermLink href={b.latestShip.url} navigate={ctx.navigate}>
            {b.latestShip.project} v{b.latestShip.version}
          </TermLink>
        </Line>
      )}
      {b.latestPost && (
        <Line k="essay">
          <TermLink href={b.latestPost.href} navigate={ctx.navigate}>
            {b.latestPost.title}
          </TermLink>
          {b.latestPost.date ? ` · ${b.latestPost.date}` : ''}
        </Line>
      )}
      {b.latestProject && (
        <Line k="project">
          <TermLink href={b.latestProject.href} navigate={ctx.navigate}>
            {b.latestProject.title}
          </TermLink>
        </Line>
      )}
      <Line k="content">{`${b.projectCount} projects · ${b.postCount} posts · ${b.labCount} lab`}</Line>
    </Block>
  )
}

registry.register({
  aliases: ['sysinfo'],
  group: 'content',
  name: 'neofetch',
  run: (_args, ctx) => <NeofetchView ctx={ctx} />,
  summary: 'the newest release, essay, and project',
})
