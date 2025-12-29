import { defineConfig } from 'tinacms'

// Branch configuration for TinaCloud
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main'

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const TINA_CLIENT_ID = process.env.NEXT_PUBLIC_TINA_CLIENT_ID

export default defineConfig({
  branch,

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  clientId: TINA_CLIENT_ID ?? '',

  ui: {
    previewUrl: () => ({
      url: APP_BASE_URL,
    }),
  },

  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },

  // TinaCloud token for cloud mode
  token: process.env.TINA_TOKEN,

  schema: {
    collections: [
      // ═══════════════════════════════════════════════════════════════════════
      // BLOG POSTS COLLECTION
      // ═══════════════════════════════════════════════════════════════════════
      {
        name: 'posts',
        label: 'Blog Posts',
        path: 'content/posts',
        format: 'md',
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`,
        },
        fields: [
          {
            type: 'string',
            name: 'emoji',
            label: 'Emoji',
            description: 'Optional emoji displayed before the title',
          },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'datetime',
            name: 'date',
            label: 'Date',
          },
          {
            type: 'string',
            name: 'author',
            label: 'Author',
            ui: {
              component: 'text',
            },
          },
          {
            type: 'string',
            name: 'excerpt',
            label: 'Excerpt',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'image',
            name: 'coverImage',
            label: 'Cover Image',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PROJECTS COLLECTION
      // ═══════════════════════════════════════════════════════════════════════
      {
        name: 'projects',
        label: 'Projects',
        path: 'content/projects',
        format: 'md',
        ui: {
          router: ({ document }) => `/projects/${document._sys.filename}`,
        },
        fields: [
          {
            type: 'string',
            name: 'emoji',
            label: 'Emoji',
            description: 'Optional emoji displayed before the title',
          },
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            ui: {
              component: 'textarea',
            },
          },
          {
            type: 'string',
            name: 'github',
            label: 'GitHub URL',
          },
          {
            type: 'string',
            name: 'date',
            label: 'Date',
            description: 'Date in YYYY-MM-DD format',
          },
          {
            type: 'string',
            name: 'tags',
            label: 'Tags',
            list: true,
          },
          {
            type: 'string',
            name: 'category',
            label: 'Category',
          },
          {
            type: 'string',
            name: 'categories',
            label: 'Categories',
            list: true,
          },
          {
            type: 'string',
            name: 'status',
            label: 'Status',
            description: 'Project status (e.g., Active Development)',
          },
          {
            type: 'image',
            name: 'image',
            label: 'Image',
          },
          {
            type: 'image',
            name: 'coverImage',
            label: 'Cover Image',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // SITE CONFIG COLLECTION (Global Settings)
      // ═══════════════════════════════════════════════════════════════════════
      {
        name: 'siteConfig',
        label: 'Site Config',
        path: 'content/config',
        format: 'json',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          // SEO Settings
          {
            type: 'object',
            name: 'seo',
            label: 'SEO Settings',
            fields: [
              {
                type: 'string',
                name: 'siteTitle',
                label: 'Site Title',
                required: true,
              },
              {
                type: 'string',
                name: 'siteDescription',
                label: 'Site Description',
                required: true,
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'siteName',
                label: 'Site Name (for OG)',
                required: true,
              },
              {
                type: 'string',
                name: 'authorName',
                label: 'Author Name',
                required: true,
              },
              {
                type: 'string',
                name: 'twitterHandle',
                label: 'Twitter Handle',
              },
              {
                type: 'string',
                name: 'keywords',
                label: 'Keywords',
                list: true,
              },
              {
                type: 'image',
                name: 'ogImage',
                label: 'Default OG Image',
              },
            ],
          },

          // Navigation
          {
            type: 'object',
            name: 'navigation',
            label: 'Navigation',
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.label || 'Nav Item',
              }),
            },
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
              },
              {
                type: 'string',
                name: 'href',
                label: 'Link',
                required: true,
              },
            ],
          },

          // Social Links
          {
            type: 'object',
            name: 'socialLinks',
            label: 'Social Links',
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.label || 'Social Link',
              }),
            },
            fields: [
              {
                type: 'string',
                name: 'label',
                label: 'Label',
                required: true,
              },
              {
                type: 'string',
                name: 'href',
                label: 'URL',
                required: true,
              },
              {
                type: 'string',
                name: 'icon',
                label: 'Icon Name',
                description: 'React Icons name (e.g., FaGithub, FaLinkedin)',
              },
            ],
          },

          // Tech Tags (for hero animation)
          {
            type: 'string',
            name: 'techTags',
            label: 'Tech Tags',
            list: true,
            description: 'Technology tags displayed in the hero section animation',
          },

          // 404 Page Content
          {
            type: 'object',
            name: 'notFound',
            label: '404 Page',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Title',
              },
              {
                type: 'string',
                name: 'subtitle',
                label: 'Subtitle',
              },
              {
                type: 'string',
                name: 'description',
                label: 'Description',
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'messages',
                label: 'Random Messages',
                list: true,
                description: 'Array of random messages shown on 404 page',
              },
              {
                type: 'string',
                name: 'primaryButtonText',
                label: 'Primary Button Text',
              },
              {
                type: 'string',
                name: 'primaryButtonLink',
                label: 'Primary Button Link',
              },
              {
                type: 'string',
                name: 'secondaryButtonText',
                label: 'Secondary Button Text',
              },
              {
                type: 'string',
                name: 'secondaryButtonLink',
                label: 'Secondary Button Link',
              },
            ],
          },

          // Footer
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              {
                type: 'string',
                name: 'copyrightName',
                label: 'Copyright Name',
              },
            ],
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PAGES COLLECTION (About, Home, etc.)
      // ═══════════════════════════════════════════════════════════════════════
      {
        name: 'pages',
        label: 'Pages',
        path: 'content/pages',
        format: 'json',
        ui: {
          router: ({ document }) => {
            const slug = document._sys.filename
            if (slug === 'home') return '/'
            return `/${slug}/`
          },
        },
        fields: [
          {
            type: 'string',
            name: 'slug',
            label: 'Page Slug',
            isTitle: true,
            required: true,
          },
          {
            type: 'string',
            name: 'title',
            label: 'SEO Title',
            required: true,
          },
          {
            type: 'string',
            name: 'description',
            label: 'SEO Description',
            required: true,
            ui: { component: 'textarea' },
          },

          // Hero Section (for home page)
          {
            type: 'object',
            name: 'hero',
            label: 'Hero Section',
            fields: [
              {
                type: 'string',
                name: 'welcomeText',
                label: 'Welcome Text',
              },
              {
                type: 'string',
                name: 'name',
                label: 'Name',
              },
              {
                type: 'string',
                name: 'subtitle',
                label: 'Subtitle',
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'primaryCtaText',
                label: 'Primary CTA Text',
              },
              {
                type: 'string',
                name: 'primaryCtaLink',
                label: 'Primary CTA Link',
              },
              {
                type: 'string',
                name: 'secondaryCtaText',
                label: 'Secondary CTA Text',
              },
              {
                type: 'string',
                name: 'secondaryCtaLink',
                label: 'Secondary CTA Link',
              },
              {
                type: 'string',
                name: 'scrollText',
                label: 'Scroll Indicator Text',
              },
            ],
          },

          // About Section (for about page)
          {
            type: 'object',
            name: 'about',
            label: 'About Section',
            fields: [
              {
                type: 'image',
                name: 'profileImage',
                label: 'Profile Image',
              },
              {
                type: 'string',
                name: 'profileImageAlt',
                label: 'Profile Image Alt Text',
              },
              {
                type: 'rich-text',
                name: 'bio',
                label: 'Biography',
              },
              {
                type: 'object',
                name: 'contactReasons',
                label: 'Contact Reasons',
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.title || 'Contact Reason',
                  }),
                },
                fields: [
                  {
                    type: 'string',
                    name: 'title',
                    label: 'Title',
                    required: true,
                  },
                  {
                    type: 'string',
                    name: 'description',
                    label: 'Description',
                    required: true,
                    ui: { component: 'textarea' },
                  },
                ],
              },
            ],
          },

          // Featured Projects Section
          {
            type: 'object',
            name: 'featuredProjects',
            label: 'Featured Projects Section',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Section Title',
              },
              {
                type: 'string',
                name: 'subtitle',
                label: 'Section Subtitle',
                ui: { component: 'textarea' },
              },
              {
                type: 'string',
                name: 'ctaText',
                label: 'Card CTA Text',
              },
            ],
          },

          // Latest Posts Section
          {
            type: 'object',
            name: 'latestPosts',
            label: 'Latest Posts Section',
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Section Title',
              },
              {
                type: 'string',
                name: 'emptyStateText',
                label: 'Empty State Text',
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },
    ],
  },
})
