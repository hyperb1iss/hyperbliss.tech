// app/cyberscape/utils/FrustumCuller.ts

import { mat4, vec3, vec4 } from 'gl-matrix'
import { VectorShape } from '../shapes/VectorShape'

export class FrustumCuller {
  private planes: vec4[]

  constructor() {
    this.planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()]
  }

  updateFrustum(projectionMatrix: mat4, viewMatrix: mat4): void {
    const clipMatrix = mat4.multiply(mat4.create(), projectionMatrix, viewMatrix)

    // Extract frustum planes
    this.extractPlane(clipMatrix, 0, this.planes[0]) // Left
    this.extractPlane(clipMatrix, 1, this.planes[1]) // Right
    this.extractPlane(clipMatrix, 2, this.planes[2]) // Bottom
    this.extractPlane(clipMatrix, 3, this.planes[3]) // Top
    this.extractPlane(clipMatrix, 4, this.planes[4]) // Near
    this.extractPlane(clipMatrix, 5, this.planes[5]) // Far

    // Normalize planes
    for (const plane of this.planes) {
      vec4.scale(plane, plane, 1 / vec3.length(plane as vec3))
    }
  }

  private extractPlane(clipMatrix: mat4, row: number, plane: vec4): void {
    const sign = row < 4 ? 1 : -1
    plane[0] = clipMatrix[3] + sign * clipMatrix[row]
    plane[1] = clipMatrix[7] + sign * clipMatrix[row + 4]
    plane[2] = clipMatrix[11] + sign * clipMatrix[row + 8]
    plane[3] = clipMatrix[15] + sign * clipMatrix[row + 12]
  }

  isShapeVisible(shape: VectorShape): boolean {
    const center = shape.position
    const radius = shape.radius

    for (const plane of this.planes) {
      const distance = vec3.dot(center, plane as vec3) + plane[3]
      if (distance < -radius) {
        return false
      }
    }

    return true
  }
}
