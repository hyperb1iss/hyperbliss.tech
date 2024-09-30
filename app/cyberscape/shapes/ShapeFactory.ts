// app/cyberscape/shapes/ShapeFactory.ts

import { CubeShape } from "./CubeShape";
import { DodecahedronShape } from "./DodecahedronShape";
import { OctahedronShape } from "./OctahedronShape";
import { PyramidShape } from "./PyramidShape";
import { TetrahedronShape } from "./TetrahedronShape";
import { VectorShape } from "./VectorShape";

/**
 * ShapeFactory class
 *
 * This class is responsible for creating different types of shapes
 * used in the CyberScape animation.
 */
export class ShapeFactory {
  /**
   * Creates a shape based on the specified type.
   * @param type - The type of shape to create ('cube', 'pyramid', 'tetrahedron', 'octahedron', or 'dodecahedron').
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @returns A VectorShape instance of the specified type.
   * @throws Error if an unsupported shape type is specified.
   */
  public static createShape(
    type: string,
    existingPositions: Set<string>,
    width: number,
    height: number
  ): VectorShape {
    switch (type) {
      case "cube":
        return new CubeShape(existingPositions, width, height);
      case "pyramid":
        return new PyramidShape(existingPositions, width, height);
      case "tetrahedron":
        return new TetrahedronShape(existingPositions, width, height);
      case "octahedron":
        return new OctahedronShape(existingPositions, width, height);
      case "dodecahedron":
        return new DodecahedronShape(existingPositions, width, height);
      default:
        throw new Error(`Unsupported shape type: ${type}`);
    }
  }
}
