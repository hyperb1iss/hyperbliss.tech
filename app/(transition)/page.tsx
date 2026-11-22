import { notFound } from 'next/navigation'
import TerminalHome from '@/components/TerminalHome'
import { buildFeed, splitLead } from '@/lib/feed'
import { getRecentActivity, getReleasesForProjects, getRepoStatsForProjects, type RepoStats } from '@/lib/github'
import { type ProjectEntry, pickFeatured } from '@/lib/projectLanes'
import type { ReleaseLike } from '@/lib/terminal/releases'
import { getAllLab, getAllPosts, getAllProjects, getPage, getSiteConfig } from '../lib/content'

// Ceiling for the route's ISR window. The events feed underneath fetches with
// a 5 minute revalidate and the shortest fetch window wins, so the page
// regenerates about every 5 minutes; releases and stats stay behind their own
// hourly fetch cache, so GitHub sees no extra calls from that cadence.
export const revalidate = 3600

export default async function Home() {
  try {
    const [pageData, siteConfig, posts, projects, labExperiments] = await Promise.all([
      getPage('home'),
      getSiteConfig().catch(() => null),
      getAllPosts(),
      getAllProjects(),
      getAllLab(),
    ])

    // Latest release and repo stats for every project with a repo, plus the
    // public events feed. Each lookup is cached in memory and by the fetch
    // cache for an hour, so this is one GitHub call per repo per hour at most;
    // when GitHub is rate-limited or offline the page renders from local
    // content and the strip falls back to release recency, then launch date.
    const repos = projects.filter((p) => p.github).map((p) => ({ github: p.github, slug: p.slug }))
    const [releases, stats, activity] = await Promise.all([
      getReleasesForProjects(repos).catch(() => new Map<string, ReleaseLike>()),
      getRepoStatsForProjects(repos).catch(() => new Map<string, RepoStats>()),
      getRecentActivity().catch(() => null),
    ])

    const feed = buildFeed({ lab: labExperiments, posts, projects, releases })
    const { lead, items } = splitLead(feed, 10)

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
    const featured = pickFeatured(entries, 3)

    return (
      <TerminalHome
        activity={activity}
        featured={featured}
        front={pageData.front}
        items={items}
        lead={lead}
        posts={posts}
        projects={projects}
        siteConfig={siteConfig}
      />
    )
  } catch {
    notFound()
  }
}
