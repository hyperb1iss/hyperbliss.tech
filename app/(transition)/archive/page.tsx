// app/(transition)/archive/page.tsx
// The whole feed, by year: every essay, lab experiment, release, and project
// launch. The front page shows the newest ten and links here for the rest.

import Archive from '@/components/Archive'
import { buildFeed, groupByYear } from '@/lib/feed'
import { getReleasesForProjects } from '@/lib/github'
import type { ReleaseLike } from '@/lib/terminal/releases'
import { getAllLab, getAllPosts, getAllProjects } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

// Same cadence as the front page so both read from one release cache window.
export const revalidate = 3600

export const metadata = generatePageMetadata(
  'Archive',
  'Every essay, lab experiment, release, and project launch on hyperbliss.tech, newest first.',
  '/archive/',
)

export default async function ArchivePage() {
  const [posts, projects, lab] = await Promise.all([getAllPosts(), getAllProjects(), getAllLab()])
  const withRepo = projects.filter((p) => p.github)
  let releases = new Map<string, ReleaseLike>()
  try {
    releases = await getReleasesForProjects(withRepo.map((p) => ({ github: p.github, slug: p.slug })))
  } catch {
    // Rate-limited or offline: the archive still lists local content.
  }
  const years = groupByYear(buildFeed({ lab, posts, projects, releases }))
  return <Archive years={years} />
}
