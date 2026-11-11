// app/components/PageTitle.tsx
// The page-level heading shared by every index and utility page. Sentence case
// in the display face, left-aligned, with an optional one-line lede. Opts out of
// the global heading rule so it matches the front page.

import type { CSSProperties, ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { displayInk } from './front/neon'
import TitleLight, { type LightTint } from './TitleLight'

const headerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-bottom: 2.8rem;
  margin-bottom: 3.2rem;
  border-bottom: 1px solid transparent;
  border-image: linear-gradient(90deg, rgba(225, 53, 255, 0.7), rgba(128, 255, 234, 0.4) 45%, transparent) 1;
`

const titleStyles = css`
  font-family: var(--font-display);
  font-stretch: 125%;
  font-weight: 900;
  font-size: clamp(3.6rem, 2.4rem + 2.6vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: -0.02em;
  text-transform: none;
  text-shadow: none;
  margin: 0;
  text-wrap: balance;
`

const ledeStyles = css`
  font-size: 1.8rem;
  font-weight: 300;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
  max-width: 68rem;
  text-wrap: pretty;
`

/** Each tint's title ink: the two colors on either side of white. */
const TINT_INK: Record<LightTint, [string, string]> = {
  cyan: ['#80ffea', '#b9a2ff'],
  magenta: ['#80ffea', '#ff8ad8'],
  pink: ['#ff8ad8', '#b9a2ff'],
  violet: ['#b9a2ff', '#80ffea'],
}

interface PageTitleProps {
  children: ReactNode
  /** One sentence under the title. Optional; most pages need none. */
  lede?: ReactNode
  /** The color of the light behind the title. */
  tint?: LightTint
}

export default function PageTitle({ children, lede, tint = 'magenta' }: PageTitleProps) {
  const [a, b] = TINT_INK[tint]
  const ink = { '--ink-a': a, '--ink-b': b } as CSSProperties
  return (
    <header className={headerStyles}>
      <TitleLight tint={tint} />
      <h1 className={cx(titleStyles, displayInk)} style={ink}>
        {children}
      </h1>
      {lede && <p className={ledeStyles}>{lede}</p>}
    </header>
  )
}
