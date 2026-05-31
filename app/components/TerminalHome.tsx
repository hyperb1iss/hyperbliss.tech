// Terminal-first homepage composition. Keep this as a server component so the
// full content corpus renders as HTML without becoming hydration payload.

import Link from 'next/link'
import type { LabSummary, PageData, PostSummary, ProjectSummary, SiteConfig } from '@/lib/content'
import { pickFeaturedProjects, projectRotationSeed, toLatestContent, toProjectCards } from '@/lib/homeContent'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { styled } from '../../styled-system/jsx'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HomeFallbackContent from './HomeFallback'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'
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

// Split hero: identity on one side, the live terminal on the other. The terminal
// is the bonus; the writing and projects below carry the weight. Stacks to a
// single column below the lg breakpoint, identity first.
const HeroGrid = styled.div`
  width: 100%;
  max-width: var(--container-xl, 1400px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  align-items: center;
  padding: var(--space-12) var(--space-4) var(--space-8);

  @media (min-width: 1024px) {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: var(--space-12);
    padding: var(--space-16) var(--space-6) var(--space-10);
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
  font-size: var(--text-fluid-xl);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  max-width: 40ch;
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

export default function TerminalHome({
  manifest,
  broadcast,
  posts,
  projects,
  labExperiments = [],
  pageData,
  siteConfig,
}: TerminalHomeProps) {
  const projectSeed = projectRotationSeed(new Date(broadcast.generatedAt))
  const projectCards = pickFeaturedProjects(toProjectCards(projects), 8, projectSeed)
  const latest = toLatestContent(posts, labExperiments)
  const hero = pageData.hero
  const name = hero?.name ?? 'Stefanie Jane'
  const tagline = hero?.subtitle ?? DEFAULT_TAGLINE

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
        </Identity>

        <TerminalCol>
          <TerminalHero broadcast={broadcast} manifest={manifest} />
        </TerminalCol>
      </HeroGrid>

      <Below>
        <LatestBlogPostsSilk posts={latest} />
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
