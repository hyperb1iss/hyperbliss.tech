// app/cyberscape/handlers/ColorBlender.ts

/**
 * The `ColorBlender` class manages proximity-based color blending between shapes.
 * It smoothly transitions colors of nearby shapes for a dynamic visual effect.
 */

import { vec3 } from 'gl-matrix'
import { VectorShape } from '../shapes/VectorShape'
import { ColorManager } from '../utils/ColorManager'

export class ColorBlender {
  /**
   * Handles proximity-based color blending between shapes.
   * @param shapes - Array of VectorShape instances to blend colors with.
   */
  public static blendColors(shapes: VectorShape[]): void {
    const INFLUENCE_RADIUS = 150 // Adjust as needed
    const influenceRadiusSquared = INFLUENCE_RADIUS * INFLUENCE_RADIUS

    for (let i = 0; i < shapes.length; i++) {
      let rTotal = 0
      let gTotal = 0
      let bTotal = 0
      let count = 0

      const shapeA = shapes[i]

      for (let j = 0; j < shapes.length; j++) {
        if (i === j) continue

        const shapeB = shapes[j]

        // Calculate delta vector and distance
        const delta = vec3.create()
        vec3.subtract(delta, shapeA.position, shapeB.position)
        const distanceSquared = vec3.squaredLength(delta)

        if (distanceSquared < influenceRadiusSquared) {
          const rgb = ColorManager.hexToRgb(shapeB.color)
          if (rgb) {
            rTotal += rgb.r
            gTotal += rgb.g
            bTotal += rgb.b
            count++
          }
        }
      }

      if (count > 0) {
        const avgR = Math.round(rTotal / count)
        const avgG = Math.round(gTotal / count)
        const avgB = Math.round(bTotal / count)

        // Blend the current shape's color towards the average color
        const currentColor = ColorManager.hexToRgb(shapeA.color)
        if (currentColor) {
          const blendedR = Math.round(currentColor.r + (avgR - currentColor.r) * 0.05)
          const blendedG = Math.round(currentColor.g + (avgG - currentColor.g) * 0.05)
          const blendedB = Math.round(currentColor.b + (avgB - currentColor.b) * 0.05)

          shapeA.color = ColorManager.rgbToHex(blendedR, blendedG, blendedB)
        }
      }
    }
  }
}
