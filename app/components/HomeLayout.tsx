// app/components/HomeLayout.tsx
'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import FeaturedProjectsSectionSilk from './FeaturedProjectsSectionSilk'
import HeroSectionSilk from './HeroSectionSilk'
import LatestBlogPostsSilk from './LatestBlogPostsSilk'

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

interface BlogPost {
  slug: string
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

interface HomeLayoutProps {
  latestPosts: BlogPost[]
  projects: Project[]
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ latestPosts, projects }) => {
  const [isMobile, setIsMobile] = useState(false)

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

  return (
    <ContentWrapper>
      {isMobile ? (
        // Mobile layout: Stack everything vertically
        <>
          <HeroSectionSilk />
          <LatestBlogPostsSilk posts={latestPosts} />
          <FeaturedProjectsSectionSilk projects={projects} />
        </>
      ) : (
        // Desktop layout: Hero & Projects on left, Sidebar on right
        <DesktopLayout>
          <MainContent>
            <HeroSectionSilk />
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

export default HomeLayout
