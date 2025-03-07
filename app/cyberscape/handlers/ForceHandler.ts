// app/cyberscape/handlers/ForceHandler.ts

/**
 * The `ForceHandler` class manages attraction and repulsion forces between shapes.
 * It applies physics-based forces to create dynamic motion and clustering effects.
 */

import { vec3 } from "gl-matrix";
import { CyberScapeConfig } from "../CyberScapeConfig";
import { VectorShape } from "../shapes/VectorShape";

export class ForceHandler {
  /**
   * Handles attraction and repulsion forces between shapes.
   * @param shapes - Array of VectorShape instances to apply forces to.
   */
  public static applyForces(shapes: VectorShape[]): void {
    const config = CyberScapeConfig.getInstance();
    const ATTRACTION_RADIUS = config.shapeAttractionRadius;
    const REPULSION_RADIUS = config.shapeRepulsionRadius;
    const ATTRACTION_FORCE = config.shapeAttractionForce;
    const REPULSION_FORCE = config.shapeRepulsionForce;

    const tempVector = vec3.create();

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shapeA = shapes[i];
        const shapeB = shapes[j];

        vec3.subtract(tempVector, shapeB.position, shapeA.position);
        const distance = vec3.length(tempVector);

        if (distance > 0 && distance < ATTRACTION_RADIUS && distance > REPULSION_RADIUS) {
          // Attraction
          const forceMagnitude = ATTRACTION_FORCE * (1 - distance / ATTRACTION_RADIUS);
          vec3.normalize(tempVector, tempVector);
          vec3.scale(tempVector, tempVector, forceMagnitude);
          shapeA.applyForce(tempVector);
          vec3.scale(tempVector, tempVector, -1); // Reverse force
          shapeB.applyForce(tempVector);
        } else if (distance > 0 && distance <= REPULSION_RADIUS) {
          // Repulsion
          const forceMagnitude = REPULSION_FORCE * (1 - distance / REPULSION_RADIUS);
          vec3.normalize(tempVector, tempVector);
          vec3.scale(tempVector, tempVector, forceMagnitude);
          shapeA.applyForce(vec3.negate(vec3.create(), tempVector));
          shapeB.applyForce(tempVector);
        }
      }
    }
  }
}
