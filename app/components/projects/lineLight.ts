// Each product line's light, as CSS custom properties: the pool behind a
// chapter, its label ink, its primary action's fill and ink, and the glow
// under its screenshot. Set on a chapter or a product page and read with
// var(--pool-a) and friends.

import type { CSSProperties } from 'react'
import { type LaneId, laneOf } from '@/lib/projectLanes'

/** Each product line's light: the pool behind the chapter, its label ink, and its action fill. */
export const LINE_LIGHT: Record<LaneId, Record<string, string>> = {
  agents: {
    '--cta-a': '#8f6bff',
    '--cta-b': '#e135ff',
    '--cta-ink': '#0d0618',
    '--label': '#c3b3ff',
    '--pool-a': 'rgba(120, 90, 255, 0.5)',
    '--pool-b': 'rgba(225, 53, 255, 0.16)',
    '--shot-glow': 'rgba(120, 90, 255, 0.4)',
  },
  lighting: {
    '--cta-a': '#e135ff',
    '--cta-b': '#ff6ac1',
    '--cta-ink': '#12040f',
    '--label': '#ff9bdc',
    '--pool-a': 'rgba(225, 53, 255, 0.5)',
    '--pool-b': 'rgba(255, 106, 193, 0.18)',
    '--shot-glow': 'rgba(225, 53, 255, 0.35)',
  },
  terminal: {
    '--cta-a': '#80ffea',
    '--cta-b': '#7aa8ff',
    '--cta-ink': '#031512',
    '--label': '#80ffea',
    '--pool-a': 'rgba(128, 255, 234, 0.36)',
    '--pool-b': 'rgba(80, 160, 255, 0.14)',
    '--shot-glow': 'rgba(128, 255, 234, 0.28)',
  },
  web: {
    '--cta-a': '#8f6bff',
    '--cta-b': '#80ffea',
    '--cta-ink': '#0d0618',
    '--label': '#c3b3ff',
    '--pool-a': 'rgba(120, 90, 255, 0.36)',
    '--pool-b': 'rgba(128, 255, 234, 0.12)',
    '--shot-glow': 'rgba(120, 90, 255, 0.3)',
  },
}

/** The light for a project's category, ready for a `style` prop. */
export function lineLight(category: string | null | undefined): CSSProperties {
  return LINE_LIGHT[laneOf(category)] as CSSProperties
}
