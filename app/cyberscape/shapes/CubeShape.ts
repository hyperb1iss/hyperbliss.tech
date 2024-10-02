// app/cyberscape/shapes/CubeShape.ts

import { vec3 } from "gl-matrix";
import { VectorShape } from "./VectorShape";

export class CubeShape extends VectorShape {
  constructor(existingPositions: Set<string>, width: number, height: number) {
    super();
    this.radius = 30 * 0.9;
    this.initializeShape();
    this.reset(existingPositions, width, height);
  }

  /**
   * Initializes the cube's vertices and edges.
   */
  protected initializeShape(): void {
    const size = 30;
    this.vertices = [
      vec3.fromValues(-size * 0.5, -size * 0.5, -size * 0.5),
      vec3.fromValues(size * 0.5, -size * 0.5, -size * 0.5),
      vec3.fromValues(size * 0.5, size * 0.5, -size * 0.5),
      vec3.fromValues(-size * 0.5, size * 0.5, -size * 0.5),
      vec3.fromValues(-size * 0.5, -size * 0.5, size * 0.5),
      vec3.fromValues(size * 0.5, -size * 0.5, size * 0.5),
      vec3.fromValues(size * 0.5, size * 0.5, size * 0.5),
      vec3.fromValues(-size * 0.5, size * 0.5, size * 0.5),
    ];
    this.edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
  }
}
