// app/cyberscape/handlers/ForceHandler.ts

/**
 * The `ForceHandler` class manages attraction and repulsion forces between shapes.
 * It applies physics-based forces to create dynamic motion and clustering effects.
 */

import { VectorShape } from "../shapes/VectorShape";

export class ForceHandler {
  /**
   * Handles attraction and repulsion forces between shapes.
   * @param shapes - Array of VectorShape instances to apply forces to.
   */
  public static applyForces(shapes: VectorShape[]): void {
    const ATTRACTION_RADIUS = 200;
    const REPULSION_RADIUS = 80;
    const ATTRACTION_FORCE = 0.0005; // Adjust as needed
    const REPULSION_FORCE = 0.001; // Adjust as needed

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shapeA = shapes[i];
        const shapeB = shapes[j];

        const dx = shapeB.position.x - shapeA.position.x;
        const dy = shapeB.position.y - shapeA.position.y;
        const dz = shapeB.position.z - shapeA.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < ATTRACTION_RADIUS && distance > REPULSION_RADIUS) {
          // Attraction
          const forceMagnitude = ATTRACTION_FORCE;
          shapeA.velocity.x += (dx / distance) * forceMagnitude;
          shapeA.velocity.y += (dy / distance) * forceMagnitude;
          shapeA.velocity.z += (dz / distance) * forceMagnitude;

          shapeB.velocity.x -= (dx / distance) * forceMagnitude;
          shapeB.velocity.y -= (dy / distance) * forceMagnitude;
          shapeB.velocity.z -= (dz / distance) * forceMagnitude;
        } else if (distance <= REPULSION_RADIUS) {
          // Repulsion
          const forceMagnitude = REPULSION_FORCE;
          shapeA.velocity.x -= (dx / distance) * forceMagnitude;
          shapeA.velocity.y -= (dy / distance) * forceMagnitude;
          shapeA.velocity.z -= (dz / distance) * forceMagnitude;

          shapeB.velocity.x += (dx / distance) * forceMagnitude;
          shapeB.velocity.y += (dy / distance) * forceMagnitude;
          shapeB.velocity.z += (dz / distance) * forceMagnitude;
        }
      }
    }
  }
}
