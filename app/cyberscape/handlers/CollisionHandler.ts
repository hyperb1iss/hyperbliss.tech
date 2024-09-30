// app/cyberscape/handlers/CollisionHandler.ts

/**
 * The `CollisionHandler` class manages collision detection and response between shapes.
 * It applies realistic physics-based collision response and triggers visual enhancements.
 */

import { VectorShape } from "../shapes/VectorShape";

export type CollisionCallback = (
  shapeA: VectorShape,
  shapeB: VectorShape
) => void;

export class CollisionHandler {
  /**
   * Handles collision detection and response between shapes.
   * @param shapes - Array of VectorShape instances to check collisions with.
   * @param collisionCallback - Optional callback to trigger additional effects upon collision.
   */
  public static handleCollisions(
    shapes: VectorShape[],
    collisionCallback?: CollisionCallback
  ): void {
    const activeShapes = shapes.filter((shape) => !shape.isExploded);
    const gridSize = 100; // Adjust based on your needs
    const grid: Map<string, VectorShape[]> = new Map();

    // Place shapes in grid cells
    for (const shape of activeShapes) {
      const cellX = Math.floor(shape.position.x / gridSize);
      const cellY = Math.floor(shape.position.y / gridSize);
      const cellZ = Math.floor(shape.position.z / gridSize);
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

                const dx = shapeB.position.x - shapeA.position.x;
                const dy = shapeB.position.y - shapeA.position.y;
                const dz = shapeB.position.z - shapeA.position.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < shapeA.radius + shapeB.radius) {
                  // Collision detected, handle it
                  this.handleCollisionResponse(
                    shapeA,
                    shapeB,
                    dx,
                    dy,
                    dz,
                    distance
                  );

                  if (collisionCallback) {
                    collisionCallback(shapeA, shapeB);
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
   * Handles the collision response between two shapes.
   * @param shapeA - First shape involved in the collision.
   * @param shapeB - Second shape involved in the collision.
   * @param dx - Difference in x positions.
   * @param dy - Difference in y positions.
   * @param dz - Difference in z positions.
   * @param distance - Distance between the shapes.
   */
  private static handleCollisionResponse(
    shapeA: VectorShape,
    shapeB: VectorShape,
    dx: number,
    dy: number,
    dz: number,
    distance: number
  ): void {
    // Normalize the collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    const nz = dz / distance;

    // Calculate relative velocity
    const dvx = shapeA.velocity.x - shapeB.velocity.x;
    const dvy = shapeA.velocity.y - shapeB.velocity.y;
    const dvz = shapeA.velocity.z - shapeB.velocity.z;

    // Calculate velocity along the normal
    const vn = dvx * nx + dvy * ny + dvz * nz;

    // If shapes are moving away from each other, skip
    if (vn > 0) return;

    // Calculate impulse scalar (assuming equal mass and perfect elasticity)
    const impulse = (-2 * vn) / 2; // mass cancels out

    // Apply impulse to the shapes' velocities
    shapeA.velocity.x += impulse * nx;
    shapeA.velocity.y += impulse * ny;
    shapeA.velocity.z += impulse * nz;

    shapeB.velocity.x -= impulse * nx;
    shapeB.velocity.y -= impulse * ny;
    shapeB.velocity.z -= impulse * nz;

    // Adjust positions to prevent overlap
    const overlap = shapeA.radius + shapeB.radius - distance;
    shapeA.position.x -= (overlap / 2) * nx;
    shapeA.position.y -= (overlap / 2) * ny;
    shapeA.position.z -= (overlap / 2) * nz;

    shapeB.position.x += (overlap / 2) * nx;
    shapeB.position.y += (overlap / 2) * ny;
    shapeB.position.z += (overlap / 2) * nz;

    // Change colors upon collision
    shapeA.color = shapeA.getRandomCyberpunkColor();
    shapeB.color = shapeB.getRandomCyberpunkColor();

    // Apply visual enhancements
    shapeA.triggerCollisionVisuals();
    shapeB.triggerCollisionVisuals();

    // Limit the maximum velocity change to prevent abrupt movements
    const maxVelocityChange = 2;
    shapeA.velocity.x = Math.max(
      Math.min(shapeA.velocity.x, maxVelocityChange),
      -maxVelocityChange
    );
    shapeA.velocity.y = Math.max(
      Math.min(shapeA.velocity.y, maxVelocityChange),
      -maxVelocityChange
    );
    shapeA.velocity.z = Math.max(
      Math.min(shapeA.velocity.z, maxVelocityChange),
      -maxVelocityChange
    );
    shapeB.velocity.x = Math.max(
      Math.min(shapeB.velocity.x, maxVelocityChange),
      -maxVelocityChange
    );
    shapeB.velocity.y = Math.max(
      Math.min(shapeB.velocity.y, maxVelocityChange),
      -maxVelocityChange
    );
    shapeB.velocity.z = Math.max(
      Math.min(shapeB.velocity.z, maxVelocityChange),
      -maxVelocityChange
    );
  }
}
