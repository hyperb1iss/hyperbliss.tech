// app/lib/metadata.ts
import { Metadata } from 'next'
import { TECH_TAGS } from './constants'

// Constants for site metadata
const AUTHOR_NAME = 'Stefanie Jane'
const BASE_URL = 'https://hyperbliss.tech'
const SITE_TITLE = '@hyperb1iss | Stefanie Jane'
const SITE_DESCRIPTION = 'The personal website of Stefanie Jane—developer, designer, and tech enthusiast.'
const SITE_NAME = '🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹'
const OG_LOCALE = 'en_US'

// Add new constants for images
const DEFAULT_OG_IMAGE = {
  alt: SITE_DESCRIPTION,
  height: 630,
  url: `${BASE_URL}/images/og-default.jpg`,
  width: 1200,
}

/**
 * Site metadata configuration object
 * Contains all the necessary metadata for SEO and social sharing
 */
const siteMetadata: Metadata = {
  alternates: {
    canonical: `${BASE_URL}/`,
    languages: {
      'en-US': `${BASE_URL}/`,
    },
    types: {
      'application/rss+xml': `${BASE_URL}/api/rss`,
    },
  },
  authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
  category: 'technology',
  creator: AUTHOR_NAME,
  description: SITE_DESCRIPTION,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  icons: {
    apple: [{ sizes: '180x180', type: 'image/png', url: '/apple-touch-icon.png' }],
    icon: [
      { url: '/favicon.ico' },
      { sizes: '16x16', type: 'image/png', url: '/favicon-16x16.png' },
      { sizes: '32x32', type: 'image/png', url: '/favicon-32x32.png' },
    ],
    other: [{ color: '#5bbad5', rel: 'mask-icon', url: '/safari-pinned-tab.svg' }],
  },
  keywords: [
    AUTHOR_NAME,
    'Stefanie Jane Kondik',
    'Stefanie Jane',
    'Stefanie Kondik',
    'hyperb1iss',
    'hyperbliss',
    'Stefanie Jane developer',
    'Stefanie Jane portfolio',
    'open source developer',
    'creative technologist',
    'AI engineering',
    'agentic AI',
    'Seattle',
    'cyanogen',
    'cyanogenmod',
    'android',
    'android developer',
    'futuristic web design',
    'full stack engineer portfolio',
    'tech blog',
    'open source projects',
    'indie dev blog',
    ...Array.from(TECH_TAGS),
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    locale: OG_LOCALE,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    type: 'website',
    url: `${BASE_URL}/`,
  },
  publisher: AUTHOR_NAME,
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      noimageindex: false,
    },
    index: true,
    nocache: false,
  },
  title: {
    default: SITE_TITLE,
    template: '%s | Hyperbliss',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@hyperb1iss',
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    site: '@hyperb1iss',
    title: SITE_TITLE,
  },
}

export default siteMetadata
