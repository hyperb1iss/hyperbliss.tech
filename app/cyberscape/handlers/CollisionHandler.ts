// app/cyberscape/handlers/CollisionHandler.ts

/**
 * The `CollisionHandler` class manages collision detection and response between shapes.
 * It applies realistic physics-based collision response and triggers visual enhancements.
 * Additionally, it emits collision particles using the `ParticlePool` to create explosion effects.
 */

import { vec3 } from "gl-matrix";
import { CyberScapeConfig } from "../CyberScapeConfig"; // Import CyberScapeConfig
import { ParticleAtCollision } from "../particles/ParticleAtCollision";
import { VectorShape } from "../shapes/VectorShape";
import { ColorManager } from "../utils/ColorManager";
import { ParticlePool } from "../utils/ParticlePool";

// Define the type for the collision callback function
export type CollisionCallback = (
  shapeA: VectorShape,
  shapeB: VectorShape
) => void;

export class CollisionHandler {
  // Static reference to the ParticlePool instance
  private static particlePool: ParticlePool | null = null;

  // Configuration parameters (can be extended or moved to a config file)
  private static readonly gridSize: number = 100; // Adjust based on your needs

  /**
   * Initializes the CollisionHandler with a ParticlePool instance.
   * This method must be called once during the application's initialization phase.
   * @param pool - The ParticlePool instance to use for emitting collision particles.
   */
  public static initialize(pool: ParticlePool): void {
    this.particlePool = pool;
    console.log("CollisionHandler initialized with ParticlePool.");
  }

