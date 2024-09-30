// app/cyberscape/particles/ParticleAtCollision.ts

/**
 * The `ParticleAtCollision` class represents particles emitted upon collisions.
 * Extends the base `Particle` class with specific initialization and behavior for explosion effects.
 */

import { project } from "../CyberScapeUtils";
import { VectorShape } from "../shapes/VectorShape";
import { Particle } from "./Particle";

export class ParticleAtCollision extends Particle {
  private onExpire: () => void;
  private fadeOutDuration: number;
  private sparkleIntensity: number;
  private initialSpeed: number;
  private direction: { x: number; y: number; z: number };

  constructor(x: number, y: number, z: number, onExpire: () => void) {
    super(new Set<string>(), window.innerWidth, window.innerHeight);
    this.onExpire = onExpire;
    this.fadeOutDuration = 2000; // 2 seconds fade out
    this.sparkleIntensity = Math.random();
    this.initialSpeed = Math.random() * 2 + 1; // Random speed between 1 and 3
    this.direction = { x: 0, y: 0, z: 0 };
    this.init(x, y, z, onExpire);
  }

  /**
   * Initializes the particle's properties for the explosion effect.
   * @param x - Initial x-coordinate.
   * @param y - Initial y-coordinate.
   * @param z - Initial z-coordinate.
   * @param onExpire - Callback function when the particle expires.
   */
  public init(x: number, y: number, z: number, onExpire: () => void): void {
    this.x = x;
    this.y = y;
    this.z = z;
    // Set initial direction (normalized vector)
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    this.direction = {
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi),
    };
    this.velocityX = this.direction.x * this.initialSpeed;
    this.velocityY = this.direction.y * this.initialSpeed;
    this.velocityZ = this.direction.z * this.initialSpeed;
    this.size = Math.random() * 2 + 1;
    this.color = "#FF00FF";
    this.lifespan = 3000; // 3 seconds total lifespan
    this.age = 0;
    this.opacity = 1;
    this.onExpire = onExpire;
    this.sparkleIntensity = Math.random();
  }

  /**
   * Updates the particle's position and fades it out over time.
   * @param isCursorOverCyberScape - Boolean indicating if the cursor is over the header area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   * @param shapes - Array of VectorShape instances.
   */
  public update(): void {
    // Update position based on velocity
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.z += this.velocityZ;

    // Slow down the particle over time
    const slowdownFactor = 0.98;
    this.velocityX *= slowdownFactor;
    this.velocityY *= slowdownFactor;
    this.velocityZ *= slowdownFactor;

    // Update age and opacity
    this.age += 16; // Assuming 60 FPS
    if (this.age > this.lifespan - this.fadeOutDuration) {
      this.opacity = Math.max(
        0,
        (this.lifespan - this.age) / this.fadeOutDuration
      );
    }

    // Update sparkle intensity
    this.sparkleIntensity = Math.max(0, this.sparkleIntensity - 0.02);

    if (this.opacity <= 0) {
      this.onExpire();
    }

    // Interact with shapes (optional)
    // No interaction to keep explosion particles moving outward independently
  }

  /**
   * Draws the particle with a sparkle effect.
   * @param ctx - The 2D rendering context of the canvas.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ): void {
    if (this.opacity <= 0) return;

    const pos = project(this.x, this.y, this.z, width, height);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.size * pos.scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 0, 255, ${this.opacity})`; // Neon Magenta with fading opacity
    ctx.fill();

    // Add a subtle motion blur effect for smoother fade-out
    ctx.shadowBlur = 5 * this.opacity;
    ctx.shadowColor = `rgba(255, 0, 255, ${this.opacity})`;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // Add sparkle effect
    if (Math.random() < this.sparkleIntensity) {
      ctx.fillStyle = `rgba(255, 255, 255, ${
        this.opacity * this.sparkleIntensity
      })`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.size * pos.scale * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * Draws connections between explosion particles, creating a dynamic web effect.
   * @param ctx - The 2D rendering context of the canvas.
   * @param particles - Array of ParticleAtCollision instances.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   * @param shapes - Array of VectorShape instances.
   */
  public static drawConnections(
    ctx: CanvasRenderingContext2D,
    particles: ParticleAtCollision[],
    width: number,
    height: number,
    shapes: VectorShape[]
  ): void {
    const MAX_DISTANCE = 50;
    const MAX_CONNECTIONS_PER_PARTICLE = 3;
    const MAX_TOTAL_CONNECTIONS = 50;

    let totalConnections = 0;

    for (
      let i = 0;
      i < particles.length && totalConnections < MAX_TOTAL_CONNECTIONS;
      i++
    ) {
      let connectionsForParticle = 0;
      const particleA = particles[i];
      const posA = project(
        particleA.x,
        particleA.y,
        particleA.z,
        width,
        height
      );

      for (
        let j = i + 1;
        j < particles.length &&
        connectionsForParticle < MAX_CONNECTIONS_PER_PARTICLE;
        j++
      ) {
        const particleB = particles[j];

        const dx = particleB.x - particleA.x;
        const dy = particleB.y - particleA.y;
        const dz = particleB.z - particleA.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < MAX_DISTANCE) {
          const posB = project(
            particleB.x,
            particleB.y,
            particleB.z,
            width,
            height
          );

          const baseOpacity =
            (1 - distance / MAX_DISTANCE) *
            Math.min(particleA.opacity, particleB.opacity);
          const opacity =
            baseOpacity *
            (1 - Math.max(particleA.age, particleB.age) / particleA.lifespan);

          // Generate a dynamic color for the connection
          const hue =
            (particleA.hue + particleB.hue) / 2 + Math.random() * 30 - 15;
          const saturation = 80 + Math.random() * 20;
          const lightness = 50 + Math.random() * 10;

          // Draw the main connection line
          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
            opacity * 0.5
          })`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();

          // Add sparkle effect to connections
          if (Math.random() < 0.3 * opacity) {
            const sparklePos = {
              x: posA.x + (posB.x - posA.x) * Math.random(),
              y: posA.y + (posB.y - posA.y) * Math.random(),
            };
            const sparkleSize = Math.random() * 1.5 + 0.5;
            const sparkleOpacity = Math.random() * opacity;
            const sparkleHue = hue + Math.random() * 60 - 30;
            ctx.fillStyle = `hsla(${sparkleHue}, 100%, 75%, ${sparkleOpacity})`;
            ctx.beginPath();
            ctx.arc(sparklePos.x, sparklePos.y, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
          }

          connectionsForParticle++;
          totalConnections++;

          if (totalConnections >= MAX_TOTAL_CONNECTIONS) break;
        }
      }
    }

    // Create temporary distortions in nearby shapes
    shapes.forEach((shape) => {
      particles.forEach((particle) => {
        const dx = shape.position.x - particle.x;
        const dy = shape.position.y - particle.y;
        const dz = shape.position.z - particle.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 100) {
          const distortionFactor =
            0.1 * (1 - distance / 100) * particle.opacity;
          shape.temporaryDistortion = {
            x: (Math.random() - 0.5) * distortionFactor,
            y: (Math.random() - 0.5) * distortionFactor,
            z: (Math.random() - 0.5) * distortionFactor,
          };
        }
      });
    });
  }

  /**
   * Sets the fade-out duration for the particle.
   * @param duration - The duration of the fade-out effect in milliseconds.
   */
  public setFadeOutDuration(duration: number): void {
    this.fadeOutDuration = duration;
  }

  /**
   * Overrides the interactWithShapes method to prevent explosion particles
   * from interacting with shapes or other particles, ensuring they explode outward.
   */
  protected interactWithShapes(_shapes: VectorShape[]): void {
    // No interaction to keep explosion particles moving outward independently
  }
}
