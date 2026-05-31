// neofetch (T1.8) — the thesis command. An ASCII sigil + a live broadcast
// panel: focus, latest ship/post/project, content counts. Auto-run on first
// boot (P3); the most screenshot-shareable artifact on the site.

import type { Broadcast } from '@/lib/terminal/types'
import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import type { TerminalContext } from '../types'
import { TermLink } from './ui'

// ASCII-only so it aligns in any monospace font. A faceted gem (💎 = quality).
const SIGIL = ['    /\\', '   /  \\', '  /\\  /\\', ' /  \\/  \\', ' \\  /\\  /', '  \\/  \\/', '   \\  /', '    \\/']
const SIGIL_COLORS = [
  'var(--silk-quantum-purple)',
  'var(--silk-quantum-purple)',
  'var(--silk-lilac)',
  'var(--silk-circuit-cyan)',
  'var(--silk-circuit-cyan)',
  'var(--silk-plasma-pink)',
  'var(--silk-plasma-pink)',
  'var(--silk-plasma-magenta)',
]

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  padding: var(--space-2) 0;
  font-family: var(--font-mono);
`

const Art = styled.pre`
  margin: 0;
  font-family: var(--font-mono);
  line-height: 1.15;
  white-space: pre;
  filter: drop-shadow(0 0 8px rgba(162, 89, 255, 0.4));
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

const TitleLine = styled.div`
  & .who { color: var(--silk-circuit-cyan); font-weight: var(--font-bold); }
  & .at { color: var(--text-muted); }
  & .host { color: var(--silk-quantum-purple); font-weight: var(--font-bold); }
`

const Rule = styled.div`
  color: var(--text-muted);
`

const Stat = styled.div`
  & .k { color: var(--silk-plasma-pink); }
  & .v { color: var(--text-primary); }
`

const Swatches = styled.div`
  display: flex;
  gap: 4px;
  margin-top: var(--space-2);

  & span {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    display: inline-block;
  }
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
    <Wrap>
      <Art aria-hidden="true">
        {SIGIL.map((line, i) => (
          <div key={line} style={{ color: SIGIL_COLORS[i] }}>
            {line}
          </div>
        ))}
      </Art>
      <Panel>
        <TitleLine>
          <span className="who">guest</span>
          <span className="at">@</span>
          <span className="host">hyperbliss</span>
        </TitleLine>
        <Rule>────────────────────────────</Rule>
        <Line k="focus">{b.focus}</Line>
        {b.location && <Line k="location">{b.location}</Line>}
        {b.latestShip && (
          <Line k="ship">
            <TermLink href={b.latestShip.url} navigate={ctx.navigate}>
              {b.latestShip.project} v{b.latestShip.version}
            </TermLink>
          </Line>
        )}
        {b.latestPost && (
          <Line k="post">
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
        <Line k="motto">open source all the way down</Line>
        <Swatches aria-hidden="true">
          <span style={{ background: 'var(--silk-quantum-purple)' }} />
          <span style={{ background: 'var(--silk-quantum-indigo)' }} />
          <span style={{ background: 'var(--silk-circuit-cyan)' }} />
          <span style={{ background: 'var(--silk-plasma-pink)' }} />
          <span style={{ background: 'var(--silk-success)' }} />
          <span style={{ background: 'var(--silk-warning)' }} />
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
  summary: 'system + broadcast panel',
})
