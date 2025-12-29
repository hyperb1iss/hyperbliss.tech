// app/(transition)/projects/page.tsx
import ProjectsPageContent from '../../components/ProjectsPageContent'
import { getAllProjects } from '../../lib/tina'

export default async function Projects() {
  const projects = await getAllProjects()

  // Transform to the format ProjectsPageContent expects
  const projectsList = projects.map((project) => ({
    frontmatter: {
      author: undefined,
      description: project.description ?? '',
      github: project.github ?? '',
      tags: (project.tags ?? []).filter((t): t is string => t !== null),
      title: project.displayTitle,
    },
    slug: project.slug,
  }))

  return <ProjectsPageContent projects={projectsList} />
}

export const metadata = {
  description: 'Discover projects developed by Stefanie Jane, showcasing innovation and creativity in technology.',
  title: 'Hyperbliss | Projects',
}
