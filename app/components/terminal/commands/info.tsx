// Text content commands: about, contact (alias social), resume.
// Self-registers on import. Reads content from ctx (manifest); social links are
// static app data.

import { SOCIAL_LINKS } from '@/lib/socials'
import type { ContentKind, Manifest } from '@/lib/terminal/types'
import { registry } from '../registry'
import { text } from '../render'
import { Accent, Block, Heading, Muted, TermLink } from './ui'

const CONTACT_EMAIL = 'stef@hyperbliss.tech'

const find = (manifest: Manifest, kind: ContentKind) => manifest.entries.find((e) => e.kind === kind)

registry.register({
  aliases: ['whoami'],
  group: 'content',
  name: 'about',
  run: (_args, ctx) => {
    const about = find(ctx.manifest, 'about')
    return (
      <Block>
        <Heading>{about?.title ?? 'Stefanie Jane'}</Heading>
        <div>{about?.summary ?? 'Principal engineer, open-source maker.'}</div>
        <div>
          <Muted>creator of CyanogenMod / LineageOS · building developer tools, terminal UIs, and AI agents.</Muted>
        </div>
        <div>
          <Muted>→ </Muted>
          <TermLink href={about?.href ?? '/about/'} navigate={ctx.navigate}>
            read the full story
          </TermLink>
          <Muted> · try </Muted>
          <Accent>contact</Accent>
          <Muted> or </Muted>
          <Accent>projects</Accent>
        </div>
      </Block>
    )
  },
  summary: 'who I am',
})

registry.register({
  aliases: ['social'],
  group: 'content',
  name: 'contact',
  run: (_args, ctx) => (
    <Block>
      <Heading>reach me</Heading>
      {SOCIAL_LINKS.map((s) => (
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
      <div>
        <Muted>psst — try </Muted>
        <Accent>ssh hyperbliss.tech</Accent>
      </div>
    </Block>
  ),
  summary: 'ways to reach me',
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
  summary: 'professional summary',
})
