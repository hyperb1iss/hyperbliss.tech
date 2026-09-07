// app/(transition)/projects/[slug]/page.tsx
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetailView from '../../../components/ProjectDetailView'
import { getAllProjectSlugs, getAllProjects, getProject } from '../../../lib/content'
import { generateProjectMetadata, type ProjectFrontmatter } from '../../../lib/generateMetadata'
import { getLatestRelease, getRepoStats } from '../../../lib/github'
import { laneOf } from '../../../lib/projectLanes'
import { extractHeadings } from '../../../lib/reading'
import { PageProps } from '../../../types'

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

// Content ships with the build, so any slug we didn't pre-render is a 404.
export const dynamicParams = false

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const project = await getProject(slug)
  if (!project) notFound()

  const frontmatter: ProjectFrontmatter = {
    description: project.description ?? '',
    github: project.github ?? '',
    tags: (project.tags ?? []).filter((t): t is string => t !== null),
    title: project.displayTitle,
  }

  return generateProjectMetadata(frontmatter, slug, parent)
}

export default async function ProjectPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const project = await getProject(slug)
  if (!project) notFound()

  const [release, stats, all] = await Promise.all([
    project.github ? getLatestRelease(project.github).catch(() => null) : null,
    project.github ? getRepoStats(project.github).catch(() => null) : null,
    getAllProjects(),
  ])

  // Other projects in the same lane, newest first, capped so the rail stays short.
  const lane = laneOf(project.category)
  const related = all
    .filter((p) => p.slug !== slug && laneOf(p.category) === lane)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, 4)

  return (
    <ProjectDetailView
      body={project.body}
      category={project.category}
      github={project.github ?? ''}
      headings={extractHeadings(project.body ?? '')}
      now={Date.now()}
      related={related}
      releaseDate={release?.publishedAt ?? null}
      releaseUrl={release?.url ?? null}
      stats={stats}
      tags={(project.tags ?? []).filter((t): t is string => t !== null)}
      title={project.title}
      version={release?.version ?? null}
    />
  )
}
