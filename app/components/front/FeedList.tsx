import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { FeedItem } from '@/lib/feed'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import Badge from './Badge'
import { shortDate } from './format'
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
  grid-template-columns: 13rem 8.4rem minmax(0, 1fr);
  column-gap: 2.8rem;
  align-items: baseline;
  padding: 2.6rem 0;
  border-top: 1px solid rgba(244, 240, 255, 0.1);

  &:last-child {
    border-bottom: 1px solid rgba(244, 240, 255, 0.1);
  }

  &[data-kind='hidden'] {
    grid-template-columns: 13rem minmax(0, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.6rem;
    & > [data-badge] {
      display: none;
    }
  }
`

const DateCol = styled.time`
  font-family: var(--font-mono);
  font-size: 1.35rem;
  letter-spacing: 0.02em;
  color: #b9b0cc;
  white-space: nowrap;
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
  align-self: center;
`

const titleStyles = css`
  font-family: var(--font-display);
  font-stretch: 112%;
  font-weight: 800;
  font-size: clamp(2.1rem, 1.7rem + 0.7vw, 2.6rem);
  line-height: 1.12;
  letter-spacing: -0.015em;
  margin: 0 0 0.6rem;
  text-wrap: pretty;

  & a {
    color: #f6f2ff;
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--title-color, var(--silk-circuit-cyan));
  }
`

const Summary = styled.p`
  font-size: 1.6rem;
  font-weight: 300;
  line-height: 1.55;
  color: #cfc8de;
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
          return (
            <Reveal
              as="li"
              className={rowStyles}
              data-kind={showKind ? undefined : 'hidden'}
              key={item.id}
              order={startOrder + index * 0.5}
            >
              <DateCol dateTime={item.date}>{shortDate(item.date)}</DateCol>
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
