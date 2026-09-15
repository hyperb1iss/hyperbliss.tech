// app/components/Archive.tsx
// Every feed item, grouped under a year marker. Server component.

import type { FeedItem } from '@/lib/feed'
import { styled } from '../../styled-system/jsx'
import FeedList from './front/FeedList'
import Reveal from './front/Reveal'
import PageLayout from './PageLayout'
import PageTitle from './PageTitle'

const YearMarker = styled.h2`
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
  margin: 4.8rem 0 2.4rem;

  &:first-of-type {
    margin-top: 0;
  }

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(162, 89, 255, 0.45), transparent);
  }
`

interface ArchiveProps {
  years: Array<{ year: string; items: FeedItem[] }>
}

export default function Archive({ years }: ArchiveProps) {
  let order = 0.5
  return (
    <PageLayout>
      <PageTitle lede="Every essay, lab experiment, release, and launch, newest first.">Archive</PageTitle>
      <div style={{ maxWidth: '96rem' }}>
        {years.map(({ year, items }) => {
          const startOrder = order
          order += 0.5 + items.length * 0.5
          return (
            <section key={year} style={{ padding: 0 }}>
              <Reveal order={startOrder}>
                <YearMarker>{year}</YearMarker>
              </Reveal>
              <FeedList heading={null} items={items} startOrder={startOrder + 0.5} titleLevel="h3" />
            </section>
          )
        })}
      </div>
    </PageLayout>
  )
}
