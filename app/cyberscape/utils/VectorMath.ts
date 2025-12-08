// app/cyberscape/utils/VectorMath.ts

import { mat4, vec3 } from 'gl-matrix'

/**
 * Reusable projection result object to avoid allocations in hot paths.
 */
export interface ProjectionResult {
  x: number
  y: number
  scale: number
}

/**
 * VectorMath class
 *
 * This class provides utility functions for vector and 3D math operations
 * used in the CyberScape animation.
 */
export class VectorMath {
  private static readonly tmpMat4 = mat4.create()

  /** Pre-allocated projection result for internal reuse */
  private static readonly tmpProjection: ProjectionResult = { scale: 0, x: 0, y: 0 }

  /** Projection constants */
  private static readonly FOV = 500
  private static readonly MIN_SCALE = 0.5
  private static readonly MAX_SCALE = 1.5

  /**
   * Projects a 3D point onto a 2D plane.
   * @param position - The position of the 3D point as a vec3.
   * @param width - The width of the 2D plane.
   * @param height - The height of the 2D plane.
   * @param out - Optional output object to reuse (avoids allocation).
   * @returns The projection result with x, y coordinates and scale.
   */
  public static project(position: vec3, width: number, height: number, out?: ProjectionResult): ProjectionResult {
    // Use provided output or internal temp (caller should provide for hot paths)
    const result = out ?? VectorMath.tmpProjection

    // Ensure z is not zero to avoid division by zero
    const z = position[2] === 0 ? 0.001 : position[2]

    const scale = VectorMath.FOV / (VectorMath.FOV + z)
    result.scale = Math.min(Math.max(scale, VectorMath.MIN_SCALE), VectorMath.MAX_SCALE)
    result.x = position[0] * result.scale + width / 2
    result.y = position[1] * result.scale + height / 2

    return result
  }

  /**
   * Creates a new ProjectionResult object for reuse in loops.
   * Call once outside hot paths, then pass to project() as 'out' parameter.
   */
  public static createProjectionResult(): ProjectionResult {
    return { scale: 0, x: 0, y: 0 }
  }

  /**
   * Rotates a 3D vertex around the X, Y, and Z axes.
   * @param vertex - The vertex to rotate as a vec3.
   * @param rotation - The rotation angles in radians as a vec3.
   * @returns The rotated vertex as a vec3.
   */
  public static rotateVertex(vertex: vec3, rotation: vec3): vec3 {
    const v = vec3.clone(vertex)
    const m = VectorMath.tmpMat4

    mat4.identity(m)
    mat4.rotateX(m, m, rotation[0])
    mat4.rotateY(m, m, rotation[1])
    mat4.rotateZ(m, m, rotation[2])

    vec3.transformMat4(v, v, m)

    return v
  }

  /**
   * Calculates the distance between two 3D points.
   * @param a - The first point as a vec3.
   * @param b - The second point as a vec3.
   * @returns The distance between the two points.
   */
  public static distance(a: vec3, b: vec3): number {
    return vec3.distance(a, b)
  }
}
