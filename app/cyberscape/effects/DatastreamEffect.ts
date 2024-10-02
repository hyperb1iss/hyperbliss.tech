// app/cyberscape/effects/DatastreamEffect.ts

/**
 * DatastreamEffect class
 *
 * Handles the rendering and interaction of the datastream effect.
 * This effect is triggered during special animations and affects particles and shapes.
 */

import { vec3 } from "gl-matrix";
import { CyberScapeConfig } from "../CyberScapeConfig";
import { Particle } from "../particles/Particle";
import { VectorShape } from "../shapes/VectorShape";
import { ParticlePool } from "../utils/ParticlePool";

export class DatastreamEffect {
  private config: CyberScapeConfig;
  private particlePool: ParticlePool;
  private particlesArray: Particle[];
  private shapesArray: VectorShape[];
  private explosionParticlesCount: number = 0;

  constructor(
    particlePool: ParticlePool,
    particlesArray: Particle[],
    shapesArray: VectorShape[]
  ) {
    this.config = CyberScapeConfig.getInstance();
    this.particlePool = particlePool;
    this.particlesArray = particlesArray;
    this.shapesArray = shapesArray;
  }

  /**
   * Draws the datastream effect.
   *
   * @param ctx - The canvas rendering context.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param centerX - The X coordinate of the effect's center.
   * @param centerY - The Y coordinate of the effect's center.
   * @param intensity - The intensity of the effect.
   * @param hue - The hue value for color calculations.
   * @param animationProgress - The progress of the animation (0 to 1).
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    animationProgress: number
  ) {
    // Create a vec3 for the center position
    const centerPos = vec3.fromValues(centerX, centerY, 0);

    // ----------------------------
    // 1. Draw Expanding Circles
    // ----------------------------
    ctx.save();
    ctx.globalAlpha = intensity * 0.5;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = 2;
    const maxRadius = Math.max(width, height) * 0.4;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const radius = intensity * maxRadius * (1 - i * 0.2);
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    // ----------------------------
    // 2. Draw Noise Effect
    // ----------------------------
    ctx.save();
    ctx.globalAlpha = intensity * 0.2;
    const noiseSize = 4;
    const noiseRadius = Math.max(width, height) * 0.2;

    // Precompute squared noise radius for performance
    const noiseRadiusSq = noiseRadius * noiseRadius;

    for (
      let x = centerX - noiseRadius;
      x < centerX + noiseRadius;
      x += noiseSize
    ) {
      for (
        let y = centerY - noiseRadius;
        y < centerY + noiseRadius;
        y += noiseSize
      ) {
        // Create a vec3 for the current point
        const point = vec3.fromValues(x, y, 0);

        // Calculate squared distance to center to avoid sqrt for performance
        const dx = point[0] - centerPos[0];
        const dy = point[1] - centerPos[1];
        const distanceSq = dx * dx + dy * dy;

        if (Math.random() < 0.5 && distanceSq <= noiseRadiusSq) {
          ctx.fillStyle = `hsl(${hue}, 100%, ${Math.random() * 50 + 50}%)`;
          ctx.fillRect(x, y, noiseSize, noiseSize);
        }
      }
    }
    ctx.restore();

    // ----------------------------
    // 3. Emit Datastream Particles
    // ----------------------------
    if (animationProgress < 0.1) {
      const particlesToEmit = Math.min(
        10,
        this.config.maxDatastreamParticles - this.explosionParticlesCount
      );
      for (let i = 0; i < particlesToEmit; i++) {
        // Retrieve a ParticleAtCollision from the pool
        const particle = this.particlePool.getCollisionParticle(
          vec3.clone(centerPos),
          () => {
            this.explosionParticlesCount--;
            // Optionally, additional logic upon particle expiration
          }
        );

        // Set particle properties
        particle.lifespan = this.config.datastreamParticleLifespan;
        particle.setFadeOutDuration(this.config.datastreamFadeOutDuration);

        // Add the particle to the active particles array
        this.particlesArray.push(particle);
        this.explosionParticlesCount++;
      }
    }

    // ----------------------------
    // 4. Affect Nearby Shapes
    // ----------------------------
    this.shapesArray.forEach((shape) => {
      // Update shape's rotation speed based on intensity
      shape.rotationSpeed = vec3.fromValues(
        intensity * 0.1,
        intensity * 0.1,
        intensity * 0.1
      );

      // Calculate vector from shape to center
      const forceVector = vec3.create();
      vec3.subtract(forceVector, centerPos, shape.position);

      // Calculate distance
      const distance = vec3.length(forceVector);

      // Avoid division by zero
      if (distance === 0) return;

      // Normalize the force vector
      vec3.scale(forceVector, forceVector, 1 / distance);

      // Calculate force magnitude
      const forceMagnitude = (intensity * 5) / (distance + 1);

      // Apply force to shape's velocity
      vec3.scaleAndAdd(
        shape.velocity,
        shape.velocity,
        forceVector,
        forceMagnitude * 0.01
      );
    });

    // ----------------------------
    // 5. Draw Energy Lines
    // ----------------------------
    ctx.save();
    ctx.globalAlpha = intensity * 0.7;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    ctx.lineWidth = 1;
    const energyLineCount = 20;
    ctx.beginPath();
    for (let i = 0; i < energyLineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * maxRadius * 0.8;

      // Calculate start and end points using vec3 for consistency
      const startVec = vec3.fromValues(
        centerPos[0] + Math.cos(angle) * length * 0.2,
        centerPos[1] + Math.sin(angle) * length * 0.2,
        0
      );
      const endVec = vec3.fromValues(
        centerPos[0] + Math.cos(angle) * length,
        centerPos[1] + Math.sin(angle) * length,
        0
      );

      ctx.moveTo(startVec[0], startVec[1]);
      ctx.lineTo(endVec[0], endVec[1]);
    }
    ctx.stroke();
    ctx.restore();
  }
}
