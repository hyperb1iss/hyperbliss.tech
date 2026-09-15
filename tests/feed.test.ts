import { describe, expect, it } from 'vitest'
import type { LabSummary, PostSummary, ProjectSummary } from '@/lib/content'
import { buildFeed, type FeedRelease, groupByYear, shippingList, shortName, splitLead, toIsoDay } from '@/lib/feed'
import { summarizeRelease } from '@/lib/github'

const post = (slug: string, date: string | null, title = slug): PostSummary => ({
  author: null,
  coverImage: null,
  date,
  displayTitle: title,
  emoji: null,
  excerpt: `${title} excerpt`,
  slug,
  tags: null,
  title,
})

const lab = (slug: string, date: string, title = slug): LabSummary => ({
  author: null,
  date,
  displayTitle: title,
  emoji: null,
  excerpt: `${title} excerpt`,
  slug,
  status: null,
  tags: null,
  title,
})

const project = (slug: string, date: string | null, title = slug): ProjectSummary => ({
  category: null,
  coverImage: null,
  date,
  description: `${title} does things`,
  displayTitle: title,
  emoji: null,
  github: `https://github.com/hyperb1iss/${slug}`,
  image: null,
  slug,
  status: null,
  tags: null,
  title,
})

const releases = new Map<string, FeedRelease>([
  [
    'opaline',
    {
      publishedAt: '2026-07-14T18:00:00Z',
      summary: 'CSS export and four new themes.',
      url: 'https://github.com/hyperb1iss/opaline/releases/tag/v0.4.2',
      version: '0.4.2',
    },
  ],
  [
    'sibyl',
    {
      publishedAt: '2026-06-30T09:00:00Z',
      summary: null,
      url: 'https://github.com/hyperb1iss/sibyl/releases/tag/v1.3.1',
      version: '1.3.1',
    },
  ],
])

const input = {
  lab: [lab('regex-nightmares', '2026-04-07', 'Regex Nightmares')],
  posts: [
    post('loop-engineering', '2026-07-21', 'Get Loopy'),
    post('how-i-ai', '2026-05-27', 'How I AI'),
    post('undated', null),
  ],
  projects: [
    project('sibyl', '2025-01-26', 'Sibyl: Build With Agents That Remember'),
    project('opaline', '2026-02-01', 'Opaline'),
    project('orphan-release', null),
  ],
  releases,
}

describe('toIsoDay', () => {
  it('normalizes timestamps to a calendar day', () => {
    expect(toIsoDay('2026-07-14T18:00:00Z')).toBe('2026-07-14')
    expect(toIsoDay('2026-07-21')).toBe('2026-07-21')
  })
  it('rejects garbage and impossible calendar days', () => {
    expect(toIsoDay(null)).toBeNull()
    expect(toIsoDay('soon')).toBeNull()
    expect(toIsoDay('2026-02-30')).toBeNull()
  })
})

describe('buildFeed', () => {
  const feed = buildFeed(input)

  it('merges every kind newest first', () => {
    expect(feed.map((item) => item.id)).toEqual([
      'essay:loop-engineering',
      'release:opaline@0.4.2',
      'release:sibyl@1.3.1',
      'essay:how-i-ai',
      'lab:regex-nightmares',
      'launch:opaline',
      'launch:sibyl',
    ])
  })

  it('drops items without a usable date', () => {
    expect(feed.some((item) => item.id === 'essay:undated')).toBe(false)
    expect(feed.some((item) => item.id === 'launch:orphan-release')).toBe(false)
  })

  it('links releases to the GitHub release page and marks them external', () => {
    const release = feed.find((item) => item.id === 'release:opaline@0.4.2')
    expect(release).toMatchObject({
      external: true,
      href: 'https://github.com/hyperb1iss/opaline/releases/tag/v0.4.2',
      project: 'Opaline',
      summary: 'CSS export and four new themes.',
      title: 'Opaline v0.4.2',
      version: '0.4.2',
    })
    expect(feed.find((item) => item.id === 'essay:loop-engineering')?.external).toBe(false)
  })

  it('can leave launches out', () => {
    const noLaunches = buildFeed(input, { launches: false })
    expect(noLaunches.some((item) => item.kind === 'launch')).toBe(false)
    expect(noLaunches).toHaveLength(5)
  })
})

describe('splitLead', () => {
  it('leads with the newest long-form piece and removes it from the rest', () => {
    const { lead, items } = splitLead(buildFeed(input), 3)
    expect(lead?.id).toBe('essay:loop-engineering')
    expect(items.map((item) => item.id)).toEqual(['release:opaline@0.4.2', 'release:sibyl@1.3.1', 'essay:how-i-ai'])
  })

  it('skips releases when picking the lead', () => {
    const feed = buildFeed({ ...input, posts: [post('old', '2020-01-01', 'Old Essay')] })
    expect(feed[0].kind).toBe('release')
    expect(splitLead(feed).lead?.id).toBe('lab:regex-nightmares')
  })

  it('falls back to the newest item when nothing is long-form', () => {
    const feed = buildFeed({ ...input, lab: [], posts: [] })
    expect(splitLead(feed).lead?.kind).toBe('release')
  })

  it('handles an empty feed', () => {
    expect(splitLead([])).toEqual({ items: [], lead: null })
  })
})

