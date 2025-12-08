// app/cyberscape/handlers/CollisionHandler.ts

/**
 * The `CollisionHandler` class manages collision detection and response between shapes.
 * It applies realistic physics-based collision response and triggers visual enhancements.
 * Additionally, it emits collision particles using the `ParticlePool` to create explosion effects.
 */

import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { ParticleAtCollision } from '../particles/ParticleAtCollision'
import { VectorShape } from '../shapes/VectorShape'
import { ColorManager } from '../utils/ColorManager'
import { Octree } from '../utils/Octree'
import { ParticlePool } from '../utils/ParticlePool'

/**
 * Type definition for the collision callback function.
 * This function is called when a collision is detected between two shapes.
 */
export type CollisionCallback = (shapeA: VectorShape, shapeB: VectorShape) => void

export class CollisionHandler {
  // Static reference to the ParticlePool instance
  private static particlePool: ParticlePool | null = null
  // Static reference to the Octree instance for spatial partitioning
  private static octree: Octree

  // Pre-allocated vectors to avoid GC pressure in collision handling
  private static readonly queryMin: vec3 = vec3.create()
  private static readonly queryMax: vec3 = vec3.create()
  private static readonly deltaPos: vec3 = vec3.create()
  private static readonly normal: vec3 = vec3.create()
  private static readonly relativeVelocity: vec3 = vec3.create()
  private static readonly impulseVec: vec3 = vec3.create()
  private static readonly correction: vec3 = vec3.create()
  private static readonly collisionPos: vec3 = vec3.create()
  private static readonly maxVelocityVec: vec3 = vec3.fromValues(2, 2, 2)
  private static readonly minVelocityVec: vec3 = vec3.fromValues(-2, -2, -2)

  /**
   * Initializes the CollisionHandler with a ParticlePool instance.
   * This method must be called once during the application's initialization phase.
   * @param pool - The ParticlePool instance to use for emitting collision particles.
   */
  public static initialize(pool: ParticlePool): void {
    CollisionHandler.particlePool = pool
    const config = CyberScapeConfig.getInstance()
    CollisionHandler.octree = new Octree({
      max: [config.canvasWidth / 2, config.canvasHeight / 2, 300],
      min: [-config.canvasWidth / 2, -config.canvasHeight / 2, -300],
    })
  }

  /**
   * Handles collision detection and response between shapes.
   * Uses spatial partitioning to efficiently detect potential collisions.
   * @param shapes - Array of VectorShape instances to check collisions with.
   * @param collisionCallback - Optional callback to trigger additional effects upon collision.
   * @param collisionParticlesArray - Array of ParticleAtCollision instances to add emitted particles to.
   */
  public static handleCollisions(
    shapes: VectorShape[],
    collisionCallback?: CollisionCallback,
    collisionParticlesArray?: ParticleAtCollision[],
  ): void {
    if (!CollisionHandler.particlePool) {
      console.error('CollisionHandler: ParticlePool is not initialized. Call CollisionHandler.initialize(pool) first.')
      return
    }

    // Clear the octree before adding new shapes
    CollisionHandler.octree.clear()

    // Add shapes to the octree for efficient collision detection
    shapes.forEach((shape) => {
      if (!shape.isExploded) {
        CollisionHandler.octree.insert(shape)
      }
    })

    // Check collisions using octree
    shapes.forEach((shapeA) => {
      if (shapeA.isExploded) return

      // Build query bounds using pre-allocated vectors
      vec3.set(
        CollisionHandler.queryMax,
        shapeA.position[0] + shapeA.radius,
        shapeA.position[1] + shapeA.radius,
        shapeA.position[2] + shapeA.radius,
      )
      vec3.set(
        CollisionHandler.queryMin,
        shapeA.position[0] - shapeA.radius,
        shapeA.position[1] - shapeA.radius,
        shapeA.position[2] - shapeA.radius,
      )

      // Retrieve nearby shapes from the octree
      const nearbyShapes = CollisionHandler.octree.query({
        max: CollisionHandler.queryMax,
        min: CollisionHandler.queryMin,
      }) as VectorShape[]

      nearbyShapes.forEach((shapeB) => {
        if (shapeA === shapeB || shapeB.isExploded) return

        // Reuse pre-allocated deltaPos
        vec3.subtract(CollisionHandler.deltaPos, shapeB.position, shapeA.position)
        const distance = vec3.length(CollisionHandler.deltaPos)

        if (distance < shapeA.radius + shapeB.radius) {
          // Handle collision response between the two shapes
          CollisionHandler.handleCollisionResponse(shapeA, shapeB, CollisionHandler.deltaPos, distance)

          // Trigger additional effects if a collision callback is provided
          if (collisionCallback) {
            collisionCallback(shapeA, shapeB)
          }

          // Emit collision particles if a collision particles array is provided
          if (collisionParticlesArray) {
            CollisionHandler.emitCollisionParticles(
              shapeA,
              shapeB,
              CollisionHandler.deltaPos,
              distance,
              collisionParticlesArray,
            )
          }
        }
      })
    })
  }

