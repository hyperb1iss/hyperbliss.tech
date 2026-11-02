// Shared title treatments. Emission headlines are clean ink on the void; the
// light lives in the scene behind them, not in gradient-filled letters.

import { css } from '../../../styled-system/css'

/** Bright ink for display titles: no gradient fill, no glow. */
export const displayInk = css`
  color: #f6f2ff;
`

/** Kind → title color for feed rows. Color carries meaning, so the badge can stay quiet. */
export const KIND_COLOR = {
  essay: 'var(--silk-plasma-pink)',
  lab: '#e0aaff',
  launch: 'var(--silk-quantum-purple)',
  release: 'var(--silk-circuit-cyan)',
} as const
