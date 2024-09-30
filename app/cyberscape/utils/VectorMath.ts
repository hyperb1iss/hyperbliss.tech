// app/cyberscape/utils/VectorMath.ts

/**
 * VectorMath class
 *
 * This class provides utility functions for vector and 3D math operations
 * used in the CyberScape animation.
 */
export class VectorMath {
  /**
   * Projects a 3D point onto a 2D plane.
   * @param x - The x-coordinate of the 3D point.
   * @param y - The y-coordinate of the 3D point.
   * @param z - The z-coordinate of the 3D point.
   * @param width - The width of the 2D plane.
   * @param height - The height of the 2D plane.
   * @returns An object containing the projected x, y coordinates and the scale.
   */
  public static project(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number
  ) {
    const fov = 500; // Field of view
    const minScale = 0.5; // Minimum scale to prevent shapes from becoming too small
    const maxScale = 1.5; // Maximum scale to prevent shapes from becoming too large
    const scale = fov / (fov + z);
    const clampedScale = Math.min(Math.max(scale, minScale), maxScale);
    return {
      x: x * clampedScale + width / 2,
      y: y * clampedScale + height / 2,
      scale: clampedScale,
    };
  }

  /**
   * Rotates a 3D vertex around the X, Y, and Z axes.
   * @param vertex - The vertex to rotate, containing x, y, and z properties.
   * @param rotation - The rotation angles in radians, containing x, y, and z properties.
   * @returns The rotated vertex with new x, y, and z coordinates.
   */
  public static rotateVertex(
    vertex: { x: number; y: number; z: number },
    rotation: { x: number; y: number; z: number }
  ) {
    // Rotation around X axis
    const x = vertex.x;
    const y = vertex.y * Math.cos(rotation.x) - vertex.z * Math.sin(rotation.x);
    const z = vertex.y * Math.sin(rotation.x) + vertex.z * Math.cos(rotation.x);

    // Rotation around Y axis
    const x1 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
    const y1 = y;
    const z1 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);

    // Rotation around Z axis
    const x2 = x1 * Math.cos(rotation.z) - y1 * Math.sin(rotation.z);
    const y2 = x1 * Math.sin(rotation.z) + y1 * Math.cos(rotation.z);
    const z2 = z1;

    return { x: x2, y: y2, z: z2 };
  }

  /**
   * Calculates the distance between two 3D points.
   * @param a - The first point with x, y, and z coordinates.
   * @param b - The second point with x, y, and z coordinates.
   * @returns The distance between the two points.
   */
  public static distance(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number }
  ): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
