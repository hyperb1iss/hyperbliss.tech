// Lazy-FS endpoint (§5.5). Serves selected virtual-FS bodies as JSON. The
// initial page payload stays manifest-only; shell file bodies arrive only when
// a command needs them.

import { NextResponse } from 'next/server'
import { getVirtualFsBodies, getVirtualFsPaths } from '@/lib/terminal/fsBodies'

export const revalidate = 3600

const MAX_PATHS = 64
const MAX_PATHS_PARAM_LENGTH = 8192

function parsePaths(request: Request): string[] | undefined {
  const params = new URL(request.url).searchParams
  const paths = params.get('paths')
  if (paths) {
    if (paths.length > MAX_PATHS_PARAM_LENGTH) {
      throw new Error('paths parameter too large')
    }
    const parsed: unknown = JSON.parse(paths)
    if (!Array.isArray(parsed) || parsed.length > MAX_PATHS || parsed.some((p) => typeof p !== 'string')) {
      throw new Error('paths must be a JSON string array')
    }
    return parsed
  }
  const path = params.get('path')
  return path ? [path] : undefined
}

async function validatePaths(paths: readonly string[] | undefined): Promise<string[] | undefined> {
  if (!paths) return undefined
  const allowed = new Set(await getVirtualFsPaths())
  if (paths.some((path) => !allowed.has(path))) {
    throw new Error('unknown virtual filesystem path')
  }
  return [...new Set(paths)]
}

export async function GET(request: Request) {
  let paths: string[] | undefined
  try {
    paths = await validatePaths(parsePaths(request))
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
