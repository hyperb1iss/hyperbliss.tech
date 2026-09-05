import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { FeedItem } from '@/lib/feed'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import Badge from './Badge'
import { numeralDate } from './format'
import { KIND_COLOR } from './neon'
import Reveal from './Reveal'

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

// Panda's styled() would swallow the `as` prop before Reveal saw it, so the
// row styles ride along as a class on the Reveal wrapper instead.
const rowStyles = css`
  display: grid;
  grid-template-columns: 6.4rem 8.4rem minmax(0, 1fr);
  column-gap: 2rem;
  align-items: start;
  padding: 1.8rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);

  &[data-kind='hidden'] {
    grid-template-columns: 6.4rem minmax(0, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 5.6rem minmax(0, 1fr);
    & > [data-badge] {
      display: none;
    }
  }
`

const DateCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const Day = styled.span`
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 3.4rem;
  line-height: 0.95;
  letter-spacing: -0.03em;
  color: #e0aaff;
  transition: color var(--duration-normal) var(--ease-silk);

  li:hover & {
    color: var(--silk-circuit-cyan);
  }
`

const Month = styled.span`
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.1em;
  color: var(--silk-steel-400);
`

const ListHeading = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  margin: 0;
`

const BadgeSlot = styled.div`
  padding-top: 0.6rem;
`

const titleStyles = css`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.1rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  margin: 0.3rem 0 0.6rem;
  text-wrap: pretty;

  & a {
    color: var(--title-color, var(--silk-steel-50));
    text-decoration: none;
    transition:
      color var(--duration-normal) var(--ease-silk),
      text-shadow var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-steel-50);
    text-shadow: 0 0 18px var(--title-color, transparent);
  }
`

const Summary = styled.p`
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  text-wrap: pretty;
`

interface FeedListProps {
  items: FeedItem[]
  /** Entrance position of the first row; rows stagger from here. */
  startOrder?: number
  /** Visually hidden heading for the list. Pass null when the page title already names it. */
  heading?: string | null
  /** Show the kind badge per row. Off for single-kind pages like Writing. */
  showKind?: boolean
  /** Cap the list width for reading comfort on wide index pages. */
  narrow?: boolean
  /** Row title level: h3 under the list's hidden h2, or h2 when the page title is the only heading above. */
  titleLevel?: 'h2' | 'h3'
}

export default function FeedList({
  items,
  startOrder = 0,
  heading = 'Latest',
  showKind = true,
  narrow = false,
  titleLevel = 'h3',
}: FeedListProps) {
  const TitleTag = titleLevel
  return (
    <div style={narrow ? { maxWidth: '96rem' } : undefined}>
      {heading && <ListHeading>{heading}</ListHeading>}
      <List>
        {items.map((item, index) => {
          const { day, month } = numeralDate(item.date)
          return (
            <Reveal
              as="li"
              className={rowStyles}
              data-kind={showKind ? undefined : 'hidden'}
              key={item.id}
              order={startOrder + index * 0.5}
            >
              <DateCol>
                <Day aria-hidden="true">{day}</Day>
                <Month aria-hidden="true">{month}</Month>
                <time
                  dateTime={item.date}
                  style={{ clip: 'rect(0 0 0 0)', height: 1, overflow: 'hidden', position: 'absolute', width: 1 }}
                >
                  {item.date}
                </time>
              </DateCol>
              {showKind && (
                <BadgeSlot data-badge="">
                  <Badge kind={item.kind} />
                </BadgeSlot>
              )}
              <div>
                <TitleTag className={titleStyles} style={{ '--title-color': KIND_COLOR[item.kind] } as CSSProperties}>
                  {item.external ? (
                    <a href={item.href} rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={item.href}>{item.title}</Link>
                  )}
                </TitleTag>
                {item.summary && <Summary>{item.summary}</Summary>}
              </div>
            </Reveal>
          )
        })}
      </List>
    </div>
  )
}
