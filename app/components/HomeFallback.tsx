// The crawlable, always-visible-without-JS content for the terminal homepage
// (§5.8). Pure and prop-driven so it renders identically on the server and is
// trivially testable. TerminalHome drops this inside a <noscript> so visitors
// with JS disabled (and non-rendering crawlers) get the full content as plain,
// visible HTML — never hidden behind motion that JS reveals.

import { SOCIAL_LINKS } from '@/lib/socials'
import { styled } from '../../styled-system/jsx'

export interface FallbackItem {
  slug: string
  title: string
  description?: string | null
}

export interface HomeFallbackContentProps {
  aboutTitle: string
  aboutSummary: string
  projects: FallbackItem[]
  posts: FallbackItem[]
  siteDescription?: string | null
}

const Wrap = styled.div`
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

export default function HomeFallbackContent({
  aboutTitle,
  aboutSummary,
  projects,
  posts,
  siteDescription,
}: HomeFallbackContentProps) {
  return (
    <Wrap>
      <h2>{aboutTitle}</h2>
      <p>{aboutSummary}</p>

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <a href={`/projects/${p.slug}/`}>{p.title}</a>
            {p.description ? ` — ${p.description}` : ''}
          </li>
        ))}
      </ul>

      <h2>Latest writing</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={`/blog/${post.slug}/`}>{post.title}</a>
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

      {siteDescription ? <p>{siteDescription}</p> : null}
    </Wrap>
  )
}
