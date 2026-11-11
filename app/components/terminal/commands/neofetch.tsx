// neofetch: the site at a glance, the way neofetch draws a machine. An LED
// mark beside the newest release and essay, the flagship products, the
// content counts, and the theme's colors as a row of cells.

import type { Broadcast } from '@/lib/terminal/types'
import { styled } from '../../../../styled-system/jsx'
import LedSign from '../LedSign'
import { registry } from '../registry'
import type { TerminalContext } from '../types'
import { Heading, TermLink } from './ui'

const Stat = styled.div`
  & .k { color: var(--term-accent-2); }
  & .v { color: var(--term-ink); }
`

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1.6rem 3.2rem;
  padding: 0.8rem 0;
`

const Mark = styled.div`
  width: 10rem;
  flex-shrink: 0;
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

const Swatches = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 1rem;

  & span {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 1px;
  }
`

const SWATCHES = [
  '--led-1',
  '--led-2',
  '--led-3',
  '--led-4',
  '--term-accent',
  '--term-accent-2',
  '--term-accent-3',
  '--term-ink',
]

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
    <Wrap>
      <Mark>
        <LedSign cell="0.9rem" label="Hyperbliss mark" text="HB" />
      </Mark>
      <Panel>
        <Heading>guest@hyperbliss</Heading>
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
        {b.flagships.length > 0 && (
          <Line k="products">
            {b.flagships.map((f, i) => (
              <span key={f.href}>
                {i > 0 && ' · '}
                <TermLink href={f.href} navigate={ctx.navigate}>
                  {f.title}
                </TermLink>
              </span>
            ))}
          </Line>
        )}
        <Line k="content">{`${b.projectCount} projects · ${b.postCount} posts · ${b.labCount} lab`}</Line>
        <Swatches aria-hidden="true">
          {SWATCHES.map((token) => (
            <span key={token} style={{ background: `var(${token})` }} />
          ))}
        </Swatches>
      </Panel>
    </Wrap>
  )
}

registry.register({
  aliases: ['sysinfo'],
  group: 'content',
  name: 'neofetch',
  run: (_args, ctx) => <NeofetchView ctx={ctx} />,
  summary: 'the site at a glance',
})
