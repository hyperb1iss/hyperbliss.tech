// app/lib/generateMetadata.ts

import type { Metadata, ResolvingMetadata } from "next";
import type { Metadata as MetadataInterface } from "next/dist/lib/metadata/types/metadata-interface";

// Configuration values
const BASE_URL = "https://hyperbliss.tech";
const DEFAULT_AUTHOR = "Stefanie Jane";
const SITE_NAME = "Hyperbliss";
const DEFAULT_LOCALE = "en_US";
const TWITTER_HANDLE = "@hyperb1iss";

/**
 * Base interface for all frontmatter data
 */
interface BaseFrontmatter extends Record<string, unknown> {
  title: string;
  author?: string;
  tags?: string[];
}

/**
 * Interface for blog post frontmatter data
 */
export interface BlogFrontmatter extends BaseFrontmatter {
  date: string;
  excerpt: string;
}

/**
 * Interface for project frontmatter data
 */
export interface ProjectFrontmatter extends BaseFrontmatter {
  description: string;
  github: string;
}

/**
 * Safely gets the default author name
 */
function getDefaultAuthor(): string {
  return DEFAULT_AUTHOR;
}

/**
 * Creates OpenGraph metadata that's compatible with Next.js types
 */
function createOpenGraph(
  title: string,
  description: string,
  url: string,
  author: string,
  tags?: string[],
  publishedTime?: string
): NonNullable<MetadataInterface["openGraph"]> {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: DEFAULT_LOCALE,
    type: "article",
    ...(publishedTime && { publishedTime }),
    ...(author && { authors: [author] }),
    ...(tags && tags.length > 0 && { tags }),
  };
}

/**
 * Creates Twitter metadata that's compatible with Next.js types
 */
function createTwitter(
  title: string,
  description: string
): NonNullable<MetadataInterface["twitter"]> {
  return {
    card: "summary_large_image",
    title,
    description,
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  };
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
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousMetadata = await parent;
  const defaultAuthor = getDefaultAuthor();
  const url = `${BASE_URL}/blog/${slug}`;
  const author = frontmatter.author || defaultAuthor;

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: frontmatter.title,
    description: frontmatter.excerpt,
    authors: [{ name: author }],
    keywords: frontmatter.tags,
    openGraph: createOpenGraph(
      frontmatter.title,
      frontmatter.excerpt,
      url,
      author,
      frontmatter.tags,
      frontmatter.date
    ),
    twitter: createTwitter(frontmatter.title, frontmatter.excerpt),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return {
    ...previousMetadata,
    ...metadata,
  } as Metadata;
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
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousMetadata = await parent;
  const defaultAuthor = getDefaultAuthor();
  const url = `${BASE_URL}/projects/${slug}`;
  const author = frontmatter.author || defaultAuthor;

  const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: frontmatter.title,
    description: frontmatter.description,
    authors: [{ name: author }],
    keywords: frontmatter.tags,
    openGraph: createOpenGraph(
      frontmatter.title,
      frontmatter.description,
      url,
      author,
      frontmatter.tags
    ),
    twitter: createTwitter(frontmatter.title, frontmatter.description),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  return {
    ...previousMetadata,
    ...metadata,
  } as Metadata;
}
