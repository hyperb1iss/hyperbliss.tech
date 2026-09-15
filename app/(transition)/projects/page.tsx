// app/(transition)/projects/page.tsx
import ProjectsPageContent from '../../components/ProjectsPageContent'
import { getAllProjects } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { getRepoFactsForProjects } from '../../lib/github'
import type { ProjectEntry } from '../../lib/projectLanes'

export const revalidate = 3600

export default async function Projects() {
  const projects = await getAllProjects()
  // One GitHub request for every repo (release and stats together).
  const facts = await getRepoFactsForProjects(projects.map((p) => ({ github: p.github, slug: p.slug })))

  const entries: ProjectEntry[] = projects.map((project) => {
    const { release, stats } = facts.get(project.slug) ?? { release: null, stats: null }
    return {
      project,
      releaseDate: release?.publishedAt ?? null,
      releaseUrl: release?.url ?? null,
      stats,
      version: release?.version ?? null,
    }
  })

  return <ProjectsPageContent entries={entries} now={Date.now()} />
}

export const metadata = generatePageMetadata('Projects', 'Explore open source projects by Stefanie Jane.', '/projects/')
