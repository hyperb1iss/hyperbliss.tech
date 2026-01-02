// app/components/FeaturedProjectsSectionSilk.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { css } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { usePageLoad } from './PageLoadOrchestrator'
import SilkCard from './SilkCard'

const sectionWrapperStyles = css`
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

const sectionHeaderStyles = css`
  text-align: center;
  margin-bottom: var(--space-12);
`

const titleStyles = css`
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

const subtitleStyles = css`
  font-family: var(--font-body);
  font-size: var(--text-fluid-lg);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: var(--leading-relaxed);
`

const projectsGridStyles = css`
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

const floatingOrbBaseStyles = css`
  position: absolute;
  border-radius: 50%;
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
    <motion.section animate="visible" className={sectionWrapperStyles} initial="hidden" variants={containerVariants}>
      {/* Floating orbs for ambiance */}
      <motion.div
        animate={{
          x: [-200, 200, -200],
          y: [-100, 100, -100],
        }}
        className={floatingOrbBaseStyles}
        initial={{ x: -200, y: -100 }}
        style={{
          background: 'radial-gradient(circle at 30% 30%, var(--silk-quantum-purple), transparent 70%)',
          height: 400,
          width: 400,
        }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        className={floatingOrbBaseStyles}
        style={{
          background: 'radial-gradient(circle at 30% 30%, var(--silk-circuit-cyan), transparent 70%)',
          height: 300,
          right: -150,
          top: 200,
          width: 300,
        }}
        transition={{
          duration: 15,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <Container>
        <motion.div className={sectionHeaderStyles} variants={itemVariants}>
          <motion.h2 className={titleStyles}>
            <TitleLink href="/projects">
              <TitleGradient>Featured Projects</TitleGradient>
            </TitleLink>
          </motion.h2>
          <motion.p className={subtitleStyles}>
            Exploring the intersection of creativity and technology through innovative solutions and experimental
            interfaces.
          </motion.p>
        </motion.div>

        <motion.div className={projectsGridStyles} variants={containerVariants}>
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
        </motion.div>
      </Container>
    </motion.section>
  )
}
