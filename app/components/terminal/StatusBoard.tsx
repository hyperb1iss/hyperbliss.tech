'use client'

// The console's landing display: the company's name set in the display face,
// a ticking clock, an activity feed that cycles recent ships and essays, the
// push sparkline, and rotating hints. Rendered once as a boot-finale log entry;
// it owns its own timers so it keeps moving without re-running the boot.
// Decorative motion is gated behind prefers-reduced-motion; the clock
// (information, not decoration) keeps ticking either way.

import { useEffect, useState } from 'react'
import type { ActivityKind, ActivitySummary } from '@/lib/github'
import { sparkline } from '@/lib/sparkline'
import type { Broadcast } from '@/lib/terminal/types'
import { styled } from '../../../styled-system/jsx'
import { getModelContext, isWebMcpEnabled } from './webmcp'

const SPARK_LEN = 16

const KIND_ICON: Record<ActivityKind, string> = { create: '+', pr: '⇡', push: '↑', release: '⌁' }

const TIPS = [
  'type `help` to explore',
  '`projects` · `blog` · `now`',
  '`matrix` follows the white rabbit',
  '⌘K / Ctrl-K opens the palette',
  'or just start typing — it is a real shell',
]

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 0.8rem 0 1.2rem;
`

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.6rem;
  flex-wrap: wrap;
`

const Host = styled.span`
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  font-size: clamp(2.4rem, 1.8rem + 1.6vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: #f6f2ff;
`

const Sub = styled.p`
  margin: 0;
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.5;
  color: #d6cfe6;
`

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.2rem 0;
  border-top: 1px solid rgba(244, 240, 255, 0.1);
  border-bottom: 1px solid rgba(244, 240, 255, 0.1);
`

const Line = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: baseline;
  flex-wrap: wrap;
`

const Label = styled.span`
  color: #ff9bdc;
  min-width: 8rem;
  flex-shrink: 0;
`

const Clock = styled.span`
  color: #b9b0cc;
  font-variant-numeric: tabular-nums;
`

const FeedText = styled.span`
  color: #f4f0ff;
`

const Spark = styled.span`
  color: #80ffea;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
`

const Live = styled.span`
  color: #80ffea;

  &::before {
    content: '●';
    margin-right: 0.4em;
    animation: silkStatusPulse 1.6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { animation: none; }
  }
`

const Tip = styled.span`
  color: #8f86a3;
`

const pad2 = (n: number) => n.toString().padStart(2, '0')
const clockStr = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
interface FeedItem {
  icon: string
  text: string
}

function buildFeed(b: Broadcast, activity: ActivitySummary | null): FeedItem[] {
  const feed: FeedItem[] = []
  if (activity) {
    for (const ev of activity.events.slice(0, 5)) {
      feed.push({ icon: KIND_ICON[ev.kind], text: `${ev.title} · ${ev.repo}` })
    }
  }
  if (b.latestShip) {
    feed.push({
      icon: '↑',
      text: `shipped ${b.latestShip.project}${b.latestShip.version ? ` v${b.latestShip.version}` : ''}`,
    })
  }
  if (b.latestPost) feed.push({ icon: '✎', text: `published ${b.latestPost.title}` })
  feed.push({
    icon: '◆',
    text:
      activity && activity.totalPushes > 0
        ? `${activity.totalPushes} pushes · ${activity.repos.length} repos · ${b.postCount} posts`
        : `${b.projectCount} repos · ${b.postCount} posts · ${b.labCount} experiments`,
  })
  feed.push({ icon: '⌁', text: 'open source all the way down' })
  return feed
}

const seedSpark = () => Array.from({ length: SPARK_LEN }, (_, i) => 0.35 + 0.25 * Math.sin(i / 2))
const stepSpark = (prev: number) => Math.max(0.06, Math.min(1, prev + (Math.random() - 0.5) * 0.55))

