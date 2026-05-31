'use client'

// `matrix` easter egg (T4.3). A self-contained digital-rain canvas appended to
// the output log. Runs for a few seconds then freezes (so it never burns CPU
// once scrolled away). Reduced motion gets a static line instead.

import { useEffect, useRef, useState } from 'react'
import { styled } from '../../../styled-system/jsx'

const GLYPHS = 'アイウエオカキクケコサシスセソﾊﾋﾌﾍﾎ0123456789∆◊∑λ≡<>/\\{}[]#$%'
const DURATION_MS = 9000
const FONT_SIZE = 14
// Advance the cascade on a chunky time-step (not every frame) for the classic,
// deliberate Matrix fall instead of a frantic blur.
const STEP_MS = 85

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 180px;
  border-radius: var(--radius-md);
  background: rgba(0, 0, 0, 0.85);
`

const Static = styled.div`
  font-family: var(--font-mono);
  color: var(--silk-success);
  padding: var(--space-2) 0;
`

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true)
      return
    }
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const width = canvas.width
    const height = canvas.height
    const columns = Math.floor(width / FONT_SIZE)
    const drops = new Array(columns).fill(0).map(() => Math.floor((Math.random() * height) / FONT_SIZE))
    // Per-column speed (rows per step) — a few faster columns make the cascade
    // feel organic instead of a uniform wall.
    const speeds = new Array(columns).fill(0).map(() => (Math.random() < 0.25 ? 2 : 1))

    let raf = 0
    let stopped = false
    const start = performance.now()
    let lastStep = 0

    const draw = (now: number) => {
      if (!stopped && now - start < DURATION_MS) raf = requestAnimationFrame(draw)
      if (now - lastStep < STEP_MS) return
      lastStep = now

      // Fade the previous frame toward black — this is the trailing glow.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.09)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE
        // Most chars green; an occasional bright leading char shimmers.
        ctx.fillStyle = Math.random() > 0.92 ? '#c8ffe9' : '#50fa7b'
        ctx.fillText(char, x, y)
        if (y > height && Math.random() > 0.975) drops[i] = 0
        drops[i] += speeds[i]
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
    }
  }, [])

  if (reduced) {
    return <Static>the matrix has you ▒▒▒ (motion reduced)</Static>
  }
  return <Canvas aria-label="Matrix digital rain animation" ref={canvasRef} />
}
