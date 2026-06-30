// Live GitHub activity command (`gh` / `activity` / `stats`). Self-registers on
// import. Fetches the cached /api/activity summary on mount and renders recent
// pushes, PRs, releases, a commits/day sparkline, and the repos being touched.
// The relative times are a snapshot from when the command ran (like a real CLI).

import { useEffect, useState } from 'react'
import type { ActivityKind, ActivitySummary } from '@/lib/github'
import { sparkline } from '@/lib/sparkline'
import { registry } from '../registry'
import type { TerminalContext } from '../types'
import { Accent, Block, Heading, ListRow, Muted, Ok, Pink, TermLink } from './ui'

const ICON: Record<ActivityKind, string> = { create: '✦', pr: '⇡', push: '↑', release: '⌁' }

function timeAgo(iso: string, now: number): string {
  const s = Math.max(0, Math.floor((now - Date.parse(iso)) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}w`
}

type State = ActivitySummary | 'loading' | 'error'

function ActivityView({ ctx }: { ctx: TerminalContext }) {
  const [state, setState] = useState<State>('loading')

  useEffect(() => {
    let cancelled = false
    fetch('/api/activity')
      .then((r) => (r.ok ? (r.json() as Promise<ActivitySummary>) : Promise.reject(new Error('http'))))
      .then((data) => {
        if (!cancelled) setState(data.ok ? data : 'error')
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'loading') {
    return (
      <Block>
        <Muted>querying github…</Muted>
      </Block>
    )
  }

  if (state === 'error') {
    return (
      <Block>
        <Pink>gh: github unreachable — rate-limited or offline, try again shortly</Pink>
      </Block>
    )
  }

  if (state.events.length === 0) {
    return (
      <Block>
        <Heading>gh · live activity</Heading>
        <Muted>quiet right now — nothing public in the last while</Muted>
      </Block>
    )
  }

  const now = Date.now()
  return (
    <Block>
      <Heading>gh · live activity</Heading>
      {state.events.slice(0, 8).map((ev) => (
        <div key={`${ev.repoFull}-${ev.createdAt}-${ev.title}`}>
          <ListRow>
            <Muted>{timeAgo(ev.createdAt, now).padStart(3)}</Muted>
            <span>{ICON[ev.kind]}</span>
            <TermLink href={ev.url} navigate={ctx.navigate}>
              {ev.repo}
            </TermLink>
            <Accent>{ev.title}</Accent>
          </ListRow>
          {ev.detail && (
            <div>
              <Muted>
                {'    '}
                {ev.detail}
              </Muted>
            </div>
          )}
        </div>
      ))}
      <div>
        <Muted>{state.windowDays}d </Muted>
        <Ok>{sparkline(state.pushesPerDay)}</Ok>
        <Muted>
          {' '}
          {state.totalPushes} pushes · {state.repos.length} repos
        </Muted>
      </div>
      {state.repos.length > 0 && (
        <div>
          <Muted>active in: </Muted>
          <Accent>{state.repos.slice(0, 6).join(' · ')}</Accent>
        </div>
      )}
      <div>
        <Muted>→ </Muted>
        <TermLink href="https://github.com/hyperb1iss" navigate={ctx.navigate}>
          github.com/hyperb1iss
        </TermLink>
      </div>
    </Block>
  )
}

registry.register({
  aliases: ['activity', 'stats'],
  group: 'content',
  name: 'gh',
  run: (_args, ctx) => <ActivityView ctx={ctx} />,
  summary: 'live github activity — recent pushes, PRs, releases',
})
