import { defineConfig } from 'tinacms'

// Branch configuration for TinaCloud
const branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || 'main'

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID

export default defineConfig({
  branch,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  clientId: TINA_CLIENT_ID ?? '',

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  schema: {
    collections: [
      // ═══════════════════════════════════════════════════════════════════════
      // BLOG POSTS COLLECTION
      // ═══════════════════════════════════════════════════════════════════════
      {
        fields: [
          {
            description: 'Optional emoji displayed before the title',
            label: 'Emoji',
            name: 'emoji',
            type: 'string',
          },
          {
            isTitle: true,
            label: 'Title',
            name: 'title',
            required: true,
            type: 'string',
          },
          {
            label: 'Date',
            name: 'date',
            type: 'datetime',
          },
          {
            label: 'Author',
            name: 'author',
            type: 'string',
            ui: {
              component: 'text',
            },
          },
          {
            label: 'Excerpt',
            name: 'excerpt',
            type: 'string',
            ui: {
              component: 'textarea',
            },
          },
          {
            label: 'Tags',
            list: true,
            name: 'tags',
            type: 'string',
          },
          {
            label: 'Cover Image',
            name: 'coverImage',
            type: 'image',
          },
          {
            isBody: true,
            label: 'Body',
            name: 'body',
            type: 'rich-text',
          },
        ],
        format: 'md',
        label: 'Blog Posts',
        name: 'posts',
        path: 'content/posts',
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`,
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PROJECTS COLLECTION
      // ═══════════════════════════════════════════════════════════════════════
      {
        fields: [
          {
            description: 'Optional emoji displayed before the title',
            label: 'Emoji',
            name: 'emoji',
            type: 'string',
          },
          {
            isTitle: true,
            label: 'Title',
            name: 'title',
            required: true,
            type: 'string',
          },
          {
            label: 'Description',
            name: 'description',
            type: 'string',
            ui: {
              component: 'textarea',
            },
          },
          {
            label: 'GitHub URL',
            name: 'github',
            type: 'string',
          },
          {
            description: 'Date in YYYY-MM-DD format',
            label: 'Date',
            name: 'date',
            type: 'string',
          },
          {
            label: 'Tags',
            list: true,
            name: 'tags',
            type: 'string',
          },
          {
            label: 'Category',
            name: 'category',
            type: 'string',
          },
          {
            label: 'Categories',
            list: true,
            name: 'categories',
            type: 'string',
          },
          {
            description: 'Project status (e.g., Active Development)',
            label: 'Status',
            name: 'status',
            type: 'string',
          },
          {
            label: 'Image',
            name: 'image',
            type: 'image',
          },
          {
            label: 'Cover Image',
            name: 'coverImage',
            type: 'image',
          },
          {
            isBody: true,
            label: 'Body',
            name: 'body',
            type: 'rich-text',
          },
        ],
        format: 'md',
        label: 'Projects',
        name: 'projects',
        path: 'content/projects',
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // SITE CONFIG COLLECTION (Global Settings)
      // ═══════════════════════════════════════════════════════════════════════
      {
        fields: [
          // SEO Settings
          {
            fields: [
              {
                label: 'Site Title',
                name: 'siteTitle',
                required: true,
                type: 'string',
              },
              {
                label: 'Site Description',
                name: 'siteDescription',
                required: true,
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                label: 'Site Name (for OG)',
                name: 'siteName',
                required: true,
                type: 'string',
              },
              {
                label: 'Author Name',
                name: 'authorName',
                required: true,
                type: 'string',
              },
              {
                label: 'Twitter Handle',
                name: 'twitterHandle',
                type: 'string',
              },
              {
                label: 'Keywords',
                list: true,
                name: 'keywords',
                type: 'string',
              },
              {
                label: 'Default OG Image',
                name: 'ogImage',
                type: 'image',
              },
            ],
            label: 'SEO Settings',
            name: 'seo',
            type: 'object',
          },

          // Navigation
          {
            fields: [
              {
                label: 'Label',
                name: 'label',
                required: true,
                type: 'string',
              },
              {
                label: 'Link',
                name: 'href',
                required: true,
                type: 'string',
              },
            ],
            label: 'Navigation',
            list: true,
            name: 'navigation',
            type: 'object',
            ui: {
              itemProps: (item) => ({
                label: item?.label || 'Nav Item',
              }),
            },
          },

          // Social Links
          {
            fields: [
              {
                label: 'Label',
                name: 'label',
                required: true,
                type: 'string',
              },
              {
                label: 'URL',
                name: 'href',
                required: true,
                type: 'string',
              },
              {
                description: 'React Icons name (e.g., FaGithub, FaLinkedin)',
                label: 'Icon Name',
                name: 'icon',
                type: 'string',
              },
            ],
            label: 'Social Links',
            list: true,
            name: 'socialLinks',
            type: 'object',
            ui: {
              itemProps: (item) => ({
                label: item?.label || 'Social Link',
              }),
            },
          },

          // Tech Tags (for hero animation)
          {
            description: 'Technology tags displayed in the hero section animation',
            label: 'Tech Tags',
            list: true,
            name: 'techTags',
            type: 'string',
          },

          // 404 Page Content
          {
            fields: [
              {
                label: 'Title',
                name: 'title',
                type: 'string',
              },
              {
                label: 'Subtitle',
                name: 'subtitle',
                type: 'string',
              },
              {
                label: 'Description',
                name: 'description',
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                description: 'Array of random messages shown on 404 page',
                label: 'Random Messages',
                list: true,
                name: 'messages',
                type: 'string',
              },
              {
                label: 'Primary Button Text',
                name: 'primaryButtonText',
                type: 'string',
              },
              {
                label: 'Primary Button Link',
                name: 'primaryButtonLink',
                type: 'string',
              },
              {
                label: 'Secondary Button Text',
                name: 'secondaryButtonText',
                type: 'string',
              },
              {
                label: 'Secondary Button Link',
                name: 'secondaryButtonLink',
                type: 'string',
              },
            ],
            label: '404 Page',
            name: 'notFound',
            type: 'object',
          },

          // Footer
          {
            fields: [
              {
                label: 'Brand Text',
                name: 'brandText',
                type: 'string',
              },
              {
                label: 'Copyright Name',
                name: 'copyrightName',
                type: 'string',
              },
              {
                description: 'Override the dynamic year (e.g., 2026)',
                label: 'Copyright Year',
                name: 'copyrightYear',
                type: 'number',
              },
              {
                label: 'Made With Text',
                name: 'madeWithText',
                type: 'string',
              },
            ],
            label: 'Footer',
            name: 'footer',
            type: 'object',
          },
        ],
        format: 'json',
        label: 'Site Config',
        name: 'siteConfig',
        path: 'content/config',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // RESUME COLLECTION (Markdown-based resume)
      // ═══════════════════════════════════════════════════════════════════════
      {
        fields: [
          {
            isTitle: true,
            label: 'Title',
            name: 'title',
            required: true,
            type: 'string',
          },
          {
            label: 'SEO Description',
            name: 'description',
            type: 'string',
            ui: { component: 'textarea' },
          },
          {
            isBody: true,
            label: 'Content',
            name: 'body',
            type: 'rich-text',
          },
        ],
        format: 'md',
        label: 'Resume',
        name: 'resume',
        path: 'content/resume',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          router: () => '/resume/',
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PAGES COLLECTION (About, Home, etc.)
      // ═══════════════════════════════════════════════════════════════════════
      {
        fields: [
          {
            isTitle: true,
            label: 'Page Slug',
            name: 'slug',
            required: true,
            type: 'string',
          },
          {
            label: 'SEO Title',
            name: 'title',
            required: true,
            type: 'string',
          },
          {
            label: 'SEO Description',
            name: 'description',
            required: true,
            type: 'string',
            ui: { component: 'textarea' },
          },

          // Hero Section (for home page)
          {
            fields: [
              {
                label: 'Welcome Text',
                name: 'welcomeText',
                type: 'string',
              },
              {
                label: 'Name',
                name: 'name',
                type: 'string',
              },
              {
                label: 'Subtitle',
                name: 'subtitle',
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                label: 'Primary CTA Text',
                name: 'primaryCtaText',
                type: 'string',
              },
              {
                label: 'Primary CTA Link',
                name: 'primaryCtaLink',
                type: 'string',
              },
              {
                label: 'Secondary CTA Text',
                name: 'secondaryCtaText',
                type: 'string',
              },
              {
                label: 'Secondary CTA Link',
                name: 'secondaryCtaLink',
                type: 'string',
              },
              {
                label: 'Scroll Indicator Text',
                name: 'scrollText',
                type: 'string',
              },
            ],
            label: 'Hero Section',
            name: 'hero',
            type: 'object',
          },

          // About Section (for about page)
          {
            fields: [
              {
                label: 'Profile Image',
                name: 'profileImage',
                type: 'image',
              },
              {
                label: 'Profile Image Alt Text',
                name: 'profileImageAlt',
                type: 'string',
              },
              // Intro section with special formatting
              {
                fields: [
                  {
                    description: 'e.g., "Hey there!"',
                    label: 'Greeting',
                    name: 'greeting',
                    type: 'string',
                  },
                  {
                    description: 'Rendered with sparkle effect',
                    label: 'Name',
                    name: 'name',
                    type: 'string',
                  },
                  {
                    description: 'Rendered with gradient effect, e.g., "the last 25+ years"',
                    label: 'Highlight Text',
                    name: 'highlightText',
                    type: 'string',
                  },
                  {
                    description: 'Text after the highlight',
                    label: 'Intro Text',
                    name: 'introText',
                    type: 'string',
                    ui: { component: 'textarea' },
                  },
                ],
                label: 'Intro',
                name: 'intro',
                type: 'object',
              },
              {
                description: 'Main bio content in markdown format',
                label: 'Biography',
                name: 'bio',
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                description: 'Text before contact reasons',
                label: 'Contact Section Intro',
                name: 'contactIntro',
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                fields: [
                  {
                    label: 'Title',
                    name: 'title',
                    required: true,
                    type: 'string',
                  },
                  {
                    label: 'Description',
                    name: 'description',
                    required: true,
                    type: 'string',
                    ui: { component: 'textarea' },
                  },
                ],
                label: 'Contact Reasons',
                list: true,
                name: 'contactReasons',
                type: 'object',
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || 'Contact Reason',
                  }),
                },
              },
            ],
            label: 'About Section',
            name: 'about',
            type: 'object',
          },

          // Featured Projects Section
          {
            fields: [
              {
                label: 'Section Title',
                name: 'title',
                type: 'string',
              },
              {
                label: 'Section Subtitle',
                name: 'subtitle',
                type: 'string',
                ui: { component: 'textarea' },
              },
              {
                label: 'Card CTA Text',
                name: 'ctaText',
                type: 'string',
              },
            ],
            label: 'Featured Projects Section',
            name: 'featuredProjects',
            type: 'object',
          },

          // Latest Posts Section
          {
            fields: [
              {
                label: 'Section Title',
                name: 'title',
                type: 'string',
              },
              {
                label: 'Empty State Text',
                name: 'emptyStateText',
                type: 'string',
                ui: { component: 'textarea' },
              },
            ],
            label: 'Latest Posts Section',
            name: 'latestPosts',
            type: 'object',
          },
        ],
        format: 'json',
        label: 'Pages',
        name: 'pages',
        path: 'content/pages',
        ui: {
          router: ({ document }) => {
            const slug = document._sys.filename
            if (slug === 'home') return '/'
            return `/${slug}/`
          },
        },
      },
    ],
  },

  // TinaCloud token for cloud mode
  token: process.env.TINA_TOKEN,

  ui: {
    previewUrl: () => ({
      url: APP_BASE_URL,
    }),
  },
})