  /**
   * Handles collision detection and response between shapes.
   * @param shapes - Array of VectorShape instances to check collisions with.
   * @param collisionCallback - Optional callback to trigger additional effects upon collision.
   * @param collisionParticlesArray - Array of ParticleAtCollision instances to add emitted particles to.
   */
  public static handleCollisions(
    shapes: VectorShape[],
    collisionCallback?: CollisionCallback,
    collisionParticlesArray?: ParticleAtCollision[]
  ): void {
    if (!this.particlePool) {
      console.error(
        "CollisionHandler: ParticlePool is not initialized. Call CollisionHandler.initialize(pool) first."
      );
      return;
    }

    const activeShapes = shapes.filter((shape) => !shape.isExploded);
    const gridSize = this.gridSize;
    const grid: Map<string, VectorShape[]> = new Map();

    // Place shapes in grid cells
    for (const shape of activeShapes) {
      const cellX = Math.floor(shape.position[0] / gridSize);
      const cellY = Math.floor(shape.position[1] / gridSize);
      const cellZ = Math.floor(shape.position[2] / gridSize);
      const cellKey = `${cellX},${cellY},${cellZ}`;

      if (!grid.has(cellKey)) {
        grid.set(cellKey, []);
      }
      grid.get(cellKey)!.push(shape);
    }

    // Check collisions only within the same cell and neighboring cells
    grid.forEach((shapesInCell, cellKey) => {
      const [cellX, cellY, cellZ] = cellKey.split(",").map(Number);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const neighborKey = `${cellX + dx},${cellY + dy},${cellZ + dz}`;
            const neighborShapes = grid.get(neighborKey) || [];

            for (const shapeA of shapesInCell) {
              for (const shapeB of neighborShapes) {
                if (shapeA === shapeB) continue;

                const deltaPos = vec3.create();
                vec3.subtract(deltaPos, shapeB.position, shapeA.position);
                const distance = vec3.length(deltaPos);

                if (distance < shapeA.radius + shapeB.radius) {
                  // Collision detected, handle it
                  this.handleCollisionResponse(
                    shapeA,
                    shapeB,
                    deltaPos,
                    distance
                  );

                  if (collisionCallback) {
                    collisionCallback(shapeA, shapeB);
                  }

                  // Emit collision particles
                  if (collisionParticlesArray) {
                    this.emitCollisionParticles(
                      shapeA,
                      shapeB,
                      deltaPos,
                      distance,
                      collisionParticlesArray
                    );
                  }
                }
              }
            }
          }
        }
      }
    });
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
    distance: number
  ): void {
    // Normalize the collision vector
    const normal = vec3.create();
    vec3.normalize(normal, deltaPos);

    // Calculate relative velocity
    const relativeVelocity = vec3.create();
    vec3.subtract(relativeVelocity, shapeA.velocity, shapeB.velocity);

    // Calculate velocity along the normal
    const vn = vec3.dot(relativeVelocity, normal);

    // If shapes are moving away from each other, skip
    if (vn > 0) return;

    // Calculate impulse scalar (assuming equal mass and perfect elasticity)
    const impulse = (-2 * vn) / 2; // mass cancels out

    // Apply impulse to the shapes' velocities
    const impulseVec = vec3.create();
    vec3.scale(impulseVec, normal, impulse);

    vec3.add(shapeA.velocity, shapeA.velocity, impulseVec);
    vec3.subtract(shapeB.velocity, shapeB.velocity, impulseVec);

    // Adjust positions to prevent overlap
    const overlap = shapeA.radius + shapeB.radius - distance;
    const correction = vec3.create();
    vec3.scale(correction, normal, overlap / 2);

    vec3.subtract(shapeA.position, shapeA.position, correction);
    vec3.add(shapeB.position, shapeB.position, correction);

    // Change colors upon collision
    shapeA.color = ColorManager.getRandomCyberpunkColor();
    shapeB.color = ColorManager.getRandomCyberpunkColor();

    // Apply visual enhancements
    shapeA.triggerCollisionVisuals();
    shapeB.triggerCollisionVisuals();

    // Limit the maximum velocity change to prevent abrupt movements
    const maxVelocityChange = 2;
    const maxVelocityVec = vec3.fromValues(
      maxVelocityChange,
      maxVelocityChange,
      maxVelocityChange
    );
    const minVelocityVec = vec3.fromValues(
      -maxVelocityChange,
      -maxVelocityChange,
      -maxVelocityChange
    );

    vec3.min(shapeA.velocity, shapeA.velocity, maxVelocityVec);
    vec3.max(shapeA.velocity, shapeA.velocity, minVelocityVec);

    vec3.min(shapeB.velocity, shapeB.velocity, maxVelocityVec);
    vec3.max(shapeB.velocity, shapeB.velocity, minVelocityVec);
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
    deltaPos: vec3,
    distance: number,
    collisionParticlesArray: ParticleAtCollision[]
  ): void {
    // Calculate the collision position (midpoint between shapeA and shapeB)
    const collisionPos = vec3.create();
    vec3.add(collisionPos, shapeA.position, shapeB.position);
    vec3.scale(collisionPos, collisionPos, 0.5);

    // Define the number of particles to emit per collision
    const PARTICLES_PER_COLLISION = 10;

    // Retrieve configuration settings directly from CyberScapeConfig
    const config = CyberScapeConfig.getInstance();

    for (let i = 0; i < PARTICLES_PER_COLLISION; i++) {
      // Retrieve a ParticleAtCollision from the ParticlePool
      const particle = this.particlePool!.getCollisionParticle(
        vec3.clone(collisionPos),
        () => {
          // Callback when the particle expires
          // This can be used to track active explosions or other effects
          // For example:
          // explosionParticlesCount--;
          // currentExplosions = Math.max(0, currentExplosions - 1);
        }
      );

      // Configure particle properties using CyberScapeConfig
      particle.lifespan = config.particleAtCollisionLifespan;
      particle.setFadeOutDuration(config.particleAtCollisionFadeOutDuration);

      // Optionally, you can randomize additional properties here
      // For example, size or color variations

      // Add the particle to the collision particles array
      collisionParticlesArray.push(particle);
    }
  }
}
