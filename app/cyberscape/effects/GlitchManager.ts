// app/cyberscape/managers/GlitchManager.ts

/**
 * GlitchManager class
 *
 * Manages the timing and application of glitch effects.
 * It controls when and how the glitch effects are applied to the canvas.
 */

import { CyberScapeConfig } from '../CyberScapeConfig'
import { ChromaticAberrationEffect } from './ChromaticAberrationEffect'
import { CRTEffect } from './CRTEffect'
import { GlitchEffect } from './GlitchEffect'

export class GlitchManager {
  private glitchEffect: GlitchEffect
  private chromaticAberrationEffect: ChromaticAberrationEffect
  private crtEffect: CRTEffect
  private config: CyberScapeConfig
  private isGlitching = false
  private lastGlitchTime = 0
  private glitchIntensity = 0
  private glitchInterval: number
  private glitchDuration: number

  constructor() {
    this.glitchEffect = new GlitchEffect()
    this.chromaticAberrationEffect = new ChromaticAberrationEffect()
    this.crtEffect = new CRTEffect()
    this.config = CyberScapeConfig.getInstance()
    this.glitchInterval = this.config.glitchIntervalMin
    this.glitchDuration = this.config.glitchDurationMin
  }

  /**
   * Handles the application of glitch effects based on timing and intensity.
   * @param ctx - The 2D rendering context of the canvas.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param timestamp - The current timestamp.
   */
  public handleGlitchEffects(ctx: CanvasRenderingContext2D, width: number, height: number, timestamp: number) {
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
    }

    if (this.isGlitching) {
      const glitchProgress = (now - this.lastGlitchTime) / this.glitchDuration
      if (glitchProgress >= 1) {
        this.isGlitching = false
      } else {
        const fadeIntensity = Math.sin(glitchProgress * Math.PI) * this.glitchIntensity
        this.glitchEffect.apply(ctx, width, height, fadeIntensity)
        this.chromaticAberrationEffect.apply(ctx, width, height, fadeIntensity * 15)
        this.crtEffect.apply(ctx, width, height, fadeIntensity * 0.5)
      }
    }
  }
}
