// Everything the pull-down terminal needs, assembled once per revalidation.
// Lives at the layout level so every route gets the same console with the same
// virtual filesystem and broadcast. Every loader is cached (content from disk,
// releases in memory and in the fetch cache), so this is cheap to call from a
// layout and a page in the same render.

import { getAllLab, getAllPosts, getAllProjects, getNow, getPage, getResume, type NowData } from '../content'
import { getReleasesForProjects } from '../github'
import { buildBroadcast } from './buildBroadcast'
import { buildManifest } from './buildManifest'
import { pickLatestShip, type ReleaseLike, versionsMap } from './releases'
import type { Broadcast, Manifest } from './types'

export const DEFAULT_NOW: NowData = {
  body: null,
  emoji: null,
  focus: 'Building things, open source all the way down.',
  location: null,
  title: 'Now',
  updated: null,
}

export interface TerminalData {
  manifest: Manifest
  broadcast: Broadcast
}

export async function getTerminalData(): Promise<TerminalData> {
  const generatedAt = new Date().toISOString()
  const [posts, projects, lab, now, aboutPage, resume] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getAllLab(),
    getNow().catch(() => DEFAULT_NOW),
    getPage('about').catch(() => null),
    getResume().catch(() => ({ body: null, description: null, title: 'Resume' })),
  ])

  let releases = new Map<string, ReleaseLike>()
  try {
    releases = await getReleasesForProjects(
      projects.filter((p) => p.github).map((p) => ({ github: p.github, slug: p.slug })),
    )
  } catch {
    // Rate-limited or offline — the console still works over local content.
  }

  const manifest = buildManifest({
    about: aboutPage?.about ?? null,
    generatedAt,
    lab,
    now,
    posts,
    projects,
    releases: versionsMap(releases),
    resume,
  })
  const broadcast = buildBroadcast({
    generatedAt,
    lab,
    latestShip: pickLatestShip(releases, projects),
    now,
    posts,
    projects,
  })
  return { broadcast, manifest }
}
