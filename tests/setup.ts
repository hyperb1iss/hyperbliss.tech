// tests/setup.ts
import '@testing-library/jest-dom/vitest'

class ResizeObserverMock implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = ResizeObserverMock
