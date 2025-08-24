// app/cyberscape/shapes/DodecahedronShape.ts

import { vec3 } from 'gl-matrix'
import { VectorShape } from './VectorShape'

/**
 * The `DodecahedronShape` class represents a dodecahedron in the CyberScape animation.
 * It extends the `VectorShape` base class and initializes the dodecahedron's specific vertices and edges.
 */
export class DodecahedronShape extends VectorShape {
  constructor(existingPositions: Set<string>, width: number, height: number) {
    super()
    this.radius = 30 * 0.9
    this.initializeShape()
    this.reset(existingPositions, width, height)
  }

  /**
   * Initializes the dodecahedron's vertices and edges.
   */
  protected initializeShape(): void {
    const size = 30
    const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio
    const a = size * 0.35
    const b = (size * 0.35) / phi
    this.vertices = [
      vec3.fromValues(a, a, a),
      vec3.fromValues(a, a, -a),
      vec3.fromValues(a, -a, a),
      vec3.fromValues(a, -a, -a),
      vec3.fromValues(-a, a, a),
      vec3.fromValues(-a, a, -a),
      vec3.fromValues(-a, -a, a),
      vec3.fromValues(-a, -a, -a),
      vec3.fromValues(0, b, phi * a),
      vec3.fromValues(0, b, -phi * a),
      vec3.fromValues(0, -b, phi * a),
      vec3.fromValues(0, -b, -phi * a),
      vec3.fromValues(b, phi * a, 0),
      vec3.fromValues(b, -phi * a, 0),
      vec3.fromValues(-b, phi * a, 0),
      vec3.fromValues(-b, -phi * a, 0),
      vec3.fromValues(phi * a, 0, b),
      vec3.fromValues(phi * a, 0, -b),
      vec3.fromValues(-phi * a, 0, b),
      vec3.fromValues(-phi * a, 0, -b),
    ]
    this.edges = [
      [0, 8],
      [0, 12],
      [0, 16],
      [1, 9],
      [1, 12],
      [1, 17],
      [2, 10],
      [2, 13],
      [2, 16],
      [3, 11],
      [3, 13],
      [3, 17],
      [4, 8],
      [4, 14],
      [4, 18],
      [5, 9],
      [5, 14],
      [5, 19],
      [6, 10],
      [6, 15],
      [6, 18],
      [7, 11],
      [7, 15],
      [7, 19],
      [8, 10],
      [9, 11],
      [12, 14],
      [13, 15],
      [16, 17],
      [18, 19],
    ]
  }
}
