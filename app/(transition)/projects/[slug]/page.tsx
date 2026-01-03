// app/(transition)/projects/[slug]/page.tsx
import { ResolvingMetadata } from 'next'
import ProjectDetailTina from '../../../components/ProjectDetailTina'
import { generateProjectMetadata, type ProjectFrontmatter } from '../../../lib/generateMetadata'
import { getAllProjectSlugs, getProjectWithQuery } from '../../../lib/tina'
import { PageProps } from '../../../types'

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata) {
  const resolvedParams = await params
  const slug = resolvedParams.slug as string

  const { project } = await getProjectWithQuery(slug)

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

  const { project, query, variables, data } = await getProjectWithQuery(slug)

  return (
    <ProjectDetailTina
      body={project.body}
      data={data}
      github={project.github ?? ''}
      query={query}
      tags={(project.tags ?? []).filter((t): t is string => t !== null)}
      title={project.displayTitle}
      variables={variables}
    />
  )
}
