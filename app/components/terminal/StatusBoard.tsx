'use client'

// The living status console — the terminal's landing display. A neofetch-style
// sigil and identity, but alive: a ticking clock + uptime, an activity feed that
// cycles recent ships/posts, an ambient sparkline, the current focus, and
// rotating hints. Rendered once as a boot-finale log entry; it owns its own
// timers so it keeps breathing without re-running the boot. Decorative motion is
// gated behind prefers-reduced-motion; the clock (information, not decoration)
// keeps ticking either way.

import { useEffect, useRef, useState } from 'react'
import type { Broadcast } from '@/lib/terminal/types'
import { styled } from '../../../styled-system/jsx'

const SIGIL_ART = ['   ⟡   ', '  ╱│╲  ', ' ╱ │ ╲ ', '╳──┼──╳', ' ╲ │ ╱ ', '  ╲│╱  ', '   ⟡   ']
const SIGIL_COLORS = ['#a259ff', '#b14dff', '#c44dff', '#e135ff', '#ff6ac1', '#ff75d8', '#80ffea']
const SIGIL = SIGIL_ART.map((art, i) => ({ art, color: SIGIL_COLORS[i % SIGIL_COLORS.length], id: `sigil-${i}` }))

const BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
const SPARK_LEN = 16

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
  gap: var(--space-2);
  padding: var(--space-1) 0 var(--space-2);
`

const Top = styled.div`
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
  align-items: flex-start;
`

const Sigil = styled.pre`
  margin: 0;
  line-height: 1.05;
  font-family: var(--font-mono);
  flex-shrink: 0;
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 14rem;
`

const Line = styled.div`
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
  flex-wrap: wrap;
`

const Label = styled.span`
  color: var(--silk-circuit-cyan);
  min-width: 4.5rem;
  flex-shrink: 0;
`

const Host = styled.span`
  color: var(--silk-plasma-pink);
`

const Spacer = styled.span`
  flex: 1;
  min-width: var(--space-4);
`

const Clock = styled.span`
  color: var(--silk-plasma-pink);
  font-variant-numeric: tabular-nums;
`

const Mono = styled.span`
  font-variant-numeric: tabular-nums;
`

const Rule = styled.div`
  border-top: 1px solid color-mix(in oklab, var(--silk-quantum-purple) 28%, transparent);
  margin: 2px 0;
`

const FeedText = styled.span`
  color: var(--text-secondary);
`

const Spark = styled.span`
  color: var(--silk-success, #50fa7b);
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
`

const Live = styled.span`
  color: var(--silk-success, #50fa7b);

  &::before {
    content: '●';
    margin-right: 0.4em;
    animation: sbPulse 1.6s ease-in-out infinite;
  }

  @keyframes sbPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { animation: none; }
  }
`

const Now = styled.span`
  color: var(--silk-circuit-cyan);
`

const Tip = styled.span`
  color: var(--text-muted);
`

const pad2 = (n: number) => n.toString().padStart(2, '0')
const clockStr = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
const uptimeStr = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`
}

interface FeedItem {
  icon: string
  text: string
}

function buildFeed(b: Broadcast): FeedItem[] {
  const feed: FeedItem[] = []
  if (b.latestShip) {
    feed.push({
      icon: '↑',
      text: `shipped ${b.latestShip.project}${b.latestShip.version ? ` v${b.latestShip.version}` : ''}`,
    })
  }
  if (b.latestPost) feed.push({ icon: '✎', text: `posted ${b.latestPost.title}` })
  feed.push({ icon: '◆', text: `${b.projectCount} repos · ${b.postCount} posts · ${b.labCount} experiments` })
  feed.push({ icon: '⌁', text: 'open source all the way down' })
  return feed
}

const seedSpark = () => Array.from({ length: SPARK_LEN }, (_, i) => 0.35 + 0.25 * Math.sin(i / 2))
const stepSpark = (prev: number) => Math.max(0.06, Math.min(1, prev + (Math.random() - 0.5) * 0.55))
const sparkChars = (vals: number[]) =>
  vals.map((v) => BARS[Math.min(BARS.length - 1, Math.floor(v * BARS.length))]).join('')

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

export default function StatusBoard({ broadcast }: { broadcast: Broadcast }) {
  const reduced = usePrefersReducedMotion()
  const mountRef = useRef(0)
  if (mountRef.current === 0) mountRef.current = Date.now()

  const feed = buildFeed(broadcast)
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
  useEffect(() => {
    if (reduced) return
    const feedId = setInterval(() => setFeedIdx((i) => (i + 1) % feed.length), 3600)
    const tipId = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 4800)
    const sparkId = setInterval(() => setSpark((prev) => [...prev.slice(1), stepSpark(prev[prev.length - 1])]), 460)
    return () => {
      clearInterval(feedId)
      clearInterval(tipId)
      clearInterval(sparkId)
    }
  }, [reduced, feed.length])

  const item = feed[feedIdx % feed.length] ?? feed[0]

  return (
    <Wrap aria-label="hyperbliss status console">
      <Top>
        <Sigil aria-hidden="true">
          {SIGIL.map((row) => (
            <div key={row.id} style={{ color: row.color }}>
              {row.art}
            </div>
          ))}
        </Sigil>

        <Body>
          <Line>
            <Host>stefanie jane · creative technologist</Host>
            <Spacer />
            <Clock>{clockStr(now)}</Clock>
          </Line>
          <Line>
            <Label>uptime</Label>
            <Mono>{uptimeStr(now.getTime() - mountRef.current)}</Mono>
          </Line>

          <Rule />

          <Line>
            <Label>{item.icon} feed</Label>
            <FeedText>{item.text}</FeedText>
          </Line>
          <Line>
            <Label>net</Label>
            <Spark>{sparkChars(spark)}</Spark>
            <Live>live</Live>
          </Line>
          <Line>
            <Label>now</Label>
            <Now>{broadcast.focus || 'building, open source all the way down'}</Now>
          </Line>

          <Rule />

          <Line>
            <Tip>{TIPS[tipIdx % TIPS.length]}</Tip>
          </Line>
        </Body>
      </Top>
    </Wrap>
  )
}
