// app/api/og/route.tsx

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { OG_HEIGHT, OG_WIDTH, OgCard, type OgKind } from '@/lib/og/card'
import { loadOgFonts } from '@/lib/og/fonts'

const KINDS: readonly OgKind[] = ['site', 'blog', 'project']

let logoCache: string | null = null

async function loadLogo(): Promise<string> {
  if (logoCache) return logoCache
  const data = await readFile(join(process.cwd(), 'public', 'images', 'logo.png'))
  logoCache = `data:image/png;base64,${data.toString('base64')}`
  return logoCache
}

function param(request: NextRequest, name: string, max: number): string | undefined {
  const value = request.nextUrl.searchParams.get(name)?.trim()
  return value ? value.slice(0, max) : undefined
}

export async function GET(request: NextRequest): Promise<ImageResponse> {
  const rawKind = param(request, 'kind', 16)
  const kind: OgKind = KINDS.includes(rawKind as OgKind) ? (rawKind as OgKind) : 'site'
  const [fonts, logoSrc] = await Promise.all([loadOgFonts(), loadLogo()])

  return new ImageResponse(
    <OgCard
      kind={kind}
      logoSrc={logoSrc}
      meta={param(request, 'meta', 48)}
      path={param(request, 'path', 64)}
      subtitle={param(request, 'subtitle', 200)}
      title={param(request, 'title', 120) ?? 'Hyperbliss'}
    />,
    {
      fonts,
      headers: {
        // Cards are keyed by their full query string, so long-lived caching
        // is safe: a title change produces a new URL.
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800',
      },
      height: OG_HEIGHT,
      width: OG_WIDTH,
    },
  )
}