  /**
   * Handles the collision response between two shapes by updating their velocities,
   * adjusting their positions to prevent overlap, and changing their colors.
   * @param shapeA - First shape involved in the collision.
   * @param shapeB - Second shape involved in the collision.
   * @param deltaPos - Difference in positions as a vec3.
   * @param distance - Distance between the shapes.
   */
  private static handleCollisionResponse(
    shapeA: VectorShape,
    shapeB: VectorShape,
    deltaPos: vec3,
    distance: number,
  ): void {
    // Normalize the collision vector (reuse pre-allocated normal)
    vec3.normalize(CollisionHandler.normal, deltaPos)

    // Calculate relative velocity (reuse pre-allocated vector)
    vec3.subtract(CollisionHandler.relativeVelocity, shapeA.velocity, shapeB.velocity)

    // Calculate velocity along the normal
    const vn = vec3.dot(CollisionHandler.relativeVelocity, CollisionHandler.normal)

    // If shapes are moving away from each other, skip
    if (vn > 0) return

    // Calculate impulse scalar (assuming equal mass and perfect elasticity)
    const impulse = (-2 * vn) / 2 // mass cancels out

    // Apply impulse to the shapes' velocities (reuse pre-allocated vector)
    vec3.scale(CollisionHandler.impulseVec, CollisionHandler.normal, impulse)

    vec3.add(shapeA.velocity, shapeA.velocity, CollisionHandler.impulseVec)
    vec3.subtract(shapeB.velocity, shapeB.velocity, CollisionHandler.impulseVec)

    // Adjust positions to prevent overlap (reuse pre-allocated vector)
    const overlap = shapeA.radius + shapeB.radius - distance
    vec3.scale(CollisionHandler.correction, CollisionHandler.normal, overlap / 2)

    vec3.subtract(shapeA.position, shapeA.position, CollisionHandler.correction)
    vec3.add(shapeB.position, shapeB.position, CollisionHandler.correction)

    // Change colors upon collision
    shapeA.color = ColorManager.getRandomCyberpunkColor()
    shapeB.color = ColorManager.getRandomCyberpunkColor()

    // Apply visual enhancements
    shapeA.triggerCollisionVisuals()
    shapeB.triggerCollisionVisuals()

    // Limit the maximum velocity change to prevent abrupt movements (use pre-allocated vectors)
    vec3.min(shapeA.velocity, shapeA.velocity, CollisionHandler.maxVelocityVec)
    vec3.max(shapeA.velocity, shapeA.velocity, CollisionHandler.minVelocityVec)

    vec3.min(shapeB.velocity, shapeB.velocity, CollisionHandler.maxVelocityVec)
    vec3.max(shapeB.velocity, shapeB.velocity, CollisionHandler.minVelocityVec)
  }

  /**
   * Emits collision particles at the point of collision between two shapes.
   * @param shapeA - First shape involved in the collision.
   * @param shapeB - Second shape involved in the collision.
   * @param deltaPos - Difference in positions as a vec3.
   * @param distance - Distance between the shapes.
   * @param collisionParticlesArray - Array of ParticleAtCollision instances to add emitted particles to.
   */
  private static emitCollisionParticles(
    shapeA: VectorShape,
    shapeB: VectorShape,
    _deltaPos: vec3,
    _distance: number,
    collisionParticlesArray: ParticleAtCollision[],
  ): void {
    // Calculate the collision position (midpoint between shapeA and shapeB) using pre-allocated vector
    vec3.add(CollisionHandler.collisionPos, shapeA.position, shapeB.position)
    vec3.scale(CollisionHandler.collisionPos, CollisionHandler.collisionPos, 0.5)

    // Define the number of particles to emit per collision
    const PARTICLES_PER_COLLISION = 10

    // Retrieve configuration settings directly from CyberScapeConfig
    const config = CyberScapeConfig.getInstance()

    for (let i = 0; i < PARTICLES_PER_COLLISION; i++) {
      // Retrieve a ParticleAtCollision from the ParticlePool (clone is needed - particle owns its position)
      const particle = CollisionHandler.particlePool?.getCollisionParticle(
        vec3.clone(CollisionHandler.collisionPos),
        () => {},
      )

      if (particle) {
        // Configure particle properties using CyberScapeConfig
        particle.lifespan = config.particleAtCollisionLifespan
        particle.setFadeOutDuration(config.particleAtCollisionFadeOutDuration)

        // Add the particle to the collision particles array
        collisionParticlesArray.push(particle)
      }
    }
  }
}
