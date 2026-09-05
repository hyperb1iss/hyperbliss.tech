import { notFound } from 'next/navigation'
import TerminalHome from '@/components/TerminalHome'
import { buildFeed, shippingList, splitLead } from '@/lib/feed'
import { getReleasesForProjects } from '@/lib/github'
import { buildBroadcast } from '@/lib/terminal/buildBroadcast'
import { buildManifest } from '@/lib/terminal/buildManifest'
import { pickLatestShip, type ReleaseLike, versionsMap } from '@/lib/terminal/releases'
import {
  getAllLab,
  getAllPosts,
  getAllProjects,
  getNow,
  getPage,
  getResume,
  getSiteConfig,
  type NowData,
} from '../lib/content'

// Re-validate hourly so the broadcast (counts, latest ship/post) stays fresh
// and the curated GitHub release fetch stays within budget (§5.10).
export const revalidate = 3600

const DEFAULT_NOW: NowData = {
  body: null,
  emoji: null,
  focus: 'Building things, open source all the way down.',
  location: null,
  title: 'Now',
  updated: null,
}

export default async function Home() {
  try {
    const [pageData, siteConfig, posts, projects, labExperiments] = await Promise.all([
      getPage('home'),
      getSiteConfig().catch(() => null),
      getAllPosts(),
      getAllProjects(),
      getAllLab(),
    ])

    const generatedAt = new Date().toISOString()

    // Terminal-first path: assemble the virtual-FS manifest + broadcast.
    const [now, aboutPage, resume] = await Promise.all([
      getNow().catch(() => DEFAULT_NOW),
      getPage('about').catch(() => null),
      getResume().catch(() => ({ body: null, description: null, title: 'Resume' })),
    ])

    // Latest release for every project with a repo. Each lookup is cached in
    // memory and by the fetch cache for an hour, so this is one GitHub call per
    // repo per hour at most, well inside even the unauthenticated budget.
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

    const manifest = buildManifest({
      about: aboutPage?.about ?? null,
      generatedAt,
      lab: labExperiments,
      now,
      posts,
      projects,
      releases: versionsMap(releases),
      resume,
    })
    const broadcast = buildBroadcast({
      generatedAt,
      lab: labExperiments,
      latestShip: pickLatestShip(releases, projects),
      now,
      posts,
      projects,
    })

    return (
      <TerminalHome
        broadcast={broadcast}
        front={pageData.front}
        items={items}
        lead={lead}
        manifest={manifest}
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
