// app/(transition)/archive/page.tsx
// The whole feed, by year: essays, lab experiments, project launches, and each
// project's latest release. The front page shows the newest few and links here.

import Archive from '@/components/Archive'
import { buildFeed, groupByYear } from '@/lib/feed'
import { getReleasesForProjects, getRepoStatsForProjects } from '@/lib/github'
import type { ReleaseLike } from '@/lib/terminal/releases'
import { getAllLab, getAllPosts, getAllProjects } from '../../lib/content'
import { generatePageMetadata } from '../../lib/generateMetadata'

// Same cadence as the front page so both read from one release cache window.
export const revalidate = 3600

export const metadata = generatePageMetadata(
  'Archive',
  'Essays, lab experiments, project launches, and the latest release of everything we make, newest first.',
  '/archive/',
)

export default async function ArchivePage() {
  const [posts, projects, lab] = await Promise.all([getAllPosts(), getAllProjects(), getAllLab()])
  const withRepo = projects.filter((p) => p.github)
  const repos = withRepo.map((p) => ({ github: p.github, slug: p.slug }))
  let releases = new Map<string, ReleaseLike>()
  const launched = new Map<string, string>()
  try {
    // Both read the same cached facts batch, so this is one GitHub request.
    const [latest, stats] = await Promise.all([getReleasesForProjects(repos), getRepoStatsForProjects(repos)])
    releases = latest
    for (const [slug, { createdAt }] of stats) if (createdAt) launched.set(slug, createdAt)
  } catch {
    // Rate-limited or offline: the archive still lists local content.
  }
  const years = groupByYear(buildFeed({ lab, launched, posts, projects, releases }))
  return <Archive years={years} />
}
