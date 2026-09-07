// app/cyberscape/particles/Particle.ts

import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { VectorShape } from '../shapes/VectorShape'
import { ColorManager } from '../utils/ColorManager'
import { GlowSprite } from '../utils/GlowSprite'
import { VectorMath } from '../utils/VectorMath'

/**
 * The `Particle` class represents a single interactive star in the background.
 * Each particle moves independently, reacts to user interaction, and maintains constant motion across the canvas.
 */
export class Particle {
  /** Static counter for unique particle IDs */
  private static nextId = 0

  /** Unique identifier for this particle (used for connection tracking) */
  public readonly id: number

  position: vec3
  velocity: vec3
  size: number

  /** Alias for size - required for OctreeObject interface */
  get radius(): number {
    return this.size
  }
  color: string
  maxSpeed: number
  minSpeed: number
  lifespan: number
  age: number
  opacity: number
  private appearanceDelay: number
  public isVisible: boolean
  hue: number

  // Optimization: Reuse vector for calculations
  private tempVector: vec3

  protected config: CyberScapeConfig

  // Add these new properties
  public connectionCount = 0
  public lastConnectionTime = 0
  public connectionDelay = 0
  public lastOffScreenTime = 0
  public respawnCooldown = 2000 // 2 seconds cooldown

  /**
   * Creates a new Particle instance.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  constructor(existingPositions: Set<string>, width: number, height: number) {
    this.id = Particle.nextId++
    this.config = CyberScapeConfig.getInstance()

    // Initialize position
    this.position = vec3.fromValues(
      Math.random() * width - width / 2,
      Math.random() * height - height / 2,
      Math.random() * 200 - 100, // Reduce z-range for better visibility
    )

    // Ensure particles start on screen
    let positionKey: string
    do {
      positionKey = `${this.position[0].toFixed(2)},${this.position[1].toFixed(2)},${this.position[2].toFixed(2)}`
    } while (existingPositions.has(positionKey))
    existingPositions.add(positionKey)

    this.size =
      Math.random() * (this.config.particleSizeMax - this.config.particleSizeMin) + this.config.particleSizeMin

    this.maxSpeed = this.config.particleMaxSpeed
    this.minSpeed = this.config.particleMinSpeed

    // Initialize with a random velocity within speed limits
    this.velocity = vec3.create()
    const angleXY = Math.random() * Math.PI * 2
    const angleZ = Math.random() * Math.PI * 2
    const speedXY = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    const speedZ = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    vec3.set(this.velocity, Math.cos(angleXY) * speedXY, Math.sin(angleXY) * speedXY, Math.cos(angleZ) * speedZ)

    this.hue = Math.round(ColorManager.getRandomCyberpunkHue())
    this.color = `hsl(${this.hue}, 100%, 50%)`

    // Set lifespan to infinity
    this.lifespan = Number.POSITIVE_INFINITY
    this.age = 0

    // Set initial opacity
    this.opacity = 0

    // Initialize tempVector for reuse in calculations
    this.tempVector = vec3.create()
    this.appearanceDelay = Math.random() * 1000 // Reduce max delay to 1 second
    this.isVisible = this.appearanceDelay === 0
  }

  /**
   * Sets a delayed appearance for the particle.
   */
  public setDelayedAppearance(): void {
    this.appearanceDelay = Math.random() * 1000 // Reduce max delay to 1 second
    this.isVisible = false
    // Fade in from just above zero (zero reads as expired to the render loop)
    this.opacity = 0.05
  }

  /**
   * Updates the delay for the particle's appearance.
   */
  public updateDelay(dtMs: number): void {
    if (!this.isVisible) {
      this.appearanceDelay -= dtMs
      if (this.appearanceDelay <= 0) {
        this.isVisible = true
        // Start the fade-in just above zero: the render loop reads opacity 0 as
        // expired and would reap the particle on the frame it appears.
        if (this.opacity <= 0) this.opacity = 0.05
      }
    }
  }

  /**
   * Checks if the particle is ready to be displayed.
   * @returns True if the particle is visible, false otherwise.
   */
  public isReady(): boolean {
    return this.isVisible
  }

