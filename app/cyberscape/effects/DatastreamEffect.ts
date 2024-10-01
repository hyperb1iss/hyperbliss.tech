// app/cyberscape/effects/DatastreamEffect.ts

/**
 * DatastreamEffect class
 *
 * Handles the rendering and interaction of the datastream effect.
 * This effect is triggered during special animations and affects particles and shapes.
 */

import { CyberScapeConfig } from "../CyberScapeConfig";
import { Particle } from "../particles/Particle";
import { ParticleAtCollision } from "../particles/ParticleAtCollision";
import { VectorShape } from "../shapes/VectorShape";
import { ParticlePool } from "../utils/ParticlePool";
import { VectorMath } from "../utils/VectorMath";

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
    // Draw expanding circles
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

    // Draw noise effect
    ctx.save();
    ctx.globalAlpha = intensity * 0.2;
    const noiseSize = 4;
    const noiseRadius = Math.max(width, height) * 0.2;
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
        if (
          Math.random() < 0.5 &&
          VectorMath.distance(
            { x, y, z: 0 },
            { x: centerX, y: centerY, z: 0 }
          ) <= noiseRadius
        ) {
          ctx.fillStyle = `hsl(${hue}, 100%, ${Math.random() * 50 + 50}%)`;
          ctx.fillRect(x, y, noiseSize, noiseSize);
        }
      }
    }
    ctx.restore();

    // Emit datastream particles
    if (animationProgress < 0.1) {
      const particlesToEmit = Math.min(
        10,
        this.config.maxDatastreamParticles - this.explosionParticlesCount
      );
      for (let i = 0; i < particlesToEmit; i++) {
        const particle = this.particlePool.getParticle(
          width,
          height,
          true
        ) as ParticleAtCollision;
        particle.init(centerX, centerY, 0, () => {
          this.explosionParticlesCount--;
        });
        particle.lifespan = this.config.datastreamParticleLifespan;
        particle.setFadeOutDuration(this.config.datastreamFadeOutDuration);
        this.particlesArray.push(particle);
        this.explosionParticlesCount++;
      }
    }

    // Affect nearby shapes
    this.shapesArray.forEach((shape) => {
      shape.rotationSpeed = {
        x: intensity * 0.1,
        y: intensity * 0.1,
        z: intensity * 0.1,
      };
      const dx = centerX - shape.position.x;
      const dy = centerY - shape.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (intensity * 5) / (distance + 1);
      shape.velocity.x += dx * force * 0.01;
      shape.velocity.y += dy * force * 0.01;
    });

    // Draw energy lines
    ctx.save();
    ctx.globalAlpha = intensity * 0.7;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    ctx.lineWidth = 1;
    const energyLineCount = 20;
    ctx.beginPath();
    for (let i = 0; i < energyLineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * maxRadius * 0.8;
      const startX = centerX + Math.cos(angle) * length * 0.2;
      const startY = centerY + Math.sin(angle) * length * 0.2;
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
    ctx.restore();
  }
}
