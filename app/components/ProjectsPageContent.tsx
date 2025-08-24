// app/components/ProjectsPageContent.tsx
'use client'

import React from 'react'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'
import ProjectList from './ProjectList'

/**
 * Interface for project data
 */
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

/**
 * Interface for ProjectsPageContent component props
 */
interface ProjectsPageContentProps {
  projects: Project[]
}

/**
 * ProjectsPageContent component
 * Renders the projects page with a title and list of projects.
 * Ensures correct layout without duplicate headers.
 * @param {ProjectsPageContentProps} props - The component props
 * @returns {JSX.Element} Rendered projects page
 */
const ProjectsPageContent: React.FC<ProjectsPageContentProps> = ({ projects }) => {
  return (
    <PageLayout>
      <PageTitle>Projects</PageTitle>
      <ProjectList projects={projects} />
    </PageLayout>
  )
}

export default ProjectsPageContent
