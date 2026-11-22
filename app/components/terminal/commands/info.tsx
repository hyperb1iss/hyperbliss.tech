// Text content commands: about, contact (alias social), resume.
// Self-registers on import. Reads content from ctx (manifest); the company's
// accounts are static app data.

import { CONTACT_EMAIL } from '@/lib/company'
import { COMPANY_LINKS } from '@/lib/socials'
import type { ContentKind, Manifest } from '@/lib/terminal/types'
import { registry } from '../registry'
import { text } from '../render'
import { Accent, Block, Heading, Muted, TermLink } from './ui'

const find = (manifest: Manifest, kind: ContentKind) => manifest.entries.find((e) => e.kind === kind)

registry.register({
  group: 'content',
  name: 'about',
  run: (_args, ctx) => {
    const about = find(ctx.manifest, 'about')
    return (
      <Block>
        <Heading>Hyperbliss Technologies</Heading>
        <div>An independent software company in Seattle, founded by Stefanie Jane.</div>
        <div>
          <Muted>We make open source tools for light, memory, and the terminal.</Muted>
        </div>
        <div>
          <Muted>→ </Muted>
          <TermLink href={about?.href ?? '/about/'} navigate={ctx.navigate}>
            the company and its founder
          </TermLink>
          <Muted> · try </Muted>
          <Accent>contact</Accent>
          <Muted> or </Muted>
          <Accent>projects</Accent>
        </div>
      </Block>
    )
  },
  summary: 'who we are',
})

registry.register({
  aliases: ['social'],
  group: 'content',
  name: 'contact',
  run: (_args, ctx) => (
    <Block>
      <Heading>reach us</Heading>
      {COMPANY_LINKS.map((s) => (
        <div key={s.label}>
          <Muted>{s.label.padEnd(10, ' ')}</Muted>
          <TermLink href={s.href} navigate={ctx.navigate}>
            {s.href.replace(/^https?:\/\//, '')}
          </TermLink>
        </div>
      ))}
      <div>
        <Muted>{'Email'.padEnd(10, ' ')}</Muted>
        <TermLink href={`mailto:${CONTACT_EMAIL}`} navigate={ctx.navigate}>
          {CONTACT_EMAIL}
        </TermLink>
      </div>
    </Block>
  ),
  summary: 'ways to reach us',
})

registry.register({
  aliases: ['cv'],
  group: 'content',
  name: 'resume',
  run: (_args, ctx) => {
    const resume = find(ctx.manifest, 'resume')
    if (!resume) return text('resume: not available', 'stderr')
    return (
      <Block>
        <Heading>{resume.title}</Heading>
        <div>{resume.summary}</div>
        <div>
          <Muted>→ </Muted>
          <TermLink href={resume.href ?? '/resume/'} navigate={ctx.navigate}>
            full resume
          </TermLink>
        </div>
      </Block>
    )
  },
  summary: "the founder's resume",
})
