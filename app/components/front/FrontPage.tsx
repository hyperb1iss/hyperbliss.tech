// The landing page under the header: the newest long-form piece leads, the
// merged feed runs beneath it, and a quiet rail carries who, now, shipping,
// and elsewhere. Server component: everything here is crawlable HTML.

import type { FrontSection, NowData } from '@/lib/content'
import type { FeedItem } from '@/lib/feed'
import { styled } from '../../../styled-system/jsx'
import FeedList from './FeedList'
import LeadStory from './LeadStory'
import Rail, { type ShippingRow } from './Rail'

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
  padding: 4.8rem 6.4rem 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32rem;
  column-gap: 7.2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 5.6rem;
    padding: 3.2rem 2.4rem 0;
  }
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export default function FrontPage({ lead, items, shipping, now, front, projectCount }: FrontPageProps) {
  return (
    <Wrap>
      <Main>
        {lead && <LeadStory item={lead} />}
        <FeedList items={items} />
      </Main>
      <Rail front={front} now={now} projectCount={projectCount} shipping={shipping} />
    </Wrap>
  )
}
