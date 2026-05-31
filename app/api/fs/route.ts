// Lazy-FS endpoint (§5.5). Serves the full virtual-FS body map as JSON, fetched
// once by the terminal on first shell use and mounted into just-bash. The
// initial page payload stays manifest-only; bodies arrive only if a visitor
// actually opens the shell.

import { NextResponse } from 'next/server'
import { getVirtualFsBodies } from '@/lib/terminal/fsBodies'

export const revalidate = 3600

export async function GET() {
  try {
    const bodies = await getVirtualFsBodies()
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
