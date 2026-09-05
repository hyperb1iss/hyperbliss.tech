import Link from 'next/link'
import type { FeedItem } from '@/lib/feed'
import { css } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import Badge from './Badge'
import { numeralDate } from './format'
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

  @media (max-width: 640px) {
    grid-template-columns: 5.6rem minmax(0, 1fr);
    & > :nth-child(2) {
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
  color: var(--silk-steel-50);
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

const Title = styled.h3`
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
    color: var(--silk-steel-50);
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: var(--silk-circuit-cyan);
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

interface FeedListProps {
  items: FeedItem[]
  /** Entrance position of the first row; rows stagger from here. */
  startOrder?: number
}

export default function FeedList({ items, startOrder = 0 }: FeedListProps) {
  return (
    <div>
      <ListHeading>Latest</ListHeading>
      <List>
        {items.map((item, index) => {
          const { day, month } = numeralDate(item.date)
          return (
            <Reveal as="li" className={rowStyles} key={item.id} order={startOrder + index * 0.5}>
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
              <BadgeSlot>
                <Badge kind={item.kind} />
              </BadgeSlot>
              <div>
                <Title>
                  {item.external ? (
                    <a href={item.href} rel="noopener noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <Link href={item.href}>{item.title}</Link>
                  )}
                </Title>
                {item.summary && <Summary>{item.summary}</Summary>}
              </div>
            </Reveal>
          )
        })}
      </List>
      <Reveal order={startOrder + items.length * 0.5}>
        <Foot>
          <Link href="/blog/">All writing →</Link>
          <Link href="/projects/">All projects →</Link>
        </Foot>
      </Reveal>
    </div>
  )
}
