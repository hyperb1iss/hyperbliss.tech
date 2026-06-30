// Builds virtual-FS bodies served lazily to the shell (§5.5). Keyed by the same
// virtual paths as the manifest, so the tree the shell mounts matches native
// commands and completion. Bodies are raw markdown files (frontmatter included)
// so `cat` is authentic; `about` is synthesized because it has no source file.

import { type AboutSection, getPage, readRawContentFile } from '../content'
import {
  getMarkdownSlugs,
  getRawMarkdownSource,
  MARKDOWN_COLLECTIONS,
  type MarkdownDirectory,
  markdownVirtualPath,
  slugFromVirtualPath,
} from '../contentCollections'
import { VFS_ABOUT, VFS_NOW, VFS_RESUME } from './paths'

function synthesizeAbout(about: AboutSection | null): string {
  if (!about) return '# About\n\nStefanie Jane — principal engineer, open-source maker.\n'
  const name = about.intro?.name ?? 'Stefanie Jane'
  const greeting = about.intro?.greeting ?? ''
  const highlight = about.intro?.highlightText ?? ''
  const intro = about.intro?.introText ?? ''
  const bio = about.bio ?? ''
  return [`# ${name}`, [greeting, highlight].filter(Boolean).join(' '), intro, bio]
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
    VFS_NOW,
    VFS_RESUME,
    VFS_ABOUT,
    ...slugsByDirectory.flatMap(([directory, slugs]) => slugs.map((slug) => markdownVirtualPath(directory, slug))),
  ]
}

export async function getVirtualFsBody(path: string): Promise<string> {
  if (path === VFS_NOW) return readRawContentFile('now.md')
  if (path === VFS_RESUME) return readRawContentFile('resume/resume.md')
  if (path === VFS_ABOUT) {
    return getPage('about')
      .then((p) => synthesizeAbout(p.about))
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
      .filter((path) => path !== VFS_NOW && path !== VFS_RESUME && path !== VFS_ABOUT)
      .map(async (path) => {
        out[path] = await getVirtualFsBody(path)
      }),
    getVirtualFsBody(VFS_NOW)
      .then((b) => {
        out[VFS_NOW] = b
      })
      .catch(() => {}),
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
