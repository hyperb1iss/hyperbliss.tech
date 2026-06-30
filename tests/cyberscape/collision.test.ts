import { vec3 } from 'gl-matrix'
import { describe, expect, it, vi } from 'vitest'
import { CollisionHandler } from '@/cyberscape/handlers/CollisionHandler'
import { CubeShape } from '@/cyberscape/shapes/CubeShape'

function overlappingCubes() {
  const positions = new Set<string>()
  const a = new CubeShape(positions, 800, 600)
  const b = new CubeShape(positions, 800, 600)
  vec3.set(a.position, 0, 0, 0)
  vec3.set(b.position, 10, 0, 0)
  vec3.set(a.velocity, 0, 0, 0)
  vec3.set(b.velocity, 0, 0, 0)
  a.opacity = 1
  b.opacity = 1
  return [a, b] as const
}

describe('CollisionHandler', () => {
  it('delegates collision side effects to a single callback boundary', () => {
    CollisionHandler.initialize()
    const [a, b] = overlappingCubes()
    const onCollision = vi.fn((shapeA: CubeShape, shapeB: CubeShape) => {
      shapeA.isExploded = true
      shapeB.isExploded = true
    })

    CollisionHandler.handleCollisions([a, b], onCollision)

    expect(onCollision).toHaveBeenCalledTimes(1)
  })
})
