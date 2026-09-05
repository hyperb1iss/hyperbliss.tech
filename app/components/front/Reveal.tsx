// One orchestrated entrance for the front page, in CSS. Server components
// render the content and this wrapper adds a keyframe that fades and lifts
// each block into place (opacity and transform only, both GPU-composited),
// staggered by the `order` each caller declares. Because it is a CSS animation
// there is no inline opacity:0 for a hydration pass to get wrong, and the
// prefers-reduced-motion query removes it entirely so the page simply appears.
// The keyframes are declared in globals.css: Panda drops @keyframes bodies
// written inside a css`` template, so the class here only references them.

import type { CSSProperties, ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

const revealStyles = css`
  animation: front-reveal 560ms var(--ease-silk) both;
  animation-delay: calc(320ms + var(--reveal-delay, 0ms));

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

// Wrappers that may contain position:fixed descendants fade without moving:
// an animated transform, even at identity, would become their containing block.
const fadeStyles = css`
  animation: front-reveal-fade 560ms var(--ease-silk) both;
  animation-delay: calc(320ms + var(--reveal-delay, 0ms));

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

interface RevealProps {
  children: ReactNode
  /** Data attribute hooks for the caller's CSS. */
  'data-kind'?: string
  /** Position in the entrance sequence. Each step adds 70ms. */
  order?: number
  /** Render as this element so semantics survive the wrapper. */
  as?: 'div' | 'section' | 'aside' | 'li'
  className?: string
  /** Fade and lift (default) or fade only. Use fade-only on page-level wrappers. */
  lift?: boolean
}

export default function Reveal({
  children,
  order = 0,
  as = 'div',
  className,
  lift = true,
  'data-kind': dataKind,
}: RevealProps) {
  const Tag = as
  const style = { '--reveal-delay': `${Math.round(order * 70)}ms` } as CSSProperties
  return (
    <Tag className={cx(lift ? revealStyles : fadeStyles, className)} data-kind={dataKind} style={style}>
      {children}
    </Tag>
  )
}
