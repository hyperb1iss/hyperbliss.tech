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

export function projectRotationSeed(date = new Date()): number {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return dayOfYear * 24 + date.getHours()
}

export function pickFeaturedProjects<T>(projects: T[], count = 8, seed = projectRotationSeed()): T[] {
  const shuffled = [...projects]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const seededRandom = Math.sin(i * seed) * 10000
    const j = Math.floor(Math.abs(seededRandom) % (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, count)
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
