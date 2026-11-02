// The landing page in the Emission direction: a full-bleed hero lit by real
// Hypercolor light, then the flagship trio as product chapters, the newest
// long-form piece as a spread, and the merged feed. Server component:
// everything here is crawlable HTML.

import Link from 'next/link'
import type { FrontSection } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import type { ActivitySummary } from '@/lib/github'
import type { ProjectEntry } from '@/lib/projectLanes'
import { styled } from '../../../styled-system/jsx'
import ProductChapter from '../projects/ProductChapter'
import EmissionHero from './EmissionHero'
import FeedList from './FeedList'
import LeadStory from './LeadStory'
import { displayInk } from './neon'
import Pulse from './Pulse'
import Reveal from './Reveal'

export interface FrontPageProps {
  lead: FeedItem | null
  items: FeedItem[]
  featured: ProjectEntry[]
  activity: ActivitySummary | null
  front: FrontSection | null
}

const DEFAULT_HEADLINE = ['Software', 'that puts you', 'in control.']

const Wrap = styled.div`
  width: 100%;
  max-width: 144rem;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 4rem 6.4rem 8rem;
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 2.4rem 2rem 6.4rem;
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-bottom: 10rem;
  scroll-margin-top: 12rem;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 7.2rem;
  }
`

const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.2rem 2.4rem;
  padding-top: 2.8rem;
  border-top: 1px solid transparent;
  border-image: linear-gradient(90deg, rgba(225, 53, 255, 0.7), rgba(128, 255, 234, 0.4) 45%, transparent) 1;
  margin-bottom: 2.4rem;
`

const Marker = styled.h2`
  margin: 0;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 1.4rem;
  font-stretch: 100%;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b9b0cc;
`

const Aside = styled.p`
  margin: 0;
  font-size: 1.6rem;
  color: #b9b0cc;
`

// A span, not <code>: the global code rule paints a boxed pink chip.
const Mono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82em;
  color: var(--silk-circuit-cyan);
  letter-spacing: 0;
`

const Brand = styled.span`
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 800;
  letter-spacing: -0.02em;
`

const Foot = styled.div`
  display: flex;
  gap: 2.4rem;
  padding-top: 2.4rem;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  letter-spacing: 0.04em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: #ffffff;
  }
`

const NAME = 'Stefanie Jane'

/**
 * `{hyperbliss}` becomes the brand mark, `{name}` the About link, and anything
 * in backticks renders in mono; everything else is plain text.
 */
function renderTagline(tagline: string) {
  return tagline.split(/(\{hyperbliss\}|\{name\}|`[^`]+`)/).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <Mono key={`mono-${index}`}>{part.slice(1, -1)}</Mono>
    if (part === '{hyperbliss}')
      return (
        <Brand className={displayInk} key={`brand-${index}`}>
          hyperbliss
        </Brand>
      )
    if (part === '{name}')
      return (
        <Link href="/about/" key={`name-${index}`}>
          {NAME}
        </Link>
      )
    return part
  })
}

export default function FrontPage({ lead, items, featured, activity, front }: FrontPageProps) {
  const headline = front?.headline?.length ? front.headline : DEFAULT_HEADLINE
  const intro =
    front?.tagline ?? 'Hyperbliss Technologies makes open source software for light, memory, and the terminal.'
  const feedStart = 2
  return (
    <>
      <EmissionHero
        essayHref={lead?.href ?? null}
        footnote={<Pulse activity={activity} />}
        headline={headline}
        intro={renderTagline(intro)}
      />
      <Wrap>
        {featured.length > 0 && (
          <Section aria-labelledby="front-products" id="products">
            <Head>
              <Marker id="front-products">Products</Marker>
              <Aside>Three product lines. Open source at the core.</Aside>
            </Head>
            {featured.map((entry, index) => (
              <ProductChapter entry={entry} flip={index % 2 === 1} key={entry.project.slug} priority={index === 0} />
            ))}
            <Foot>
              <Link href="/projects/">All products and open source →</Link>
            </Foot>
          </Section>
        )}
        {lead && (
          <Section aria-labelledby="front-latest">
            <Head>
              <Marker id="front-latest">Latest</Marker>
            </Head>
            <Reveal order={0}>
              <LeadStory item={lead} />
            </Reveal>
          </Section>
        )}
        <Section aria-labelledby="front-recently">
          <Head>
            <Marker id="front-recently">Recently</Marker>
          </Head>
          <FeedList heading={null} items={items} startOrder={feedStart} />
          <Foot>
            <Link href="/archive/">Everything, by year →</Link>
          </Foot>
        </Section>
      </Wrap>
    </>
  )
}
