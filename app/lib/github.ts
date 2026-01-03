// app/lib/github.ts
// GitHub API utilities for fetching release information

interface GitHubRelease {
  tag_name: string
  published_at: string
  html_url: string
}

interface ReleaseInfo {
  version: string
  publishedAt: string
  url: string
}

// Cache for GitHub release data (in-memory for build time)
const releaseCache = new Map<string, { data: ReleaseInfo | null; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

/**
 * Extract owner and repo from a GitHub URL
 * Supports: https://github.com/owner/repo, github.com/owner/repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/i)
  if (!match) return null
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ''),
  }
}

/**
 * Fetch the latest release for a GitHub repository
 */
export async function getLatestRelease(githubUrl: string): Promise<ReleaseInfo | null> {
  const parsed = parseGitHubUrl(githubUrl)
  if (!parsed) return null

  const cacheKey = `${parsed.owner}/${parsed.repo}`

  // Check cache
  const cached = releaseCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Add token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      // Cache for 1 hour in Next.js fetch cache
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      // No releases or repo not found - cache the null result
      releaseCache.set(cacheKey, { data: null, timestamp: Date.now() })
      return null
    }

    const release: GitHubRelease = await response.json()

    const releaseInfo: ReleaseInfo = {
      publishedAt: release.published_at,
      url: release.html_url,
      version: release.tag_name.replace(/^v/, ''),
    }

    // Cache the result
    releaseCache.set(cacheKey, { data: releaseInfo, timestamp: Date.now() })

    return releaseInfo
  } catch (error) {
    console.error(`Failed to fetch release for ${cacheKey}:`, error)
    releaseCache.set(cacheKey, { data: null, timestamp: Date.now() })
    return null
  }
}

/**
 * Fetch releases for multiple GitHub URLs in parallel
 */
export async function getReleasesForProjects(
  projects: Array<{ slug: string; github: string | null }>,
): Promise<Map<string, ReleaseInfo>> {
  const releaseMap = new Map<string, ReleaseInfo>()

  const results = await Promise.all(
    projects.map(async (project) => {
      if (!project.github) return { release: null, slug: project.slug }
      const release = await getLatestRelease(project.github)
      return { release, slug: project.slug }
    }),
  )

  for (const { slug, release } of results) {
    if (release) {
      releaseMap.set(slug, release)
    }
  }

  return releaseMap
}