describe('shortName', () => {
  it('drops the tagline after a colon and leaves plain names alone', () => {
    expect(shortName('Sibyl: Build With Agents That Remember')).toBe('Sibyl')
    expect(shortName('DroidMind')).toBe('DroidMind')
    expect(shortName(': odd')).toBe(': odd')
  })
})

describe('shippingList', () => {
  it('lists released projects newest release first with project links', () => {
    expect(shippingList(input.projects, releases)).toEqual([
      {
        href: '/projects/opaline/',
        publishedAt: '2026-07-14T18:00:00Z',
        slug: 'opaline',
        title: 'Opaline',
        version: '0.4.2',
      },
      {
        href: '/projects/sibyl/',
        publishedAt: '2026-06-30T09:00:00Z',
        slug: 'sibyl',
        title: 'Sibyl',
        version: '1.3.1',
      },
    ])
  })
  it('respects the cap', () => {
    expect(shippingList(input.projects, releases, 1)).toHaveLength(1)
  })
})

describe('summarizeRelease', () => {
  it('takes the first real line and strips markdown', () => {
    const body =
      "## What's Changed\n\n* **CSS export** for every theme by @hyperb1iss in https://github.com/x/y/pull/12\n* egui fixes\n\n**Full Changelog**: https://github.com/x/y/compare/v0.4.1...v0.4.2"
    expect(summarizeRelease('v0.4.2', body, '0.4.2')).toBe('CSS export for every theme')
  })
  it('skips release-date and version boilerplate lines', () => {
    expect(summarizeRelease(null, 'Released: 2026-09-02\n\nAdds CSS export.', '0.4.2')).toBe('Adds CSS export.')
    expect(
      summarizeRelease(
        'Release v0.4.2',
        '# Release Notes v0.4.2\n\n**Released:** 2026-09-02\n\nA correctness release for the theme contract.\n\n## Highlights',
        '0.4.2',
      ),
    ).toBe('A correctness release for the theme contract.')
  })
  it('keeps the first sentence whole instead of truncating mid-thought', () => {
    const body =
      'Sibyl 1.3.2 improves startup reliability and closes authentication gaps. It also refreshes the web workspace with unified search, a collapsible sidebar, and a faster graph view.'
    expect(summarizeRelease(null, body, '1.3.2')).toBe(
      'Sibyl 1.3.2 improves startup reliability and closes authentication gaps.',
    )
    expect(summarizeRelease(null, 'Version 0.4.2\n', '0.4.2')).toBeNull()
  })
  it('falls back to a descriptive title, never a bare tag or boilerplate', () => {
    expect(summarizeRelease('Retrieval rewrite', '', '1.3.1')).toBe('Retrieval rewrite')
    expect(summarizeRelease('v1.3.1', '', '1.3.1')).toBeNull()
    expect(summarizeRelease('Release v1.2.3', '', '1.2.3')).toBeNull()
    expect(summarizeRelease('Release v1.2.3: Faster startup', '', '1.2.3')).toBe('Release v1.2.3: Faster startup')
    expect(summarizeRelease(null, null, '1.3.1')).toBeNull()
  })
  it('closes a fence only on a matching marker at least as wide as the opener', () => {
    const body = '````md\n```\nnpm install thing\n```\n````\n\nActual release summary.'
    expect(summarizeRelease(null, body, '1.0.0')).toBe('Actual release summary.')
    expect(summarizeRelease(null, '~~~\ncode\n```\nstill code\n~~~\nProse.', '1.0.0')).toBe('Prose.')
    const trailing = '````md\n````not-a-closer\nLeaked prose\n````\n\nActual release summary.'
    expect(summarizeRelease(null, trailing, '1.0.0')).toBe('Actual release summary.')
    expect(summarizeRelease(null, '```\nnever closed\nstill code', '1.0.0')).toBeNull()
  })
  it('skips code fences, html, tables, and unwraps blockquotes', () => {
    expect(summarizeRelease(null, '```text\nnpm i thing\n```\n\nAdds a CLI.', '1.0.0')).toBe('Adds a CLI.')
    expect(summarizeRelease(null, '<details><summary>Notes</summary>\n\nFixed the crash.', '1.0.0')).toBe(
      'Fixed the crash.',
    )
    expect(summarizeRelease(null, '> Fixed the crash.', '1.0.0')).toBe('Fixed the crash.')
    expect(summarizeRelease(null, '| a | b |\n|---|---|\nTable first.', '1.0.0')).toBe('Table first.')
  })
  it('truncates long lines on a word boundary', () => {
    const long = `${'a'.repeat(60)} ${'b'.repeat(60)} ${'c'.repeat(60)}`
    const out = summarizeRelease(null, long, '1.0.0')
    expect(out?.length).toBeLessThanOrEqual(160)
    expect(out?.endsWith('…')).toBe(true)
  })
})

describe('groupByYear', () => {
  it('buckets items by year, newest year first, keeping order within a year', () => {
    const feed = buildFeed(input)
    const years = groupByYear(feed)
    expect(years.map((y) => y.year)).toEqual([...years.map((y) => y.year)].sort().reverse())
    expect(years.flatMap((y) => y.items)).toEqual(feed)
    for (const { year, items } of years) {
      for (const item of items) expect(item.date.startsWith(year)).toBe(true)
    }
  })

  it('returns no groups for an empty feed', () => {
    expect(groupByYear([])).toEqual([])
  })
})
