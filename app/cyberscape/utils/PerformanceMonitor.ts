/**
 * PerformanceMonitor class for tracking and logging performance metrics.
 *
 * To use:
 * window.cyberScapePerformance('start')
 */
import { CyberScapeConfig } from '../CyberScapeConfig'

export class PerformanceMonitor {
  private config: CyberScapeConfig
  private fpsHistory: number[] = []
  private lastCheck = 0
  private checkInterval = 1000 // Check every second
  private enabled = true
  private targetFPS = 30
  private adjustmentThreshold = 5 // FPS difference that triggers adjustment
  private performanceLevel = 1 // Scale from 0 (lowest) to 1 (highest)

  /**
   * The tuned config values at construction. Adaptive scaling multiplies these
   * rather than hardcoding its own ceilings, so a calmer baseline stays calm.
   */
  private readonly baseline: {
    baseParticleCount: number
    glitchEffectMaxAmount: number
    glitchEffectMaxNumLines: number
    glitchEffectMaxNumSlices: number
    mobileParticleReductionFactor: number
    numberOfShapes: number
    numberOfShapesMobile: number
    particleAtCollisionMaxConnectionsPerParticle: number
    particleAtCollisionMaxTotalConnections: number
    particlePoolSize: number
    particlesPerPixel: number
  }

  constructor() {
    this.config = CyberScapeConfig.getInstance()
    this.targetFPS = this.config.targetFPS
    const c = this.config
    this.baseline = {
      baseParticleCount: c.baseParticleCount,
      glitchEffectMaxAmount: c.glitchEffectMaxAmount,
      glitchEffectMaxNumLines: c.glitchEffectMaxNumLines,
      glitchEffectMaxNumSlices: c.glitchEffectMaxNumSlices,
      mobileParticleReductionFactor: c.mobileParticleReductionFactor,
      numberOfShapes: c.numberOfShapes,
      numberOfShapesMobile: c.numberOfShapesMobile,
      particleAtCollisionMaxConnectionsPerParticle: c.particleAtCollisionMaxConnectionsPerParticle,
      particleAtCollisionMaxTotalConnections: c.particleAtCollisionMaxTotalConnections,
      particlePoolSize: c.particlePoolSize,
      particlesPerPixel: c.particlesPerPixel,
    }
  }

  public enable(): void {
    this.enabled = true
  }

  public disable(): void {
    this.enabled = false
  }

  public update(timestamp: number, deltaTime: number): void {
    if (!this.enabled) return

    // Calculate current FPS
    const currentFPS = 1000 / deltaTime
    this.fpsHistory.push(currentFPS)

    // Keep history limited to last 60 frames
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift()
    }

    // Check performance periodically
    if (timestamp - this.lastCheck >= this.checkInterval) {
      this.checkPerformance()
      this.lastCheck = timestamp
    }
  }

  private checkPerformance(): void {
    if (this.fpsHistory.length < 30) return

    // Calculate average FPS
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length
    const fpsDiff = this.targetFPS - avgFPS

    // Running above target (a 120Hz display, say) is not a reason to touch anything.
    // Step down when we miss the target, step back up only while we are still degraded.
    if (fpsDiff > this.adjustmentThreshold && this.performanceLevel > 0) {
      this.performanceLevel = Math.max(0, this.performanceLevel - 0.1)
      this.adjustSettings()
    } else if (fpsDiff < -this.adjustmentThreshold && this.performanceLevel < 1) {
      this.performanceLevel = Math.min(1, this.performanceLevel + 0.1)
      this.adjustSettings()
    }
  }

  private adjustSettings(): void {
    const level = this.performanceLevel
    const b = this.baseline
    const updates: Partial<CyberScapeConfig> = {
      baseParticleCount: Math.floor(b.baseParticleCount * level),
      effectsScaleFactor: level,

      // Visual effects adjustments
      glitchEffectMaxAmount: Math.floor(b.glitchEffectMaxAmount * level),
      glitchEffectMaxNumLines: Math.floor(b.glitchEffectMaxNumLines * level),
      glitchEffectMaxNumSlices: Math.floor(b.glitchEffectMaxNumSlices * level),

      // Mobile specific adjustments
      mobileParticleReductionFactor: Math.max(0.3, b.mobileParticleReductionFactor * level),

      // Shape adjustments
      numberOfShapes: Math.max(2, Math.floor(b.numberOfShapes * level)),
      numberOfShapesMobile: Math.max(2, Math.floor(b.numberOfShapesMobile * level)),

      // Connection adjustments
      particleAtCollisionMaxConnectionsPerParticle: Math.floor(b.particleAtCollisionMaxConnectionsPerParticle * level),
      particleAtCollisionMaxTotalConnections: Math.floor(b.particleAtCollisionMaxTotalConnections * level),
      // Particle adjustments
      particlePoolSize: Math.floor(b.particlePoolSize * level),

      // Scale factors
      particleScaleFactor: level,
      particlesPerPixel: b.particlesPerPixel * level,
    }

    this.config.updateConfig(updates)
  }

  public getPerformanceLevel(): number {
    return this.performanceLevel
  }
}
