import { ResolvedMetadata } from 'next'
import { NextResponse } from 'next/server'
import { TECH_TAGS } from '@/lib/constants'
import {
  BlogFrontmatter,
  generateBlogMetadata,
  generateProjectMetadata,
  ProjectFrontmatter,
} from '@/lib/generateMetadata'
import { getAllMarkdownSlugs, getMarkdownContent } from '@/lib/markdown'
import siteMetadata from '@/lib/metadata'
import { SOCIAL_LINKS } from '@/lib/socials'

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Creates a minimal resolved metadata object for parent resolution
 * Based on the test mock structure
 */
const createMinimalMetadata = (): ResolvedMetadata => ({
  abstract: '',
  alternates: {
    canonical: { url: 'https://hyperbliss.tech' },
    languages: {
      'en-US': [
        {
          url: 'https://hyperbliss.tech',
        },
      ],
    },
    media: {
      'only screen and (max-width: 600px)': [
        {
          url: 'https://m.hyperbliss.tech',
        },
      ],
    },
    types: {
      'application/rss+xml': [
        {
          url: 'https://hyperbliss.tech/feed.xml',
        },
      ],
    },
  },
  appLinks: {},
  appleWebApp: {
    capable: true,
    startupImage: [],
    statusBarStyle: 'default',
    title: undefined,
  },
  applicationName: 'Hyperbliss',
  archives: [],
  assets: [],
  authors: [{ name: 'Test Author', url: 'https://hyperbliss.tech' }],
  bookmarks: [],
  category: '',
  classification: '',
  colorScheme: 'dark',
  creator: 'Test Creator',
  description: 'Test Description',
  facebook: {},
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: true,
    url: false,
  },
  generator: 'Next.js',
  icons: {
    apple: [{ url: '/apple-touch-icon.png' }],
    icon: [{ url: '/favicon.ico' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
    shortcut: [{ url: '/favicon-16x16.png' }],
  },
  itunes: {
    appArgument: 'myapp://123',
    appId: 'myApp123',
  },
  keywords: ['test'],
  manifest: '/manifest.json',
  metadataBase: new URL('https://hyperbliss.tech'),
  openGraph: {
    audio: [],
    countryName: 'United States',
    description: 'Test Description',
    determiner: 'auto',
    emails: ['contact@hyperbliss.tech'],
    faxNumbers: [],
    images: [],
    locale: 'en_US',
    phoneNumbers: [],
    siteName: 'Hyperbliss',
    title: {
      absolute: 'Test Title',
      template: '%s | Test',
    },
    ttl: 0,
    type: 'website',
    url: 'https://hyperbliss.tech',
    videos: [],
  },
  other: {},
  pagination: {
    next: null,
    previous: null,
  },
  pinterest: {
    richPin: 'true',
  },
  publisher: 'Test Publisher',
  referrer: 'origin-when-cross-origin',
  robots: {
    basic: 'index, follow',
    googleBot: 'index, follow, max-video-preview: -1, max-image-preview: large, max-snippet: -1',
  },
  themeColor: [
    { color: '#000000', media: '(prefers-color-scheme: dark)' },
    { color: '#ffffff', media: '(prefers-color-scheme: light)' },
  ],
  title: {
    absolute: 'Test Title',
    template: '%s | Test',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@hyperb1iss',
    creatorId: '1234567890',
    description: 'Test Description',
    images: [
      {
        alt: 'Test Title',
        height: 630,
        url: 'https://hyperbliss.tech/og-image.jpg',
        width: 1200,
      },
    ],
    site: '@hyperb1iss',
    siteId: '1234567890',
    title: {
      absolute: 'Test Title',
      template: '%s | Test',
    },
  },
  verification: {
    google: null,
    me: null,
    other: {},
    yahoo: null,
    yandex: null,
  },
  viewport: 'width=device-width, initial-scale=1',
})

/**
 * Fetches metadata for all blog posts
 */
async function getAllBlogMetadata() {
  const slugs = await getAllMarkdownSlugs('src/posts')
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<BlogFrontmatter>('src/posts', slug)
      const metadata = await generateBlogMetadata(frontmatter, slug, Promise.resolve(createMinimalMetadata()))
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
  const slugs = await getAllMarkdownSlugs('src/projects')
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<ProjectFrontmatter>('src/projects', slug)
      const metadata = await generateProjectMetadata(frontmatter, slug, Promise.resolve(createMinimalMetadata()))
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
