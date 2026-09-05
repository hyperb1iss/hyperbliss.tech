// app/components/PageLayout.tsx
// Content column for every page under the header. GlobalLayout already renders
// the <main> landmark, so this is a plain wrapper; the entrance rides the same
// CSS keyframe as the front page and honors prefers-reduced-motion.

import type { ReactNode } from 'react'
import { css } from '../../styled-system/css'
import Reveal from './front/Reveal'

const wrapperStyles = css`
  flex: 1;
  width: 100%;
  max-width: 144rem;
  margin: 0 auto;
  padding: 4.8rem 6.4rem 6.4rem;
  min-height: 60vh;
  position: relative;

  @media (max-width: 1024px) {
    padding: 3.2rem 2.4rem 4.8rem;
  }
`

interface PageLayoutProps {
  children: ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return <Reveal className={wrapperStyles}>{children}</Reveal>
}
