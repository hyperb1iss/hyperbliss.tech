// The landing page under the header: the newest long-form piece leads, the
// merged feed runs beneath it, and a quiet rail carries who, now, shipping,
// and elsewhere. Server component: everything here is crawlable HTML.

import Link from 'next/link'
import type { FrontSection, NowData } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import { css, cx } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import FeedList from './FeedList'
import LeadStory from './LeadStory'
import { neonTitle } from './neon'
import Rail, { type ShippingRow } from './Rail'
import Reveal from './Reveal'

export interface FrontPageProps {
  lead: FeedItem | null
  items: FeedItem[]
  shipping: ShippingRow[]
  now: NowData
  front: FrontSection | null
  projectCount: number
}

const Wrap = styled.div`
  width: 100%;
  max-width: 144rem;
  margin: 0 auto;
  padding: 4.8rem 6.4rem 6.4rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32rem;
  column-gap: 7.2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 5.6rem;
    padding: 3.2rem 2.4rem 4.8rem;
  }
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const Intro = styled.p`
  grid-column: 1 / -1;
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

  @media (max-width: 1024px) {
    margin-bottom: 0;
  }
`

const Brand = styled.span`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.1em;
  letter-spacing: -0.03em;
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

const introRow = 'front-intro'
const introRowStyles = css`
  grid-column: 1 / -1;
`

const NAME = 'Stefanie Jane'

/** `{hyperbliss}` becomes the brand mark and `{name}` the About link; everything else is plain text. */
function renderTagline(tagline: string) {
  return tagline.split(/(\{hyperbliss\}|\{name\})/).map((part, index) => {
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

export default function FrontPage({ lead, items, shipping, now, front, projectCount }: FrontPageProps) {
  const tagline = front?.tagline ?? "Hey, I'm {name}, and {hyperbliss} is where I make things."
  return (
    <Wrap>
      <Reveal as="div" className={cx(introRow, introRowStyles)} order={0}>
        <Intro>{renderTagline(tagline)}</Intro>
      </Reveal>
      <Main>
        <Reveal order={0.5}>
          <Marker>Latest</Marker>
        </Reveal>
        {lead && (
          <Reveal order={1}>
            <LeadStory item={lead} />
          </Reveal>
        )}
        <FeedList heading={null} items={items} startOrder={1.5} />
        <Reveal order={1.5 + items.length * 0.5}>
          <Foot>
            <Link href="/blog/">All writing →</Link>
            <Link href="/projects/">All projects →</Link>
          </Foot>
        </Reveal>
      </Main>
      <Reveal order={2}>
        <Rail front={front} now={now} projectCount={projectCount} shipping={shipping} />
      </Reveal>
    </Wrap>
  )
}
