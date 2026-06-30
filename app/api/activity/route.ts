// Live GitHub activity endpoint. Proxies the public events feed with a token so
// all visitors share one cached upstream call every 5 minutes instead of each
// spending their own anonymous 60 req/hr per-IP budget. Returns a slim,
// normalized summary — never the raw event payloads.

import { NextResponse } from 'next/server'
import { getRecentActivity } from '@/lib/github'

export const revalidate = 300

export async function GET() {
  const summary = await getRecentActivity()
  // Recover fast from a failed upstream; coast on success.
  const maxAge = summary.ok ? 300 : 60
  return NextResponse.json(summary, {
    headers: {
      'Cache-Control': `public, max-age=${maxAge}, stale-while-revalidate=86400`,
    },
  })
}
