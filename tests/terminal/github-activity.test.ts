import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRecentActivity } from '@/lib/github'

const NOW = new Date('2026-06-18T12:00:00Z')

// Newest-first, mirroring the LIVE events/public shape: PushEvent payloads carry
// only before/head/push_id/ref/repository_id — no `size`, no `commits[]`. The
// suite would have missed the empty-feed bug without fixtures shaped like this.
function rawEvents(): unknown[] {
  return [
    {
      created_at: '2026-06-18T10:00:00Z',
      payload: { before: 'p0', head: 'aaa', push_id: 1, ref: 'refs/heads/main', repository_id: 1 },
      repo: { name: 'hyperb1iss/hyperskills' },
      type: 'PushEvent',
    },
    {
      created_at: '2026-06-18T09:00:00Z',
      payload: { before: 'p1', head: 'bbb', push_id: 2, ref: 'refs/heads/main', repository_id: 2 },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'PushEvent',
    },
    {
      created_at: '2026-06-18T08:59:00Z',
      payload: { before: 'p2', head: 'ccc', push_id: 3, ref: 'refs/heads/main', repository_id: 2 },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'PushEvent',
    },
    {
      created_at: '2026-06-18T08:00:00Z',
      payload: {
        action: 'opened',
        number: 5,
        pull_request: { html_url: 'https://github.com/hyperb1iss/sibyl/pull/5', number: 5, title: 'Add the feature' },
      },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'PullRequestEvent',
    },
    {
      created_at: '2026-06-16T12:00:00Z',
      payload: { before: 'p3', head: 'ddd', push_id: 4, ref: 'refs/heads/main', repository_id: 2 },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'PushEvent',
    },
    {
      created_at: '2026-06-16T11:00:00Z',
      payload: { ref: 'feature/x', ref_type: 'branch' },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'CreateEvent',
    },
    {
      created_at: '2026-06-16T10:30:00Z',
      payload: { ref: 'feature/x', ref_type: 'branch' },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'DeleteEvent',
    },
    {
      created_at: '2026-06-15T10:00:00Z',
      payload: { action: 'created' },
      repo: { name: 'hyperb1iss/sibyl' },
      type: 'IssueCommentEvent',
    },
    {
      created_at: '2026-05-20T10:00:00Z',
      payload: { before: 'p9', head: 'old', push_id: 9, ref: 'refs/heads/main', repository_id: 3 },
      repo: { name: 'hyperb1iss/old-repo' },
      type: 'PushEvent',
    },
  ]
}

const okResponse = (body: unknown) => ({ json: async () => body, ok: true })

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getRecentActivity', () => {
  it('normalizes the feed and folds consecutive same-repo pushes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse(rawEvents())))
    const a = await getRecentActivity('hyperb1iss')

    expect(a.ok).toBe(true)
    // Delete + IssueComment dropped; the two adjacent sibyl pushes fold into one.
    expect(a.events).toHaveLength(6)

    expect(a.events[0]).toMatchObject({ count: 1, kind: 'push', repo: 'hyperskills', title: 'pushed to main' })
    expect(a.events[0].url).toContain('/commit/aaa')
    expect(a.events[1]).toMatchObject({ count: 2, kind: 'push', repo: 'sibyl', title: 'pushed 2× to main' })
    expect(a.events[2]).toMatchObject({ detail: 'Add the feature', kind: 'pr', title: 'opened PR #5' })
    // The later sibyl push is separated by the PR, so it stays its own item.
    expect(a.events[3]).toMatchObject({ count: 1, kind: 'push', repo: 'sibyl', title: 'pushed to main' })
    expect(a.events[4]).toMatchObject({ kind: 'create', title: 'created branch feature/x' })
  })

  it('counts pushes even though the payload has no size or commits field', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse(rawEvents())))
    const a = await getRecentActivity('hyperb1iss')

    expect(a.pushesPerDay).toHaveLength(14)
    expect(a.pushesPerDay[13]).toBe(3) // three pushes today
    expect(a.pushesPerDay[11]).toBe(1) // one push two days ago
    expect(a.totalPushes).toBe(4) // the 29-day-old push is outside the window
  })

  it('lists distinct in-window repos in recency order', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse(rawEvents())))
    const a = await getRecentActivity('hyperb1iss')
    // old-repo's only event is 29 days old (outside the 14-day window), so it
    // is excluded — the repos list must agree with the pushes window.
    expect(a.repos).toEqual(['hyperskills', 'sibyl'])
  })

  it('returns ok:false on a non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({}), ok: false }))
    const a = await getRecentActivity('x')
    expect(a.ok).toBe(false)
    expect(a.events).toEqual([])
    expect(a.pushesPerDay).toHaveLength(14)
  })

  it('returns ok:false when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    expect((await getRecentActivity('x')).ok).toBe(false)
  })

  it('returns ok:false on a non-array body (e.g. a rate-limit message)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okResponse({ message: 'API rate limit exceeded' })))
    expect((await getRecentActivity('x')).ok).toBe(false)
  })
})
