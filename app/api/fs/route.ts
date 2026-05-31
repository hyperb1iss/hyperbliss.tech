// Lazy-FS endpoint (§5.5). Serves selected virtual-FS bodies as JSON. The
// initial page payload stays manifest-only; shell file bodies arrive only when
// a command needs them.

import { NextResponse } from 'next/server'
import { getVirtualFsBodies } from '@/lib/terminal/fsBodies'

export const revalidate = 3600

function parsePaths(request: Request): string[] | undefined {
  const params = new URL(request.url).searchParams
  const paths = params.get('paths')
  if (paths) {
    const parsed: unknown = JSON.parse(paths)
    if (!Array.isArray(parsed) || parsed.some((p) => typeof p !== 'string')) {
      throw new Error('paths must be a JSON string array')
    }
    return parsed
  }
  const path = params.get('path')
  return path ? [path] : undefined
}

export async function GET(request: Request) {
  let paths: string[] | undefined
  try {
    paths = parsePaths(request)
  } catch {
    return NextResponse.json({ error: 'invalid filesystem path request' }, { status: 400 })
  }

  try {
    const bodies = await getVirtualFsBodies(paths)
    return NextResponse.json(bodies, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Failed to build virtual FS bodies:', error)
    return NextResponse.json({ error: 'failed to load filesystem' }, { status: 500 })
  }
}
