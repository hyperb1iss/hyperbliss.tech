// app/components/HomePageClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { tinaField } from 'tinacms/dist/react'
import { styled } from '../../styled-system/jsx'
import type {
  PagesQuery,
  PostsConnectionQuery,
  ProjectsConnectionQuery,
  SiteConfigQuery,
} from '../../tina/__generated__/types'
import { useTinaSafe } from '../lib/useTinaSafe'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HeroSectionSilk from './HeroSectionSilk'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface HomePageClientProps {
  pageData: {
    data: PagesQuery
    query: string
    variables: { relativePath: string }
  }
  siteConfigData?: {
    data: SiteConfigQuery
    query: string
    variables: { relativePath: string }
  } | null
  postsData: {
    data: PostsConnectionQuery
    query: string
    variables: Record<string, unknown>
  }
  projectsData: {
    data: ProjectsConnectionQuery
    query: string
    variables: Record<string, unknown>
  }
}

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    excerpt: string
    date: string
    tags: string[]
  }
}

// Helper type for post transformation
interface PostCandidate {
  slug: string
  frontmatter: {
    date: string
    excerpt: string
    tags: string[]
    title: string
  }
}

interface Project {
  slug: string
  frontmatter: {
    title: string
    description: string
    github: string
    tags: string[]
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Panda CSS Styles
// ═══════════════════════════════════════════════════════════════════════════

const ContentWrapper = styled.div`
  width: 100%;
`

const DesktopLayout = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const SidebarWrapper = styled.aside`
  flex: 0 0 350px;
  padding: 2rem;
  position: sticky;
  top: 100px;
  align-self: flex-start;

  @media (max-width: 1200px) {
    flex: 0 0 300px;
  }

  @media (max-width: 768px) {
    position: relative;
    top: auto;
    flex: 1;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
`

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function formatDisplayTitle(emoji: string | null | undefined, title: string): string {
  return emoji ? `${emoji} ${title}` : title
}

function getSlugFromRelativePath(relativePath: string): string {
  return relativePath.replace(/\.md$/, '')
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export function HomePageClient({ pageData, siteConfigData, postsData, projectsData }: HomePageClientProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Enable live editing for all data sources
  const { data: tinaPageData } = useTinaSafe(pageData)
  const { data: tinaSiteConfigData } = useTinaSafe(
    siteConfigData ?? { data: {} as SiteConfigQuery, query: '', variables: { relativePath: '' } },
  )
  const { data: tinaPostsData } = useTinaSafe(postsData)
  const { data: tinaProjectsData } = useTinaSafe(projectsData)

  // Extract data from Tina responses
  const page = tinaPageData.pages
  const hero = page?.hero
  const techTags = tinaSiteConfigData.siteConfig?.techTags?.filter((t): t is string => t !== null) ?? null

  // Transform posts for display
  const latestPosts: BlogPost[] = (tinaPostsData.postsConnection?.edges ?? [])
    .slice(0, 5)
    .map((edge): PostCandidate | null => {
      const node = edge?.node
      if (!node) return null
      return {
        frontmatter: {
          date: node.date ?? '',
          excerpt: node.excerpt ?? '',
          tags: (node.tags ?? []).filter((t): t is string => t !== null),
          title: formatDisplayTitle(node.emoji, node.title),
        },
        slug: getSlugFromRelativePath(node._sys.relativePath),
      }
    })
    .filter((p): p is PostCandidate => p !== null)
    .sort((a, b) => {
      if (!a.frontmatter.date && !b.frontmatter.date) return 0
      if (!a.frontmatter.date) return 1
      if (!b.frontmatter.date) return -1
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    })

  // Transform projects for display
  const projects: Project[] = (tinaProjectsData.projectsConnection?.edges ?? [])
    .map((edge) => {
      const node = edge?.node
      if (!node) return null
      return {
        frontmatter: {
          description: node.description ?? '',
          github: node.github ?? '',
          tags: (node.tags ?? []).filter((t): t is string => t !== null),
          title: formatDisplayTitle(node.emoji, node.title),
        },
        slug: getSlugFromRelativePath(node._sys.relativePath),
      }
    })
    .filter((p): p is Project => p !== null)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
    }
  }, [])

  // Prepare hero data with tinaField markers - normalize undefined to null
  const heroData = hero
    ? {
        name: hero.name ?? null,
        primaryCtaLink: hero.primaryCtaLink ?? null,
        primaryCtaText: hero.primaryCtaText ?? null,
        scrollText: hero.scrollText ?? null,
        secondaryCtaLink: hero.secondaryCtaLink ?? null,
        secondaryCtaText: hero.secondaryCtaText ?? null,
        subtitle: hero.subtitle ?? null,
        welcomeText: hero.welcomeText ?? null,
      }
    : null

  return (
    <ContentWrapper data-tina-field={tinaField(page, 'hero')}>
      {isMobile ? (
        <>
          <HeroSectionSilk hero={heroData} techTags={techTags} tinaPage={page} />
          <LatestBlogPostsSilk posts={latestPosts} />
          <FeaturedProjectsSectionSilk projects={projects} />
        </>
      ) : (
        <DesktopLayout>
          <MainContent>
            <HeroSectionSilk hero={heroData} techTags={techTags} tinaPage={page} />
            <FeaturedProjectsSectionSilk projects={projects} />
          </MainContent>
          <SidebarWrapper>
            <LatestBlogPostsSilk posts={latestPosts} />
          </SidebarWrapper>
        </DesktopLayout>
      )}
    </ContentWrapper>
  )
}

export default HomePageClient
