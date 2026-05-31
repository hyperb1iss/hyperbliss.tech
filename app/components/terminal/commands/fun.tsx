// Easter eggs: ssh, sudo. Self-registers on import. `contact` teases `ssh`, so
// these ship with P1; the rest of T4.3 (a game) lands in P4.

import { styled } from '../../../../styled-system/jsx'
import MatrixRain from '../MatrixRain'
import { registry } from '../registry'
import { text } from '../render'
import { buildShareUrl } from '../share'
import { Accent, Block, Muted, Ok } from './ui'

const Banner = styled.pre`
  margin: 0;
  font-family: var(--font-mono);
  color: var(--silk-circuit-cyan);
  line-height: 1.2;
  text-shadow: 0 0 10px rgba(0, 255, 240, 0.4);
`

registry.register({
  group: 'fun',
  name: 'ssh',
  run: (args) => {
    const host = args[0] ?? ''
    if (host && !/hyperbliss\.tech$/.test(host)) {
      return text(`ssh: connect to host ${host}: Connection refused (this is a website 💜)`, 'stderr')
    }
    return (
      <Block>
        <Banner>
          {
            '  ┌─[ welcome to hyperbliss.tech ]─┐\n  │  you are already inside ✦       │\n  └─────────────────────────────────┘'
          }
        </Banner>
        <div>
          <Ok>Last login: just now from a browser near you</Ok>
        </div>
        <div>
          <Muted>type </Muted>
          <Accent>help</Accent>
          <Muted> to look around, or </Muted>
          <Accent>neofetch</Accent>
          <Muted> for the tour.</Muted>
        </div>
      </Block>
    )
  },
  summary: 'connect to hyperbliss.tech',
  usage: 'ssh hyperbliss.tech',
})

registry.register({
  group: 'fun',
  hidden: true,
  name: 'sudo',
  run: (args) => {
    const rest = args.join(' ')
    if (/make me a sandwich/i.test(rest)) return text('okay. 🥪', 'ok')
    return text(`sudo: a password is required — and you're a guest here 😏 (nice try)`, 'stderr')
  },
  summary: 'superuser do (you wish)',
})

registry.register({
  group: 'fun',
  name: 'matrix',
  run: () => <MatrixRain />,
  summary: 'follow the white rabbit',
})

registry.register({
  group: 'meta',
  name: 'share',
  run: (_args, ctx) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hyperbliss.tech'
    const url = buildShareUrl(origin, ctx.history)
    let copied = false
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => {},
        () => {},
      )
      copied = true
    }
    return (
      <Block>
        <div>
          <Muted>{copied ? 'shareable link (copied to clipboard):' : 'shareable link:'}</Muted>
        </div>
        <div>
          <Accent>{url}</Accent>
        </div>
        <div>
          <Muted>opening it replays this session.</Muted>
        </div>
      </Block>
    )
  },
  summary: 'copy a link that replays this session',
})
