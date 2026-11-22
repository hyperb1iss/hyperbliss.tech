// Content by name. Anything the site publishes (a project, an essay, a lab
// experiment) answers to its slug or its short title: typed bare it prints
// this card, and `open <name>` goes to its page.

import type { Manifest, ManifestEntry } from '@/lib/terminal/types'
import type { TerminalContext } from '../types'
import { Accent, Block, Heading, Muted, Ok, Tag, TagRow, TermLink } from './ui'

const slugOf = (entry: ManifestEntry) => entry.path.replace(/^.*\//, '').replace(/\.md$/, '')
/** "Hypercolor: A Canvas for Your Lights" → ["Hypercolor", "A Canvas for Your Lights"]. */
export const splitTitle = (title: string): [string, string | null] => {
  const at = title.indexOf(':')
  return at === -1 ? [title, null] : [title.slice(0, at).trim(), title.slice(at + 1).trim()]
}

/** Every name a visitor might type for a piece of content, lowercased. */
export function entryNames(manifest: Manifest): string[] {
  return manifest.entries.flatMap((entry) => [slugOf(entry), splitTitle(entry.title)[0].toLowerCase()])
}

/** The entry a bare name refers to: an exact slug first, then a short title. */
export function findEntry(manifest: Manifest, name: string): ManifestEntry | null {
  const wanted = name.toLowerCase()
  return (
    manifest.entries.find((entry) => slugOf(entry) === wanted) ??
    manifest.entries.find((entry) => splitTitle(entry.title)[0].toLowerCase() === wanted) ??
    null
  )
}

export function EntryCard({ entry, ctx }: { entry: ManifestEntry; ctx: TerminalContext }) {
  const [name, tagline] = splitTitle(entry.title)
  return (
    <Block>
      <Heading>
        {name}
        {entry.latestVersion && (
          <>
            {' '}
            <Ok>v{entry.latestVersion}</Ok>
          </>
        )}
      </Heading>
      {tagline && <div>{tagline}</div>}
      {entry.summary && (
        <div>
          <Muted>{entry.summary}</Muted>
        </div>
      )}
      {entry.tags.length > 0 && (
        <TagRow>
          {entry.tags.slice(0, 6).map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagRow>
      )}
      <div>
        <Muted>→ </Muted>
        {entry.href && (
          <TermLink href={entry.href} navigate={ctx.navigate}>
            open the page
          </TermLink>
        )}
        {entry.github && (
          <>
            <Muted> · </Muted>
            <TermLink href={entry.github} navigate={ctx.navigate}>
              source
            </TermLink>
          </>
        )}
        <Muted> · </Muted>
        <Accent>cat {entry.path.slice(1)}</Accent>
      </div>
    </Block>
  )
}
