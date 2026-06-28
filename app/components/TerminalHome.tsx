// Terminal-first homepage composition. Keep this as a server component so the
// full content corpus renders as HTML without becoming hydration payload.

import type { LabSummary, PageData, PostSummary, ProjectSummary, SiteConfig } from '@/lib/content'
import { pickFeaturedProjects, projectRotationSeed, toLatestContent, toProjectCards } from '@/lib/homeContent'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import { styled } from '../../styled-system/jsx'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HeroSectionSilk from './HeroSectionSilk'
import HomeFallbackContent from './HomeFallback'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'
import TerminalConsole from './terminal/TerminalConsole'

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
      {/* The full identity hero is the landing; the terminal is a summonable
          pull-down console layered on top (portaled, defaults closed). */}
      <TerminalConsole broadcast={broadcast} manifest={manifest} />

      <HeroSectionSilk hero={hero} techTags={siteConfig?.techTags ?? null} />

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
