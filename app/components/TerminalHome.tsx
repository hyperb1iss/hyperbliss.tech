// Terminal-first homepage composition. Keep this as a server component so the
// full content corpus renders as HTML without becoming hydration payload.

import Link from 'next/link'
import type { LabSummary, PageData, PostSummary, ProjectSummary, SiteConfig } from '@/lib/content'
import { pickFeaturedProjects, projectRotationSeed, toProjectCards } from '@/lib/homeContent'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { styled } from '../../styled-system/jsx'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HomeFallbackContent from './HomeFallback'
import { SparklingName } from './SparklingName'
import { StarButton } from './StarComponents'
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

const DEFAULT_TAGLINE =
  'I build software that gives people control over their technology. Open source all the way down.'

// Split hero: identity + latest writing on one side, the live terminal on the
// other. Stacks to a single column below the lg breakpoint, identity first.
const HeroGrid = styled.div`
  width: 100%;
  max-width: var(--container-xl, 1400px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  align-items: center;
  padding: var(--space-10) var(--space-4) var(--space-6);

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: var(--space-12);
    padding: var(--space-12) var(--space-6) var(--space-8);
  }
`

const Identity = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
    align-items: flex-start;
  }
`

const NameHeading = styled.h1`
  font-family: var(--font-heading);
  font-size: var(--text-fluid-4xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  margin: 0;

  @media (min-width: 1024px) {
    font-size: var(--text-fluid-5xl);
  }
`

const Tagline = styled.p`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 36ch;
  margin: 0;
`

const CtaRow = styled.div`
  display: flex;
  gap: var(--space-4);
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`

const SecondaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  font-weight: var(--font-medium);
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--duration-fast) var(--ease-silk);

  &:hover {
    border-bottom-color: var(--silk-circuit-cyan);
  }
`

const Posts = styled.section`
  width: 100%;
  margin-top: var(--space-2);
`

const PostsHeading = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--silk-circuit-cyan);
  }
`

const PostList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const PostRow = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--surface-glass);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-silk);

  &:hover {
    border-color: rgba(0, 255, 240, 0.4);
    background: rgba(0, 255, 240, 0.05);
    transform: translateX(4px);
  }
`

const PostTitle = styled.span`
  font-family: var(--font-body);
  font-size: var(--text-fluid-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: var(--leading-snug);
`

const PostMeta = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--silk-circuit-cyan);
  opacity: 0.85;
  flex-shrink: 0;
`

const PostExcerpt = styled.span`
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PostFooter = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: 2px;
`

const PostTag = styled.span`
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--silk-plasma-pink);
  background: rgba(255, 117, 216, 0.1);
  border: 1px solid rgba(255, 117, 216, 0.25);
  border-radius: var(--radius-full);
  padding: 1px var(--space-2);
`

const TerminalCol = styled.div`
  width: 100%;
  min-width: 0;
`

const Below = styled.div`
  width: 100%;
  max-width: var(--container-xl, 1400px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const fmtDate = (iso: string): string => {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

export default function TerminalHome({
  manifest,
  broadcast,
  posts,
  projects,
  pageData,
  siteConfig,
}: TerminalHomeProps) {
  const projectSeed = projectRotationSeed(new Date(broadcast.generatedAt))
  const projectCards = pickFeaturedProjects(toProjectCards(projects), 8, projectSeed)
  const hero = pageData.hero
  const name = hero?.name ?? 'Stefanie Jane'
  const tagline = hero?.subtitle ?? DEFAULT_TAGLINE
  const latestPosts = posts.slice(0, 3)

  return (
    <>
      <HeroGrid>
        <Identity>
          <NameHeading>
            <SparklingName name={name} sparkleCount={8} />
          </NameHeading>
          <Tagline>{tagline}</Tagline>
          <CtaRow>
            <Link href={hero?.primaryCtaLink ?? '/projects'} style={{ textDecoration: 'none' }}>
              <StarButton size="lg" variant="primary">
                {hero?.primaryCtaText ?? 'View Projects'}
              </StarButton>
            </Link>
            <SecondaryCta href={hero?.secondaryCtaLink ?? '/about'}>
              {hero?.secondaryCtaText ?? 'About Me'} →
            </SecondaryCta>
          </CtaRow>

          {latestPosts.length > 0 && (
            <Posts aria-label="Latest writing">
              <PostsHeading href="/blog">Latest posts →</PostsHeading>
              <PostList>
                {latestPosts.map((post) => (
                  <li key={post.slug}>
                    <PostRow href={`/blog/${post.slug}`}>
                      <PostTitle>{post.displayTitle}</PostTitle>
                      {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
                      <PostFooter>
                        <PostMeta>{fmtDate(post.date ?? '')}</PostMeta>
                        {(post.tags ?? [])
                          .filter((t): t is string => Boolean(t))
                          .slice(0, 3)
                          .map((t) => (
                            <PostTag key={t}>{t}</PostTag>
                          ))}
                      </PostFooter>
                    </PostRow>
                  </li>
                ))}
              </PostList>
            </Posts>
          )}
        </Identity>

        <TerminalCol>
          <TerminalHero broadcast={broadcast} manifest={manifest} />
        </TerminalCol>
      </HeroGrid>

      <Below>
        <FeaturedProjectsSectionSilk projects={projectCards} selectionSeed={null} />
      </Below>

      <noscript>
        <HomeFallbackContent
          aboutSummary={tagline}
          aboutTitle={name}
          posts={posts.map((p) => ({ slug: p.slug, title: p.displayTitle }))}
          projects={projects.map((p) => ({ description: p.description, slug: p.slug, title: p.displayTitle }))}
          siteDescription={siteConfig?.seo?.siteDescription}
        />
      </noscript>
    </>
  )
}
