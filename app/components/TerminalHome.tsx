'use client'

// Terminal-first homepage composition. The terminal is the hero; the existing
// Silk sections render below for depth, SEO, and mobile scroll. A <noscript>
// block guarantees the full content is visible even with JavaScript disabled
// (§5.8) — it never relies on motion that JS later reveals.

import Link from 'next/link'
import type { LabSummary, PageData, PostSummary, ProjectSummary, SiteConfig } from '@/lib/content'
import { toLatestContent, toProjectCards } from '@/lib/homeContent'
import { SOCIAL_LINKS } from '@/lib/socials'
import type { Broadcast, Manifest, ManifestEntry } from '@/lib/terminal/types'
import { styled } from '../../styled-system/jsx'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'
import TerminalHero from './terminal/TerminalHero'

interface TerminalHomeProps {
  manifest: Manifest
  broadcast: Broadcast
  posts: PostSummary[]
  projects: ProjectSummary[]
  labExperiments?: LabSummary[]
  pageData: PageData
  siteConfig?: SiteConfig | null
}

const Below = styled.div`
  width: 100%;
  max-width: var(--container-xl, 1400px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const Teaser = styled.section`
  text-align: center;
  padding: var(--space-12) var(--space-4) var(--space-4);

  & h2 {
    font-family: var(--font-heading);
    font-size: var(--text-fluid-2xl);
    font-weight: var(--font-bold);
    background: linear-gradient(135deg, var(--silk-quantum-purple), var(--silk-circuit-cyan));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: var(--space-3);
  }
  & p {
    font-family: var(--font-body);
    color: var(--text-secondary);
    font-size: var(--text-fluid-base);
    max-width: 640px;
    margin: 0 auto var(--space-4);
  }
  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
    border-bottom: 1px dotted var(--silk-circuit-cyan);
  }
`

// Static, always-visible content for crawlers and JS-disabled visitors.
const NoScriptContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
  font-family: var(--font-body);
  color: var(--text-primary);

  & h2 {
    font-family: var(--font-heading);
    color: var(--silk-quantum-purple);
    margin-top: var(--space-6);
  }
  & a {
    color: var(--silk-circuit-cyan);
  }
  & li {
    margin: var(--space-1) 0;
  }
`

function aboutEntry(manifest: Manifest): ManifestEntry | undefined {
  return manifest.entries.find((e) => e.kind === 'about')
}

export default function TerminalHome({
  manifest,
  broadcast,
  posts,
  projects,
  labExperiments = [],
  pageData,
  siteConfig,
}: TerminalHomeProps) {
  const projectCards = toProjectCards(projects)
  const latest = toLatestContent(posts, labExperiments)
  const about = aboutEntry(manifest)

  return (
    <>
      <TerminalHero broadcast={broadcast} manifest={manifest} />

      <Below>
        <Teaser>
          <h2>{about?.title ?? 'Stefanie Jane'}</h2>
          <p>{about?.summary ?? pageData.description}</p>
          <Link href="/about/">about me →</Link>
        </Teaser>

        <FeaturedProjectsSectionSilk projects={projectCards} />
        <LatestBlogPostsSilk posts={latest} />
      </Below>

      <noscript>
        <NoScriptContent>
          <h2>{about?.title ?? 'Stefanie Jane'}</h2>
          <p>{about?.summary ?? pageData.description}</p>

          <h2>Projects</h2>
          <ul>
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`/projects/${p.slug}/`}>{p.displayTitle}</a>
                {p.description ? ` — ${p.description}` : ''}
              </li>
            ))}
          </ul>

          <h2>Latest writing</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <a href={`/blog/${post.slug}/`}>{post.displayTitle}</a>
              </li>
            ))}
          </ul>

          <h2>Find me</h2>
          <ul>
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a href={s.href}>{s.label}</a>
              </li>
            ))}
          </ul>
          {siteConfig?.seo?.siteDescription ? <p>{siteConfig.seo.siteDescription}</p> : null}
        </NoScriptContent>
      </noscript>
    </>
  )
}