  /**
   * Updates the particle's position and velocity based on current state and interactions.
   * This method is called every frame to animate the particle.
   * @param isCursorOverCyberScape - Boolean indicating if the cursor is over the header area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   * @param shapes - Array of VectorShape instances for interaction.
   * @param step - Elapsed simulation ticks since the last update.
   */
  public update(
    isCursorOverCyberScape: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    shapes: VectorShape[],
    step = 1,
  ): void {
    if (!this.isVisible) return
    if (isCursorOverCyberScape) {
      vec3.set(this.tempVector, mouseX - this.position[0], mouseY - this.position[1], 0)
      const distance = vec3.length(this.tempVector)

      if (distance > 0 && distance < this.config.cursorInfluenceRadius) {
        const force =
          ((this.config.cursorInfluenceRadius - distance) / this.config.cursorInfluenceRadius) * this.config.cursorForce
        vec3.scale(this.tempVector, this.tempVector, (1 / distance) * force * step)
        vec3.add(this.velocity, this.velocity, this.tempVector)
      }
    }

    // Apply slight attraction to center (reuse tempVector to avoid allocation)
    vec3.set(
      this.tempVector,
      (-this.position[0] / (width * 10)) * this.config.centerAttractionForce * step,
      (-this.position[1] / (height * 10)) * this.config.centerAttractionForce * step,
      0,
    )
    vec3.add(this.velocity, this.velocity, this.tempVector)

    // Update position
    vec3.scaleAndAdd(this.position, this.position, this.velocity, step)

    // Wrap around edges smoothly
    const buffer = 200 // Ensure objects are fully offscreen before wrapping
    if (this.position[0] < -width / 2 - buffer) {
      this.position[0] += width + buffer * 2
    } else if (this.position[0] > width / 2 + buffer) {
      this.position[0] -= width + buffer * 2
    }
    if (this.position[1] < -height / 2 - buffer) {
      this.position[1] += height + buffer * 2
    } else if (this.position[1] > height / 2 + buffer) {
      this.position[1] -= height + buffer * 2
    }
    this.position[2] = ((this.position[2] + 300) % 600) - 300

    // Ensure minimum and maximum speed
    const speed = vec3.length(this.velocity)
    if (speed < this.minSpeed) {
      vec3.scale(this.velocity, this.velocity, this.minSpeed / speed)
    } else if (speed > this.maxSpeed) {
      vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed)
    }

    // Add small random changes to velocity for more natural movement (reuse tempVector).
    // Random walks scale with the square root of elapsed time, so the field keeps
    // the same wander regardless of refresh rate.
    const jitter = 0.01 * Math.sqrt(step)
    vec3.set(
      this.tempVector,
      (Math.random() - 0.5) * jitter,
      (Math.random() - 0.5) * jitter,
      (Math.random() - 0.5) * jitter,
    )
    vec3.add(this.velocity, this.velocity, this.tempVector)

    // Ambient particles live forever; emitted specks carry a finite lifespan and
    // must age out, or they slowly replace the field with near-invisible dots
    if (Number.isFinite(this.lifespan)) {
      this.age += step * this.config.simulationTickMs
      const fadeMs = Math.min(500, this.lifespan / 2)
      if (this.age >= this.lifespan - fadeMs) {
        this.opacity = Math.max(0, (this.lifespan - this.age) / fadeMs)
        this.interactWithShapes(shapes, step)
        return
      }
    }

    // Gradually increase opacity when the particle becomes visible
    if (this.opacity < 1) {
      this.opacity = Math.min(this.opacity + 0.02 * step, 1)
    }

    // Interact with nearby shapes
    this.interactWithShapes(shapes, step)

