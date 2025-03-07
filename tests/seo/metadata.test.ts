import { generateBlogMetadata, generateProjectMetadata } from "@/lib/generateMetadata";
import type { ResolvedMetadata } from "next";

describe("Metadata Generation", () => {
  // Create a properly typed mock that satisfies ResolvingMetadata
  const mockParent = () =>
    Promise.resolve({
      metadataBase: new URL("https://hyperbliss.tech"),
      title: {
        absolute: "Test Title",
        template: "%s | Test",
        default: "Test Title",
      },
      description: "Test Description",
      applicationName: "Hyperbliss",
      authors: [{ name: "Test Author", url: "https://hyperbliss.tech" }],
      generator: "Next.js",
      keywords: ["test"],
      referrer: "origin-when-cross-origin" as const,
      themeColor: [
        { color: "#000000", media: "(prefers-color-scheme: dark)" },
        { color: "#ffffff", media: "(prefers-color-scheme: light)" },
      ],
      colorScheme: "dark" as const,
      viewport: "width=device-width, initial-scale=1",
      creator: "Test Creator",
      publisher: "Test Publisher",
      robots: {
        basic: "index, follow",
        googleBot:
          "index, follow, max-video-preview: -1, max-image-preview: large, max-snippet: -1",
      },
      alternates: {
        canonical: { url: "https://hyperbliss.tech" },
        languages: {
          "en-US": [
            {
              url: "https://hyperbliss.tech",
              hrefLang: "en-US",
            },
          ],
        },
        media: {
          "only screen and (max-width: 600px)": [
            {
              url: "https://m.hyperbliss.tech",
              media: "only screen and (max-width: 600px)",
            },
          ],
        },
        types: {
          "application/rss+xml": [
            {
              url: "https://hyperbliss.tech/feed.xml",
              type: "application/rss+xml",
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
          default: "Test Title",
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
          default: "Test Title",
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
        statusBarStyle: "default" as const,
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
    }) as Promise<ResolvedMetadata>;

  describe("Blog Metadata", () => {
    const mockBlogFrontmatter = {
      title: "Test Blog Post",
      excerpt: "This is a test blog post",
      date: "2024-03-20",
      author: "Test Author",
      tags: ["test", "blog"],
    };

    it("should generate correct blog metadata", async () => {
      const metadata = await generateBlogMetadata(mockBlogFrontmatter, "test-post", mockParent());

      // Test only the fields we care about
      expect(metadata).toMatchObject({
        metadataBase: new URL("https://hyperbliss.tech"),
        title: "Test Blog Post",
        description: "This is a test blog post",
        authors: [{ name: "Test Author" }],
        keywords: ["test", "blog"],
      });

      // Test OpenGraph separately
      expect(metadata.openGraph).toMatchObject({
        type: "article",
        title: "Test Blog Post",
        description: "This is a test blog post",
        url: "https://hyperbliss.tech/blog/test-post",
        siteName: "Hyperbliss",
        locale: "en_US",
        publishedTime: "2024-03-20",
        authors: ["Test Author"],
        tags: ["test", "blog"],
      });

      // Test Twitter metadata separately
      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: "Test Blog Post",
        description: "This is a test blog post",
        creator: "@hyperb1iss",
        site: "@hyperb1iss",
      });
    });

    it("should use default author when not provided", async () => {
      const frontmatterWithoutAuthor = {
        ...mockBlogFrontmatter,
        author: undefined,
      };

      const metadata = await generateBlogMetadata(
        frontmatterWithoutAuthor,
        "test-post",
        mockParent()
      );

      expect(metadata.authors).toEqual([{ name: "Stefanie Jane" }]);
    });

    it("should include OpenGraph images", async () => {
      const metadata = await generateBlogMetadata(mockBlogFrontmatter, "test-post", mockParent());

      // Check if images exist and is an array
      expect(metadata.openGraph?.images).toBeDefined();
      const ogImages = metadata.openGraph?.images;
      expect(Array.isArray(ogImages)).toBe(true);

      // Type guard to ensure we're working with an array
      if (Array.isArray(ogImages)) {
        expect(ogImages[0]).toMatchObject({
          url: expect.stringContaining("hyperbliss.tech"),
          width: 1200,
          height: 630,
          alt: expect.any(String),
        });
      }

      // Check Twitter images
      const twitterImages = metadata.twitter?.images;
      expect(Array.isArray(twitterImages)).toBe(true);

      // Type guard for Twitter images
      if (Array.isArray(twitterImages)) {
        expect(twitterImages[0]).toMatchObject({
          url: expect.stringContaining("hyperbliss.tech"),
          alt: expect.any(String),
        });
      }
    });
  });

  describe("Project Metadata", () => {
    const mockProjectFrontmatter = {
      title: "Test Project",
      description: "This is a test project",
      github: "https://github.com/test/project",
      author: "Test Author",
      tags: ["test", "project"],
    };

    it("should generate correct project metadata", async () => {
      const metadata = await generateProjectMetadata(
        mockProjectFrontmatter,
        "test-project",
        mockParent()
      );

      expect(metadata).toMatchObject({
        metadataBase: new URL("https://hyperbliss.tech"),
        title: "Test Project",
        description: "This is a test project",
        authors: [{ name: "Test Author" }],
        keywords: ["test", "project"],
      });

      expect(metadata.openGraph).toMatchObject({
        type: "article",
        title: "Test Project",
        description: "This is a test project",
        url: "https://hyperbliss.tech/projects/test-project",
        siteName: "Hyperbliss",
        locale: "en_US",
        authors: ["Test Author"],
        tags: ["test", "project"],
      });

      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: "Test Project",
        description: "This is a test project",
        creator: "@hyperb1iss",
        site: "@hyperb1iss",
      });
    });

    it("should handle missing optional fields", async () => {
      const minimalFrontmatter = {
        title: "Minimal Project",
        description: "Minimal description",
        github: "https://github.com/test/minimal",
      };

      const metadata = await generateProjectMetadata(
        minimalFrontmatter,
        "minimal-project",
        mockParent()
      );

      expect(metadata.authors).toEqual([{ name: "Stefanie Jane" }]);
      expect(metadata.keywords).toBeUndefined();
    });
  });
});
