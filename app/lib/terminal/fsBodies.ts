// Builds virtual-FS bodies served lazily to the shell (§5.5). Keyed by the same
// virtual paths as the manifest, so the tree the shell mounts matches native
// commands and completion. Bodies are raw markdown files (frontmatter included)
// so `cat` is authentic; `about` is synthesized because it has no source file.

import {
  type AboutSection,
  getAllLabSlugs,
  getAllPostSlugs,
  getAllProjectSlugs,
  getPage,
  readRawContentFile,
} from '../content'
import { VFS_ABOUT, VFS_NOW, VFS_RESUME, virtualPath } from './paths'

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

function assertSafeSlug(slug: string): void {
  if (!/^[\w.-]+$/.test(slug)) {
    throw new Error(`invalid virtual FS path: ${slug}`)
  }
}

function slugFromVirtualPath(path: string, prefix: string): string {
  const suffix = path.slice(prefix.length)
  if (!suffix.endsWith('.md')) {
    throw new Error(`invalid virtual FS path: ${path}`)
  }
  const slug = suffix.slice(0, -3)
  assertSafeSlug(slug)
  return slug
}

export async function getVirtualFsBody(path: string): Promise<string> {
  if (path === VFS_NOW) return readRawContentFile('now.md')
  if (path === VFS_RESUME) return readRawContentFile('resume/resume.md')
  if (path === VFS_ABOUT) {
    return getPage('about')
      .then((p) => synthesizeAbout(p.about))
      .catch(() => synthesizeAbout(null))
  }
  if (path.startsWith('/blog/')) {
    return readRawContentFile(`posts/${slugFromVirtualPath(path, '/blog/')}.md`)
  }
  if (path.startsWith('/projects/')) {
    return readRawContentFile(`projects/${slugFromVirtualPath(path, '/projects/')}.md`)
  }
  if (path.startsWith('/lab/')) {
    return readRawContentFile(`lab/${slugFromVirtualPath(path, '/lab/')}.md`)
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
  const [postSlugs, projectSlugs, labSlugs] = await Promise.all([
    getAllPostSlugs(),
    getAllProjectSlugs(),
    getAllLabSlugs(),
  ])

  await Promise.all([
    ...postSlugs.map(async (s) => {
      out[virtualPath('post', s)] = await readRawContentFile(`posts/${s}.md`)
    }),
    ...projectSlugs.map(async (s) => {
      out[virtualPath('project', s)] = await readRawContentFile(`projects/${s}.md`)
    }),
    ...labSlugs.map(async (s) => {
      out[virtualPath('lab', s)] = await readRawContentFile(`lab/${s}.md`)
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
