// app/cyberscape/shapes/PyramidShape.ts

/**
 * The `PyramidShape` class represents a pyramid in the CyberScape animation.
 * It extends the `VectorShape` base class and initializes the pyramid's specific vertices and edges.
 */

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
      { x: 0, y: -size, z: 0 },
      { x: -size * 0.7, y: size * 0.7, z: -size * 0.7 },
      { x: size * 0.7, y: size * 0.7, z: -size * 0.7 },
      { x: size * 0.7, y: size * 0.7, z: size * 0.7 },
      { x: -size * 0.7, y: size * 0.7, z: size * 0.7 },
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
