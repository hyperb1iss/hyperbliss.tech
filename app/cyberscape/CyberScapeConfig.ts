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
  public targetFPS = 60
  public frameTime: number = 1000 / this.targetFPS
  /**
   * Duration of one simulation tick. Every per-frame constant below (speeds,
   * forces, fade rates) was tuned against a 30fps loop, so a tick is 1/30s and
   * the render loop scales its work by elapsed time measured in ticks.
   */
  public simulationTickMs = 1000 / 30
  /** Longest single frame the simulation integrates before clamping (tab switches, jank). */
  public maxFrameDeltaMs = 100

  // Camera drift and pointer parallax (radians)
  public cameraDriftYaw = 0.14
  public cameraDriftPitch = 0.07
  public cameraDriftPeriodMs = 26000
  public cameraParallaxYaw = 0.09
  public cameraParallaxPitch = 0.05
  public cameraSmoothingMs = 450

  // Glow rendering
  public particleGlowRadiusFactor = 4
  public particleGlowCursorBoost = 3

  // Context response: calm when unattended, alive when touched
  /** Time without pointer activity over the band before the field eases into calm */
  public idleCalmDelayMs = 12000
  /** Motion time scale while calm (1 is full speed) */
  public idleCalmEnergy = 0.45
  public energySmoothingMs = 1800
  /** Pull toward a hovered nav link: reach in world units, px per tick at the rim, orbit radius */
  public navMagnetRadius = 190
  public navMagnetPull = 1.1
  public navMagnetInnerRadius = 26
  /** Page scroll nudges particles along z; the nudge decays over scrollDepthDecayMs */
  public scrollDepthFactor = 0.04
  public scrollDepthMax = 4
  public scrollDepthDecayMs = 350

  // Particle settings
  public particlePoolSize = 500
  public particlesPerPixel: number = 1 / 3200
  public baseParticleCount = 70
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
  public numberOfShapes = 4
  public numberOfShapesMobile = 3
  public shapeMinSpeed = 0.05
  public shapeMaxSpeed = 0.3
  public shapeLifespanMin = 10000
  public shapeLifespanMax = 25000
  public shapeFadeOutDuration = 3000
  public shapeGlowIntensityMin = 8
  public shapeGlowIntensityMax = 14

  // Explosion settings
  public maxExplosionParticles = 100
  public maxSimultaneousExplosions = 3
  public explosionCooldown = 2000
  public explosionParticlesToEmit = 10

  // Datastream effect settings
  public maxDatastreamParticles = 100
  public datastreamParticleLifespan = 2000
  public datastreamFadeOutDuration = 500
  public datastreamEnergyLineCount = 18
  public datastreamMaxRadiusFactor = 0.45
  public datastreamShapeRotationSpeed = 0.1
  public datastreamShapeForceMultiplier = 0.01
  public datastreamIntensityMultiplier = 5
  /** Outward impulse per tick applied to particles as the shockwave passes */
  public datastreamParticlePush = 0.6

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
  public glitchIntervalMin = 25000
  public glitchIntervalMax = 45000
  public glitchDurationMin = 100
  public glitchDurationMax = 400
  public glitchIntensityMin = 0.2
  public glitchIntensityMax = 0.55

  // Glitch effect detail settings
  /** Sideways offset of the chromatic echoes at full intensity, in CSS pixels */
  public glitchMaxOffsetPx = 6
  public glitchMaxSlices = 3

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
