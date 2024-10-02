// app/cyberscape/utils/VectorMath.ts

import { mat4, vec3 } from "gl-matrix";

/**
 * VectorMath class
 *
 * This class provides utility functions for vector and 3D math operations
 * used in the CyberScape animation.
 */
export class VectorMath {
  private static readonly tmpMat4 = mat4.create();

  /**
   * Projects a 3D point onto a 2D plane.
   * @param position - The position of the 3D point as a vec3.
   * @param width - The width of the 2D plane.
   * @param height - The height of the 2D plane.
   * @returns An object containing the projected x, y coordinates and the scale.
   */
  public static project(
    position: vec3,
    width: number,
    height: number
  ) {
    const fov = 500; // Field of view
    const minScale = 0.5; // Minimum scale to prevent shapes from becoming too small
    const maxScale = 1.5; // Maximum scale to prevent shapes from becoming too large
    const scale = fov / (fov + position[2]);
    const clampedScale = Math.min(Math.max(scale, minScale), maxScale);
    return {
      x: position[0] * clampedScale + width / 2,
      y: position[1] * clampedScale + height / 2,
      scale: clampedScale,
    };
  }

  /**
   * Rotates a 3D vertex around the X, Y, and Z axes.
   * @param vertex - The vertex to rotate as a vec3.
   * @param rotation - The rotation angles in radians as a vec3.
   * @returns The rotated vertex as a vec3.
   */
  public static rotateVertex(vertex: vec3, rotation: vec3): vec3 {
    const v = vec3.clone(vertex);
    const m = VectorMath.tmpMat4;

    mat4.identity(m);
    mat4.rotateX(m, m, rotation[0]);
    mat4.rotateY(m, m, rotation[1]);
    mat4.rotateZ(m, m, rotation[2]);

    vec3.transformMat4(v, v, m);

    return v;
  }

  /**
   * Calculates the distance between two 3D points.
   * @param a - The first point as a vec3.
   * @param b - The second point as a vec3.
   * @returns The distance between the two points.
   */
  public static distance(a: vec3, b: vec3): number {
    return vec3.distance(a, b);
  }
}
