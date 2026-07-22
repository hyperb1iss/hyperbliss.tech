// app/lib/ogImage.ts

import type { OgKind } from './og/card'

const BASE_URL = 'https://hyperbliss.tech'

export interface OgImageParams {
  kind: OgKind
  title?: string
  subtitle?: string
  meta?: string
  path?: string
}

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630

/**
 * Builds the absolute URL for a generated OG card. Cards are rendered on
 * demand by /api/og and cached by their query string.
 */
export function buildOgImageUrl({ kind, title, subtitle, meta, path }: OgImageParams): string {
  const params = new URLSearchParams()
  params.set('kind', kind)
  if (title) params.set('title', title)
  if (subtitle) params.set('subtitle', subtitle)
  if (meta) params.set('meta', meta)
  if (path) params.set('path', path)
  // trailingSlash: true 308s route handlers at the bare path; emit the
  // canonical slashed URL so scrapers never eat a redirect hop.
  return `${BASE_URL}/api/og/?${params.toString()}`
}

export const DEFAULT_OG_IMAGE_URL = buildOgImageUrl({ kind: 'site' })
