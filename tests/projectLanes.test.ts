import { describe, expect, it } from 'vitest'
import type { ProjectSummary } from '@/lib/content'
import {
  formatStars,
  groupByLane,
  LANES,
  laneOf,
  type ProjectEntry,
  pickFeatured,
  relativeTime,
  sortEntries,
} from '@/lib/projectLanes'

const project = (slug: string, category: string | null, title = slug): ProjectSummary => ({
  category,
  coverImage: null,
  date: '2025-01-01',
  description: null,
  displayTitle: title,
  emoji: null,
  github: `https://github.com/hyperb1iss/${slug}`,
  image: null,
  slug,
  status: null,
  tags: null,
  title,
})

const entry = (
  slug: string,
  category: string | null,
  extra: Partial<Omit<ProjectEntry, 'project'>> = {},
): ProjectEntry => ({
  project: project(slug, category),
  releaseDate: null,
  releaseUrl: null,
  stats: null,
  version: null,
  ...extra,
})

const stats = (stars: number, pushedAt: string, archived = false) => ({
  archived,
  forks: 0,
  language: 'Rust',
  pushedAt,
  stars,
})

describe('laneOf', () => {
  it('maps known categories and falls back to web', () => {
    expect(laneOf('agents')).toBe('agents')
    expect(laneOf('lighting')).toBe('lighting')
    expect(laneOf('nope')).toBe('web')
    expect(laneOf(null)).toBe('web')
  })
})

describe('sortEntries', () => {
  it('orders by release, then push, then stars, then name', () => {
    const sorted = sortEntries([
      entry('b-name', 'web'),
      entry('a-name', 'web'),
      entry('starry', 'web', { stats: stats(50, '2026-01-01T00:00:00Z') }),
      entry('pushed', 'web', { stats: stats(1, '2026-06-01T00:00:00Z') }),
      entry('released', 'web', { releaseDate: '2026-03-01T00:00:00Z' }),
    ])
    expect(sorted.map((e) => e.project.slug)).toEqual(['released', 'pushed', 'starry', 'a-name', 'b-name'])
  })
  it('falls back to launch date before name when GitHub answered nothing', () => {
    const newer = entry('zeta', 'web')
    newer.project.date = '2026-05-01'
    const older = entry('alpha', 'web')
    older.project.date = '2025-02-01'
    expect(sortEntries([older, newer]).map((e) => e.project.slug)).toEqual(['zeta', 'alpha'])
  })
})

describe('groupByLane', () => {
  it('returns non-empty lanes in canonical order', () => {
    const groups = groupByLane([entry('z', 'web'), entry('s', 'agents'), entry('u', 'lighting')])
    expect(groups.map((g) => g.lane.id)).toEqual(['agents', 'lighting', 'web'])
    expect(LANES.map((l) => l.id)).toEqual(['agents', 'terminal', 'lighting', 'web'])
  })
})

describe('pickFeatured', () => {
  it('falls back to release recency when fewer than half the repos have stats', () => {
    // A rate-limited build: two of six repos answered. Ranking those two would
    // crown whichever got through, so recency wins instead.
    const entries = [
      entry('a', 'web', { stats: stats(5, '2025-01-01') }),
      entry('b', 'web', { stats: stats(50, '2025-01-01') }),
      entry('c', 'web', { releaseDate: '2026-03-01' }),
      entry('d', 'web', { releaseDate: '2026-02-01' }),
      entry('e', 'web'),
      entry('f', 'web'),
    ]
    expect(pickFeatured(entries, 2).map((e) => e.project.slug)).toEqual(['c', 'd'])
  })

  it('falls back to release recency when no project has a GitHub URL', () => {
    const offGithub = (slug: string, releaseDate: string): ProjectEntry => {
      const e = entry(slug, 'web', { releaseDate })
      return { ...e, project: { ...e.project, github: null } }
    }
    const picked = pickFeatured([offGithub('a', '2026-01-01'), offGithub('b', '2026-03-01')], 2)
    expect(picked.map((e) => e.project.slug)).toEqual(['b', 'a'])
  })

  it('ranks by stars once a majority of repos have stats', () => {
    const entries = [
      entry('a', 'web', { stats: stats(5, '2025-01-01') }),
      entry('b', 'web', { stats: stats(50, '2025-01-01') }),
      entry('c', 'web', { releaseDate: '2026-03-01' }),
    ]
    expect(pickFeatured(entries, 2).map((e) => e.project.slug)).toEqual(['b', 'a'])
  })

  it('takes the most starred, breaking ties on recent pushes, skipping archived', () => {
    const picked = pickFeatured(
      [
        entry('old-star', 'web', { stats: stats(90, '2024-01-01T00:00:00Z') }),
        entry('fresh-star', 'web', { stats: stats(90, '2026-08-01T00:00:00Z') }),
        entry('archived', 'web', { stats: stats(500, '2026-08-01T00:00:00Z', true) }),
        entry('small', 'web', { stats: stats(3, '2026-08-01T00:00:00Z') }),
        entry('nostats', 'web'),
      ],
      2,
    )
    expect(picked.map((e) => e.project.slug)).toEqual(['fresh-star', 'old-star'])
  })
  it('falls back to release recency when no stats exist', () => {
    const picked = pickFeatured([entry('a', 'web'), entry('b', 'web', { releaseDate: '2026-01-01' })], 1)
    expect(picked[0].project.slug).toBe('b')
  })

  it('puts pinned projects first in rank order, whatever their stars', () => {
    const pin = (slug: string, rank: number, stars = 1): ProjectEntry => {
      const e = entry(slug, 'web', { stats: stats(stars, '2026-01-01T00:00:00Z') })
      return { ...e, project: { ...e.project, featured: rank } }
    }
    const entries = [
      entry('popular', 'web', { stats: stats(900, '2026-08-01T00:00:00Z') }),
      pin('third', 3),
      pin('first', 1),
      pin('second', 2, 500),
    ]
    expect(pickFeatured(entries, 3).map((e) => e.project.slug)).toEqual(['first', 'second', 'third'])
  })

  it('fills open slots by stars when fewer projects are pinned than the count', () => {
    const pinned = { ...entry('pinned', 'web'), project: { ...entry('pinned', 'web').project, featured: 1 } }
    const entries = [
      entry('small', 'web', { stats: stats(3, '2026-01-01T00:00:00Z') }),
      pinned,
      entry('big', 'web', { stats: stats(300, '2026-01-01T00:00:00Z') }),
    ]
    expect(pickFeatured(entries, 2).map((e) => e.project.slug)).toEqual(['pinned', 'big'])
  })
})

describe('relativeTime and formatStars', () => {
  const now = new Date('2026-09-06T12:00:00Z').getTime()
  it('renders compact relative times', () => {
    expect(relativeTime('2026-09-06T11:59:40Z', now)).toBe('just now')
    expect(relativeTime('2026-09-06T09:00:00Z', now)).toBe('3h ago')
    expect(relativeTime('2026-09-01T12:00:00Z', now)).toBe('5d ago')
    expect(relativeTime('2026-03-06T12:00:00Z', now)).toBe('6mo ago')
    expect(relativeTime('2023-09-06T12:00:00Z', now)).toBe('3y ago')
    expect(relativeTime(null, now)).toBeNull()
  })
  it('abbreviates thousands', () => {
    expect(formatStars(58)).toBe('58')
    expect(formatStars(1234)).toBe('1.2k')
    expect(formatStars(12345)).toBe('12k')
  })
})
