'use client'

import type { RefObject } from 'react'
import { useEffect } from 'react'

type Cleanup = () => void

export interface CanvasAnimationLifecycle {
  addResizeListener: (listener: () => void) => void
  addVisibilityListener: (listener: () => void) => void
  cancelFrame: (id: number) => void
  requestFrame: (callback: FrameRequestCallback) => number
}

interface CanvasAnimationContext {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  lifecycle: CanvasAnimationLifecycle
}

export type CanvasAnimationSetup = (context: CanvasAnimationContext) => Cleanup | undefined

export function useCanvasAnimation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  setupAnimation: CanvasAnimationSetup,
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const cleanups: Cleanup[] = []
    const frameIds = new Set<number>()

    const lifecycle: CanvasAnimationLifecycle = {
      addResizeListener: (listener) => {
        window.addEventListener('resize', listener)
        cleanups.push(() => window.removeEventListener('resize', listener))
      },
      addVisibilityListener: (listener) => {
        document.addEventListener('visibilitychange', listener)
        cleanups.push(() => document.removeEventListener('visibilitychange', listener))
      },
      cancelFrame: (id) => {
        window.cancelAnimationFrame(id)
        frameIds.delete(id)
      },
      requestFrame: (callback) => {
        const id = window.requestAnimationFrame((time) => {
          frameIds.delete(id)
          callback(time)
        })
        frameIds.add(id)
        return id
      },
    }

    const setupCleanup = setupAnimation({ canvas, context, lifecycle })

    return () => {
      setupCleanup?.()

      for (const cleanup of [...cleanups].reverse()) {
        cleanup()
      }

      for (const frameId of frameIds) {
        window.cancelAnimationFrame(frameId)
      }
      frameIds.clear()
    }
  }, [canvasRef, setupAnimation])
}
