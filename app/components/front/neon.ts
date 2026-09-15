// Shared neon text treatments for titles. One gradient, one glow, used by the
// page titles and story headlines so the whole site glows the same way.

import { css } from '../../../styled-system/css'

/** Cyan → lavender → pink gradient fill with a soft purple bloom behind it. */
export const neonTitle = css`
  background: linear-gradient(110deg, var(--silk-circuit-cyan) 0%, #e0aaff 48%, var(--silk-plasma-pink) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 18px rgba(162, 89, 255, 0.35));
`

/** Kind → title color for feed rows. Color carries meaning, so the badge can stay quiet. */
export const KIND_COLOR = {
  essay: 'var(--silk-plasma-pink)',
  lab: '#e0aaff',
  launch: 'var(--silk-quantum-purple)',
  release: 'var(--silk-circuit-cyan)',
} as const
