// T1.10 (stronger) — render the real TerminalHome to static markup and assert
// the homepage `/` output carries all real content, both in the SSR sections
// (outside <noscript>) and in the no-JS fallback. The terminal hero itself is
// client-only (ssr:false) and contributes no crawlable content, so it's mocked
// out to isolate the SSR/SEO surface.

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { PageLoadProvider } from '@/components/PageLoadOrchestrator'
import TerminalHome from '@/components/TerminalHome'
import type { LabSummary, PageData, PostSummary, ProjectSummary } from '@/lib/content'
import { testBroadcast, testManifest } from '../terminal/_harness'

vi.mock('@/components/terminal/TerminalHero', () => ({ default: () => null }))

const project = (slug: string, title: string): ProjectSummary => ({
  category: null,
  coverImage: null,
  date: '2025-01-01',
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

const post = (slug: string, title: string): PostSummary => ({
  author: 'Stefanie Jane',
  coverImage: null,
  date: '2026-05-27',
  displayTitle: title,
  emoji: null,
  excerpt: `${title} excerpt`,
  slug,
  tags: ['ai'],
  title,
})

const pageData: PageData = {
  about: null,
  description: 'Stefanie Jane builds developer tools and terminal UIs.',
  featuredProjects: null,
  hero: null,
  latestPosts: null,
  slug: 'home',
  title: 'Home',
}

const projects = [project('sibyl', 'Sibyl'), project('chromacat', 'ChromaCat')]
const posts = [post('how-i-ai', 'How I AI'), post('regex-deep-dive', 'Regex Deep Dive')]
const lab: LabSummary[] = []

const html = renderToStaticMarkup(
  <PageLoadProvider>
    <TerminalHome
      broadcast={testBroadcast}
      labExperiments={lab}
      manifest={testManifest}
      pageData={pageData}
      posts={posts}
      projects={projects}
      siteConfig={null}
    />
  </PageLoadProvider>,
)
const withoutNoscript = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')

describe('TerminalHome SSR markup carries real content', () => {
  it('renders project titles', () => {
    expect(html).toContain('Sibyl')
    expect(html).toContain('ChromaCat')
  })

  it('renders post titles', () => {
    expect(html).toContain('How I AI')
  })

  it('renders the about teaser linking to the about page', () => {
    expect(html.toLowerCase()).toContain('about me') // about CTA
    expect(html).toContain('/about')
  })

  it('keeps content crawlable even outside the noscript fallback', () => {
    // The SSR Silk sections must carry content independently of <noscript>.
    expect(withoutNoscript).toContain('Sibyl')
    expect(withoutNoscript).toContain('How I AI')
  })

  it('does not hide the homepage behind display:none', () => {
    expect(html).not.toContain('display:none')
  })
})
