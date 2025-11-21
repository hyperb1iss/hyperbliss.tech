// app/cyberscape/CyberScapeConfig.ts

/**
 * CyberScapeConfig class
 *
 * This class manages all configurable parameters for the CyberScape animation.
 * It allows for real-time adjustments while maintaining default values and mobile functionality.
 */
export class CyberScapeConfig {
  private static instance: CyberScapeConfig

  // Animation and rendering
  public targetFPS = 30
  public frameTime: number = 1000 / this.targetFPS

  // Particle settings
  public particlePoolSize = 500
  public particlesPerPixel: number = 1 / 2000
  public baseParticleCount = 100
  public particleMinSpeed = 0.1
  public particleMaxSpeed = 0.5
  public particleSizeMin = 1.5
  public particleSizeMax = 3.5
  public particleLifespan: number = Number.POSITIVE_INFINITY

  // Particle At Collision settings
  public particleAtCollisionFadeOutDuration = 2000
  public particleAtCollisionMaxSpeed = 3
  public particleAtCollisionMinSpeed = 1
  public particleAtCollisionSizeMax = 3
  public particleAtCollisionSizeMin = 1
  public particleAtCollisionColor = '#ff75d8'
  public particleAtCollisionLifespan = 3000
  public particleAtCollisionSlowdownFactor = 0.98
  public particleAtCollisionSparkleDecay = 0.02
  public particleAtCollisionConnectionDistance = 100
  public particleAtCollisionMaxConnectionsPerParticle = 5
  public particleAtCollisionMaxTotalConnections = 50
  public particleAtCollisionShapeDistortionRadius = 100
  public particleAtCollisionShapeDistortionFactor = 0.1

  // Shape settings
  public numberOfShapes = 6
  public numberOfShapesMobile = 5
  public shapeMinSpeed = 0.05
  public shapeMaxSpeed = 0.3
  public shapeLifespanMin = 10000
  public shapeLifespanMax = 25000
  public shapeFadeOutDuration = 3000
  public shapeGlowIntensityMin = 15
  public shapeGlowIntensityMax = 25

  // Explosion settings
  public maxExplosionParticles = 100
  public maxSimultaneousExplosions = 3
  public explosionCooldown = 2000
  public explosionParticlesToEmit = 10

  // Datastream effect settings
  public maxDatastreamParticles = 100
  public datastreamParticleLifespan = 2000
  public datastreamFadeOutDuration = 500
  public datastreamEnergyLineCount = 20
  public datastreamMaxRadiusFactor = 0.4
  public datastreamNoiseSize = 4
  public datastreamNoiseRadiusFactor = 0.2
  public datastreamShapeRotationSpeed = 0.1
  public datastreamShapeForceMultiplier = 0.01
  public datastreamIntensityMultiplier = 5

  // Interaction settings
  public cursorInfluenceRadius = 300
  public cursorForce = 0.01
  public centerAttractionForce = 0.005
  public particleInteractionRadius = 100
  public particleInteractionForce = 0.1
  public shapeParticleInteractionRadius = 100
  public shapeParticleInteractionForce = 0.01
  public shapeAttractionRadius = 200
  public shapeRepulsionRadius = 80
  public shapeAttractionForce = 0.0005
  public shapeRepulsionForce = 0.001

  // Glitch effect settings
  public glitchIntervalMin = 10000
  public glitchIntervalMax = 20000
  public glitchDurationMin = 100
  public glitchDurationMax = 400
  public glitchIntensityMin = 0.3
  public glitchIntensityMax = 1

  // Glitch effect detail settings
  public glitchEffectMaxAmount = 15
  public glitchEffectDisplacementThresholdFactor = 0.2
  public glitchEffectMaxNumLines = 30
  public glitchEffectMaxNumSlices = 8
  public glitchEffectMaxNumBlocks = 5
  public glitchEffectNoiseIntensityFactor = 0.2

  // Connection settings
  public particleConnectionDistance = 100
  public shapeConnectionDistance = 120
  public connectionAnimationDuration = 1000 // Default duration in milliseconds

  // Mobile specific settings
  public mobileWidthThreshold = 768
  public mobileParticleReductionFactor = 0.8

  // New properties
  public collisionGridSize = 100
  public minConnectionDelay = 100
  public maxConnectionDelay = 500

  public canvasWidth = 800
  public canvasHeight = 600

  public performanceMode: 'high' | 'medium' | 'low' = 'high'
  public autoAdjustPerformance = true
  public minFPS = 24
  public performanceCheckInterval = 1000
  public particleScaleFactor = 1
  public effectsScaleFactor = 1

  private constructor() {}

  /**
   * Gets the singleton instance of CyberScapeConfig.
   * @returns The CyberScapeConfig instance.
   */
  public static getInstance(): CyberScapeConfig {
    if (!CyberScapeConfig.instance) {
      CyberScapeConfig.instance = new CyberScapeConfig()
    }
    return CyberScapeConfig.instance
  }

  /**
   * Updates the configuration with new values.
   * @param updates - Partial object with properties to update.
   */
  public updateConfig(updates: Partial<CyberScapeConfig>): void {
    Object.assign(this, updates)
    this.frameTime = 1000 / this.targetFPS
  }

  public updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width
    this.canvasHeight = height
  }
  /**
   * Calculates the number of particles based on canvas dimensions and device type.
   * @param width - Canvas width.
   * @param height - Canvas height.
   * @returns The calculated number of particles.
   */
  public calculateParticleCount(width: number, height: number): number {
    const isMobile = width <= this.mobileWidthThreshold
    let count = Math.max(this.baseParticleCount, Math.floor(width * height * this.particlesPerPixel))
    if (isMobile) {
      count = Math.floor(count * this.mobileParticleReductionFactor)
    }
    return count
  }

  /**
   * Determines the number of shapes based on device type.
   * @param width - Canvas width.
   * @returns The number of shapes to display.
   */
  public getShapeCount(width: number): number {
    return width <= this.mobileWidthThreshold ? this.numberOfShapesMobile : this.numberOfShapes
  }
}
