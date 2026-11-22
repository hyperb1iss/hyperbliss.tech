// app/lib/ogImage.ts

import { BASE_URL, TAGLINE } from './company'
import type { OgKind } from './og/card'

export interface OgImageParams {
  kind: OgKind
  title?: string
  subtitle?: string
  meta?: string
}

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/**
 * Builds the absolute URL for a generated OG card. Cards are rendered on
 * demand by /api/og and cached by their query string.
 */
export function buildOgImageUrl({ kind, title, subtitle, meta }: OgImageParams): string {
  const params = new URLSearchParams()
  params.set('kind', kind)
  if (title) params.set('title', title)
  if (subtitle) params.set('subtitle', subtitle)
  if (meta) params.set('meta', meta)
  // trailingSlash: true 308s route handlers at the bare path; emit the
  // canonical slashed URL so scrapers never eat a redirect hop.
  return `${BASE_URL}/api/og/?${params.toString()}`
}

// The site card draws the tagline itself; naming it in the URL is what makes
// a new tagline a new URL, so caches and scrapers fetch the new card.
export const DEFAULT_OG_IMAGE_URL = buildOgImageUrl({ kind: 'site', title: TAGLINE })
