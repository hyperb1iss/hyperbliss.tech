// app/(transition)/projects/page.tsx
import ProjectsPageContent from '../../components/ProjectsPageContent'
import { getAllProjects } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'
import { getReleasesForProjects, getRepoStatsForProjects } from '../../lib/github'
import type { ProjectEntry } from '../../lib/projectLanes'

export const revalidate = 3600

export default async function Projects() {
  const projects = await getAllProjects()
  const repos = projects.map((p) => ({ github: p.github, slug: p.slug }))
  const [releases, stats] = await Promise.all([
    getReleasesForProjects(repos).catch(() => new Map()),
    getRepoStatsForProjects(repos).catch(() => new Map()),
  ])

  const entries: ProjectEntry[] = projects.map((project) => {
    const release = releases.get(project.slug)
    return {
      project,
      releaseDate: release?.publishedAt ?? null,
      releaseUrl: release?.url ?? null,
      stats: stats.get(project.slug) ?? null,
      version: release?.version ?? null,
    }
  })

  return <ProjectsPageContent entries={entries} now={Date.now()} />
}

export const metadata = generatePageMetadata('Projects', 'Explore open source projects by Stefanie Jane.', '/projects/')
