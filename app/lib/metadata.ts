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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }],
  },
  manifest: "/site.webmanifest",
  title: {
    default: SITE_TITLE,
    template: "%s | Hyperbliss",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    AUTHOR_NAME,
    "Stefanie Jane Kondik",
    "Stefanie Jane",
    "Stefanie Kondik",
    "hyperb1iss",
    "hyperbliss",
    "Stefanie Jane developer",
    "Stefanie Jane portfolio",
    "open source developer",
    "creative technologist",
    "AI engineering",
    "agentic AI",
    "Seattle",
    "cyanogen",
    "cyanogenmod",
    "android",
    "android developer",
    "futuristic web design",
    "full stack engineer portfolio",
    "tech blog",
    "open source projects",
    "indie dev blog",
    ...Array.from(TECH_TAGS),
  ],
  authors: [{ name: AUTHOR_NAME, url: BASE_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: "@hyperb1iss",
    creator: "@hyperb1iss",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: `${BASE_URL}/`,
    languages: {
      "en-US": `${BASE_URL}/`,
    },
    types: {
      "application/rss+xml": `${BASE_URL}/api/rss`,
    },
  },
  category: "technology",
};

export default siteMetadata;
