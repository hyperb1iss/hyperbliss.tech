// Easter eggs: ssh, sudo, matrix, glow, hello. Self-registers on import.

import { TAGLINE } from '@/lib/company'
import { styled } from '../../../../styled-system/jsx'
import LedSign from '../LedSign'
import MatrixRain from '../MatrixRain'
import { registry } from '../registry'
import { text } from '../render'
import { buildShareUrl } from '../share'
import { Accent, Block, Muted, Ok } from './ui'

const Banner = styled.pre`
  margin: 0;
  font-family: var(--font-mono);
  color: var(--term-accent);
  line-height: 1.2;
`

// An ssh-style login banner. Pure ASCII only: the console's mono face
// won't tile box-drawing or star glyphs to one cell, so the old
// ┌─┐ box drifted apart. The rule width is derived from the title so it never
// needs hand-counting when the text changes.
function welcomeBanner(): string {
  const title = 'welcome to hyperbliss.tech'
  const body = 'you are already here'
  const width = Math.max(40, title.length + 8)
  const head = `-- ${title} `
  const top = head + '-'.repeat(width - head.length)
  const bot = '-'.repeat(width)
  return `${top}\n   ${body}\n${bot}`
}

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
        <Banner>{welcomeBanner()}</Banner>
        <div>
          <Ok>Last login: just now from a browser near you</Ok>
        </div>
        <div>
          <Muted>type </Muted>
          <Accent>help</Accent>
          <Muted> to look around.</Muted>
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
    return text('sudo: a password is required, and you are a guest here', 'stderr')
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

// The tagline on the wall. Reads the same source as the hero, so it follows
// whatever the tagline becomes.
registry.register({
  group: 'fun',
  hidden: true,
  name: 'glow',
  run: () => <LedSign text={TAGLINE} />,
  summary: 'light the tagline',
})

registry.register({
  aliases: ['hi', 'hey'],
  group: 'fun',
  hidden: true,
  name: 'hello',
  run: () => <LedSign text="HELLO <3" />,
  summary: 'say hi back',
})
