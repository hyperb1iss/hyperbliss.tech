// app/cyberscape/config/CyberScapeConfig.ts

/**
 * CyberScapeConfig class
 *
 * This class manages all configurable parameters for the CyberScape animation.
 * It allows for real-time adjustments while maintaining default values and mobile functionality.
 */
export class CyberScapeConfig {
  private static instance: CyberScapeConfig;

  // Animation and rendering
  public targetFPS: number = 60;
  public frameTime: number = 1000 / this.targetFPS;

  // Particle settings
  public particlePoolSize: number = 1000;
  public particlesPerPixel: number = 1 / 2000;
  public baseParticleCount: number = 250;
  public particleMinSpeed: number = 0.1;
  public particleMaxSpeed: number = 0.5;
  public particleSizeMin: number = 1.5;
  public particleSizeMax: number = 3.5;
  public particleLifespan: number = Infinity;

  // Particle At Collision settings
  public particleAtCollisionFadeOutDuration: number = 2000;
  public particleAtCollisionMaxSpeed: number = 3;
  public particleAtCollisionMinSpeed: number = 1;
  public particleAtCollisionSizeMax: number = 3;
  public particleAtCollisionSizeMin: number = 1;
  public particleAtCollisionColor: string = "#FF00FF";
  public particleAtCollisionLifespan: number = 3000;
  public particleAtCollisionSlowdownFactor: number = 0.98;
  public particleAtCollisionSparkleDecay: number = 0.02;
  public particleAtCollisionConnectionDistance: number = 100;
  public particleAtCollisionMaxConnectionsPerParticle: number = 5;
  public particleAtCollisionMaxTotalConnections: number = 50;
  public particleAtCollisionShapeDistortionRadius: number = 100;
  public particleAtCollisionShapeDistortionFactor: number = 0.1;

  // Shape settings
  public numberOfShapes: number = 6;
  public numberOfShapesMobile: number = 5;
  public shapeMinSpeed: number = 0.05;
  public shapeMaxSpeed: number = 0.3;
  public shapeLifespanMin: number = 10000;
  public shapeLifespanMax: number = 25000;
  public shapeFadeOutDuration: number = 3000;
  public shapeGlowIntensityMin: number = 15;
  public shapeGlowIntensityMax: number = 25;

  // Explosion settings
  public maxExplosionParticles: number = 200;
  public maxSimultaneousExplosions: number = 3;
  public explosionCooldown: number = 2000;
  public explosionParticlesToEmit: number = 10;

  // Datastream effect settings
  public maxDatastreamParticles: number = 100;
  public datastreamParticleLifespan: number = 2000;
  public datastreamFadeOutDuration: number = 500;

  // Interaction settings
  public cursorInfluenceRadius: number = 300;
  public cursorForce: number = 0.01;
  public centerAttractionForce: number = 0.005;

  // Glitch effect settings
  public glitchIntervalMin: number = 5000;
  public glitchIntervalMax: number = 10000;
  public glitchDurationMin: number = 100;
  public glitchDurationMax: number = 400;
  public glitchIntensityMin: number = 0.3;
  public glitchIntensityMax: number = 1;

  // Connection settings
  public particleConnectionDistance: number = 150;
  public shapeConnectionDistance: number = 120;

  // Mobile specific settings
  public mobileWidthThreshold: number = 768;
  public mobileParticleReductionFactor: number = 0.8;

  private constructor() {}

  /**
   * Gets the singleton instance of CyberScapeConfig.
   * @returns The CyberScapeConfig instance.
   */
  public static getInstance(): CyberScapeConfig {
    if (!CyberScapeConfig.instance) {
      CyberScapeConfig.instance = new CyberScapeConfig();
    }
    return CyberScapeConfig.instance;
  }

  /**
   * Updates the configuration with new values.
   * @param updates - Partial object with properties to update.
   */
  public updateConfig(updates: Partial<CyberScapeConfig>): void {
    Object.assign(this, updates);
    this.frameTime = 1000 / this.targetFPS;
  }

  /**
   * Calculates the number of particles based on canvas dimensions and device type.
   * @param width - Canvas width.
   * @param height - Canvas height.
   * @returns The calculated number of particles.
   */
  public calculateParticleCount(width: number, height: number): number {
    const isMobile = width <= this.mobileWidthThreshold;
    let count = Math.max(
      this.baseParticleCount,
      Math.floor(width * height * this.particlesPerPixel)
    );
    if (isMobile) {
      count = Math.floor(count * this.mobileParticleReductionFactor);
    }
    return count;
  }

  /**
   * Determines the number of shapes based on device type.
   * @param width - Canvas width.
   * @returns The number of shapes to display.
   */
  public getShapeCount(width: number): number {
    return width <= this.mobileWidthThreshold
      ? this.numberOfShapesMobile
      : this.numberOfShapes;
  }
}
