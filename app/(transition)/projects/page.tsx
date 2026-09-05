// app/(transition)/projects/page.tsx

import type { ProjectRow } from '../../components/ProjectRows'
import ProjectsPageContent from '../../components/ProjectsPageContent'
import { getAllProjects } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { getReleasesForProjects } from '../../lib/github'

export default async function Projects() {
  const projects = await getAllProjects()
  const releases = await getReleasesForProjects(projects.map((p) => ({ github: p.github, slug: p.slug })))

  // Newest release first, then unreleased projects alphabetically.
  const rows: ProjectRow[] = projects
    .map((project) => {
      const release = releases.get(project.slug)
      return { project, releaseUrl: release?.url ?? null, version: release?.version ?? null }
    })
    .sort((a, b) => {
      const aDate = releases.get(a.project.slug)?.publishedAt
      const bDate = releases.get(b.project.slug)?.publishedAt
      if (aDate && bDate) return new Date(bDate).getTime() - new Date(aDate).getTime()
      if (aDate) return -1
      if (bDate) return 1
      return a.project.title.localeCompare(b.project.title)
    })

  return <ProjectsPageContent rows={rows} />
}

export const metadata = generatePageMetadata('Projects', 'Explore open source projects by Stefanie Jane.', '/projects/')
