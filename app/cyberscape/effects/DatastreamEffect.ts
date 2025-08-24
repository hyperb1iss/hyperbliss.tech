// app/cyberscape/effects/DatastreamEffect.ts

/**
 * DatastreamEffect class
 *
 * This class handles the rendering and interaction of the datastream effect.
 * The effect is triggered during special animations and affects particles and shapes,
 * creating a dynamic, cyberpunk-inspired visual display.
 */

import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { Particle } from '../particles/Particle'
import { VectorShape } from '../shapes/VectorShape'
import { ParticlePool } from '../utils/ParticlePool'

export class DatastreamEffect {
  private config: CyberScapeConfig
  private particlePool: ParticlePool
  private particlesArray: Particle[]
  private shapesArray: VectorShape[]
  private explosionParticlesCount = 0

  // Pre-allocated reusable vectors for performance optimization
  private centerPos: vec3
  private forceVector: vec3

  /**
   * Creates a new DatastreamEffect instance.
   *
   * @param particlePool - The particle pool to use for creating new particles.
   * @param particlesArray - The array of active particles in the scene.
   * @param shapesArray - The array of active shapes in the scene.
   */
  constructor(particlePool: ParticlePool, particlesArray: Particle[], shapesArray: VectorShape[]) {
    this.config = CyberScapeConfig.getInstance()
    this.particlePool = particlePool
    this.particlesArray = particlesArray
    this.shapesArray = shapesArray

    // Initialize reusable vectors
    this.centerPos = vec3.create()
    this.forceVector = vec3.create()
  }

  /**
   * Draws the complete datastream effect.
   *
   * @param ctx - The canvas rendering context.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param centerX - The X coordinate of the effect's center.
   * @param centerY - The Y coordinate of the effect's center.
   * @param intensity - The intensity of the effect (0 to 1).
   * @param hue - The base hue value for color calculations.
   * @param animationProgress - The progress of the animation (0 to 1).
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    animationProgress: number,
  ) {
    // Set centerPos once for reuse
    vec3.set(this.centerPos, centerX, centerY, 0)

    // Draw each component of the datastream effect
    this.drawExpandingCircles(ctx, width, height, centerX, centerY, intensity, hue)
    this.drawNoiseEffect(ctx, width, height, centerX, centerY, intensity, hue)
    this.emitDatastreamParticles(animationProgress)
    this.affectNearbyShapes(intensity)
    this.drawEnergyLines(ctx, width, height, centerX, centerY, intensity, hue)
  }

  /**
   * Draws expanding circles radiating from the center of the effect.
   */
  private drawExpandingCircles(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
  ) {
    ctx.save()
    ctx.globalAlpha = intensity * 0.5
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
    ctx.lineWidth = 2
    const maxRadius = Math.max(width, height) * 0.4
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const radius = intensity * maxRadius * (1 - i * 0.2)
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    }
    ctx.stroke()
    ctx.restore()
  }

  /**
   * Creates a noise effect around the center of the datastream.
   * Uses an off-screen canvas for performance optimization.
   */
  private drawNoiseEffect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
  ) {
    ctx.save()
    ctx.globalAlpha = intensity * 0.2
    const noiseSize = 4
    const noiseRadius = Math.max(width, height) * 0.2
    const noiseRadiusSq = noiseRadius * noiseRadius

    // Use an off-screen canvas for noise generation
    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = width
    noiseCanvas.height = height
    const noiseCtx = noiseCanvas.getContext('2d')!

    for (let x = centerX - noiseRadius; x < centerX + noiseRadius; x += noiseSize) {
      for (let y = centerY - noiseRadius; y < centerY + noiseRadius; y += noiseSize) {
        const dx = x - centerX
        const dy = y - centerY
        const distanceSq = dx * dx + dy * dy

        if (Math.random() < 0.5 && distanceSq <= noiseRadiusSq) {
          noiseCtx.fillStyle = `hsl(${hue}, 100%, ${Math.random() * 50 + 50}%)`
          noiseCtx.fillRect(x, y, noiseSize, noiseSize)
        }
      }
    }

    ctx.drawImage(noiseCanvas, 0, 0)
    ctx.restore()
  }

  /**
   * Emits particles for the datastream effect during the initial phase of the animation.
   */
  private emitDatastreamParticles(animationProgress: number) {
    if (animationProgress < 0.1) {
      const particlesToEmit = Math.min(10, this.config.maxDatastreamParticles - this.explosionParticlesCount)
      for (let i = 0; i < particlesToEmit; i++) {
        const particle = this.particlePool.getCollisionParticle(vec3.clone(this.centerPos), () => {
          this.explosionParticlesCount--
        })

        particle.lifespan = this.config.datastreamParticleLifespan
        particle.setFadeOutDuration(this.config.datastreamFadeOutDuration)

        this.particlesArray.push(particle)
        this.explosionParticlesCount++
      }
    }
  }

  /**
   * Applies forces to nearby shapes, affecting their rotation and velocity.
   */
  private affectNearbyShapes(intensity: number) {
    for (const shape of this.shapesArray) {
      // Update rotation speed based on effect intensity
      shape.rotationSpeed = vec3.fromValues(intensity * 0.1, intensity * 0.1, intensity * 0.1)

      // Calculate force vector from shape to effect center
      vec3.subtract(this.forceVector, this.centerPos, shape.position)
      const distance = vec3.length(this.forceVector)

      if (distance === 0) continue

      // Normalize and scale force vector
      vec3.scale(this.forceVector, this.forceVector, 1 / distance)
      const forceMagnitude = (intensity * 5) / (distance + 1)

      // Apply force to shape's velocity
      vec3.scaleAndAdd(shape.velocity, shape.velocity, this.forceVector, forceMagnitude * 0.01)
    }
  }

  /**
   * Draws energy lines radiating from the center of the effect.
   */
  private drawEnergyLines(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
  ) {
    ctx.save()
    ctx.globalAlpha = intensity * 0.7
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`
    ctx.lineWidth = 1
    const maxRadius = Math.max(width, height) * 0.4
    const energyLineCount = 20
    ctx.beginPath()
    for (let i = 0; i < energyLineCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const length = Math.random() * maxRadius * 0.8
      const startX = centerX + Math.cos(angle) * length * 0.2
      const startY = centerY + Math.sin(angle) * length * 0.2
      const endX = centerX + Math.cos(angle) * length
      const endY = centerY + Math.sin(angle) * length

      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
    }
    ctx.stroke()
    ctx.restore()
  }
}
