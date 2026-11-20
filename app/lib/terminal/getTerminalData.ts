// Everything the pull-down terminal needs, assembled once per revalidation.
// Lives at the layout level so every route gets the same console with the same
// virtual filesystem and broadcast. Every loader is cached (content from disk,
// releases in memory and in the fetch cache), so this is cheap to call from a
// layout and a page in the same render.

import { getAllLab, getAllPosts, getAllProjects, getPage, getResume } from '../content'
import { getReleasesForProjects } from '../github'
import { buildBroadcast } from './buildBroadcast'
import { buildManifest } from './buildManifest'
import { getVirtualFsBodies } from './fsBodies'
import { pickLatestShip, type ReleaseLike, versionsMap } from './releases'
import { type Broadcast, byteLengthUtf8, fingerprint, type Manifest } from './types'

export interface TerminalData {
  manifest: Manifest
  broadcast: Broadcast
}

export async function getTerminalData(): Promise<TerminalData> {
  const generatedAt = new Date().toISOString()
  const [posts, projects, lab, aboutPage, resume] = await Promise.all([
    getAllPosts(),
    getAllProjects(),
    getAllLab(),
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

  // Real byte sizes for every file the shell serves, so `ls -l`, `df`, and
  // `dmesg` report what `cat` will actually print instead of an estimate.
  // The same read fingerprints the tree, which versions the body requests.
  let sizes: Record<string, number> | undefined
  let version: string | undefined
  try {
    const bodies = await getVirtualFsBodies()
    const paths = Object.keys(bodies).sort()
    sizes = Object.fromEntries(paths.map((path) => [path, byteLengthUtf8(bodies[path])]))
    version = fingerprint(paths.map((path) => `${path}\n${bodies[path]}`).join('\n'))
  } catch {
    // Fall back to the manifest's summary-based estimates.
  }

  const manifest = buildManifest({
    about: aboutPage?.about ?? null,
    company: aboutPage?.company ?? null,
    generatedAt,
    lab,
    posts,
    projects,
    releases: versionsMap(releases),
    resume,
    sizes,
    version,
  })
  const broadcast = buildBroadcast({
    generatedAt,
    lab,
    latestShip: pickLatestShip(releases, projects),
    posts,
    projects,
  })
  return { broadcast, manifest }
}
