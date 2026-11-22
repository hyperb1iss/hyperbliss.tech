// Shared title treatments. Display titles are filled with a crisp two-color
// run through white (no glow), so a title never reads as the same ink as the
// text under it. A page sets --ink-a and --ink-b to pick its pair.

import { css } from '../../../styled-system/css'

/** The ink for display titles: --ink-a through white to --ink-b, clipped to the letters. */
export const displayInk = css`
  width: fit-content;
  background-image: linear-gradient(95deg, var(--ink-a, #80ffea) 0%, #ffffff 48%, var(--ink-b, #ff8ad8) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`

/** Kind → title color for feed rows. Color carries meaning, so the badge can stay quiet. */
export const KIND_COLOR = {
  essay: 'var(--silk-plasma-pink)',
  lab: '#e0aaff',
  launch: 'var(--silk-quantum-purple)',
  release: 'var(--silk-circuit-cyan)',
} as const
