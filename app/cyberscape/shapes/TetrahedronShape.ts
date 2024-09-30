// app/cyberscape/shapes/TetrahedronShape.ts

/**
 * The `TetrahedronShape` class represents a tetrahedron in the CyberScape animation.
 * It extends the `VectorShape` base class and initializes the tetrahedron's specific vertices and edges.
 */

import { VectorShape } from "./VectorShape";

export class TetrahedronShape extends VectorShape {
  constructor(existingPositions: Set<string>, width: number, height: number) {
    super();
    this.radius = 30 * 0.9;
    this.initializeShape();
    this.reset(existingPositions, width, height);
  }

  /**
   * Initializes the tetrahedron's vertices and edges.
   */
  protected initializeShape(): void {
    const size = 30;
    this.vertices = [
      { x: size * 0.7, y: size * 0.7, z: size * 0.7 },
      { x: -size * 0.7, y: -size * 0.7, z: size * 0.7 },
      { x: -size * 0.7, y: size * 0.7, z: -size * 0.7 },
      { x: size * 0.7, y: -size * 0.7, z: -size * 0.7 },
    ];
    this.edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [2, 3],
    ];
  }
}
