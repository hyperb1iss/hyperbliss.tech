import { notFound } from 'next/navigation'
import TerminalHome from '@/components/TerminalHome'
import { buildFeed, shippingList, splitLead } from '@/lib/feed'
import { getReleasesForProjects } from '@/lib/github'
import { DEFAULT_NOW } from '@/lib/terminal/getTerminalData'
import type { ReleaseLike } from '@/lib/terminal/releases'
import { getAllLab, getAllPosts, getAllProjects, getNow, getPage, getSiteConfig } from '../lib/content'

// Re-validate hourly so the feed (releases, latest post) stays fresh and the
// GitHub release lookups stay inside their cache window.
export const revalidate = 3600

export default async function Home() {
  try {
    const [pageData, siteConfig, posts, projects, labExperiments, now] = await Promise.all([
      getPage('home'),
      getSiteConfig().catch(() => null),
      getAllPosts(),
      getAllProjects(),
      getAllLab(),
      getNow().catch(() => DEFAULT_NOW),
    ])

    // Latest release for every project with a repo. Each lookup is cached in
    // memory and by the fetch cache for an hour, so this is one GitHub call per
    // repo per hour at most.
    const withRepo = projects.filter((p) => p.github)
    let releases = new Map<string, ReleaseLike>()
    try {
      releases = await getReleasesForProjects(withRepo.map((p) => ({ github: p.github, slug: p.slug })))
    } catch {
      // Rate-limited or offline — the feed still renders from local content.
    }

    const feed = buildFeed({ lab: labExperiments, posts, projects, releases })
    const { lead, items } = splitLead(feed, 10)
    const shipping = shippingList(projects, releases, 6)

    return (
      <TerminalHome
        front={pageData.front}
        items={items}
        lead={lead}
        now={now}
        posts={posts}
        projects={projects}
        shipping={shipping}
        siteConfig={siteConfig}
      />
    )
  } catch {
    notFound()
  }
}
