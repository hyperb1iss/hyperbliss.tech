// app/cyberscape/utils/ParticlePool.ts

import { Particle } from "../particles/Particle";
import { ParticleAtCollision } from "../particles/ParticleAtCollision";

/**
 * ParticlePool class
 *
 * This class manages a pool of particle objects to improve performance
 * by reducing object creation and garbage collection.
 */
export class ParticlePool {
  private pool: Particle[];
  private maxSize: number;

  /**
   * Creates a new ParticlePool instance.
   * @param size - The maximum number of particles to store in the pool.
   */
  constructor(size: number) {
    this.maxSize = size;
    this.pool = [];
    this.initialize();
  }

  /**
   * Initializes the particle pool with inactive particles.
   */
  private initialize(): void {
    for (let i = 0; i < this.maxSize; i++) {
      this.pool.push(new Particle(new Set<string>(), 0, 0));
    }
  }

  /**
   * Retrieves a particle from the pool or creates a new one if the pool is empty.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param isCollision - Whether the particle is for a collision effect.
   * @returns A Particle or ParticleAtCollision instance.
   */
  public getParticle(
    width: number,
    height: number,
    isCollision: boolean = false
  ): Particle | ParticleAtCollision {
    if (this.pool.length > 0) {
      const particle = this.pool.pop()!;
      if (isCollision) {
        return new ParticleAtCollision(0, 0, 0, () => {});
      }
      particle.reset(new Set<string>(), width, height);
      return particle;
    }
    return isCollision
      ? new ParticleAtCollision(0, 0, 0, () => {})
      : new Particle(new Set<string>(), width, height);
  }

  /**
   * Returns a particle to the pool if there's space.
   * @param particle - The particle to return to the pool.
   */
  public returnParticle(particle: Particle): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(particle);
    }
  }
}
