import { TECH_TAGS } from "@/lib/constants";
import {
  BlogFrontmatter,
  generateBlogMetadata,
  generateProjectMetadata,
  ProjectFrontmatter,
} from "@/lib/generateMetadata";
import { getAllMarkdownSlugs, getMarkdownContent } from "@/lib/markdown";
import siteMetadata from "@/lib/metadata";
import { SOCIAL_LINKS } from "@/lib/socials";
import { ResolvedMetadata } from "next";
import { NextResponse } from "next/server";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Creates a minimal resolved metadata object for parent resolution
 * Based on the test mock structure
 */
const createMinimalMetadata = (): ResolvedMetadata => ({
  metadataBase: new URL("https://hyperbliss.tech"),
  title: {
    absolute: "Test Title",
    template: "%s | Test",
  },
  description: "Test Description",
  applicationName: "Hyperbliss",
  authors: [{ name: "Test Author", url: "https://hyperbliss.tech" }],
  generator: "Next.js",
  keywords: ["test"],
  referrer: "origin-when-cross-origin",
  themeColor: [
    { color: "#000000", media: "(prefers-color-scheme: dark)" },
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
  ],
  colorScheme: "dark",
  viewport: "width=device-width, initial-scale=1",
  creator: "Test Creator",
  publisher: "Test Publisher",
  robots: {
    basic: "index, follow",
    googleBot: "index, follow, max-video-preview: -1, max-image-preview: large, max-snippet: -1",
  },
  alternates: {
    canonical: { url: "https://hyperbliss.tech" },
    languages: {
      "en-US": [
        {
          url: "https://hyperbliss.tech",
        },
      ],
    },
    media: {
      "only screen and (max-width: 600px)": [
        {
          url: "https://m.hyperbliss.tech",
        },
      ],
    },
    types: {
      "application/rss+xml": [
        {
          url: "https://hyperbliss.tech/feed.xml",
        },
      ],
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: [{ url: "/favicon-16x16.png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  openGraph: {
    type: "website",
    determiner: "auto",
    title: {
      absolute: "Test Title",
      template: "%s | Test",
    },
    description: "Test Description",
    siteName: "Hyperbliss",
    locale: "en_US",
    url: "https://hyperbliss.tech",
    countryName: "United States",
    emails: ["contact@hyperbliss.tech"],
    phoneNumbers: [],
    faxNumbers: [],
    images: [],
    audio: [],
    videos: [],
    ttl: 0,
  },
  twitter: {
    card: "summary_large_image",
    site: "@hyperb1iss",
    siteId: "1234567890",
    creator: "@hyperb1iss",
    creatorId: "1234567890",
    title: {
      absolute: "Test Title",
      template: "%s | Test",
    },
    description: "Test Description",
    images: [
      {
        url: "https://hyperbliss.tech/og-image.jpg",
        alt: "Test Title",
        width: 1200,
        height: 630,
      },
    ],
  },
  verification: {
    google: null,
    yahoo: null,
    yandex: null,
    me: null,
    other: {},
  },
  appleWebApp: {
    capable: true,
    title: undefined,
    startupImage: [],
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  abstract: "",
  archives: [],
  assets: [],
  bookmarks: [],
  category: "",
  classification: "",
  other: {},
  itunes: {
    appId: "myApp123",
    appArgument: "myapp://123",
  },
  manifest: "/manifest.json",
  appLinks: {},
  facebook: {},
});

/**
 * Fetches metadata for all blog posts
 */
async function getAllBlogMetadata() {
  const slugs = await getAllMarkdownSlugs("src/posts");
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<BlogFrontmatter>("src/posts", slug);
      const metadata = await generateBlogMetadata(
        frontmatter,
        slug,
        Promise.resolve(createMinimalMetadata())
      );
      return {
        slug,
        metadata,
      };
    })
  );
}

/**
 * Fetches metadata for all project pages
 */
async function getAllProjectMetadata() {
  const slugs = await getAllMarkdownSlugs("src/projects");
  return Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter } = await getMarkdownContent<ProjectFrontmatter>("src/projects", slug);
      const metadata = await generateProjectMetadata(
        frontmatter,
        slug,
        Promise.resolve(createMinimalMetadata())
      );
      return {
        slug,
        metadata,
      };
    })
  );
}

/**
 * GET handler for /api/seo endpoint
 * Returns a comprehensive overview of the site's SEO configuration
 * Only available in development mode
 */
export async function GET() {
  // Return 404 if not in development mode
  if (!isDevelopment) {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 404 }
    );
  }

  const [blogMetadata, projectMetadata] = await Promise.all([
    getAllBlogMetadata(),
    getAllProjectMetadata(),
  ]);

  const seoData = {
    siteMetadata,
    techTags: Array.from(TECH_TAGS),
    socialLinks: SOCIAL_LINKS.map(({ href, label }) => ({ href, label })),
    pages: {
      blog: blogMetadata,
      projects: projectMetadata,
    },
    robots: {
      sitemap: "https://hyperbliss.tech/sitemap.xml",
      rss: "https://hyperbliss.tech/api/rss",
    },
  };

  return NextResponse.json(seoData, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store", // Disable caching in development
    },
  });
}
