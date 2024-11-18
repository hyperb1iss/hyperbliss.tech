// app/lib/metadata.ts
import { Metadata } from "next";
import { TECH_TAGS } from "./constants";

// Constants for site metadata
const AUTHOR_NAME = "Stefanie Jane";
const BASE_URL = "https://hyperbliss.tech";
const SITE_TITLE = "@hyperb1iss | Stefanie Jane";
const SITE_DESCRIPTION =
  "The personal website of Stefanie Jane—developer, designer, and tech enthusiast.";
const SITE_NAME = "🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹";
const OG_LOCALE = "en_US";

// Add new constants for images
const DEFAULT_OG_IMAGE = {
  url: `${BASE_URL}/images/og-default.jpg`,
  width: 1200,
  height: 630,
  alt: SITE_DESCRIPTION,
};

/**
 * Site metadata configuration object
 * Contains all the necessary metadata for SEO and social sharing
 */
const siteMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Hyperbliss",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    "hyperb1iss",
    "hyperbliss",
    "web development",
    "design",
    "technology",
    "blog",
    ...Array.from(TECH_TAGS),
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  openGraph: {
    type: "website",
    locale: OG_LOCALE,
    url: `${BASE_URL}/`,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hyperb1iss",
    creator: "@hyperb1iss",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default siteMetadata;
