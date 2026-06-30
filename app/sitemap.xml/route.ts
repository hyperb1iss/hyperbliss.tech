// app/sitemap.xml/route.ts

import { MARKDOWN_COLLECTIONS, type MarkdownDirectory } from '../lib/contentCollections'
import { getAllMarkdownSlugs } from '../lib/markdown'

/**
 * Ensures a URL ends with a trailing slash
 * @param {string} url - The URL to check and possibly modify
 * @returns {string} - URL with trailing slash
 */
function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

/**
 * Generates the sitemap.xml content
 * @returns {Promise<Response>} The sitemap response
 */
export async function GET(): Promise<Response> {
  const baseUrl = 'https://hyperbliss.tech'
  const dynamicCollections: Array<{
    changeFrequency: 'monthly' | 'weekly'
    directory: MarkdownDirectory
    priority: 0.7 | 0.8
  }> = [
    { changeFrequency: 'weekly', directory: 'posts', priority: 0.7 },
    { changeFrequency: 'monthly', directory: 'projects', priority: 0.8 },
    { changeFrequency: 'monthly', directory: 'lab', priority: 0.8 },
  ]

  const dynamicUrls = (
    await Promise.all(
      dynamicCollections.map(async ({ changeFrequency, directory, priority }) => {
        const slugs = await getAllMarkdownSlugs(directory)
        const routeSegment = MARKDOWN_COLLECTIONS[directory].routeSegment
        return slugs.map((slug) => ({
          changeFrequency,
          lastModified: new Date(),
          priority,
          url: ensureTrailingSlash(`${baseUrl}/${routeSegment}/${slug}`),
        }))
      }),
    )
  ).flat()

  const staticPages = [
    { changeFrequency: 'daily' as const, lastModified: new Date(), priority: 1.0, url: ensureTrailingSlash(baseUrl) },
    {
      changeFrequency: 'weekly' as const,
      lastModified: new Date(),
      priority: 0.8,
      url: ensureTrailingSlash(`${baseUrl}/about`),
    },
    {
      changeFrequency: 'daily' as const,
      lastModified: new Date(),
      priority: 0.9,
      url: ensureTrailingSlash(`${baseUrl}/blog`),
    },
    {
      changeFrequency: 'weekly' as const,
      lastModified: new Date(),
      priority: 0.9,
      url: ensureTrailingSlash(`${baseUrl}/projects`),
    },
    {
      changeFrequency: 'weekly' as const,
      lastModified: new Date(),
      priority: 0.8,
      url: ensureTrailingSlash(`${baseUrl}/lab`),
    },
    {
      changeFrequency: 'monthly' as const,
      lastModified: new Date(),
      priority: 0.7,
      url: ensureTrailingSlash(`${baseUrl}/resume`),
    },
  ]

  const sitemap = [...staticPages, ...dynamicUrls]

  // Convert the sitemap array to XML string
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap
        .map(
          (entry) => `
        <url>
          <loc>${entry.url}</loc>
          <lastmod>${entry.lastModified.toISOString()}</lastmod>
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
