// app/sitemap.xml/route.ts

import { BASE_URL } from '../lib/company'
import { MARKDOWN_COLLECTIONS, type MarkdownDirectory } from '../lib/contentCollections'
import { getAllMarkdownSlugs, getMarkdownContent } from '../lib/markdown'

interface SitemapEntry {
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  priority: number
  url: string
  /** Only set from a real date. A made-up one teaches crawlers to ignore it. */
  lastModified?: string
}

function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

function isoDate(value: unknown): string | undefined {
  if (typeof value !== 'string' && !(value instanceof Date)) return undefined
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

const COLLECTIONS: Array<{
  changeFrequency: SitemapEntry['changeFrequency']
  /** Whether the frontmatter date is the day the page was published. */
  dated: boolean
  directory: MarkdownDirectory
  priority: number
}> = [
  { changeFrequency: 'weekly', dated: true, directory: 'posts', priority: 0.7 },
  { changeFrequency: 'monthly', dated: false, directory: 'projects', priority: 0.8 },
  { changeFrequency: 'monthly', dated: true, directory: 'lab', priority: 0.8 },
]

const STATIC_PAGES: SitemapEntry[] = [
  { changeFrequency: 'daily', priority: 1.0, url: '' },
  { changeFrequency: 'weekly', priority: 0.8, url: '/about' },
  { changeFrequency: 'daily', priority: 0.9, url: '/blog' },
  { changeFrequency: 'weekly', priority: 0.9, url: '/projects' },
  { changeFrequency: 'weekly', priority: 0.8, url: '/lab' },
  { changeFrequency: 'monthly', priority: 0.7, url: '/resume' },
  { changeFrequency: 'weekly', priority: 0.6, url: '/archive' },
]

export async function GET(): Promise<Response> {
  const dynamicUrls = (
    await Promise.all(
      COLLECTIONS.map(async ({ changeFrequency, dated, directory, priority }) => {
        const slugs = await getAllMarkdownSlugs(directory)
        const routeSegment = MARKDOWN_COLLECTIONS[directory].routeSegment
        return Promise.all(
          slugs.map(async (slug): Promise<SitemapEntry> => {
            const date = dated
              ? await getMarkdownContent(directory, slug)
                  .then((item) => isoDate(item.frontmatter.date))
                  .catch(() => undefined)
              : undefined
            return { changeFrequency, lastModified: date, priority, url: `/${routeSegment}/${slug}` }
          }),
        )
      }),
    )
  ).flat()

  const sitemap = [...STATIC_PAGES, ...dynamicUrls]

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap
        .map(
          (entry) => `
        <url>
          <loc>${ensureTrailingSlash(`${BASE_URL}${entry.url}`)}</loc>${
            entry.lastModified
              ? `
          <lastmod>${entry.lastModified}</lastmod>`
              : ''
          }
          <changefreq>${entry.changeFrequency}</changefreq>
          <priority>${entry.priority}</priority>
        </url>
      `,
        )
        .join('')}
    </urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  )
}
