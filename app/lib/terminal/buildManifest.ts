// Server-side builder: turns the content corpus into the virtual-FS manifest.
// Pure and synchronous so it's trivially testable. The caller fetches content
// (content.ts) and supplies real byte sizes; this maps slugs to virtual paths
// and assembles entries. Bodies are never included (§5.5).

import type { AboutSection, LabSummary, NowData, PostSummary, ProjectSummary, ResumeData } from '../content'
import { byteLengthUtf8, type Manifest, type ManifestEntry } from './types'

/** Virtual-path → real byte size of the body the lazy-FS will serve. */
export type ManifestSizes = Record<string, number>

export interface BuildManifestInput {
  posts: PostSummary[]
  projects: ProjectSummary[]
  lab: LabSummary[]
  now: NowData
  about: AboutSection | null
  resume: ResumeData
  /** Real byte sizes keyed by virtual path; entries fall back to an estimate. */
  sizes?: ManifestSizes
  /** Project slug → latest released version, for `ls`/`projects` annotations. */
  releases?: Record<string, string>
  /** ISO timestamp from the caller (scripts can't call Date.now). */
  generatedAt: string
}

const trimTags = (tags: (string | null)[] | null): string[] =>
  (tags ?? []).filter((t): t is string => typeof t === 'string' && t.length > 0)

const sizeFor = (path: string, fallbackText: string, sizes?: ManifestSizes): number =>
  sizes?.[path] ?? Math.max(1, byteLengthUtf8(fallbackText))

/**
 * Build the authoritative virtual filesystem manifest. Path scheme:
 *   /about.md /now.md /resume.md
 *   /projects/<slug>.md  /blog/<slug>.md  /lab/<slug>.md
 * hrefs carry a trailing slash to match the site's `trailingSlash: true`.
 */
export function buildManifest(input: BuildManifestInput): Manifest {
  const { posts, projects, lab, now, about, resume, sizes, releases, generatedAt } = input
  const entries: ManifestEntry[] = []

  // about.md — synthesized from the about page bio
  const aboutSummary = about?.intro?.introText ?? about?.bio?.slice(0, 160) ?? 'About Stefanie Jane.'
  entries.push({
    bytes: sizeFor('/about.md', `${aboutSummary}\n${about?.bio ?? ''}`, sizes),
    date: null,
    emoji: null,
    github: null,
    href: '/about/',
    kind: 'about',
    latestVersion: null,
    path: '/about.md',
    status: null,
    summary: aboutSummary,
    tags: ['about', 'bio'],
    title: about?.intro?.name ?? 'About Stefanie Jane',
  })

  // now.md
  entries.push({
    bytes: sizeFor('/now.md', `${now.focus ?? ''}\n${now.body ?? ''}`, sizes),
    date: now.updated,
    emoji: now.emoji,
    github: null,
    href: null,
    kind: 'now',
    latestVersion: null,
    path: '/now.md',
    status: null,
    summary: now.focus ?? 'What I am working on right now.',
    tags: ['now', 'current'],
    title: now.title,
  })

  // resume.md
  entries.push({
    bytes: sizeFor('/resume.md', resume.body ?? resume.description ?? '', sizes),
    date: null,
    emoji: null,
    github: null,
    href: '/resume/',
    kind: 'resume',
    latestVersion: null,
    path: '/resume.md',
    status: null,
    summary: resume.description ?? 'Professional summary.',
    tags: ['resume', 'cv'],
    title: resume.title,
  })

  for (const p of projects) {
    const path = `/projects/${p.slug}.md`
    entries.push({
      bytes: sizeFor(path, `${p.description ?? ''}\n${p.title}`, sizes),
      date: p.date,
      emoji: p.emoji,
      github: p.github,
      href: `/projects/${p.slug}/`,
      kind: 'project',
      latestVersion: releases?.[p.slug] ?? p.latestVersion ?? null,
      path,
      status: p.status,
      summary: p.description ?? '',
      tags: trimTags(p.tags),
      title: p.title,
    })
  }

  for (const post of posts) {
    const path = `/blog/${post.slug}.md`
    entries.push({
      bytes: sizeFor(path, `${post.excerpt ?? ''}\n${post.title}`, sizes),
      date: post.date,
      emoji: post.emoji,
      github: null,
      href: `/blog/${post.slug}/`,
      kind: 'post',
      latestVersion: null,
      path,
      status: null,
      summary: post.excerpt ?? '',
      tags: trimTags(post.tags),
      title: post.title,
    })
  }

  for (const exp of lab) {
    const path = `/lab/${exp.slug}.md`
    entries.push({
      bytes: sizeFor(path, `${exp.excerpt ?? ''}\n${exp.title}`, sizes),
      date: exp.date,
      emoji: exp.emoji,
      github: null,
      href: `/lab/${exp.slug}/`,
      kind: 'lab',
      latestVersion: null,
      path,
      status: exp.status,
      summary: exp.excerpt ?? '',
      tags: trimTags(exp.tags),
      title: exp.title,
    })
  }

  return { entries, generatedAt }
}

/** Index a manifest by virtual path for O(1) lookups. */
export function manifestByPath(manifest: Manifest): Map<string, ManifestEntry> {
  return new Map(manifest.entries.map((e) => [e.path, e]))
}
