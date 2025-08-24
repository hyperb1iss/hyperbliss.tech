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

      // Retrieve nearby shapes from the octree
      const nearbyShapes = CollisionHandler.octree.query({
        max: vec3.add(vec3.create(), shapeA.position, [shapeA.radius, shapeA.radius, shapeA.radius]),
        min: vec3.sub(vec3.create(), shapeA.position, [shapeA.radius, shapeA.radius, shapeA.radius]),
      }) as VectorShape[]

      nearbyShapes.forEach((shapeB) => {
        if (shapeA === shapeB || shapeB.isExploded) return

        const deltaPos = vec3.create()
        vec3.subtract(deltaPos, shapeB.position, shapeA.position)
        const distance = vec3.length(deltaPos)

        if (distance < shapeA.radius + shapeB.radius) {
          // Handle collision response between the two shapes
          CollisionHandler.handleCollisionResponse(shapeA, shapeB, deltaPos, distance)

          // Trigger additional effects if a collision callback is provided
          if (collisionCallback) {
            collisionCallback(shapeA, shapeB)
          }

          // Emit collision particles if a collision particles array is provided
          if (collisionParticlesArray) {
            CollisionHandler.emitCollisionParticles(shapeA, shapeB, deltaPos, distance, collisionParticlesArray)
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
    // Normalize the collision vector
    const normal = vec3.create()
    vec3.normalize(normal, deltaPos)

    // Calculate relative velocity
    const relativeVelocity = vec3.create()
    vec3.subtract(relativeVelocity, shapeA.velocity, shapeB.velocity)

    // Calculate velocity along the normal
    const vn = vec3.dot(relativeVelocity, normal)

    // If shapes are moving away from each other, skip
    if (vn > 0) return

    // Calculate impulse scalar (assuming equal mass and perfect elasticity)
    const impulse = (-2 * vn) / 2 // mass cancels out

    // Apply impulse to the shapes' velocities
    const impulseVec = vec3.create()
    vec3.scale(impulseVec, normal, impulse)

    vec3.add(shapeA.velocity, shapeA.velocity, impulseVec)
    vec3.subtract(shapeB.velocity, shapeB.velocity, impulseVec)

    // Adjust positions to prevent overlap
    const overlap = shapeA.radius + shapeB.radius - distance
    const correction = vec3.create()
    vec3.scale(correction, normal, overlap / 2)

    vec3.subtract(shapeA.position, shapeA.position, correction)
    vec3.add(shapeB.position, shapeB.position, correction)

    // Change colors upon collision
    shapeA.color = ColorManager.getRandomCyberpunkColor()
    shapeB.color = ColorManager.getRandomCyberpunkColor()

    // Apply visual enhancements
    shapeA.triggerCollisionVisuals()
    shapeB.triggerCollisionVisuals()

    // Limit the maximum velocity change to prevent abrupt movements
    const maxVelocityChange = 2
    const maxVelocityVec = vec3.fromValues(maxVelocityChange, maxVelocityChange, maxVelocityChange)
    const minVelocityVec = vec3.fromValues(-maxVelocityChange, -maxVelocityChange, -maxVelocityChange)

    vec3.min(shapeA.velocity, shapeA.velocity, maxVelocityVec)
    vec3.max(shapeA.velocity, shapeA.velocity, minVelocityVec)

    vec3.min(shapeB.velocity, shapeB.velocity, maxVelocityVec)
    vec3.max(shapeB.velocity, shapeB.velocity, minVelocityVec)
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
    // Calculate the collision position (midpoint between shapeA and shapeB)
    const collisionPos = vec3.create()
    vec3.add(collisionPos, shapeA.position, shapeB.position)
    vec3.scale(collisionPos, collisionPos, 0.5)

    // Define the number of particles to emit per collision
    const PARTICLES_PER_COLLISION = 10

    // Retrieve configuration settings directly from CyberScapeConfig
    const config = CyberScapeConfig.getInstance()

    for (let i = 0; i < PARTICLES_PER_COLLISION; i++) {
      // Retrieve a ParticleAtCollision from the ParticlePool
      const particle = CollisionHandler.particlePool?.getCollisionParticle(vec3.clone(collisionPos), () => {})

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
