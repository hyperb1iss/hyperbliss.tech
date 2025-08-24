// app/components/FeaturedProjectsSection.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import Card from './Card'
import GlitchSpan from './GlitchSpan'
import { usePageLoad } from './PageLoadOrchestrator'
import StyledTitle from './StyledTitle'

const FeaturedProjectsSectionWrapper = styled(motion.section)`
  padding: 4rem 16px;
  position: relative;
  overflow: hidden;
`

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: 800px;
  }

  @media (min-width: 1200px) {
    max-width: 1000px;
  }
`

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
  }
`

interface Project {
  slug: string
  frontmatter: {
    title: string
    description: string
    github: string
    tags: string[]
  }
}

interface FeaturedProjectsProps {
  projects: Project[]
}

// Add this hash function at the top level, before the component
function getHashedProjects(projects: Project[], count: number): Project[] {
  const date = new Date()
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const hour = date.getHours()

  // Create a seed based on hour and day of year
  const seed = dayOfYear * 24 + hour

  // Fisher-Yates shuffle with seeded random
  const shuffled = [...projects]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const seededRandom = Math.sin(i * seed) * 10000
    const j = Math.floor(Math.abs(seededRandom) % (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const displayedProjects = getHashedProjects(projects, 6)
  const { isInitialLoad } = usePageLoad()

  return (
    <FeaturedProjectsSectionWrapper
      animate={{ opacity: 1 }}
      initial={{ opacity: isInitialLoad ? 0 : 1 }}
      transition={{ delay: isInitialLoad ? 0.4 : 0, duration: isInitialLoad ? 0.5 : 0 }}
    >
      <StyledTitle
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: isInitialLoad ? 0 : 1, y: isInitialLoad ? -10 : 0 }}
        transition={{ delay: isInitialLoad ? 0.5 : 0, duration: isInitialLoad ? 0.4 : 0 }}
      >
        <TitleLink href="/projects">
          <GlitchSpan data-text="Featured Projects">Featured Projects</GlitchSpan>
        </TitleLink>
      </StyledTitle>
      <ProjectsGrid
        animate="visible"
        initial="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: isInitialLoad ? 0.6 : 0,
              staggerChildren: isInitialLoad ? 0.05 : 0,
            },
          },
        }}
      >
        {displayedProjects.map((project, index) => (
          <Card
            className="project-card"
            color="0, 255, 255"
            description={project.frontmatter.description}
            githubLink={project.frontmatter.github}
            index={index}
            key={project.slug}
            link={`/projects/${project.slug}`}
            linkColor="255, 0, 255"
            linkText="Learn More"
            tags={project.frontmatter.tags}
            title={project.frontmatter.title}
          />
        ))}
      </ProjectsGrid>
    </FeaturedProjectsSectionWrapper>
  )
}
