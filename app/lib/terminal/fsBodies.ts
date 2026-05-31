// Builds the full virtual-FS body map served lazily to the shell (§5.5). Keyed
// by the same virtual paths as the manifest, so the tree the shell mounts
// matches the tree native commands and completion already know. Bodies are the
// raw markdown files (frontmatter included) so `cat` is authentic; `about` is
// synthesized from the about page since it has no single source file.

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

/** virtualPath → raw body, for every file in the manifest tree. */
export async function getVirtualFsBodies(): Promise<Record<string, string>> {
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
    readRawContentFile('now.md')
      .then((b) => {
        out[VFS_NOW] = b
      })
      .catch(() => {}),
    readRawContentFile('resume/resume.md')
      .then((b) => {
        out[VFS_RESUME] = b
      })
      .catch(() => {}),
    getPage('about')
      .then((p) => {
        out[VFS_ABOUT] = synthesizeAbout(p.about)
      })
      .catch(() => {
        out[VFS_ABOUT] = synthesizeAbout(null)
      }),
  ])

  return out
}
