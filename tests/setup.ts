// tests/setup.ts
import '@testing-library/jest-dom'

class ResizeObserverMock implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = ResizeObserverMock

// Add Response polyfill
global.Response = class Response {
  private body: string
  private options: ResponseInit

  constructor(body: string | null, options: ResponseInit = {}) {
    this.body = body || ''
    this.options = options
  }

  text(): Promise<string> {
    return Promise.resolve(this.body)
  }

  headers = {
    get: (name: string): string | null => {
      return (this.options.headers as Record<string, string>)?.[name] || null
    },
  }
} as unknown as typeof Response
