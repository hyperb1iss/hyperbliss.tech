import { cleanup, render, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TerminalHero from '@/components/terminal/TerminalHero'
import { testBroadcast, testManifest } from './_harness'

vi.mock('next/dynamic', () => ({
  default: () =>
    function MockTerminal() {
      return null
    },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/analytics', () => ({
  trackTerminalCommand: vi.fn(),
}))

class FakeModelContext extends EventTarget implements ModelContext {
  readonly registered = new Map<string, ModelContextRegisteredTool>()

  registerTool(tool: ModelContextRegisteredTool, options?: ModelContextRegisterToolOptions): void {
    this.registered.set(tool.name, tool)
    options?.signal?.addEventListener(
      'abort',
      () => {
        this.registered.delete(tool.name)
        this.dispatchEvent(new Event('toolchange'))
      },
      { once: true },
    )
    this.dispatchEvent(new Event('toolchange'))
  }
}

function installModelContext(modelContext: ModelContext | undefined) {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: modelContext,
  })
}

describe('TerminalHero WebMCP registration', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_TERMINAL_HERO', 'true')
    vi.stubEnv('NEXT_PUBLIC_WEBMCP', 'true')
  })

  afterEach(() => {
    cleanup()
    installModelContext(undefined)
    vi.unstubAllEnvs()
  })

  it('registers WebMCP tools on mount and unregisters them on unmount', async () => {
    const modelContext = new FakeModelContext()
    installModelContext(modelContext)

    const rendered = render(<TerminalHero broadcast={testBroadcast} manifest={testManifest} />)
    await waitFor(() => expect(modelContext.registered.size).toBe(7))

    rendered.unmount()
    await waitFor(() => expect(modelContext.registered.size).toBe(0))
  })
})
