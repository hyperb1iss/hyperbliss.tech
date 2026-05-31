// Rich content commands: projects, blog, lab, now. Self-registers on import.
// Reads everything from ctx (manifest + broadcast) so it's testable and stays
// fresh as content changes.

import type { ContentKind, Manifest, ManifestEntry } from '@/lib/terminal/types'
import { registry } from '../registry'
import { OutputText, text } from '../render'
import type { TerminalContext } from '../types'
import { Accent, Block, Heading, ListRow, Muted, Ok, Pink, Tag, TagRow, TermLink } from './ui'

const byKind = (manifest: Manifest, kind: ContentKind): ManifestEntry[] =>
  manifest.entries.filter((e) => e.kind === kind)

const tags = (entry: ManifestEntry, max = 4) =>
  entry.tags.length > 0 ? (
    <TagRow>
      {entry.tags.slice(0, max).map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </TagRow>
  ) : null

function ProjectsView({ ctx }: { ctx: TerminalContext }) {
  const projects = byKind(ctx.manifest, 'project')
  return (
    <Block>
      <Heading>projects · {projects.length} repos</Heading>
      {projects.map((p) => (
        <ListRow key={p.path}>
          {p.emoji && <span>{p.emoji}</span>}
          <TermLink href={p.href ?? '/projects/'} navigate={ctx.navigate}>
            {p.title}
          </TermLink>
          {p.latestVersion && <Ok>v{p.latestVersion}</Ok>}
          {tags(p, 3)}
        </ListRow>
      ))}
      <div>
        <Muted>→ </Muted>
        <TermLink href="/projects/" navigate={ctx.navigate}>
          browse all projects
        </TermLink>
        <Muted> · tip: </Muted>
        <Accent>ls projects | grep rust</Accent>
      </div>
    </Block>
  )
}

function BlogView({ ctx }: { ctx: TerminalContext }) {
  const posts = byKind(ctx.manifest, 'post')
  return (
    <Block>
      <Heading>blog · {posts.length} posts</Heading>
      {posts.map((post) => (
        <div key={post.path}>
          <ListRow>
            {post.date && <Muted>{post.date}</Muted>}
            <TermLink href={post.href ?? '/blog/'} navigate={ctx.navigate}>
              {post.title}
            </TermLink>
          </ListRow>
          {post.summary && (
            <div>
              <Muted>
                {'  '}
                {post.summary.length > 110 ? `${post.summary.slice(0, 110)}…` : post.summary}
              </Muted>
            </div>
          )}
        </div>
      ))}
      <div>
        <Muted>→ </Muted>
        <TermLink href="/blog/" navigate={ctx.navigate}>
          all posts
        </TermLink>
      </div>
    </Block>
  )
}

function LabView({ ctx }: { ctx: TerminalContext }) {
  const experiments = byKind(ctx.manifest, 'lab')
  if (experiments.length === 0) return text('lab: nothing here yet — check back soon')
  return (
    <Block>
      <Heading>lab · {experiments.length} experiments</Heading>
      {experiments.map((exp) => (
        <div key={exp.path}>
          <ListRow>
            {exp.emoji && <span>{exp.emoji}</span>}
            <TermLink href={exp.href ?? '/lab/'} navigate={ctx.navigate}>
              {exp.title}
            </TermLink>
            {exp.status && <Pink>[{exp.status}]</Pink>}
          </ListRow>
          {exp.summary && (
            <div>
              <Muted>
                {'  '}
                {exp.summary}
              </Muted>
            </div>
          )}
        </div>
      ))}
      <div>
        <Muted>→ </Muted>
        <TermLink href="/lab/" navigate={ctx.navigate}>
          all experiments
        </TermLink>
      </div>
    </Block>
  )
}

/** Light prose rendering: headings and bullets, everything as safe text. */
function Prose({ body }: { body: string }) {
  const lines = body.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        const key = `${i}-${line.slice(0, 8)}`
        if (line.startsWith('## ')) {
          return (
            <div key={key}>
              <Accent>{line.slice(3)}</Accent>
            </div>
          )
        }
        if (line.startsWith('- ')) {
          return (
            <div key={key}>
              <Muted> • </Muted>
              <OutputText>{line.slice(2)}</OutputText>
            </div>
          )
        }
        return (
          <div key={key}>
            <OutputText>{line}</OutputText>
          </div>
        )
      })}
    </>
  )
}

function NowView({ ctx }: { ctx: TerminalContext }) {
  const { broadcast } = ctx
  return (
    <Block>
      <Heading>now</Heading>
      <div>
        <Accent>{broadcast.focus}</Accent>
      </div>
      {broadcast.nowBody && <Prose body={broadcast.nowBody} />}
      {broadcast.nowUpdated && (
        <div>
          <Muted>updated {broadcast.nowUpdated}</Muted>
        </div>
      )}
    </Block>
  )
}

registry.register({
  aliases: ['repos'],
  group: 'content',
  name: 'projects',
  run: (_args, ctx) => <ProjectsView ctx={ctx} />,
  summary: 'open-source projects I maintain',
})

registry.register({
  aliases: ['posts', 'writing'],
  group: 'content',
  name: 'blog',
  run: (_args, ctx) => <BlogView ctx={ctx} />,
  summary: 'things I have written',
})

registry.register({
  group: 'content',
  name: 'lab',
  run: (_args, ctx) => <LabView ctx={ctx} />,
  summary: 'interactive experiments',
})

registry.register({
  group: 'content',
  name: 'now',
  run: (_args, ctx) => <NowView ctx={ctx} />,
  summary: 'what I am working on right now',
})
