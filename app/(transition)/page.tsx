import { notFound } from 'next/navigation'
import HomePageClient from '@/components/HomePageClient'
import TerminalHome from '@/components/TerminalHome'
import { getReleasesForProjects } from '@/lib/github'
import { projectRotationSeed } from '@/lib/homeContent'
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

// Gate the terminal-first hero (§6). Off → the classic homepage stays the
// fallback. Enable with NEXT_PUBLIC_TERMINAL_HERO=true; flag removed on ship.
const TERMINAL_HERO = process.env.NEXT_PUBLIC_TERMINAL_HERO === 'true'

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
    const projectSelectionSeed = projectRotationSeed(new Date(generatedAt))

    if (!TERMINAL_HERO) {
      return (
        <HomePageClient
          labExperiments={labExperiments}
          pageData={pageData}
          posts={posts}
          projectSelectionSeed={projectSelectionSeed}
          projects={projects}
          siteConfig={siteConfig}
        />
      )
    }

    // Terminal-first path: assemble the virtual-FS manifest + broadcast.
    const [now, aboutPage, resume] = await Promise.all([
      getNow().catch(() => DEFAULT_NOW),
      getPage('about').catch(() => null),
      getResume().catch(() => ({ body: null, description: null, title: 'Resume' })),
    ])

    // Curated "currently shipping": a few recent repos, not all 24 (§5.10).
    const curated = projects.filter((p) => p.github).slice(0, 4)
    let releases = new Map<string, ReleaseLike>()
    try {
      releases = await getReleasesForProjects(curated.map((p) => ({ github: p.github, slug: p.slug })))
    } catch {
      // Rate-limited or offline — the empty-ship fallback still renders.
    }

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
        labExperiments={labExperiments}
        manifest={manifest}
        pageData={pageData}
        posts={posts}
        projects={projects}
        siteConfig={siteConfig}
      />
    )
  } catch {
    notFound()
  }
}
