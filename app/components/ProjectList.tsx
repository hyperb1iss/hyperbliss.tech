// app/components/ProjectList.tsx
'use client'

import { motion } from 'framer-motion'
import styled from 'styled-components'
import Card from './Card'

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 3rem;

  @media (min-width: 1600px) {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  }
}

interface ProjectListProps {
  projects: Project[]
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <ProjectsGrid
      animate="visible"
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
      {projects.map((project, index) => (
        <Card
          color="0, 255, 255"
          description={project.frontmatter.description}
          githubLink={project.frontmatter.github}
          index={index}
          key={project.slug}
          link={`/projects/${project.slug}`}
          linkColor="255, 0, 255"
          linkText="Learn More"
          meta={project.frontmatter.author ? `Author: ${project.frontmatter.author}` : undefined}
          tags={project.frontmatter.tags}
          title={project.frontmatter.title}
        />
      ))}
    </ProjectsGrid>
  )
}

export default ProjectList
