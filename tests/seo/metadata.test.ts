import type { ResolvedMetadata } from 'next'
import { generateBlogMetadata, generateProjectMetadata } from '@/lib/generateMetadata'

describe('Metadata Generation', () => {
  // Create a properly typed mock that satisfies ResolvingMetadata
  const mockParent = () =>
    Promise.resolve({
      abstract: '',
      alternates: {
        canonical: { url: 'https://hyperbliss.tech' },
        languages: {
          'en-US': [
            {
              hrefLang: 'en-US',
              url: 'https://hyperbliss.tech',
            },
          ],
        },
        media: {
          'only screen and (max-width: 600px)': [
            {
              media: 'only screen and (max-width: 600px)',
              url: 'https://m.hyperbliss.tech',
            },
          ],
        },
        types: {
          'application/rss+xml': [
            {
              type: 'application/rss+xml',
              url: 'https://hyperbliss.tech/feed.xml',
            },
          ],
        },
      },
      appLinks: {},
      appleWebApp: {
        capable: true,
        startupImage: [],
        statusBarStyle: 'default' as const,
        title: undefined,
      },
      applicationName: 'Hyperbliss',
      archives: [],
      assets: [],
      authors: [{ name: 'Test Author', url: 'https://hyperbliss.tech' }],
      bookmarks: [],
      category: '',
      classification: '',
      colorScheme: 'dark' as const,
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
          default: 'Test Title',
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
      pinterest: null,
      publisher: 'Test Publisher',
      referrer: 'origin-when-cross-origin' as const,
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
        default: 'Test Title',
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
          default: 'Test Title',
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
    }) as Promise<ResolvedMetadata>

  describe('Blog Metadata', () => {
    const mockBlogFrontmatter = {
      author: 'Test Author',
      date: '2024-03-20',
      excerpt: 'This is a test blog post',
      tags: ['test', 'blog'],
      title: 'Test Blog Post',
    }

    it('should generate correct blog metadata', async () => {
      const metadata = await generateBlogMetadata(mockBlogFrontmatter, 'test-post', mockParent())

      // Test only the fields we care about
      expect(metadata).toMatchObject({
        authors: [{ name: 'Test Author' }],
        description: 'This is a test blog post',
        keywords: ['test', 'blog'],
        metadataBase: new URL('https://hyperbliss.tech'),
        title: 'Test Blog Post',
      })

      // Test OpenGraph separately
      expect(metadata.openGraph).toMatchObject({
        authors: ['Test Author'],
        description: 'This is a test blog post',
        locale: 'en_US',
        publishedTime: '2024-03-20',
        siteName: 'Hyperbliss',
        tags: ['test', 'blog'],
        title: 'Test Blog Post',
        type: 'article',
        url: 'https://hyperbliss.tech/blog/test-post/',
      })

      // Test Twitter metadata separately
      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        creator: '@hyperb1iss',
        description: 'This is a test blog post',
        site: '@hyperb1iss',
        title: 'Test Blog Post',
      })
    })

    it('should use default author when not provided', async () => {
      const frontmatterWithoutAuthor = {
        ...mockBlogFrontmatter,
        author: undefined,
      }

      const metadata = await generateBlogMetadata(frontmatterWithoutAuthor, 'test-post', mockParent())

      expect(metadata.authors).toEqual([{ name: 'Stefanie Jane' }])
    })

    it('should include OpenGraph images', async () => {
      const metadata = await generateBlogMetadata(mockBlogFrontmatter, 'test-post', mockParent())

      // Check if images exist and is an array
      expect(metadata.openGraph?.images).toBeDefined()
      const ogImages = metadata.openGraph?.images
      expect(Array.isArray(ogImages)).toBe(true)

      // Type guard to ensure we're working with an array
      if (Array.isArray(ogImages)) {
        expect(ogImages[0]).toMatchObject({
          alt: expect.any(String),
          height: 630,
          url: expect.stringContaining('hyperbliss.tech'),
          width: 1200,
        })
      }

      // Check Twitter images
      const twitterImages = metadata.twitter?.images
      expect(Array.isArray(twitterImages)).toBe(true)

      // Type guard for Twitter images
      if (Array.isArray(twitterImages)) {
        expect(twitterImages[0]).toMatchObject({
          alt: expect.any(String),
          url: expect.stringContaining('hyperbliss.tech'),
        })
      }
    })
  })

  describe('Project Metadata', () => {
    const mockProjectFrontmatter = {
      author: 'Test Author',
      description: 'This is a test project',
      github: 'https://github.com/test/project',
      tags: ['test', 'project'],
      title: 'Test Project',
    }

    it('should generate correct project metadata', async () => {
      const metadata = await generateProjectMetadata(mockProjectFrontmatter, 'test-project', mockParent())

      expect(metadata).toMatchObject({
        authors: [{ name: 'Test Author' }],
        description: 'This is a test project',
        keywords: ['test', 'project'],
        metadataBase: new URL('https://hyperbliss.tech'),
        title: 'Test Project',
      })

      expect(metadata.openGraph).toMatchObject({
        authors: ['Test Author'],
        description: 'This is a test project',
        locale: 'en_US',
        siteName: 'Hyperbliss',
        tags: ['test', 'project'],
        title: 'Test Project',
        type: 'article',
        url: 'https://hyperbliss.tech/projects/test-project/',
      })

      expect(metadata.twitter).toMatchObject({
        card: 'summary_large_image',
        creator: '@hyperb1iss',
        description: 'This is a test project',
        site: '@hyperb1iss',
        title: 'Test Project',
      })
    })

    it('should handle missing optional fields', async () => {
      const minimalFrontmatter = {
        description: 'Minimal description',
        github: 'https://github.com/test/minimal',
        title: 'Minimal Project',
      }

      const metadata = await generateProjectMetadata(minimalFrontmatter, 'minimal-project', mockParent())

      expect(metadata.authors).toEqual([{ name: 'Stefanie Jane' }])
      expect(metadata.keywords).toBeUndefined()
    })
  })
})