/** Fetch the cached activity summary once; null until a non-empty result lands. */
function useGithubActivity(): ActivitySummary | null {
  const [data, setData] = useState<ActivitySummary | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch('/api/activity')
      .then((r) => (r.ok ? (r.json() as Promise<ActivitySummary>) : null))
      .then((d) => {
        if (!cancelled && d?.ok && d.events.length > 0) setData(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return data
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])
  return reduced
}

type WebMcpStatus = { state: 'disabled' | 'unsupported' | 'ready'; count: number | null }

function useWebMcpStatus(): WebMcpStatus {
  const [status, setStatus] = useState<WebMcpStatus>({ count: null, state: 'disabled' })

  useEffect(() => {
    if (!isWebMcpEnabled()) {
      setStatus({ count: null, state: 'disabled' })
      return
    }

    const modelContext = getModelContext()
    if (!modelContext) {
      setStatus({ count: null, state: 'unsupported' })
      return
    }

    const getTools = modelContext.getTools?.bind(modelContext)
    if (!getTools) {
      setStatus({ count: null, state: 'unsupported' })
      return
    }

    let cancelled = false
    const sync = async () => {
      try {
        const tools = await getTools()
        if (!cancelled) setStatus({ count: tools?.length ?? null, state: 'ready' })
      } catch {
        if (!cancelled) setStatus({ count: null, state: 'unsupported' })
      }
    }

    void sync()
    modelContext.addEventListener('toolchange', sync)
    return () => {
      cancelled = true
      modelContext.removeEventListener('toolchange', sync)
    }
  }, [])

  return status
}

export default function StatusBoard({ broadcast }: { broadcast: Broadcast }) {
  const reduced = usePrefersReducedMotion()
  const webmcp = useWebMcpStatus()
  const activity = useGithubActivity()
  const feed = buildFeed(broadcast, activity)
  const [now, setNow] = useState(() => new Date())
  const [feedIdx, setFeedIdx] = useState(0)
  const [tipIdx, setTipIdx] = useState(0)
  const [spark, setSpark] = useState<number[]>(seedSpark)

  // Clock + uptime always tick — they're information, not decoration.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Feed / tips / sparkline are ambient flourish — pause them for reduced motion.
  // Real commit cadence is static data, so only the placeholder spark animates.
  useEffect(() => {
    if (reduced) return
    const feedId = setInterval(() => setFeedIdx((i) => (i + 1) % feed.length), 3600)
    const tipId = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 4800)
    const sparkId = activity
      ? null
      : setInterval(() => setSpark((prev) => [...prev.slice(1), stepSpark(prev[prev.length - 1])]), 460)
    return () => {
      clearInterval(feedId)
      clearInterval(tipId)
      if (sparkId) clearInterval(sparkId)
    }
  }, [reduced, feed.length, activity])

  const item = feed[feedIdx % feed.length] ?? feed[0]
  const sparkVals = activity ? activity.pushesPerDay : spark

  return (
    <Wrap aria-label="hyperbliss status console">
      <Head>
        <Host>Hyperbliss Technologies</Host>
        <Clock>{clockStr(now)}</Clock>
      </Head>
      <Sub>Open source tools for light, memory, and the terminal.</Sub>

      <Rows>
        <Line>
          <Label>{item.icon} latest</Label>
          <FeedText>{item.text}</FeedText>
        </Line>
        <Line>
          <Label>{activity ? 'pushes' : 'pulse'}</Label>
          <Spark>{sparkline(sparkVals)}</Spark>
          <Live>live</Live>
        </Line>
        {/* Agent tooling is plumbing: it only earns a row when it is actually on. */}
        {webmcp.state === 'ready' && (
          <Line>
            <Label>agents</Label>
            <Spark>WebMCP</Spark>
            <Live>ready{webmcp.count === null ? '' : ` · ${webmcp.count} tools`}</Live>
          </Line>
        )}
      </Rows>

      <Tip>{TIPS[tipIdx % TIPS.length]}</Tip>
    </Wrap>
  )
}
