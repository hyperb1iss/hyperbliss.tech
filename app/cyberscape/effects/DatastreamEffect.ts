// app/cyberscape/effects/DatastreamEffect.ts

/**
 * DatastreamEffect class
 *
 * The click and tap response: a shockwave. Three rings expand from the
 * pointer, a fixed fan of thin rays grows with them, the centre blooms, and a
 * pressure band pushes particles outward as it passes. Shapes are tugged
 * toward the centre and a burst of spark particles is emitted at the start.
 * Everything is drawn in palette colours with canvas primitives.
 */

import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { Particle } from '../particles/Particle'
import { VectorShape } from '../shapes/VectorShape'
import { GlowSprite } from '../utils/GlowSprite'
import { ParticlePool } from '../utils/ParticlePool'

const RING_COLORS = ['#00fff0', '#a259ff', '#ff75d8']
const RAY_COLOR = '#a259ff'
const BLOOM_COLOR = '#00fff0'

export class DatastreamEffect {
  private config: CyberScapeConfig
  private particlePool: ParticlePool
  private particlesArray: Particle[]
  private shapesArray: VectorShape[]
  private explosionParticlesCount = 0
  private emitted = false

  /** Ray angles and lengths, fixed per burst so the fan grows instead of flickering */
  private rayAngles: number[] = []
  private rayLengths: number[] = []

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
   * Starts a new burst: seeds the ray fan and arms the spark emission.
   */
  public begin(): void {
    this.emitted = false
    this.rayAngles = []
    this.rayLengths = []
    const count = this.config.datastreamEnergyLineCount
    const jitter = (Math.PI * 2) / count
    for (let i = 0; i < count; i++) {
      this.rayAngles.push(i * jitter + (Math.random() - 0.5) * jitter)
      this.rayLengths.push(0.45 + Math.random() * 0.55)
    }
  }

  /**
   * Draws the shockwave for the current frame.
   *
   * @param ctx - The canvas rendering context.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param centerX - The X coordinate of the effect's centre in canvas space.
   * @param centerY - The Y coordinate of the effect's centre in canvas space.
   * @param intensity - The intensity envelope (0 to 1).
   * @param hue - Palette hue for the leading ring.
   * @param animationProgress - The progress of the animation (0 to 1).
   * @param step - Elapsed simulation ticks since the last frame.
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
    step = 1,
  ) {
    // Forces act in world space, which is centred on the canvas
    vec3.set(this.centerPos, centerX - width / 2, centerY - height / 2, 0)

    const maxRadius = Math.max(width, height) * this.config.datastreamMaxRadiusFactor
    const eased = 1 - (1 - animationProgress) ** 3
    const ringRadius = eased * maxRadius

    this.drawBloom(ctx, centerX, centerY, intensity)
    this.drawRays(ctx, centerX, centerY, maxRadius, eased, intensity)
    this.drawRings(ctx, centerX, centerY, maxRadius, animationProgress, hue)
    this.emitSparks()
    this.pushParticles(ringRadius, maxRadius, intensity, step)
    this.affectNearbyShapes(intensity, step)
  }

  /**
   * A soft cyan bloom at the point of impact that fades with the envelope.
   */
  private drawBloom(ctx: CanvasRenderingContext2D, x: number, y: number, intensity: number) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = 0.55 * intensity
    GlowSprite.draw(ctx, BLOOM_COLOR, x, y, 26 + 34 * intensity)
    ctx.restore()
  }

  /**
   * Three rings staggered behind the leading edge, each fading as it grows.
   */
  private drawRings(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    maxRadius: number,
    progress: number,
    hue: number,
  ) {
    ctx.save()
    ctx.lineWidth = 1.5
    for (let i = 0; i < 3; i++) {
      const local = progress - i * 0.12
      if (local <= 0) continue
      const eased = 1 - (1 - Math.min(local, 1)) ** 3
      const radius = eased * maxRadius
      const alpha = (1 - eased) * (0.7 - i * 0.15)
      if (alpha <= 0.01 || radius <= 1) continue
      ctx.strokeStyle = i === 0 ? `hsl(${hue}, 100%, 65%)` : RING_COLORS[i]
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }

  /**
   * A fan of thin rays that grows with the leading ring and dissolves.
   */
  private drawRays(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    maxRadius: number,
    eased: number,
    intensity: number,
  ) {
    if (this.rayAngles.length === 0) return
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = 0.35 * intensity
    ctx.strokeStyle = RAY_COLOR
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i < this.rayAngles.length; i++) {
      const angle = this.rayAngles[i]
      const length = this.rayLengths[i] * maxRadius * eased
      const inner = length * 0.35
      ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner)
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    }
    ctx.stroke()
    ctx.restore()
  }

  /**
   * Emits the spark burst once per shockwave.
   */
  private emitSparks() {
    if (this.emitted) return
    this.emitted = true
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

  /**
   * Pushes particles outward as the leading ring passes over them.
   */
  private pushParticles(ringRadius: number, maxRadius: number, intensity: number, step: number) {
    const band = maxRadius * 0.18
    const push = this.config.datastreamParticlePush * intensity * step
    for (const particle of this.particlesArray) {
      const dx = particle.position[0] - this.centerPos[0]
      const dy = particle.position[1] - this.centerPos[1]
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance === 0) continue
      const gap = Math.abs(distance - ringRadius)
      if (gap > band) continue
      const strength = (1 - gap / band) * push
      particle.velocity[0] += (dx / distance) * strength
      particle.velocity[1] += (dy / distance) * strength
    }
  }

  /**
   * Applies forces to nearby shapes, affecting their rotation and velocity.
   */
  private affectNearbyShapes(intensity: number, step: number) {
    const spin = this.config.datastreamShapeRotationSpeed * intensity
    for (const shape of this.shapesArray) {
      // Update rotation speed based on effect intensity
      vec3.set(shape.rotationSpeed, spin, spin, spin)

      // Calculate force vector from shape to effect center
      vec3.subtract(this.forceVector, this.centerPos, shape.position)
      const distance = vec3.length(this.forceVector)

      if (distance === 0) continue

      // Normalize and scale force vector
      vec3.scale(this.forceVector, this.forceVector, 1 / distance)
      const forceMagnitude = (intensity * this.config.datastreamIntensityMultiplier) / (distance + 1)

      // Apply force to shape's velocity
      vec3.scaleAndAdd(
        shape.velocity,
        shape.velocity,
        this.forceVector,
        forceMagnitude * this.config.datastreamShapeForceMultiplier * step,
      )
    }
  }
}
