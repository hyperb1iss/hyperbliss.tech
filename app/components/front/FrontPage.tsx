// The landing page under the header, one column: the intro sentence, a
// computed pulse line, the newest long-form piece, the flagship trio, then the
// merged feed. Server component: everything here is crawlable HTML.

import Link from 'next/link'
import type { FrontSection } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import type { ActivitySummary } from '@/lib/github'
import type { ProjectEntry } from '@/lib/projectLanes'
import { styled } from '../../../styled-system/jsx'
import Building from './Building'
import FeedList from './FeedList'
import LeadStory from './LeadStory'
import { neonTitle } from './neon'
import Pulse from './Pulse'
import Reveal from './Reveal'

export interface FrontPageProps {
  lead: FeedItem | null
  items: FeedItem[]
  featured: ProjectEntry[]
  activity: ActivitySummary | null
  front: FrontSection | null
  projectCount: number
}

const Wrap = styled.div`
  width: 100%;
  max-width: 116rem;
  margin: 0 auto;
  padding: 4.8rem 6.4rem 6.4rem;
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 1024px) {
    padding: 3.2rem 2.4rem 4.8rem;
  }
`

const Intro = styled.p`
  font-size: clamp(2rem, 1.7rem + 0.8vw, 2.7rem);
  font-weight: 300;
  line-height: 1.4;
  color: var(--silk-steel-50);
  margin: 0 0 4.4rem;
  max-width: 104rem;
  text-wrap: pretty;

  & a {
    color: var(--silk-plasma-pink);
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-steel-50);
  }
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-bottom: 5.6rem;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const Brand = styled.span`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1em;
  letter-spacing: -0.03em;
`

// A span, not <code>: the global code rule paints a boxed pink chip.
const Mono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82em;
  color: var(--silk-circuit-cyan);
  letter-spacing: 0;
`

const Marker = styled.h2`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-shadow: none;
  color: var(--silk-quantum-purple);
  margin: 0 0 2.4rem;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(162, 89, 255, 0.45), transparent);
  }
`

const Foot = styled.div`
  display: flex;
  gap: 2.4rem;
  padding-top: 1.8rem;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.06em;

  & a {
    color: var(--silk-circuit-cyan);
    text-decoration: none;
  }
  & a:hover {
    color: var(--silk-steel-50);
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
        <Brand className={neonTitle} key={`brand-${index}`}>
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

export default function FrontPage({ lead, items, featured, activity, front, projectCount }: FrontPageProps) {
  const tagline = front?.tagline ?? "Hey, I'm {name}, and {hyperbliss} is where I make things."
  const buildingStart = 1.6
  const feedStart = buildingStart + featured.length * 0.3 + 0.8
  return (
    <Wrap>
      <Reveal order={0}>
        <Intro>{renderTagline(tagline)}</Intro>
      </Reveal>
      <Reveal order={0.3}>
        <Pulse activity={activity} />
      </Reveal>
      <Section aria-labelledby="front-latest">
        <Reveal order={0.5}>
          <Marker id="front-latest">Latest</Marker>
        </Reveal>
        {lead && (
          <Reveal order={1}>
            <LeadStory item={lead} />
          </Reveal>
        )}
      </Section>
      {featured.length > 0 && (
        <Section aria-labelledby="front-building">
          <Reveal order={buildingStart - 0.3}>
            <Marker id="front-building">Building</Marker>
          </Reveal>
          <Building entries={featured} projectCount={projectCount} startOrder={buildingStart} />
        </Section>
      )}
      <Section aria-labelledby="front-recently">
        <Reveal order={feedStart - 0.3}>
          <Marker id="front-recently">Recently</Marker>
        </Reveal>
        <FeedList heading={null} items={items} startOrder={feedStart} />
        <Reveal order={feedStart + items.length * 0.5}>
          <Foot>
            <Link href="/archive/">Everything, by year →</Link>
          </Foot>
        </Reveal>
      </Section>
    </Wrap>
  )
}
