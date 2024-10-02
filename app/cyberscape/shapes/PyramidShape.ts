// app/cyberscape/shapes/PyramidShape.ts

import { vec3 } from "gl-matrix";
import { VectorShape } from "./VectorShape";

export class PyramidShape extends VectorShape {
  constructor(existingPositions: Set<string>, width: number, height: number) {
    super();
    this.radius = 30 * 0.9;
    this.initializeShape();
    this.reset(existingPositions, width, height);
  }

  /**
   * Initializes the pyramid's vertices and edges.
   */
  protected initializeShape(): void {
    const size = 30;
    this.vertices = [
      vec3.fromValues(0, -size, 0),
      vec3.fromValues(-size * 0.7, size * 0.7, -size * 0.7),
      vec3.fromValues(size * 0.7, size * 0.7, -size * 0.7),
      vec3.fromValues(size * 0.7, size * 0.7, size * 0.7),
      vec3.fromValues(-size * 0.7, size * 0.7, size * 0.7),
    ];
    this.edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
    ];
  }
}
