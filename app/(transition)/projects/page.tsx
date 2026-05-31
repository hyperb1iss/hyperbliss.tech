// app/(transition)/projects/page.tsx
import ProjectsPageContent from '../../components/ProjectsPageContent'
import { getAllProjects } from '../../lib/content'
import { getReleasesForProjects } from '../../lib/github'

export default async function Projects() {
  const projects = await getAllProjects()

  // Fetch GitHub release info for all projects
  const releases = await getReleasesForProjects(projects.map((p) => ({ github: p.github, slug: p.slug })))

  // Transform and sort by release date (newest releases first)
  const projectsList = projects
    .map((project) => {
      const release = releases.get(project.slug)
      return {
        frontmatter: {
          author: undefined,
          description: project.description ?? '',
          github: project.github ?? '',
          latestVersion: release?.version ?? null,
          releaseDate: release?.publishedAt ?? null,
          releaseUrl: release?.url ?? null,
          tags: (project.tags ?? []).filter((t): t is string => t !== null),
          title: project.displayTitle,
        },
        slug: project.slug,
      }
    })
    .sort((a, b) => {
      // Sort by release date (newest first), then by static date, then alphabetically
      const aDate = a.frontmatter.releaseDate
      const bDate = b.frontmatter.releaseDate
      if (aDate && bDate) {
        return new Date(bDate).getTime() - new Date(aDate).getTime()
      }
      if (aDate) return -1
      if (bDate) return 1
      return a.frontmatter.title.localeCompare(b.frontmatter.title)
    })

  return <ProjectsPageContent projects={projectsList} />
}

export const metadata = {
  description: 'Discover projects developed by Stefanie Jane, showcasing innovation and creativity in technology.',
  title: 'Hyperbliss | Projects',
}
