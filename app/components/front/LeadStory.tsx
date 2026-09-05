import Link from 'next/link'
import type { FeedItem } from '@/lib/feed'
import { cx } from '../../../styled-system/css'
import { styled } from '../../../styled-system/jsx'
import Badge from './Badge'
import { KIND_VERB, longDate } from './format'
import { neonTitle } from './neon'

const Article = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-bottom: 3.2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  font-size: 1.4rem;
  color: var(--silk-steel-400);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3.4rem, 2.6rem + 2vw, 5.4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  text-transform: none;
  text-shadow: none;
  margin: 0;
  max-width: 86rem;
  text-wrap: balance;

  & a {
    color: inherit;
    text-decoration: none;
  }
  &:hover {
    filter: drop-shadow(0 0 26px rgba(0, 255, 240, 0.35));
  }
`

const Lede = styled.p`
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
  max-width: 72rem;
  text-wrap: pretty;
`

const More = styled(Link)`
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.06em;
  color: var(--silk-circuit-cyan);
  text-decoration: none;
  align-self: flex-start;
  transition:
    color var(--duration-normal) var(--ease-silk),
    transform var(--duration-normal) var(--ease-silk);

  &:hover {
    color: var(--silk-steel-50);
    transform: translateX(4px);
  }
`

export default function LeadStory({ item }: { item: FeedItem }) {
  return (
    <Article>
      <Meta>
        <Badge kind={item.kind} />
        <time dateTime={item.date}>{longDate(item.date)}</time>
      </Meta>
      <Title className={neonTitle}>
        {item.external ? (
          <a href={item.href} rel="noopener noreferrer">
            {item.title}
          </a>
        ) : (
          <Link href={item.href}>{item.title}</Link>
        )}
      </Title>
      {item.summary && <Lede>{item.summary}</Lede>}
      <More href={item.href} rel={item.external ? 'noopener noreferrer' : undefined}>
        {KIND_VERB[item.kind]} →
      </More>
    </Article>
  )
}
