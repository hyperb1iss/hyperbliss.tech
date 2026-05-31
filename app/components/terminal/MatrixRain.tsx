'use client'

// `matrix` easter egg (T4.3). A self-contained digital-rain canvas appended to
// the output log. Runs for a few seconds then freezes (so it never burns CPU
// once scrolled away). Reduced motion gets a static line instead.

import { useEffect, useRef, useState } from 'react'
import { styled } from '../../../styled-system/jsx'

const GLYPHS = 'アイウエオカキクケコサシスセソﾊﾋﾌﾍﾎ0123456789∆◊∑λ≡<>/\\{}[]#$%'
const DURATION_MS = 6000
const FONT_SIZE = 14

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

    let raf = 0
    let stopped = false
    const start = performance.now()

    const draw = (now: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, width, height)
      ctx.font = `${FONT_SIZE}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE
        ctx.fillStyle = drops[i] * FONT_SIZE > height - FONT_SIZE * 2 ? '#80ffea' : '#50fa7b'
        ctx.fillText(char, x, y)
        if (y > height && Math.random() > 0.975) drops[i] = 0
        drops[i] += 1
      }
      if (!stopped && now - start < DURATION_MS) raf = requestAnimationFrame(draw)
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
