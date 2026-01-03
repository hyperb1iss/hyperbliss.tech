// app/components/ProjectList.tsx
'use client'

import { motion } from 'framer-motion'
import { css } from '../../styled-system/css'
import SilkCard from './SilkCard'

const projectsGridStyles = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: var(--space-10);
  padding: var(--space-12) 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  }
`

interface Project {
  slug: string
  frontmatter: {
    title: string
    description: string
    github: string
    author?: string
    tags?: string[]
    latestVersion?: string | null
    releaseDate?: string | null
    releaseUrl?: string | null
  }
}

interface ProjectListProps {
  projects: Project[]
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <motion.div
      animate="visible"
      className={projectsGridStyles}
      initial="hidden"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: 0.2,
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {projects.map((project, index) => {
        // Format version meta string
        const versionMeta = project.frontmatter.latestVersion
          ? `v${project.frontmatter.latestVersion}`
          : undefined

        // Debug: log meta value for each project
        console.log(`[ProjectList] ${project.slug}: meta=${versionMeta}`)

        return (
          <SilkCard
            description={project.frontmatter.description}
            githubLink={project.frontmatter.github}
            index={index}
            key={project.slug}
            link={`/projects/${project.slug}`}
            linkText="Explore Project"
            meta={versionMeta}
            tags={project.frontmatter.tags}
            title={project.frontmatter.title}
          />
        )
      })}
    </motion.div>
  )
}

export default ProjectList
