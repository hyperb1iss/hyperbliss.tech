// app/components/PageTitle.tsx
// The page-level heading shared by every index and utility page. Sentence case
// in the display face, left-aligned, with an optional one-line lede. Opts out of
// the global heading rule so it matches the front page.

import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { displayInk } from './front/neon'
import TitleLight, { type LightTint } from './TitleLight'

const headerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-bottom: 2.8rem;
  margin-bottom: 3.2rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
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

interface PageTitleProps {
  children: ReactNode
  /** One sentence under the title. Optional; most pages need none. */
  lede?: ReactNode
  /** The color of the light behind the title. */
  tint?: LightTint
}

export default function PageTitle({ children, lede, tint = 'magenta' }: PageTitleProps) {
  return (
    <header className={headerStyles}>
      <TitleLight tint={tint} />
      <h1 className={cx(titleStyles, displayInk)}>{children}</h1>
      {lede && <p className={ledeStyles}>{lede}</p>}
    </header>
  )
}
