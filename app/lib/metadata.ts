// app/metadata.ts
import { Metadata } from "next";

const siteMetadata: Metadata = {
  title: {
    default: "Hyperbliss | Stefanie Jane",
    template: "%s | Hyperbliss",
  },
  description:
    "The personal website of Stefanie Jane—developer, designer, and tech enthusiast.",
  keywords: [
    "Stefanie Jane",
    "hyperb1iss",
    "hyperbliss",
    "web development",
    "design",
    "technology",
    "blog",
  ],
  authors: [{ name: "Stefanie Jane" }],
  creator: "Stefanie Jane",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a14" },
  ],
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
