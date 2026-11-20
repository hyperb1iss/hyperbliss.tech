// app/api/og/route.tsx

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { KIND_TINT, OG_HEIGHT, OG_WIDTH, OgCard, type OgKind } from '@/lib/og/card'
import { loadOgFonts } from '@/lib/og/fonts'

const KINDS: readonly OgKind[] = ['site', 'blog', 'project', 'lab']

let logoCache: string | null = null

async function loadLogo(): Promise<string> {
  if (logoCache) return logoCache
  const data = await readFile(join(process.cwd(), 'public', 'images', 'logo.png'))
  logoCache = `data:image/png;base64,${data.toString('base64')}`
  return logoCache
}

// One literal path per frame, so the file tracer bundles each JPEG.
const LIGHT_FILES = {
  cyan: join(process.cwd(), 'app', 'lib', 'og', 'light', 'light-cyan.jpg'),
  magenta: join(process.cwd(), 'app', 'lib', 'og', 'light', 'light-magenta.jpg'),
  pink: join(process.cwd(), 'app', 'lib', 'og', 'light', 'light-pink.jpg'),
  violet: join(process.cwd(), 'app', 'lib', 'og', 'light', 'light-violet.jpg'),
} as const

const lightCache = new Map<OgKind, string>()

async function loadLight(kind: OgKind): Promise<string> {
  const hit = lightCache.get(kind)
  if (hit) return hit
  const data = await readFile(LIGHT_FILES[KIND_TINT[kind]])
  const src = `data:image/jpeg;base64,${data.toString('base64')}`
  lightCache.set(kind, src)
  return src
}

function param(request: NextRequest, name: string, max: number): string | undefined {
  const value = request.nextUrl.searchParams.get(name)?.trim()
  return value ? value.slice(0, max) : undefined
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const rawKind = param(request, 'kind', 16)
  const kind: OgKind = KINDS.includes(rawKind as OgKind) ? (rawKind as OgKind) : 'site'
  const [fonts, logoSrc, lightSrc] = await Promise.all([loadOgFonts(), loadLogo(), loadLight(kind)])

  return new ImageResponse(
    <OgCard
      kind={kind}
      lightSrc={lightSrc}
      logoSrc={logoSrc}
      meta={param(request, 'meta', 48)}
      subtitle={param(request, 'subtitle', 200)}
      title={param(request, 'title', 120) ?? 'Hyperbliss'}
    />,
    {
      fonts,
      headers: {
        // Cards are keyed by their full query string, so long-lived caching
        // is safe: a title change produces a new URL.
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800',
        // Netlify's function cache ignores query strings unless told to vary
        // on them; without this, the first card rendered serves for EVERY
        // query string (verified live: identical bytes across kinds).
        'Netlify-Vary': 'query',
      },
      height: OG_HEIGHT,
      width: OG_WIDTH,
    },
  )
}
