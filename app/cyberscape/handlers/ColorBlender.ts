// app/cyberscape/handlers/ColorBlender.ts

/**
 * The `ColorBlender` class manages proximity-based color blending between shapes.
 * It smoothly transitions colors of nearby shapes for a dynamic visual effect.
 */

import { ColorManager } from "../utils/ColorManager";
import { VectorShape } from "../shapes/VectorShape";

export class ColorBlender {
  /**
   * Handles proximity-based color blending between shapes.
   * @param shapes - Array of VectorShape instances to blend colors with.
   */
  public static blendColors(shapes: VectorShape[]): void {
    const INFLUENCE_RADIUS = 150; // Adjust as needed

    for (let i = 0; i < shapes.length; i++) {
      let rTotal = 0,
        gTotal = 0,
        bTotal = 0,
        count = 0;

      for (let j = 0; j < shapes.length; j++) {
        if (i === j) continue;

        const shapeA = shapes[i];
        const shapeB = shapes[j];

        const dx = shapeA.position.x - shapeB.position.x;
        const dy = shapeA.position.y - shapeB.position.y;
        const dz = shapeA.position.z - shapeB.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < INFLUENCE_RADIUS) {
          const rgb = ColorManager.hexToRgb(shapeB.color);
          if (rgb) {
            rTotal += rgb.r;
            gTotal += rgb.g;
            bTotal += rgb.b;
            count++;
          }
        }
      }

      if (count > 0) {
        const avgR = Math.round(rTotal / count);
        const avgG = Math.round(gTotal / count);
        const avgB = Math.round(bTotal / count);

        // Blend the current shape's color towards the average color
        const currentColor = ColorManager.hexToRgb(shapes[i].color);
        if (currentColor) {
          const blendedR = Math.round(
            currentColor.r + (avgR - currentColor.r) * 0.05
          );
          const blendedG = Math.round(
            currentColor.g + (avgG - currentColor.g) * 0.05
          );
          const blendedB = Math.round(
            currentColor.b + (avgB - currentColor.b) * 0.05
          );

          shapes[i].color = ColorManager.rgbToHex(blendedR, blendedG, blendedB);
        }
      }
    }
  }
}
