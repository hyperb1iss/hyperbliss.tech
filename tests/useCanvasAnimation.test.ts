import { renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { useCanvasAnimation } from '@/hooks/useCanvasAnimation'

function createCanvasRef(context: CanvasRenderingContext2D | null = {} as CanvasRenderingContext2D) {
  const canvas = {
    getContext: vi.fn((kind: string) => (kind === '2d' ? context : null)),
  } as unknown as HTMLCanvasElement

  return { current: canvas } satisfies RefObject<HTMLCanvasElement | null>
}

describe('useCanvasAnimation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('cleans up registered listeners and pending animation frames on unmount', () => {
    const context = {} as CanvasRenderingContext2D
    const ref = createCanvasRef(context)
    const resizeListener = vi.fn()
    const visibilityListener = vi.fn()

    const addWindowListener = vi.spyOn(window, 'addEventListener')
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    const addDocumentListener = vi.spyOn(document, 'addEventListener')
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 42)
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)

    const setupAnimation = vi.fn(({ canvas, context: setupContext, lifecycle }) => {
      expect(canvas).toBe(ref.current)
      expect(setupContext).toBe(context)

      lifecycle.addResizeListener(resizeListener)
      lifecycle.addVisibilityListener(visibilityListener)
      lifecycle.requestFrame(() => undefined)
    })

    const { unmount } = renderHook(() => useCanvasAnimation(ref, setupAnimation))

    expect(setupAnimation).toHaveBeenCalledTimes(1)
    expect(addWindowListener).toHaveBeenCalledWith('resize', resizeListener)
    expect(addDocumentListener).toHaveBeenCalledWith('visibilitychange', visibilityListener)
    expect(requestFrame).toHaveBeenCalledTimes(1)

    unmount()

    expect(removeWindowListener).toHaveBeenCalledWith('resize', resizeListener)
    expect(removeDocumentListener).toHaveBeenCalledWith('visibilitychange', visibilityListener)
    expect(cancelFrame).toHaveBeenCalledWith(42)
  })

  it('skips setup when the canvas context is unavailable', () => {
    const setupAnimation = vi.fn()

    renderHook(() => useCanvasAnimation(createCanvasRef(null), setupAnimation))

    expect(setupAnimation).not.toHaveBeenCalled()
  })
})
