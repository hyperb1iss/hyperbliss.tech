import { describe, expect, it } from 'vitest'
import type { AboutSection, LabSummary, NowData, PostSummary, ProjectSummary, ResumeData } from '@/lib/content'
import { buildBroadcast } from '@/lib/terminal/buildBroadcast'
import { buildManifest, manifestByPath } from '@/lib/terminal/buildManifest'
import { byteLengthUtf8 } from '@/lib/terminal/types'

const project = (over: Partial<ProjectSummary> = {}): ProjectSummary => ({
  category: null,
  coverImage: null,
  date: '2025-01-01',
  description: 'A neat project.',
  displayTitle: 'Proj',
  emoji: '🛠️',
  github: 'https://github.com/hyperb1iss/proj',
  image: null,
  slug: 'proj',
  status: 'active',
  tags: ['Rust', null, 'CLI'],
  title: 'Proj',
  ...over,
})

const post = (over: Partial<PostSummary> = {}): PostSummary => ({
  author: 'Stefanie Jane',
  coverImage: null,
  date: '2026-05-27',
  displayTitle: 'Post',
  emoji: '📝',
  excerpt: 'An excerpt.',
  slug: 'post',
  tags: ['ai'],
  title: 'Post',
  ...over,
})

const lab = (over: Partial<LabSummary> = {}): LabSummary => ({
  author: null,
  date: '2026-04-08',
  displayTitle: 'Lab',
  emoji: '🔮',
  excerpt: 'A lab experiment.',
  slug: 'lab',
  status: 'live',
  tags: ['interactive'],
  title: 'Lab',
  ...over,
})

const now: NowData = {
  body: 'Doing stuff.',
  emoji: '🌊',
  focus: 'Building a terminal hero',
  location: 'Seattle, WA',
  title: 'Now',
  updated: '2026-05-31',
}

const about: AboutSection = {
  bio: 'Long bio prose here.',
  contactIntro: null,
  contactReasons: null,
  intro: { greeting: 'hi', highlightText: null, introText: 'Creative technologist.', name: 'Stefanie Jane' },
  profileImage: null,
  profileImageAlt: null,
}

const resume: ResumeData = { body: 'Resume body.', description: 'Principal engineer.', title: 'Resume' }

describe('buildManifest', () => {
  const manifest = buildManifest({
    about,
    generatedAt: '2026-05-31T00:00:00.000Z',
    lab: [lab()],
    now,
    posts: [post()],
    projects: [project()],
    resume,
  })

  it('includes the singleton content files plus one entry per content item', () => {
    const paths = manifest.entries.map((e) => e.path)
    expect(paths).toContain('/about.md')
    expect(paths).toContain('/now.md')
    expect(paths).toContain('/resume.md')
    expect(paths).toContain('/projects/proj.md')
    expect(paths).toContain('/blog/post.md')
    expect(paths).toContain('/lab/lab.md')
    expect(manifest.entries).toHaveLength(6)
  })

  it('never ships bodies', () => {
    for (const entry of manifest.entries) {
      expect(entry).not.toHaveProperty('body')
      expect(JSON.stringify(entry)).not.toContain('Long bio prose here.')
      expect(JSON.stringify(entry)).not.toContain('Resume body.')
    }
  })

  it('maps slugs to deep-route hrefs with a trailing slash', () => {
    const byPath = manifestByPath(manifest)
    expect(byPath.get('/projects/proj.md')?.href).toBe('/projects/proj/')
    expect(byPath.get('/blog/post.md')?.href).toBe('/blog/post/')
    expect(byPath.get('/lab/lab.md')?.href).toBe('/lab/lab/')
    expect(byPath.get('/now.md')?.href).toBeNull()
  })

  it('strips null tags', () => {
    const proj = manifestByPath(manifest).get('/projects/proj.md')
    expect(proj?.tags).toEqual(['Rust', 'CLI'])
  })

  it('prefers real sizes but falls back to a non-trivial estimate', () => {
    const withSizes = buildManifest({
      about,
      generatedAt: 'x',
      lab: [],
      now,
      posts: [],
      projects: [project()],
      resume,
      sizes: { '/projects/proj.md': 4242 },
    })
    expect(manifestByPath(withSizes).get('/projects/proj.md')?.bytes).toBe(4242)
    // fallback estimate is derived from the summary, so it varies and is > 1
    expect(manifestByPath(manifest).get('/projects/proj.md')?.bytes).toBeGreaterThan(1)
  })

  it('carries release versions onto project entries', () => {
    const withReleases = buildManifest({
      about,
      generatedAt: 'x',
      lab: [],
      now,
      posts: [],
      projects: [project()],
      releases: { proj: '1.2.3' },
      resume,
    })
    expect(manifestByPath(withReleases).get('/projects/proj.md')?.latestVersion).toBe('1.2.3')
  })
})

describe('buildBroadcast', () => {
  it('summarizes counts and picks the newest post/project', () => {
    const broadcast = buildBroadcast({
      generatedAt: '2026-05-31T00:00:00.000Z',
      lab: [lab()],
      now,
      posts: [post({ date: '2026-01-01', slug: 'old' }), post({ date: '2026-05-27', slug: 'new' })],
      projects: [project({ date: '2025-01-01', slug: 'p1' }), project({ date: '2025-09-01', slug: 'p2' })],
    })
    expect(broadcast.postCount).toBe(2)
    expect(broadcast.projectCount).toBe(2)
    expect(broadcast.labCount).toBe(1)
    expect(broadcast.focus).toBe('Building a terminal hero')
    expect(broadcast.latestPost?.href).toBe('/blog/new/')
    expect(broadcast.latestProject?.href).toBe('/projects/p2/')
    expect(broadcast.latestShip).toBeNull()
  })

  it('survives an empty corpus and missing focus', () => {
    const broadcast = buildBroadcast({
      generatedAt: 'x',
      lab: [],
      now: { body: null, emoji: null, focus: null, location: null, title: 'Now', updated: null },
      posts: [],
      projects: [],
    })
    expect(broadcast.latestPost).toBeNull()
    expect(broadcast.latestProject).toBeNull()
    expect(broadcast.focus.length).toBeGreaterThan(0)
  })
})

describe('byteLengthUtf8', () => {
  it('counts ascii, multibyte, and astral characters', () => {
    expect(byteLengthUtf8('abc')).toBe(3)
    expect(byteLengthUtf8('é')).toBe(2)
    expect(byteLengthUtf8('🌊')).toBe(4)
  })
})
