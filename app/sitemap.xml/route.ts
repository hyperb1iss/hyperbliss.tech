// app/sitemap.xml/route.ts
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

  // Get all blog posts and projects
  const [blogSlugs, projectSlugs] = await Promise.all([
    getAllMarkdownSlugs('src/posts'),
    getAllMarkdownSlugs('src/projects'),
  ])

  // Generate URLs for blog posts
  const blogUrls = blogSlugs.map((slug) => ({
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
    priority: 0.7,
    url: ensureTrailingSlash(`${baseUrl}/blog/${slug}`),
  }))

  // Generate URLs for projects
  const projectUrls = projectSlugs.map((slug) => ({
    changeFrequency: 'monthly' as const,
    lastModified: new Date(),
    priority: 0.8,
    url: ensureTrailingSlash(`${baseUrl}/projects/${slug}`),
  }))

  // Static pages
  const staticPages = [
    {
      changeFrequency: 'daily' as const,
      lastModified: new Date(),
      priority: 1.0,
      url: ensureTrailingSlash(baseUrl),
    },
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
  ]

  const sitemap = [...staticPages, ...blogUrls, ...projectUrls]

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
