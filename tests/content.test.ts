// Missing-content handling: nonexistent or out-of-root slugs resolve to null
// (so routes can 404) rather than throwing and 500ing.

import { describe, expect, it } from 'vitest'
import { getAllPostSlugs, getAllProjectSlugs, getAllProjects, getPost, getProject } from '@/lib/content'
import { extractHeadings } from '@/lib/reading'

describe('getPost', () => {
  it('returns null for a slug with no backing file', async () => {
    expect(await getPost('afsewaefw')).toBeNull()
  })

  it('returns null instead of escaping the content root via traversal', async () => {
    expect(await getPost('../../README')).toBeNull()
  })

  it('returns the post for a real slug', async () => {
    const [slug] = await getAllPostSlugs()
    const post = await getPost(slug)
    expect(post).not.toBeNull()
    expect(post?.slug).toBe(slug)
  })
})

describe('getProject', () => {
  it('returns null for a slug with no backing file', async () => {
    expect(await getProject('afewfwae')).toBeNull()
  })

  it('returns null instead of escaping the content root via traversal', async () => {
    expect(await getProject('../../README')).toBeNull()
  })

  it('returns the project for a real slug', async () => {
    const [slug] = await getAllProjectSlugs()
    const project = await getProject(slug)
    expect(project).not.toBeNull()
    expect(project?.slug).toBe(slug)
  })
})

describe('getAllProjects', () => {
  it('flags hasInstall exactly when the page will render an #install heading', async () => {
    const projects = await getAllProjects()
    for (const project of projects) {
      const detail = await getProject(project.slug)
      const rendered = extractHeadings(detail?.body ?? '').some((heading) => heading.id === 'install')
      expect(project.hasInstall, project.slug).toBe(rendered)
    }
    const flagships = projects.filter((p) => typeof p.featured === 'number').map((p) => [p.slug, p.hasInstall])
    expect(flagships).toEqual(
      expect.arrayContaining([
        ['hypercolor', true],
        ['sibyl', true],
        ['unifly', true],
      ]),
    )
  })
})
