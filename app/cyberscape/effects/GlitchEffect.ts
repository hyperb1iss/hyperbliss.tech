// app/cyberscape/effects/GlitchEffect.ts

/**
 * GlitchEffect class
 *
 * A restrained signal shimmer built from canvas primitives only: a pink and a
 * cyan echo of the frame offset sideways (chromatic aberration in palette
 * colours), a couple of thin horizontal slices nudged a few pixels, and one
 * scanline sweep. No pixel loops, no random hues, no inversion, so it stays
 * on brand and on the GPU.
 */

import { CyberScapeConfig } from '../CyberScapeConfig'

const ECHO_PINK = '#ff75d8'
const ECHO_CYAN = '#00fff0'
const SWEEP_CYAN = 'rgba(0, 255, 240, 1)'

export class GlitchEffect {
  private config: CyberScapeConfig
  private tint: HTMLCanvasElement | null = null
  private tintCtx: CanvasRenderingContext2D | null = null

  /** Slice rows are picked once per glitch so they hold still instead of buzzing */
  private sliceSeeds: number[] = []

  constructor() {
    this.config = CyberScapeConfig.getInstance()
  }

  /**
   * Picks the slice rows for a new glitch burst.
   */
  public begin(): void {
    this.sliceSeeds = []
    for (let i = 0; i < this.config.glitchMaxSlices; i++) {
      this.sliceSeeds.push(Math.random())
    }
  }

  /**
   * Applies the shimmer on top of the finished frame.
   *
   * @param ctx - The 2D rendering context of the canvas.
   * @param intensity - Effect strength (0-1), already shaped by the manager's envelope.
   * @param progress - Position within the glitch (0-1), drives the scanline sweep.
   */
  public apply(ctx: CanvasRenderingContext2D, intensity: number, progress: number): void {
    const canvas = ctx.canvas
    const pw = canvas.width
    const ph = canvas.height
    if (pw === 0 || ph === 0) return

    const dpr = pw / Math.max(1, canvas.clientWidth || pw)
    const offset = this.config.glitchMaxOffsetPx * intensity * dpr

    ctx.save()
    ctx.resetTransform()

    // Chromatic echoes: a tinted silhouette of the frame, shifted left in pink and right in cyan
    const tintCtx = this.getTintContext(pw, ph)
    if (tintCtx) {
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.45 * intensity
      this.drawEcho(ctx, tintCtx, canvas, ECHO_PINK, -offset)
      this.drawEcho(ctx, tintCtx, canvas, ECHO_CYAN, offset)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
    }

    // Horizontal slices nudged sideways, redrawn from the canvas itself
    const sliceHeight = Math.max(2, Math.round(ph * 0.06))
    for (let i = 0; i < this.sliceSeeds.length; i++) {
      const seed = this.sliceSeeds[i]
      const y = Math.floor(seed * (ph - sliceHeight))
      const shift = (seed < 0.5 ? -1 : 1) * offset * (1.5 + i)
      ctx.drawImage(canvas, 0, y, pw, sliceHeight, shift, y, pw, sliceHeight)
    }

    // A single soft scanline band sweeping top to bottom over the glitch
    const bandHeight = Math.max(4, ph * 0.22)
    const bandY = progress * (ph + bandHeight) - bandHeight
    const band = ctx.createLinearGradient(0, bandY, 0, bandY + bandHeight)
    band.addColorStop(0, 'rgba(0, 255, 240, 0)')
    band.addColorStop(0.5, SWEEP_CYAN)
    band.addColorStop(1, 'rgba(0, 255, 240, 0)')
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = 0.08 * intensity
    ctx.fillStyle = band
    ctx.fillRect(0, bandY, pw, bandHeight)

    ctx.restore()
  }

  /**
   * Tints the current frame flat in one colour on the scratch canvas and blits it offset.
   */
  private drawEcho(
    ctx: CanvasRenderingContext2D,
    tintCtx: CanvasRenderingContext2D,
    source: HTMLCanvasElement,
    color: string,
    dx: number,
  ): void {
    const w = source.width
    const h = source.height
    tintCtx.globalCompositeOperation = 'source-over'
    tintCtx.clearRect(0, 0, w, h)
    tintCtx.drawImage(source, 0, 0)
    tintCtx.globalCompositeOperation = 'source-in'
    tintCtx.fillStyle = color
    tintCtx.fillRect(0, 0, w, h)
    ctx.drawImage(tintCtx.canvas, dx, 0)
  }

  private getTintContext(w: number, h: number): CanvasRenderingContext2D | null {
    if (!this.tint) {
      this.tint = document.createElement('canvas')
      this.tintCtx = this.tint.getContext('2d')
    }
    if (this.tint.width !== w || this.tint.height !== h) {
      this.tint.width = w
      this.tint.height = h
    }
    return this.tintCtx
  }
}
