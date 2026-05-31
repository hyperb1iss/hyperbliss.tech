// Pure transforms from content summaries to the card shapes the Silk homepage
// sections expect. Shared by the classic homepage and the terminal-first page
// so the SSR sections render identically in both.

import type { LabSummary, PostSummary, ProjectSummary } from './content'

export interface ProjectCard {
  slug: string
  frontmatter: { title: string; description: string; github: string; tags: string[] }
}

export interface BlogPostCard {
  slug: string
  linkPrefix?: string
  frontmatter: { title: string; excerpt: string; date: string; tags: string[] }
}

const cleanTags = (tags: (string | null)[] | null): string[] => (tags ?? []).filter((t): t is string => t !== null)

export function toProjectCards(projects: ProjectSummary[]): ProjectCard[] {
  return projects.map((project) => ({
    frontmatter: {
      description: project.description ?? '',
      github: project.github ?? '',
      tags: cleanTags(project.tags),
      title: project.displayTitle,
    },
    slug: project.slug,
  }))
}

/** Posts + lab experiments, newest first, capped — for the "Latest" section. */
export function toLatestContent(posts: PostSummary[], lab: LabSummary[] = [], limit = 5): BlogPostCard[] {
  const merged: BlogPostCard[] = [
    ...posts.map((post) => ({
      frontmatter: {
        date: post.date ?? '',
        excerpt: post.excerpt ?? '',
        tags: cleanTags(post.tags),
        title: post.displayTitle,
      },
      linkPrefix: '/blog',
      slug: post.slug,
    })),
    ...lab.map((exp) => ({
      frontmatter: {
        date: exp.date ?? '',
        excerpt: exp.excerpt ?? '',
        tags: cleanTags(exp.tags),
        title: exp.displayTitle,
      },
      linkPrefix: '/lab',
      slug: exp.slug,
    })),
  ]
  merged.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
  return merged.slice(0, limit)
}
