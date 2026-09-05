import Link from 'next/link'
import type { FeedItem } from '@/lib/feed'
import { styled } from '../../../styled-system/jsx'
import Badge from './Badge'
import { numeralDate } from './format'

const List = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`

const Row = styled.li`
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
`

const Month = styled.span`
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
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

export default function FeedList({ items }: { items: FeedItem[] }) {
  return (
    <div>
      <List>
        {items.map((item) => {
          const { day, month } = numeralDate(item.date)
          return (
            <Row key={item.id}>
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
                  <Link href={item.href}>{item.title}</Link>
                </Title>
                {item.summary && <Summary>{item.summary}</Summary>}
              </div>
            </Row>
          )
        })}
      </List>
      <Foot>
        <Link href="/blog/">All writing →</Link>
        <Link href="/projects/">All projects →</Link>
      </Foot>
    </div>
  )
}
