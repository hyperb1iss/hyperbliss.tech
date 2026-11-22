// The home route: the front page as crawlable server-rendered HTML. The
// pull-down terminal is mounted by the (transition) layout on every route.
// Keep this a server component so the content corpus never becomes hydration
// payload.

import { SITE_DESCRIPTION } from '@/lib/company'
import type { FrontSection, PostSummary, ProjectSummary } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import type { ProjectEntry } from '@/lib/projectLanes'
import FrontPage from './front/FrontPage'
import HomeFallbackContent from './HomeFallback'

interface TerminalHomeProps {
  posts: PostSummary[]
  projects: ProjectSummary[]
  lead: FeedItem | null
  items: FeedItem[]
  featured: ProjectEntry[]
  front: FrontSection | null
}

const DEFAULT_SUMMARY = 'An independent software company in Seattle. Open source at the core.'

export default function TerminalHome({ posts, projects, lead, items, featured, front }: TerminalHomeProps) {
  return (
    <>
      <FrontPage featured={featured} front={front} items={items} lead={lead} />

      <noscript>
        <HomeFallbackContent
          aboutSummary={front?.bio ?? DEFAULT_SUMMARY}
          aboutTitle="Hyperbliss Technologies"
          posts={posts.map((p) => ({ slug: p.slug, title: p.displayTitle }))}
          projects={projects.map((p) => ({ description: p.description, slug: p.slug, title: p.displayTitle }))}
          siteDescription={SITE_DESCRIPTION}
        />
      </noscript>
    </>
  )
}
