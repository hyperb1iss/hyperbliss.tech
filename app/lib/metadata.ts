// app/lib/metadata.ts
import { Metadata } from "next";

const AUTHOR_NAME = "Stefanie Jane";
const BASE_URL = "https://hyperbliss.tech";
const SITE_TITLE = "Hyperbliss | Stefanie Jane";
const SITE_DESCRIPTION =
  "The personal website of Stefanie Jane—developer, designer, and tech enthusiast.";
const SITE_NAME = "🌠 𝓱 𝔂 𝓹 𝓮 𝓻 𝓫 𝟏 𝓲 𝓼 𝓼 ✨ ⎊ ⨳ ✵ ⊹";
const OG_LOCALE = "en_US";

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
  manifest: "/site.webmanifest",
};

export default siteMetadata;
