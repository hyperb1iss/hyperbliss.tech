// The newest long-form piece as a two-column spread: the kind and date in mono,
// the title set expanded and heavy with the read link under it, and the
// excerpt beside it at reading size. An h3 under the front page's Latest
// marker; the hero owns the h1.

import Link from 'next/link'
import type { FeedItem } from '@/lib/feed'
import { styled } from '../../../styled-system/jsx'
import { KIND_VERB, longDate } from './format'

const Article = styled.article`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(52rem, 100%), 1fr));
  gap: 3.2rem 6.4rem;
  align-items: start;
`

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`

const Meta = styled.p`
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b9b0cc;
`

const Title = styled.h3`
  margin: 0;
  font-family: var(--font-display);
  font-stretch: 110%;
  font-weight: 800;
  font-size: clamp(3.6rem, 2.4rem + 3vw, 7.2rem);
  line-height: 0.98;
  letter-spacing: -0.02em;
  color: #f6f2ff;
  text-wrap: balance;

  & a {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-normal) var(--ease-silk);
  }
  & a:hover {
    color: #ffffff;
  }
`

const More = styled(Link)`
  align-self: flex-start;
  color: var(--silk-circuit-cyan);
  font-size: 1.6rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px solid rgba(128, 255, 234, 0.5);
  padding-bottom: 2px;

  &:hover {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }
`

const Excerpt = styled.p`
  margin: 0;
  font-size: clamp(1.9rem, 1.6rem + 0.5vw, 2.3rem);
  line-height: 1.6;
  font-weight: 300;
  color: #d6cfe6;
  text-wrap: pretty;
`

export default function LeadStory({ item }: { item: FeedItem }) {
  const rel = item.external ? 'noopener noreferrer' : undefined
  return (
    <Article>
      <Head>
        <Meta>
          {item.kind === 'lab' ? 'Lab' : 'Essay'} · <time dateTime={item.date}>{longDate(item.date)}</time>
        </Meta>
        <Title>
          <Link href={item.href} rel={rel}>
            {item.title}
          </Link>
        </Title>
        <More href={item.href} rel={rel}>
          {KIND_VERB[item.kind]}
        </More>
      </Head>
      {item.summary && <Excerpt>{item.summary}</Excerpt>}
    </Article>
  )
}
