// @vitest-environment node

import { describe, expect, it } from 'vitest'
import config from '../next.config.mjs'

describe('security headers', () => {
  it('sets explicit public WebMCP env defaults for static client folding', () => {
    expect(config.env).toMatchObject({
      NEXT_PUBLIC_TERMINAL_HERO: 'true',
      NEXT_PUBLIC_WEBMCP: 'true',
      // Agent shell exec is opt-in by default; only the env can turn it on.
      NEXT_PUBLIC_WEBMCP_SHELL: 'false',
    })
  })

  it('preserves privacy policy entries and names no origin-trial features', async () => {
    const headers = await config.headers()
    const globalHeaders = headers.find((entry) => entry.source === '/(.*)')?.headers ?? []
    const permissions = globalHeaders.find((header) => header.key === 'Permissions-Policy')?.value

    expect(permissions).toContain('camera=()')
    expect(permissions).toContain('microphone=()')
    expect(permissions).toContain('geolocation=()')
    // WebMCP's `tools` defaults to self; naming it logs a console error in
    // every browser without the origin trial.
    expect(permissions).not.toContain('tools')
  })
})
