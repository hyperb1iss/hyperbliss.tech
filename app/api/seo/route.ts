import { NextResponse } from 'next/server'
import { TECH_TAGS } from '@/lib/constants'
import {
  type BlogFrontmatter,
  generateBlogMetadata,
  generateProjectMetadata,
  type ProjectFrontmatter,
} from '@/lib/generateMetadata'
import { getAllMarkdownSlugs, getMarkdownContent } from '@/lib/markdown'
import siteMetadata from '@/lib/metadata'
import { SOCIAL_LINKS } from '@/lib/socials'

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Fetches metadata for all blog posts
 */
async function getAllBlogMetadata() {
  const slugs = await getAllMarkdownSlugs('posts')
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<BlogFrontmatter>('posts', slug)
      const metadata = await generateBlogMetadata(frontmatter, slug)
      return {
        metadata,
        slug,
      }
    }),
  )
}

/**
 * Fetches metadata for all project pages
 */
async function getAllProjectMetadata() {
  const slugs = await getAllMarkdownSlugs('projects')
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<ProjectFrontmatter>('projects', slug)
      const metadata = await generateProjectMetadata(frontmatter, slug)
      return {
        metadata,
        slug,
      }
    }),
  )
}

/**
 * GET handler for /api/seo endpoint
 * Returns a comprehensive overview of the site's SEO configuration
 * Only available in development mode
 */
export async function GET() {
  // Return 404 if not in development mode
  if (!isDevelopment) {
    return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 404 })
  }

  const [blogMetadata, projectMetadata] = await Promise.all([getAllBlogMetadata(), getAllProjectMetadata()])

  const seoData = {
    pages: {
      blog: blogMetadata,
      projects: projectMetadata,
    },
    robots: {
      rss: 'https://hyperbliss.tech/api/rss',
      sitemap: 'https://hyperbliss.tech/sitemap.xml',
    },
    siteMetadata,
    socialLinks: SOCIAL_LINKS.map(({ href, label }) => ({ href, label })),
    techTags: Array.from(TECH_TAGS),
  }

  return NextResponse.json(seoData, {
    headers: {
      'Cache-Control': 'no-store', // Disable caching in development
      'Content-Type': 'application/json',
    },
  })
}
