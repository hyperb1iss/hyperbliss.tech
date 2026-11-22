// Render the real TerminalHome to static markup and assert the homepage `/`
// output carries all real content, both in the SSR front page (outside
// <noscript>) and in the no-JS fallback. The terminal lives in the client-only
// pull-down console (portaled, mounted-gated, ssr:false inside) and
// contributes no crawlable content, so it's mocked out to isolate the SEO
// surface.

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { PageLoadProvider } from '@/components/PageLoadOrchestrator'
import TerminalHome from '@/components/TerminalHome'
import type { FrontSection, LabSummary, PostSummary, ProjectSummary } from '@/lib/content'
import { buildFeed, type FeedRelease, splitLead } from '@/lib/feed'
import type { ActivitySummary } from '@/lib/github'
import { type ProjectEntry, pickFeatured } from '@/lib/projectLanes'

const project = (slug: string, title: string, date: string): ProjectSummary => ({
  category: null,
  coverImage: null,
  date,
  description: `${title} description`,
  displayTitle: title,
  emoji: null,
  github: `https://github.com/hyperb1iss/${slug}`,
  image: null,
  slug,
  status: 'active',
  tags: ['Rust'],
  title,
})

const post = (slug: string, title: string, date: string): PostSummary => ({
  author: 'Stefanie Jane',
  coverImage: null,
  date,
  displayTitle: title,
  emoji: null,
  excerpt: `${title} excerpt`,
  slug,
  tags: ['ai'],
  title,
})

const front: FrontSection = {
  bio: 'I build software that gives people control over their technology.',
  tagline: "Hi! I'm {name}! Welcome to my personal site, where you can find all my projects, writings, and `/etc`.",
}

const activity: ActivitySummary = {
  events: [],
  generatedAt: '2026-09-14T00:00:00Z',
  ok: true,
  pushesPerDay: [],
  repos: ['sibyl', 'chromacat'],
  totalPushes: 7,
  windowDays: 14,
}

const projects = [project('sibyl', 'Sibyl', '2025-01-26'), project('chromacat', 'ChromaCat', '2024-11-02')]
const posts = [post('how-i-ai', 'How I AI', '2026-05-27'), post('regex-deep-dive', 'Regex Deep Dive', '2026-04-03')]
const lab: LabSummary[] = []
const releases = new Map<string, FeedRelease>([
  [
    'sibyl',
    {
      publishedAt: '2026-06-30T00:00:00Z',
      summary: 'Retrieval rewrite.',
      url: 'https://github.com/hyperb1iss/sibyl/releases/tag/v1.3.1',
      version: '1.3.1',
    },
  ],
])

const { lead, items } = splitLead(buildFeed({ lab, posts, projects, releases }), 10)
const entries: ProjectEntry[] = projects.map((project) => {
  const release = releases.get(project.slug)
  return {
    project,
    releaseDate: release?.publishedAt ?? null,
    releaseUrl: release?.url ?? null,
    stats:
      project.slug === 'sibyl' ? { archived: false, forks: 3, language: 'Rust', pushedAt: null, stars: 412 } : null,
    version: release?.version ?? null,
  }
})
const featured = pickFeatured(entries, 3)

const html = renderToStaticMarkup(
  <PageLoadProvider>
    <TerminalHome
      activity={activity}
      featured={featured}
      front={front}
      items={items}
      lead={lead}
      posts={posts}
      projects={projects}
      siteConfig={null}
    />
  </PageLoadProvider>,
)
const withoutNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')

describe('TerminalHome SSR markup carries real content', () => {
  it('leads with the newest essay as an h1 linking to the post', () => {
    // next/link normalizes the trailing slash per next.config, so accept either.
    expect(withoutNoscript).toMatch(/<h1[^>]*><a[^>]*href="\/blog\/how-i-ai\/?"[^>]*>How I AI<\/a><\/h1>/)
    expect(withoutNoscript).toContain('How I AI excerpt')
  })

  it('renders the feed with releases, launches, and older essays as deep links', () => {
    expect(withoutNoscript).toContain('Sibyl v1.3.1')
    expect(withoutNoscript).toContain('Retrieval rewrite.')
    expect(withoutNoscript).toContain('href="https://github.com/hyperb1iss/sibyl/releases/tag/v1.3.1"')
    expect(withoutNoscript).toMatch(/href="\/blog\/regex-deep-dive\/?"/)
    expect(withoutNoscript).toMatch(/href="\/projects\/chromacat\/?"/)
  })

  it('opens with the intro sentence and a visible Latest marker', () => {
    expect(withoutNoscript).toMatch(
      /Hi! I(&#x27;|')m <a[^>]*href="\/about\/?"[^>]*>Stefanie Jane<\/a>! Welcome to my personal site/,
    )
    expect(withoutNoscript).toMatch(/<span[^>]*>\/etc<\/span>\./)
    expect(withoutNoscript).not.toContain('{name}')
    expect(withoutNoscript).not.toContain('`')
    expect(withoutNoscript).toMatch(/<h2[^>]*>Latest<\/h2>/)
  })

  it('renders the Building strip with the featured trio and live facts', () => {
    expect(withoutNoscript).toMatch(/<h2[^>]*>Building<\/h2>/)
    expect(withoutNoscript).toMatch(/<h3[^>]*><a[^>]*href="\/projects\/sibyl\/?"[^>]*>Sibyl<\/a><\/h3>/)
    expect(withoutNoscript).toMatch(/<h3[^>]*><a[^>]*href="\/projects\/chromacat\/?"[^>]*>ChromaCat<\/a><\/h3>/)
    expect(withoutNoscript).toContain('★ 412')
    expect(withoutNoscript).toMatch(
      /href="https:\/\/github\.com\/hyperb1iss\/sibyl\/releases\/tag\/v1\.3\.1"[^>]*>v1\.3\.1</,
    )
    expect(withoutNoscript).toMatch(/href="\/projects\/?"[^>]*>All 2 projects/)
  })

  it('renders the computed pulse line and carries no hand-written now, photo, or rail', () => {
    expect(withoutNoscript).toContain('last 14 days')
    expect(withoutNoscript).toContain('7 pushes')
    expect(withoutNoscript).toContain('sibyl, chromacat')
    expect(withoutNoscript).not.toContain('profile-image')
    expect(withoutNoscript).not.toContain('Creative technologist')
    expect(withoutNoscript).not.toContain('<aside')
    expect(withoutNoscript).not.toMatch(/<h2[^>]*>(Now|Shipping|Elsewhere)<\/h2>/)
  })

  it('keeps the feed under its own Recently marker', () => {
    expect(withoutNoscript).toMatch(/<h2[^>]*>Recently<\/h2>/)
  })

  it('keeps the no-JS fallback with every project and post', () => {
    expect(html).toContain('ChromaCat')
    expect(html).toContain('Regex Deep Dive')
  })

  it('does not hide the homepage behind display:none', () => {
    expect(html).not.toContain('display:none')
  })

  it('adds no <main> landmark of its own (GlobalLayout provides the page main)', () => {
    expect(html).not.toContain('<main')
  })

  it('has one h1 and a feed-level h2 above the item h3s', () => {
    expect((withoutNoscript.match(/<h1\b/g) ?? []).length).toBe(1)
    expect(withoutNoscript).toMatch(/<h2[^>]*>Latest<\/h2>/)
  })
})
