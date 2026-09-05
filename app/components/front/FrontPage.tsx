// The landing page under the header: the newest long-form piece leads, the
// merged feed runs beneath it, and a quiet rail carries who, now, shipping,
// and elsewhere. Server component: everything here is crawlable HTML.

import Link from 'next/link'
import type { FrontSection, NowData } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import { styled } from '../../../styled-system/jsx'
import FeedList from './FeedList'
import LeadStory from './LeadStory'
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

export default function FrontPage({ lead, items, shipping, now, front, projectCount }: FrontPageProps) {
  return (
    <Wrap>
      <Main>
        {lead && (
          <Reveal order={0}>
            <LeadStory item={lead} />
          </Reveal>
        )}
        <FeedList items={items} startOrder={1} />
        <Reveal order={1 + items.length * 0.5}>
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
