// app/components/PageTitle.tsx
// The page-level heading shared by every index and utility page. Sentence case
// in the display face, left-aligned, with an optional one-line lede. Opts out of
// the global uppercase-and-glow heading rule so it matches the front page.

import type { ReactNode } from 'react'
import { css, cx } from '../../styled-system/css'
import { neonTitle } from './front/neon'

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
  font-weight: 700;
  font-size: clamp(3.4rem, 2.8rem + 1.6vw, 4.8rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
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
}

export default function PageTitle({ children, lede }: PageTitleProps) {
  return (
    <header className={headerStyles}>
      <h1 className={cx(titleStyles, neonTitle)}>{children}</h1>
      {lede && <p className={ledeStyles}>{lede}</p>}
    </header>
  )
}
