// app/components/NotFoundPage.tsx
// The 404 in the Emission language: the page title's band of light, a huge
// "404" filled with that same light, one plain sentence, and the two places
// most visitors were heading anyway.

import Link from 'next/link'
import { css, cx } from '../../styled-system/css'
import { styled } from '../../styled-system/jsx'
import { displayInk } from './front/neon'
import PageLayout from './PageLayout'
import TitleLight from './TitleLight'

const Stage = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding: 2.4rem 0 4.8rem;
`

const Label = styled.p`
  margin: 0;
  font-family: var(--font-mono);
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b9b0cc;
`

// The digits carry the light, like the last line of the front page hero.
const codeStyles = css`
  display: block;
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  font-size: clamp(12rem, 6rem + 18vw, 30rem);
  line-height: 0.82;
  letter-spacing: -0.04em;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0.24)),
    url('/images/emission/cymatics.webp');
  background-size:
    100% 100%,
    160% auto;
  background-position:
    0 0,
    50% 10%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  user-select: none;
`

const titleStyles = css`
  margin: 0;
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  font-size: clamp(3.2rem, 2.2rem + 2.2vw, 5.6rem);
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  text-wrap: balance;
`

const Lede = styled.p`
  margin: 0;
  max-width: 56rem;
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  text-wrap: pretty;
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem 2.8rem;
  padding-top: 0.8rem;
`

const primaryStyles = css`
  display: inline-flex;
  align-items: center;
  padding: 1.6rem 2.8rem;
  border-radius: 999px;
  background: #f4f0ff;
  color: #0b0712;
  font-weight: 600;
  font-size: 1.6rem;
  text-decoration: none;
  transition:
    transform var(--duration-normal) var(--ease-silk),
    box-shadow var(--duration-normal) var(--ease-silk);

  &:hover {
    color: #0b0712;
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.4),
      0 18px 50px rgba(225, 53, 255, 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

const secondaryStyles = css`
  color: #f4f0ff;
  font-size: 1.6rem;
  text-decoration: none;
  border-bottom: 1px solid rgba(244, 240, 255, 0.4);
  padding-bottom: 2px;

  &:hover {
    color: #ffffff;
    border-bottom-color: #ffffff;
  }
`

export default function NotFoundPage() {
  return (
    <PageLayout>
      <Stage aria-labelledby="not-found-title">
        <TitleLight tint="cyan" />
        <Label>Error 404</Label>
        <span aria-hidden="true" className={codeStyles}>
          404
        </span>
        <h1 className={cx(titleStyles, displayInk)} id="not-found-title">
          Nothing lives at this address.
        </h1>
        <Lede>The link may be old, or the page moved. Everything we make is one click from here.</Lede>
        <Actions>
          <Link className={primaryStyles} href="/">
            Back home
          </Link>
          <Link className={secondaryStyles} href="/projects/">
            See the products
          </Link>
          <Link className={secondaryStyles} href="/blog/">
            Read the writing
          </Link>
        </Actions>
      </Stage>
    </PageLayout>
  )
}
