// app/components/HomePageClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { styled } from '../../styled-system/jsx'
import type { LabSummary, PageData, PostSummary, ProjectSummary, SiteConfig } from '../lib/content'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HeroSectionSilk from './HeroSectionSilk'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'
import SponsorBanner from './SponsorBanner'

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

interface HomePageClientProps {
  pageData: PageData
  siteConfig?: SiteConfig | null
  posts: PostSummary[]
  projects: ProjectSummary[]
  labExperiments?: LabSummary[]
}

interface BlogPost {
  slug: string
  linkPrefix?: string
  frontmatter: {
    title: string
    excerpt: string
    date: string
    tags: string[]
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
// Component
// ═══════════════════════════════════════════════════════════════════════════

export function HomePageClient({ pageData, siteConfig, posts, projects, labExperiments = [] }: HomePageClientProps) {
  const [isMobile, setIsMobile] = useState(false)

  const hero = pageData.hero
  const techTags = siteConfig?.techTags ?? null

  // Merge blog posts and lab experiments, sorted by date, take latest 5
  const allContent = [
    ...posts.map((post) => ({
      frontmatter: {
        date: post.date ?? '',
        excerpt: post.excerpt ?? '',
        tags: (post.tags ?? []).filter((t): t is string => t !== null),
        title: post.displayTitle,
      },
      linkPrefix: '/blog',
      slug: post.slug,
    })),
    ...labExperiments.map((exp) => ({
      frontmatter: {
        date: exp.date ?? '',
        excerpt: exp.excerpt ?? '',
        tags: (exp.tags ?? []).filter((t): t is string => t !== null),
        title: exp.displayTitle,
      },
      linkPrefix: '/lab',
      slug: exp.slug,
    })),
  ].sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  const latestPosts: BlogPost[] = allContent.slice(0, 5)

  // Transform projects for display
  const projectsList: Project[] = projects.map((project) => ({
    frontmatter: {
      description: project.description ?? '',
      github: project.github ?? '',
      tags: (project.tags ?? []).filter((t): t is string => t !== null),
      title: project.displayTitle,
    },
    slug: project.slug,
  }))

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

  // Prepare hero data — normalize undefined to null
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
    <ContentWrapper>
      {isMobile ? (
        <>
          <HeroSectionSilk hero={heroData} techTags={techTags} />
          <LatestBlogPostsSilk posts={latestPosts} />
          <FeaturedProjectsSectionSilk projects={projectsList} />
          <SponsorBanner />
        </>
      ) : (
        <>
          <DesktopLayout>
            <MainContent>
              <HeroSectionSilk hero={heroData} techTags={techTags} />
              <FeaturedProjectsSectionSilk projects={projectsList} />
            </MainContent>
            <SidebarWrapper>
              <LatestBlogPostsSilk posts={latestPosts} />
            </SidebarWrapper>
          </DesktopLayout>
          <SponsorBanner />
        </>
      )}
    </ContentWrapper>
  )
}

export default HomePageClient
