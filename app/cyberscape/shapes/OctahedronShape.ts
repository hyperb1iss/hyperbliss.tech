// app/cyberscape/shapes/OctahedronShape.ts

/**
 * The `OctahedronShape` class represents an octahedron in the CyberScape animation.
 * It extends the `VectorShape` base class and initializes the octahedron's specific vertices and edges.
 */

import { VectorShape } from "./VectorShape";

export class OctahedronShape extends VectorShape {
  constructor(existingPositions: Set<string>, width: number, height: number) {
    super();
    this.radius = 30 * 0.9;
    this.initializeShape();
    this.reset(existingPositions, width, height);
  }

  /**
   * Initializes the octahedron's vertices and edges.
   */
  protected initializeShape(): void {
    const size = 30;
    this.vertices = [
      { x: 0, y: size * 0.7, z: 0 },
      { x: size * 0.7, y: 0, z: 0 },
      { x: 0, y: 0, z: size * 0.7 },
      { x: -size * 0.7, y: 0, z: 0 },
      { x: 0, y: 0, z: -size * 0.7 },
      { x: 0, y: -size * 0.7, z: 0 },
    ];
    this.edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 1],
    ];
  }
}
