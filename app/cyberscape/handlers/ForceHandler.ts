// app/cyberscape/handlers/ForceHandler.ts

/**
 * The `ForceHandler` class manages attraction and repulsion forces between shapes.
 * It applies physics-based forces to create dynamic motion and clustering effects.
 */

import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { VectorShape } from '../shapes/VectorShape'

export class ForceHandler {
  // Pre-allocated vectors to avoid allocations in force calculations
  private static readonly tempVector: vec3 = vec3.create()
  private static readonly negatedForce: vec3 = vec3.create()

  /**
   * Handles attraction and repulsion forces between shapes.
   * @param shapes - Array of VectorShape instances to apply forces to.
   */
  public static applyForces(shapes: VectorShape[]): void {
    const config = CyberScapeConfig.getInstance()
    const ATTRACTION_RADIUS = config.shapeAttractionRadius
    const REPULSION_RADIUS = config.shapeRepulsionRadius
    const ATTRACTION_FORCE = config.shapeAttractionForce
    const REPULSION_FORCE = config.shapeRepulsionForce

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shapeA = shapes[i]
        const shapeB = shapes[j]

        vec3.subtract(ForceHandler.tempVector, shapeB.position, shapeA.position)
        const distance = vec3.length(ForceHandler.tempVector)

        if (distance > 0 && distance < ATTRACTION_RADIUS && distance > REPULSION_RADIUS) {
          // Attraction
          const forceMagnitude = ATTRACTION_FORCE * (1 - distance / ATTRACTION_RADIUS)
          vec3.normalize(ForceHandler.tempVector, ForceHandler.tempVector)
          vec3.scale(ForceHandler.tempVector, ForceHandler.tempVector, forceMagnitude)
          shapeA.applyForce(ForceHandler.tempVector)
          vec3.scale(ForceHandler.tempVector, ForceHandler.tempVector, -1) // Reverse force
          shapeB.applyForce(ForceHandler.tempVector)
        } else if (distance > 0 && distance <= REPULSION_RADIUS) {
          // Repulsion
          const forceMagnitude = REPULSION_FORCE * (1 - distance / REPULSION_RADIUS)
          vec3.normalize(ForceHandler.tempVector, ForceHandler.tempVector)
          vec3.scale(ForceHandler.tempVector, ForceHandler.tempVector, forceMagnitude)
          // Negate into pre-allocated vector instead of creating new one
          vec3.negate(ForceHandler.negatedForce, ForceHandler.tempVector)
          shapeA.applyForce(ForceHandler.negatedForce)
          shapeB.applyForce(ForceHandler.tempVector)
        }
      }
    }
  }
}
