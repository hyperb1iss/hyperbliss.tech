import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '@/components/terminal/commands'
import { registry as shared } from '@/components/terminal/registry'
import { makeHarness } from './_harness'

const summary = {
  events: [
    {
      branch: 'main',
      count: 2,
      createdAt: '2026-06-18T10:00:00Z',
      detail: null,
      kind: 'push',
      repo: 'sibyl',
      repoFull: 'hyperb1iss/sibyl',
      title: 'pushed 2× to main',
      url: 'https://github.com/hyperb1iss/sibyl/commit/abc',
    },
  ],
  generatedAt: '2026-06-18T12:00:00Z',
  ok: true,
  pushesPerDay: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3],
  repos: ['sibyl', 'haven'],
  totalPushes: 5,
  windowDays: 14,
}

const renderGh = () => {
  const h = makeHarness({ registry: shared })
  return render(<div>{shared.get('gh')?.run([], h.ctx)}</div>)
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('gh command', () => {
  it('registers under gh, activity, and stats', () => {
    expect(shared.get('gh')).toBeDefined()
    expect(shared.get('activity')).toBe(shared.get('gh'))
    expect(shared.get('stats')).toBe(shared.get('gh'))
  })

  it('shows a loading state, then the fetched activity', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => summary, ok: true }))
    renderGh()
    expect(screen.getByText('querying github…')).toBeInTheDocument()
    expect(await screen.findByText('pushed 2× to main')).toBeInTheDocument()
    expect(screen.getByText('sibyl')).toBeInTheDocument()
    expect(screen.getByText(/5 pushes · 2 repos/)).toBeInTheDocument()
  })

  it('surfaces an error when the endpoint is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    renderGh()
    expect(await screen.findByText(/github unreachable/)).toBeInTheDocument()
  })

  it('falls back gracefully when the summary is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ ...summary, events: [], ok: true }), ok: true }),
    )
    renderGh()
    expect(await screen.findByText(/quiet right now/)).toBeInTheDocument()
  })
})
