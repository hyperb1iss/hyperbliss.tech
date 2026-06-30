import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import StatusBoard from '@/components/terminal/StatusBoard'
import { testBroadcast } from './_harness'

class FakeModelContext extends EventTarget implements ModelContext {
  constructor(private readonly tools: ModelContextTool[]) {
    super()
  }

  registerTool(): void {}

  async getTools(): Promise<ModelContextTool[]> {
    return this.tools
  }
}

class PartialModelContext extends EventTarget implements ModelContext {
  registerTool(): void {}
}

class ThrowingModelContext extends EventTarget implements ModelContext {
  registerTool(): void {}

  async getTools(): Promise<ModelContextTool[]> {
    throw new Error('boom')
  }
}

function installModelContext(modelContext: ModelContext | undefined) {
  Object.defineProperty(document, 'modelContext', {
    configurable: true,
    value: modelContext,
  })
}

afterEach(() => {
  cleanup()
  installModelContext(undefined)
  vi.unstubAllEnvs()
})

describe('StatusBoard WebMCP status', () => {
  it('reports disabled when the site flag is off even if the browser API exists', () => {
    vi.stubEnv('NEXT_PUBLIC_TERMINAL_HERO', 'true')
    vi.stubEnv('NEXT_PUBLIC_WEBMCP', 'false')
    installModelContext(
      new FakeModelContext([{ description: 'Tool', inputSchema: { type: 'object' }, name: 'whats_now' }]),
    )

    render(<StatusBoard broadcast={testBroadcast} />)

    expect(screen.getByText('WebMCP disabled')).toBeInTheDocument()
  })

  it('reports ready with the registered tool count when enabled and supported', async () => {
    vi.stubEnv('NEXT_PUBLIC_TERMINAL_HERO', 'true')
    vi.stubEnv('NEXT_PUBLIC_WEBMCP', 'true')
    installModelContext(
      new FakeModelContext([
        { description: 'Tool', inputSchema: { type: 'object' }, name: 'whats_now' },
        { description: 'Tool', inputSchema: { type: 'object' }, name: 'get_site_status' },
      ]),
    )

    render(<StatusBoard broadcast={testBroadcast} />)

    await waitFor(() => expect(screen.getByText('ready · 2 tools')).toBeInTheDocument())
  })

  it('reports unsupported when getTools is absent or fails', async () => {
    vi.stubEnv('NEXT_PUBLIC_TERMINAL_HERO', 'true')
    vi.stubEnv('NEXT_PUBLIC_WEBMCP', 'true')
    installModelContext(new PartialModelContext())

    const rendered = render(<StatusBoard broadcast={testBroadcast} />)
    await waitFor(() => expect(screen.getByText('WebMCP unsupported')).toBeInTheDocument())

    rendered.unmount()
    installModelContext(new ThrowingModelContext())
    render(<StatusBoard broadcast={testBroadcast} />)
    await waitFor(() => expect(screen.getByText('WebMCP unsupported')).toBeInTheDocument())
  })
})
