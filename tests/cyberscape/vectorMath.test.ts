import { vec3 } from 'gl-matrix'
import { afterEach, describe, expect, it } from 'vitest'
import { VectorMath } from '@/cyberscape/utils/VectorMath'

const W = 800
const H = 200

describe('VectorMath.project with a view rotation', () => {
  afterEach(() => {
    VectorMath.setView(0, 0)
  })

  it('matches the plain perspective formula when the view is unrotated', () => {
    const p = vec3.fromValues(100, -40, 250)
    const out = VectorMath.project(p, W, H)
    const scale = 500 / (500 + 250)
    expect(out.scale).toBeCloseTo(scale)
    expect(out.x).toBeCloseTo(100 * scale + W / 2)
    expect(out.y).toBeCloseTo(-40 * scale + H / 2)
  })

  it('leaves the origin fixed under any rotation', () => {
    VectorMath.setView(0.3, -0.2)
    const out = VectorMath.project(vec3.fromValues(0, 0, 0), W, H)
    expect(out.x).toBeCloseTo(W / 2)
    expect(out.y).toBeCloseTo(H / 2)
  })

  it('slides near and far points in opposite directions under yaw', () => {
    const near = vec3.fromValues(0, 0, -200)
    const far = vec3.fromValues(0, 0, 200)
    const nearBefore = VectorMath.project(near, W, H).x
    const farBefore = VectorMath.project(far, W, H).x
    expect(nearBefore).toBeCloseTo(W / 2)
    expect(farBefore).toBeCloseTo(W / 2)

    VectorMath.setView(0.25, 0)
    const nearAfter = VectorMath.project(near, W, H).x
    const farAfter = VectorMath.project(far, W, H).x
    expect(nearAfter).toBeLessThan(W / 2)
    expect(farAfter).toBeGreaterThan(W / 2)
  })

  it('tilts points vertically under pitch', () => {
    const p = vec3.fromValues(0, 0, -200)
    VectorMath.setView(0, 0.2)
    const out = VectorMath.project(p, W, H)
    expect(out.y).not.toBeCloseTo(H / 2)
    expect(out.x).toBeCloseTo(W / 2)
  })
})
