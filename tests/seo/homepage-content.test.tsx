// T1.10 — SEO / no-JS proof. The terminal is client-only, so the crawlable
// content lives in the SSR sections + a <noscript> fallback (§5.8). This
// asserts that fallback renders every kind of real content as plain, visible,
// linkable HTML — no motion, no display:none.

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HomeFallbackContent from '@/components/HomeFallback'

const html = renderToStaticMarkup(
  <HomeFallbackContent
    aboutSummary="Creative technologist building developer tools and terminal UIs."
    aboutTitle="Stefanie Jane"
    posts={[
      { slug: 'how-i-ai', title: 'How I AI (Today)' },
      { slug: 'regex-nightmares', title: 'Regex Nightmares' },
    ]}
    projects={[
      { description: 'Persistent memory for agents', slug: 'sibyl', title: 'Sibyl' },
      { description: 'Agentic git companion', slug: 'git-iris', title: 'Git-Iris' },
    ]}
    siteDescription="Open source all the way down."
  />,
)

describe('homepage crawlable content (no-JS fallback)', () => {
  it('includes the about heading and prose', () => {
    expect(html).toContain('Stefanie Jane')
    expect(html).toContain('Creative technologist building developer tools')
  })

  it('includes every project title as a crawlable deep link', () => {
    expect(html).toContain('Sibyl')
    expect(html).toContain('href="/projects/sibyl/"')
    expect(html).toContain('Git-Iris')
    expect(html).toContain('href="/projects/git-iris/"')
  })

  it('includes post titles as crawlable deep links', () => {
    expect(html).toContain('How I AI (Today)')
    expect(html).toContain('href="/blog/how-i-ai/"')
    expect(html).toContain('href="/blog/regex-nightmares/"')
  })

  it('includes social links', () => {
    expect(html).toContain('GitHub')
    expect(html).toContain('https://github.com/hyperb1iss')
    expect(html).toContain('https://bsky.app/profile/hyperbliss.tech')
  })

  it('includes the site description', () => {
    expect(html).toContain('Open source all the way down.')
  })

  it('does not hide content behind display:none', () => {
    expect(html).not.toContain('display:none')
    expect(html).not.toContain('display: none')
  })
})
