// app/lib/generateMetadata.ts

import type { Metadata, ResolvingMetadata } from 'next'
import type { Metadata as MetadataInterface } from 'next/dist/lib/metadata/types/metadata-interface'
import { buildOgImageUrl, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from './ogImage'

// Configuration values
const BASE_URL = 'https://hyperbliss.tech'
const DEFAULT_AUTHOR = 'Stefanie Jane'
const SITE_NAME = 'Hyperbliss'
const DEFAULT_LOCALE = 'en_US'
const TWITTER_HANDLE = '@hyperb1iss'

/** Formats a frontmatter date for the card's meta pill, e.g. "July 22, 2026". */
function formatCardDate(date: string): string {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', { day: 'numeric', month: 'long', timeZone: 'UTC', year: 'numeric' })
}

/**
 * Ensures a URL ends with a trailing slash
 * @param {string} url - The URL to check and possibly modify
 * @returns {string} - URL with trailing slash
 */
function ensureTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

/**
 * Base interface for all frontmatter data
 */
interface BaseFrontmatter extends Record<string, unknown> {
  title: string
  author?: string
  tags?: string[]
}

/**
 * Interface for blog post frontmatter data
 */
export interface BlogFrontmatter extends BaseFrontmatter {
  date: string
  excerpt: string
}

/**
 * Interface for project frontmatter data
 */
export interface ProjectFrontmatter extends BaseFrontmatter {
  description: string
  github: string
}

/**
 * Safely gets the default author name
 */
function getDefaultAuthor(): string {
  return DEFAULT_AUTHOR
}

/**
 * Creates OpenGraph metadata that's compatible with Next.js types
 */
function createOpenGraph(
  title: string,
  description: string,
  url: string,
  author: string,
  imageUrl: string,
  type: 'article' | 'website',
  tags?: string[],
  publishedTime?: string,
): NonNullable<MetadataInterface['openGraph']> {
  return {
    description,
    images: [
      {
        alt: title,
        height: OG_IMAGE_HEIGHT,
        url: imageUrl,
        width: OG_IMAGE_WIDTH,
      },
    ],
    locale: DEFAULT_LOCALE,
    siteName: SITE_NAME,
    title,
    type,
    url: ensureTrailingSlash(url),
    ...(publishedTime && { publishedTime }),
    ...(author && { authors: [author] }),
    ...(tags && tags.length > 0 && { tags }),
  }
}

/**
 * Creates Twitter metadata that's compatible with Next.js types
 */
function createTwitter(
  title: string,
  description: string,
  imageUrl: string,
): NonNullable<MetadataInterface['twitter']> {
  return {
    card: 'summary_large_image',
    creator: TWITTER_HANDLE,
    description,
    images: [
      {
        alt: title,
        url: imageUrl,
      },
    ],
    site: TWITTER_HANDLE,
    title,
  }
}

/**
 * Generates metadata for blog posts
 * @param frontmatter - The frontmatter data from the blog post
 * @param slug - The URL slug for the blog post
 * @param parent - The parent metadata object
 * @returns Metadata object for the blog post
 */
export async function generateBlogMetadata(
  frontmatter: BlogFrontmatter,
  slug: string,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  const previousMetadata = parent ? await parent : {}
  const defaultAuthor = getDefaultAuthor()
  const url = `${BASE_URL}/blog/${slug}`
  const author = frontmatter.author || defaultAuthor
  const imageUrl = buildOgImageUrl({
    kind: 'blog',
    meta: formatCardDate(frontmatter.date),
    path: `cat blog/${slug}.md`,
    subtitle: frontmatter.excerpt,
    title: frontmatter.title,
  })

  const metadata: Metadata = {
    alternates: {
      canonical: ensureTrailingSlash(url),
    },
    authors: [{ name: author }],
    description: frontmatter.excerpt,
    keywords: frontmatter.tags,
    metadataBase: new URL(BASE_URL),
    openGraph: createOpenGraph(
      frontmatter.title,
      frontmatter.excerpt,
      url,
      author,
      imageUrl,
      'article',
      frontmatter.tags,
      frontmatter.date,
    ),
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
    },
    title: frontmatter.title,
    twitter: createTwitter(frontmatter.title, frontmatter.excerpt, imageUrl),
  }

  return {
    ...previousMetadata,
    ...metadata,
  } as Metadata
}

/**
 * Generates metadata for project pages
 * @param frontmatter - The frontmatter data from the project
 * @param slug - The URL slug for the project
 * @param parent - The parent metadata object
 * @returns Metadata object for the project
 */
export async function generateProjectMetadata(
  frontmatter: ProjectFrontmatter,
  slug: string,
  parent?: ResolvingMetadata,
): Promise<Metadata> {
  const previousMetadata = parent ? await parent : {}
  const defaultAuthor = getDefaultAuthor()
  const url = `${BASE_URL}/projects/${slug}`
  const author = frontmatter.author || defaultAuthor
  const imageUrl = buildOgImageUrl({
    kind: 'project',
    path: `hyperbliss projects --show ${slug}`,
    subtitle: frontmatter.description,
    title: frontmatter.title,
  })

  const metadata: Metadata = {
    alternates: {
      canonical: ensureTrailingSlash(url),
    },
    authors: [{ name: author }],
    description: frontmatter.description,
    keywords: frontmatter.tags,
    metadataBase: new URL(BASE_URL),
    openGraph: createOpenGraph(
      frontmatter.title,
      frontmatter.description,
      url,
      author,
      imageUrl,
      'website',
      frontmatter.tags,
    ),
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
      index: true,
    },
    title: frontmatter.title,
    twitter: createTwitter(frontmatter.title, frontmatter.description, imageUrl),
  }

  return {
    ...previousMetadata,
    ...metadata,
  } as Metadata
}
