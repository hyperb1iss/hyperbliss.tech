import { vec3 } from 'gl-matrix'
import { describe, expect, it } from 'vitest'
import { CyberScapeConfig } from '@/cyberscape/CyberScapeConfig'
import { Particle } from '@/cyberscape/particles/Particle'
import { ParticleAtCollision } from '@/cyberscape/particles/ParticleAtCollision'

describe('particle lifecycle', () => {
  it('appears with an opacity the render loop will not read as expired', () => {
    const particle = new Particle(new Set<string>(), 800, 200)
    particle.setDelayedAppearance()
    particle.opacity = 0
    // Drain the appearance delay (at most 1s) in wall-clock steps
    for (let i = 0; i < 80 && !particle.isReady(); i++) particle.updateDelay(16)
    expect(particle.isReady()).toBe(true)
    expect(particle.opacity).toBeGreaterThan(0)
  })

  it('keeps updating while grazing the edge inside the out-of-bounds buffer', () => {
    const particle = new Particle(new Set<string>(), 800, 200)
    particle.setDelayedAppearance()
    for (let i = 0; i < 80 && !particle.isReady(); i++) particle.updateDelay(16)
    vec3.set(particle.position, -800 / 2 - 30, 0, 0)
    vec3.set(particle.velocity, 0, 0, 0)
    particle.update(false, 0, 0, 800, 200, [], 1)
    expect(particle.isOutOfBounds(800, 200)).toBe(false)
    expect(particle.isReady()).toBe(true)
  })

  it('burst particles are visible the frame they are emitted and expire once', () => {
    let expired = 0
    const particle = new ParticleAtCollision(vec3.fromValues(0, 0, 0), () => expired++)
    expect(particle.isReady()).toBe(true)
    expect(particle.opacity).toBe(1)
    const config = CyberScapeConfig.getInstance()
    const total = config.particleAtCollisionLifespan + 100
    for (let t = 0; t < total; t += 16) particle.tick(16 / config.simulationTickMs, 16)
    expect(particle.opacity).toBe(0)
    expect(expired).toBeGreaterThanOrEqual(1)
  })
})
