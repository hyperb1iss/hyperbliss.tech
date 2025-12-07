// app/components/FeaturedProjectsSectionSilk.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styled from 'styled-components'
import { usePageLoad } from './PageLoadOrchestrator'
import SilkCard from './SilkCard'

const SectionWrapper = styled(motion.section)`
  padding: var(--space-16) var(--space-4);
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--silk-void-black-alpha-50) 50%,
    transparent 100%
  );
`

const Container = styled.div`
  max-width: var(--container-xl);
  margin: 0 auto;
`

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: var(--space-12);
`

const Title = styled(motion.h2)`
  font-family: var(--font-display);
  font-size: var(--text-fluid-3xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
  position: relative;
  display: inline-block;
`

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  position: relative;
  
  &::after {
    content: '→';
    position: absolute;
    right: -2em;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: all var(--duration-normal) var(--ease-silk);
  }
  
  &:hover {
    &::after {
      opacity: 1;
      right: -1.5em;
    }
  }
`

const TitleGradient = styled.span`
  background: linear-gradient(
    135deg,
    var(--silk-quantum-purple) 0%,
    var(--silk-circuit-cyan) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
`

const Subtitle = styled(motion.p)`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
`

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--space-10);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
`

const FloatingOrb = styled(motion.div)<{ $color: string; $size: number }>`
  position: absolute;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    ${(props) => props.$color},
    transparent 70%
  );
  filter: blur(40px);
  opacity: 0.3;
  pointer-events: none;
  z-index: -1;
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

interface FeaturedProjectsSectionSilkProps {
  projects: Project[]
}

function getHashedProjects(projects: Project[], count: number): Project[] {
  const date = new Date()
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const hour = date.getHours()
  const seed = dayOfYear * 24 + hour

  const shuffled = [...projects]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const seededRandom = Math.sin(i * seed) * 10000
    const j = Math.floor(Math.abs(seededRandom) % (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
}

export default function FeaturedProjectsSectionSilk({ projects }: FeaturedProjectsSectionSilkProps) {
  const displayedProjects = getHashedProjects(projects, 6)
  const { isInitialLoad } = usePageLoad()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: isInitialLoad ? 0.4 : 0,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] as const,
      },
      y: 0,
    },
  }

  return (
    <SectionWrapper animate="visible" initial="hidden" variants={containerVariants}>
      {/* Floating orbs for ambiance */}
      <FloatingOrb
        $color="var(--silk-quantum-purple)"
        $size={400}
        animate={{
          x: [-200, 200, -200],
          y: [-100, 100, -100],
        }}
        initial={{ x: -200, y: -100 }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <FloatingOrb
        $color="var(--silk-circuit-cyan)"
        $size={300}
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        initial={{ right: -150, top: 200 }}
        transition={{
          duration: 15,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <Container>
        <SectionHeader variants={itemVariants}>
          <Title>
            <TitleLink href="/projects">
              <TitleGradient>Featured Projects</TitleGradient>
            </TitleLink>
          </Title>
          <Subtitle>
            Exploring the intersection of creativity and technology through innovative solutions and experimental
            interfaces.
          </Subtitle>
        </SectionHeader>

        <ProjectsGrid variants={containerVariants}>
          {displayedProjects.map((project, index) => (
            <SilkCard
              description={project.frontmatter.description}
              githubLink={project.frontmatter.github}
              index={index}
              key={project.slug}
              link={`/projects/${project.slug}`}
              linkText="Explore Project"
              tags={project.frontmatter.tags}
              title={project.frontmatter.title}
            />
          ))}
        </ProjectsGrid>
      </Container>
    </SectionWrapper>
  )
}
