// The home route: the front page as crawlable server-rendered HTML, with the
// terminal layered on top as a summonable pull-down console. Keep this a server
// component so the content corpus never becomes hydration payload.

import type { FrontSection, NowData, PostSummary, ProjectSummary, SiteConfig } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import type { Broadcast, Manifest } from '@/lib/terminal/types'
import FrontPage from './front/FrontPage'
import type { ShippingRow } from './front/Rail'
import HomeFallbackContent from './HomeFallback'
import TerminalConsole from './terminal/TerminalConsole'

interface TerminalHomeProps {
  manifest: Manifest
  broadcast: Broadcast
  posts: PostSummary[]
  projects: ProjectSummary[]
  lead: FeedItem | null
  items: FeedItem[]
  shipping: ShippingRow[]
  now: NowData
  front: FrontSection | null
  siteConfig?: SiteConfig | null
}

const DEFAULT_TAGLINE =
  'I build software that gives people control over their technology. Open source all the way down.'

export default function TerminalHome({
  manifest,
  broadcast,
  posts,
  projects,
  lead,
  items,
  shipping,
  now,
  front,
  siteConfig,
}: TerminalHomeProps) {
  return (
    <>
      {/* Portaled pull-down console; defaults closed. */}
      <TerminalConsole broadcast={broadcast} manifest={manifest} />

      <FrontPage front={front} items={items} lead={lead} now={now} projectCount={projects.length} shipping={shipping} />

      <noscript>
        <HomeFallbackContent
          aboutSummary={front?.bio ?? DEFAULT_TAGLINE}
          aboutTitle="Stefanie Jane"
          posts={posts.map((p) => ({ slug: p.slug, title: p.displayTitle }))}
          projects={projects.map((p) => ({ description: p.description, slug: p.slug, title: p.displayTitle }))}
          siteDescription={siteConfig?.seo?.siteDescription}
        />
      </noscript>
    </>
  )
}