    // Update visibility against the same buffered bounds isOutOfBounds uses, so a
    // particle grazing the edge keeps moving instead of freezing in the delay path
    const pos = VectorMath.project(this.position, width, height)
    const margin = 100
    this.isVisible = pos.x >= -margin && pos.x <= width + margin && pos.y >= -margin && pos.y <= height + margin
  }

  /**
   * Interacts with nearby shapes, applying forces and influencing rotations.
   * @param shapes - Array of VectorShape instances.
   */
  protected interactWithShapes(shapes: VectorShape[], step = 1): void {
    const INTERACTION_RADIUS = this.config.particleInteractionRadius
    const INTERACTION_FORCE = this.config.particleInteractionForce
    const rotationJitter = 0.001 * Math.sqrt(step)
    shapes.forEach((shape) => {
      vec3.subtract(this.tempVector, shape.position, this.position)
      const distance = vec3.length(this.tempVector)

      if (distance > 0 && distance < INTERACTION_RADIUS) {
        const force = INTERACTION_FORCE * (1 - distance / INTERACTION_RADIUS)
        vec3.scale(this.tempVector, this.tempVector, (1 / distance) * force * step)
        vec3.add(this.velocity, this.velocity, this.tempVector)

        // Influence shape's rotation
        shape.rotationSpeed[0] += (Math.random() - 0.5) * rotationJitter
        shape.rotationSpeed[1] += (Math.random() - 0.5) * rotationJitter
        shape.rotationSpeed[2] += (Math.random() - 0.5) * rotationJitter
      }
    })
  }

  /**
   * Draws the particle on the canvas with a dynamic glow effect.
   * @param ctx - The 2D rendering context of the canvas.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    _step = 1,
  ): void {
    if (!this.isVisible || this.opacity <= 0) return
    const pos = VectorMath.project(this.position, width, height)
    const radius = this.size * pos.scale

    // Halo grows as the cursor approaches, the same cue the old shadowBlur gave
    const distanceToCursor = Math.hypot(mouseX - this.position[0], mouseY - this.position[1])
    const cursorBoost = ((200 - Math.min(distanceToCursor, 200)) / 200) * this.config.particleGlowCursorBoost
    const glowRadius = radius * (this.config.particleGlowRadiusFactor + cursorBoost)

    // Depth fog: far particles read a little dimmer, which is what makes the z axis legible
    const depthAlpha = 0.6 + 0.4 * (pos.scale - 0.5)
    const alpha = this.opacity * Math.min(1, Math.max(0.4, depthAlpha))

    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = alpha
    GlowSprite.draw(ctx, this.color, pos.x, pos.y, glowRadius)
    ctx.globalCompositeOperation = 'source-over'

    // Crisp core on top of the halo
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  /**
   * Resets the particle to a new random position.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public reset(existingPositions: Set<string>, width: number, height: number): void {
    const currentTime = Date.now()
    if (currentTime - this.lastOffScreenTime < this.respawnCooldown) {
      // If the cooldown hasn't elapsed, don't reset the particle
      return
    }

    let positionKey: string
    do {
      vec3.set(
        this.position,
        Math.random() * width - width / 2,
        Math.random() * height - height / 2,
        Math.random() * 600 - 300,
      )
      positionKey = `${this.position[0].toFixed(2)},${this.position[1].toFixed(2)},${this.position[2].toFixed(2)}`
    } while (existingPositions.has(positionKey))
    existingPositions.add(positionKey)

    // Reset velocity
    const angleXY = Math.random() * Math.PI * 2
    const angleZ = Math.random() * Math.PI * 2
    const speedXY = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    const speedZ = Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed
    vec3.set(this.velocity, Math.cos(angleXY) * speedXY, Math.sin(angleXY) * speedXY, Math.cos(angleZ) * speedZ)

    // Optionally reset color for variety
    this.hue = Math.round(ColorManager.getRandomCyberpunkHue())
    this.color = `hsl(${this.hue}, 100%, 50%)`

    // Reset lifecycle properties
    this.lifespan = this.config.particleLifespan
    this.age = 0
    this.opacity = 1

    // Reset the lastOffScreenTime
    this.lastOffScreenTime = 0
  }

  public canCreateNewConnection(currentTime: number): boolean {
    const config = CyberScapeConfig.getInstance()
    if (this.lastConnectionTime === 0) {
      this.lastConnectionTime = currentTime
      this.connectionDelay = Math.random() * config.maxConnectionDelay + config.minConnectionDelay
      return true
    }

    if (currentTime - this.lastConnectionTime < this.connectionDelay) {
      return false
    }
    this.lastConnectionTime = currentTime
    this.connectionDelay = Math.random() * config.maxConnectionDelay + config.minConnectionDelay
    return true
  }

  public incrementConnectionCount(): void {
    this.connectionCount++
  }

  public decrementConnectionCount(): void {
    this.connectionCount = Math.max(0, this.connectionCount - 1)
  }

  public isOutOfBounds(width: number, height: number): boolean {
    const pos = VectorMath.project(this.position, width, height)
    const buffer = 100 // Buffer zone to prevent immediate re-creation
    return pos.x < -buffer || pos.x > width + buffer || pos.y < -buffer || pos.y > height + buffer
  }

  public setOffScreen(): void {
    this.lastOffScreenTime = Date.now()
  }
}
