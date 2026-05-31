// app/(transition)/projects/[slug]/page.tsx
import { ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import ProjectDetailView from '../../../components/ProjectDetailView'
import { getAllProjectSlugs, getProject } from '../../../lib/content'
import { generateProjectMetadata, type ProjectFrontmatter } from '../../../lib/generateMetadata'
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

  return (
    <ProjectDetailView
      body={project.body}
      github={project.github ?? ''}
      tags={(project.tags ?? []).filter((t): t is string => t !== null)}
      title={project.displayTitle}
    />
  )
}
