import { vec3 } from 'gl-matrix'
import { Particle } from '../particles/Particle'
import { ParticleAtCollision } from '../particles/ParticleAtCollision'

/**
 * ParticlePool class
 *
 * Manages pools of particle objects to optimize performance by reusing particles.
 */
export class ParticlePool {
  private regularPool: Particle[]
  private collisionPool: ParticleAtCollision[]
  private maxRegularPoolSize: number
  private maxCollisionPoolSize: number

  /**
   * Creates a new ParticlePool instance.
   * @param maxRegularPoolSize - Maximum number of regular particles in the pool.
   * @param maxCollisionPoolSize - Maximum number of collision particles in the pool.
   */
  constructor(maxRegularPoolSize = 500, maxCollisionPoolSize = 100) {
    this.maxRegularPoolSize = maxRegularPoolSize
    this.maxCollisionPoolSize = maxCollisionPoolSize
    this.regularPool = []
    this.collisionPool = []
    this.initializePools()
  }

  /**
   * Initializes the particle pools with inactive particles.
   */
  private initializePools(): void {
    for (let i = 0; i < this.maxRegularPoolSize; i++) {
      this.regularPool.push(new Particle(new Set<string>(), window.innerWidth, window.innerHeight))
    }
    for (let i = 0; i < this.maxCollisionPoolSize; i++) {
      this.collisionPool.push(new ParticleAtCollision(vec3.create(), () => {}))
    }
  }

  /**
   * Retrieves a regular particle from the pool or creates a new one if the pool is empty.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @returns A Particle instance.
   */
  public getParticle(width: number, height: number): Particle {
    if (this.regularPool.length > 0) {
      const particle = this.regularPool.pop()!
      particle.reset(new Set<string>(), width, height)
      return particle
    }
    // If pool is empty, create a new particle
    return new Particle(new Set<string>(), width, height)
  }

  /**
   * Retrieves a collision particle from the collision pool or creates a new one if the pool is empty.
   * @param position - The initial position of the collision particle.
   * @param onExpire - Callback function when the particle expires.
   * @returns A ParticleAtCollision instance.
   */
  public getCollisionParticle(position: vec3, onExpire: () => void): ParticleAtCollision {
    if (this.collisionPool.length > 0) {
      const particle = this.collisionPool.pop()!
      particle.init(vec3.clone(position), onExpire)
      return particle
    }
    // If pool is empty, create a new collision particle
    return new ParticleAtCollision(vec3.clone(position), onExpire)
  }

  /**
   * Returns a regular particle to the pool if there's space.
   * @param particle - The particle to return to the pool.
   */
  public returnParticle(particle: Particle): void {
    if (this.regularPool.length < this.maxRegularPoolSize) {
      this.regularPool.push(particle)
    }
  }

  /**
   * Returns a collision particle to the collision pool if there's space.
   * @param particle - The collision particle to return to the pool.
   */
  public returnCollisionParticle(particle: ParticleAtCollision): void {
    if (this.collisionPool.length < this.maxCollisionPoolSize) {
      this.collisionPool.push(particle)
    }
  }
}
