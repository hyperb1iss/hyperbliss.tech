// app/cyberscape/effects/GlitchManager.ts

/**
 * GlitchManager class
 *
 * Decides when a shimmer fires and shapes its intensity envelope; the look
 * itself lives in GlitchEffect.
 */

import { CyberScapeConfig } from '../CyberScapeConfig'
import { GlitchEffect } from './GlitchEffect'

export class GlitchManager {
  private glitchEffect: GlitchEffect
  private config: CyberScapeConfig
  private isGlitching = false
  private lastGlitchTime = 0
  private glitchIntensity = 0
  private glitchInterval: number
  private glitchDuration: number

  constructor() {
    this.glitchEffect = new GlitchEffect()
    this.config = CyberScapeConfig.getInstance()
    this.glitchInterval = this.config.glitchIntervalMin
    this.glitchDuration = this.config.glitchDurationMin
  }

  /**
   * Forces a glitch on the next frame. Exposed for the debug hook so the
   * effect can be inspected without waiting out the interval.
   */
  public trigger(): void {
    this.isGlitching = false
    this.glitchInterval = 0
    this.lastGlitchTime = 0
  }

  /**
   * Keeps the interval clock from advancing while the field is calm, so a
   * pending glitch does not fire the moment the field wakes.
   */
  public hold(timestamp: number): void {
    if (!this.isGlitching) {
      this.lastGlitchTime = timestamp
    }
  }

  /**
   * Fires a glitch on the configured random interval and runs its envelope.
   * @param ctx - The 2D rendering context of the canvas.
   * @param timestamp - The current animation timestamp.
   */
  public handleGlitchEffects(ctx: CanvasRenderingContext2D, timestamp: number): void {
    const now = timestamp

    if (!this.isGlitching && now - this.lastGlitchTime > this.glitchInterval) {
      this.isGlitching = true
      this.glitchIntensity =
        Math.random() * (this.config.glitchIntensityMax - this.config.glitchIntensityMin) +
        this.config.glitchIntensityMin
      this.glitchDuration =
        Math.random() * (this.config.glitchDurationMax - this.config.glitchDurationMin) + this.config.glitchDurationMin
      this.lastGlitchTime = now
      this.glitchInterval =
        Math.random() * (this.config.glitchIntervalMax - this.config.glitchIntervalMin) + this.config.glitchIntervalMin
      this.glitchEffect.begin()
    }

    if (this.isGlitching) {
      const progress = (now - this.lastGlitchTime) / this.glitchDuration
      if (progress >= 1) {
        this.isGlitching = false
      } else {
        const fadeIntensity = Math.sin(progress * Math.PI) * this.glitchIntensity
        this.glitchEffect.apply(ctx, fadeIntensity, progress)
      }
    }
  }
}
