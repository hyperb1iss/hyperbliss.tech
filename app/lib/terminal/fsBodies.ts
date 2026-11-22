// Builds virtual-FS bodies served lazily to the shell (§5.5). Keyed by the same
// virtual paths as the manifest, so the tree the shell mounts matches native
// commands and completion. Bodies are raw markdown files (frontmatter included)
// so `cat` is authentic; `about` is synthesized because it has no source file.

import { type AboutSection, type CompanySection, getPage, readRawContentFile } from '../content'
import {
  getMarkdownSlugs,
  getRawMarkdownSource,
  MARKDOWN_COLLECTIONS,
  type MarkdownDirectory,
  markdownVirtualPath,
  slugFromVirtualPath,
} from '../contentCollections'
import { VFS_ABOUT, VFS_RESUME } from './paths'

/** about.md as the About page reads: the company, how it works, then its founder. */
export function synthesizeAbout(about: AboutSection | null, company: CompanySection | null = null): string {
  const parts: string[] = ['# Hyperbliss Technologies']
  parts.push(company?.lede ?? 'An independent software company in Seattle.')
  if (company?.principles?.length) {
    parts.push('## How we work')
    parts.push(company.principles.map((p) => `- **${p.title}.** ${p.description}`).join('\n'))
  }
  if (about) {
    const name = about.intro?.name ?? 'Stefanie Jane'
    parts.push(`## Founder: ${name}`)
    const { highlightText, introText } = about.intro ?? {}
    if (highlightText || introText) {
      parts.push(["I've been building technology for", highlightText, introText].filter(Boolean).join(' '))
    }
    if (about.bio) parts.push(about.bio)
  }
  const contact = [company?.contactEmail, company?.location].filter(Boolean).join(' · ')
  if (contact) parts.push(contact)
  return parts
    .filter((s) => s.trim().length > 0)
    .join('\n\n')
    .concat('\n')
}

export async function getVirtualFsPaths(): Promise<string[]> {
  const directories = Object.keys(MARKDOWN_COLLECTIONS) as MarkdownDirectory[]
  const slugsByDirectory = await Promise.all(
    directories.map(async (directory) => [directory, await getMarkdownSlugs(directory)] as const),
  )
  return [
    VFS_RESUME,
    VFS_ABOUT,
    ...slugsByDirectory.flatMap(([directory, slugs]) => slugs.map((slug) => markdownVirtualPath(directory, slug))),
  ]
}

export async function getVirtualFsBody(path: string): Promise<string> {
  if (path === VFS_RESUME) return readRawContentFile('resume/resume.md')
  if (path === VFS_ABOUT) {
    return getPage('about')
      .then((p) => synthesizeAbout(p.about, p.company))
      .catch(() => synthesizeAbout(null))
  }
  const source = slugFromVirtualPath(path)
  if (source) {
    return getRawMarkdownSource(source.directory, source.slug)
  }
  throw new Error(`unknown virtual FS path: ${path}`)
}

/** virtualPath → raw body, for selected files or the full manifest tree. */
export async function getVirtualFsBodies(paths?: readonly string[]): Promise<Record<string, string>> {
  if (paths) {
    const entries = await Promise.all(paths.map(async (path) => [path, await getVirtualFsBody(path)] as const))
    return Object.fromEntries(entries)
  }

  const out: Record<string, string> = {}
  const allPaths = await getVirtualFsPaths()

  await Promise.all([
    ...allPaths
      .filter((path) => path !== VFS_RESUME && path !== VFS_ABOUT)
      .map(async (path) => {
        out[path] = await getVirtualFsBody(path)
      }),
    getVirtualFsBody(VFS_RESUME)
      .then((b) => {
        out[VFS_RESUME] = b
      })
      .catch(() => {}),
    getVirtualFsBody(VFS_ABOUT)
      .then((b) => {
        out[VFS_ABOUT] = b
      })
      .catch(() => {
        out[VFS_ABOUT] = synthesizeAbout(null)
      }),
  ])

  return out
}
