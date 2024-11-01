/**
 * PerformanceMonitor class for tracking and logging performance metrics.
 *
 * To use:
 * window.cyberScapePerformance('start')
 */
import { CyberScapeConfig } from "../CyberScapeConfig";

export class PerformanceMonitor {
  private config: CyberScapeConfig;
  private fpsHistory: number[] = [];
  private lastCheck: number = 0;
  private checkInterval: number = 1000; // Check every second
  private enabled: boolean = true;
  private targetFPS: number = 30;
  private adjustmentThreshold: number = 5; // FPS difference that triggers adjustment
  private performanceLevel: number = 1; // Scale from 0 (lowest) to 1 (highest)

  constructor() {
    this.config = CyberScapeConfig.getInstance();
    this.targetFPS = this.config.targetFPS;
  }

  public enable(): void {
    this.enabled = true;
  }

  public disable(): void {
    this.enabled = false;
  }

  public update(timestamp: number, deltaTime: number): void {
    if (!this.enabled) return;

    // Calculate current FPS
    const currentFPS = 1000 / deltaTime;
    this.fpsHistory.push(currentFPS);

    // Keep history limited to last 60 frames
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Check performance periodically
    if (timestamp - this.lastCheck >= this.checkInterval) {
      this.checkPerformance();
      this.lastCheck = timestamp;
    }
  }

  private checkPerformance(): void {
    if (this.fpsHistory.length < 30) return;

    // Calculate average FPS
    const avgFPS =
      this.fpsHistory.reduce((a, b) => a + b) / this.fpsHistory.length;
    const fpsDiff = this.targetFPS - avgFPS;

    if (Math.abs(fpsDiff) > this.adjustmentThreshold) {
      // Adjust performance level
      this.performanceLevel = Math.max(
        0,
        Math.min(1, this.performanceLevel + (fpsDiff > 0 ? -0.1 : 0.1))
      );

      this.adjustSettings();
    }
  }

  private adjustSettings(): void {
    const updates: Partial<CyberScapeConfig> = {
      // Particle adjustments
      particlePoolSize: Math.floor(1000 * this.performanceLevel),
      particlesPerPixel: (1 / 2000) * this.performanceLevel,
      baseParticleCount: Math.floor(200 * this.performanceLevel),

      // Shape adjustments
      numberOfShapes: Math.max(3, Math.floor(6 * this.performanceLevel)),
      numberOfShapesMobile: Math.max(2, Math.floor(5 * this.performanceLevel)),

      // Visual effects adjustments
      glitchEffectMaxAmount: Math.floor(15 * this.performanceLevel),
      glitchEffectMaxNumLines: Math.floor(30 * this.performanceLevel),
      glitchEffectMaxNumSlices: Math.floor(8 * this.performanceLevel),

      // Connection adjustments
      particleAtCollisionMaxConnectionsPerParticle: Math.floor(
        5 * this.performanceLevel
      ),
      particleAtCollisionMaxTotalConnections: Math.floor(
        50 * this.performanceLevel
      ),

      // Mobile specific adjustments
      mobileParticleReductionFactor: Math.max(0.3, 0.8 * this.performanceLevel),

      // Scale factors
      particleScaleFactor: this.performanceLevel,
      effectsScaleFactor: this.performanceLevel,
    };

    this.config.updateConfig(updates);
  }

  public getPerformanceLevel(): number {
    return this.performanceLevel;
  }
}
