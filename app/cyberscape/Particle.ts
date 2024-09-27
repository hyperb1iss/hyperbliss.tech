import { project, getRandomCyberpunkHue } from "./CyberScapeUtils";

/**
 * Particle class representing a single interactive star in the background.
 * Each particle moves independently, reacts to user interaction, and
 * maintains constant motion across the canvas.
 */
export class Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  color: string;
  maxSpeed: number;
  minSpeed: number;
  lifespan: number;
  age: number;
  opacity: number;
  private appearanceDelay: number;
  private isVisible: boolean;

  // Optimization: Reuse vector for calculations
  private tempVector: { x: number; y: number; z: number };

  /**
   * Creates a new Particle instance.
   * @param existingPositions - Set of existing position keys to avoid overlap
   * @param width - Width of the canvas
   * @param height - Height of the canvas
   */
  constructor(existingPositions: Set<string>, width: number, height: number) {
    // Ensure unique positions by checking existingPositions
    let positionKey: string;
    do {
      this.x = Math.random() * width - width / 2;
      this.y = Math.random() * height - height / 2;
      this.z = Math.random() * 600 - 300;
      positionKey = `${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(
        2
      )}`;
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    this.size = Math.random() * 2 + 1.5; // Particles now range from 1.5 to 3.5 in size

    this.maxSpeed = 0.5;
    this.minSpeed = 0.1;

    // Initialize with a random velocity within speed limits
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI * 2;
    const speedXY =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    const speedZ =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    this.velocityX = Math.cos(angleXY) * speedXY;
    this.velocityY = Math.sin(angleXY) * speedXY;
    this.velocityZ = Math.cos(angleZ) * speedZ;

    this.color = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;

    // Initialize lifecycle properties
    this.lifespan = Infinity; // Default lifespan for regular particles
    this.age = 0;
    this.opacity = 1;

    // Initialize tempVector for reuse in calculations
    this.tempVector = { x: 0, y: 0, z: 0 };
    this.appearanceDelay = 0;
    this.isVisible = false;
  }

  /**
   * Sets a delayed appearance for the particle.
   */
  setDelayedAppearance() {
    this.appearanceDelay = Math.random() * 5000; // Random delay up to 5 seconds
    this.isVisible = false;
  }

  /**
   * Updates the delay for the particle's appearance.
   */
  updateDelay() {
    if (!this.isVisible) {
      this.appearanceDelay -= 16; // Assuming 60 FPS
      if (this.appearanceDelay <= 0) {
        this.isVisible = true;
      }
    }
  }

  /**
   * Checks if the particle is ready to be displayed.
   * @returns True if the particle is visible, false otherwise.
   */
  isReady() {
    return this.isVisible;
  }

  /**
   * Updates the particle's position and velocity based on current state and interactions.
   * This method is called every frame to animate the particle.
   * @param isCursorOverCyberScape - Boolean indicating if the cursor is over the header area
   * @param mouseX - X coordinate of the mouse cursor
   * @param mouseY - Y coordinate of the mouse cursor
   * @param width - Width of the canvas
   * @param height - Height of the canvas
   */
  update(
    isCursorOverCyberScape: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    if (!this.isVisible) return;
    if (isCursorOverCyberScape) {
      this.tempVector.x = mouseX - this.x;
      this.tempVector.y = mouseY - this.y;
      const distance = Math.hypot(this.tempVector.x, this.tempVector.y);

      if (distance > 0 && distance < 200) {
        const force = ((200 - distance) / 200) * 0.02;
        this.velocityX += (this.tempVector.x / distance) * force;
        this.velocityY += (this.tempVector.y / distance) * force;
      }
    }

    // Apply very slight attraction to center to keep particles from straying too far
    this.velocityX += (-this.x / (width * 10)) * 0.01;
    this.velocityY += (-this.y / (height * 10)) * 0.01;

    // Update position
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.z += this.velocityZ;

    // Wrap around edges smoothly
    const buffer = 200; // Ensure objects are fully offscreen before wrapping
    if (this.x < -width / 2 - buffer) {
      this.x += width + buffer * 2;
    } else if (this.x > width / 2 + buffer) {
      this.x -= width + buffer * 2;
    }
    if (this.y < -height / 2 - buffer) {
      this.y += height + buffer * 2;
    } else if (this.y > height / 2 + buffer) {
      this.y -= height + buffer * 2;
    }
    this.z = ((this.z + 300) % 600) - 300;

    // Ensure minimum speed
    const speed = Math.hypot(this.velocityX, this.velocityY, this.velocityZ);
    if (speed < this.minSpeed) {
      const scale = this.minSpeed / speed;
      this.velocityX *= scale;
      this.velocityY *= scale;
      this.velocityZ *= scale;
    }

    // Limit maximum speed
    if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.velocityX *= scale;
      this.velocityY *= scale;
      this.velocityZ *= scale;
    }

    // Add small random changes to velocity for more natural movement
    this.velocityX += (Math.random() - 0.5) * 0.01;
    this.velocityY += (Math.random() - 0.5) * 0.01;
    this.velocityZ += (Math.random() - 0.5) * 0.01;

    // Update lifecycle if lifespan is finite
    if (this.lifespan !== Infinity) {
      this.age += 16; // Assuming 60 FPS
      this.opacity = Math.max(0, 1 - this.age / this.lifespan);
    }
  }

  /**
   * Draws the particle on the canvas with a dynamic glow effect.
   * @param ctx - The 2D rendering context of the canvas
   * @param mouseX - X coordinate of the mouse cursor
   * @param mouseY - Y coordinate of the mouse cursor
   * @param width - Width of the canvas
   * @param height - Height of the canvas
   */
  draw(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    if (!this.isVisible) return;
    const pos = project(this.x, this.y, this.z, width, height);

    // Calculate dynamic shadow blur based on position and proximity to cursor
    const distanceToCursor = Math.hypot(mouseX - this.x, mouseY - this.y);
    const dynamicShadowBlur = 10 + (200 - Math.min(distanceToCursor, 200)) / 20;

    // Set the particle's color and prepare for dynamic glow effect
    ctx.fillStyle = this.color;
    ctx.shadowBlur = dynamicShadowBlur;
    ctx.shadowColor = this.color; // Ensure glow matches object color

    // Draw the particle as a circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.size * pos.scale, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    // Reset shadow blur to avoid affecting other drawings
    ctx.shadowBlur = 0;
  }

  /**
   * Resets the particle to a new random position.
   * @param existingPositions - Set of existing position keys to avoid overlap
   * @param width - Width of the canvas
   * @param height - Height of the canvas
   */
  reset(existingPositions: Set<string>, width: number, height: number) {
    let positionKey: string;
    do {
      this.x = Math.random() * width - width / 2;
      this.y = Math.random() * height - height / 2;
      this.z = Math.random() * 600 - 300;
      positionKey = `${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(
        2
      )}`;
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    // Reset velocity
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI * 2;
    const speedXY =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    const speedZ =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    this.velocityX = Math.cos(angleXY) * speedXY;
    this.velocityY = Math.sin(angleXY) * speedXY;
    this.velocityZ = Math.cos(angleZ) * speedZ;

    // Optionally reset color for variety
    this.color = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;

    // Reset lifecycle properties
    this.lifespan = Infinity; // Regular particles have infinite lifespan
    this.age = 0;
    this.opacity = 1;
  }
}

/**
 * ParticleAtCollision class representing particles emitted upon collisions.
 * Extends the base Particle class with specific initialization and behavior for explosion effects.
 */
export class ParticleAtCollision extends Particle {
  private onExpire: () => void;
  private fadeOutDuration: number;
  private sparkleIntensity: number;

  /**
   * Creates a new ParticleAtCollision instance.
   * @param x - X coordinate of the collision point.
   * @param y - Y coordinate of the collision point.
   * @param z - Z coordinate of the collision point.
   * @param onExpire - Callback function to be called when the particle expires.
   */
  constructor(x: number, y: number, z: number, onExpire: () => void) {
    super(new Set<string>(), window.innerWidth, window.innerHeight);
    this.onExpire = onExpire;
    this.fadeOutDuration = 2000; // 2 seconds fade out
    this.sparkleIntensity = Math.random();
    this.init(x, y, z, onExpire);
  }

  /**
   * Initializes the particle with specific properties for collision effects.
   * @param x - X coordinate of the collision point.
   * @param y - Y coordinate of the collision point.
   * @param z - Z coordinate of the collision point.
   * @param onExpire - Callback function to be called when the particle expires.
   */
  init(x: number, y: number, z: number, onExpire: () => void) {
    this.x = x;
    this.y = y;
    this.z = z;
    // Increase initial velocity for wider spread
    this.velocityX = (Math.random() - 0.5) * 4;
    this.velocityY = (Math.random() - 0.5) * 4;
    this.velocityZ = (Math.random() - 0.5) * 4;
    this.size = Math.random() * 2 + 1;
    this.color = "#FF00FF";
    this.lifespan = 3000; // 3 seconds total lifespan
    this.age = 0;
    this.opacity = 1;
    this.onExpire = onExpire;
    this.sparkleIntensity = Math.random();
  }

  /**
   * Updates the particle's state, including position, velocity, and visual properties.
   * @param isCursorOverCyberScape - Boolean indicating if the cursor is over the CyberScape area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  update(
    isCursorOverCyberScape: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    super.update(isCursorOverCyberScape, mouseX, mouseY, width, height);

    // Slow down the particle over time
    this.velocityX *= 0.98;
    this.velocityY *= 0.98;
    this.velocityZ *= 0.98;

    // Update opacity for smooth fade out
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
  }

  /**
   * Draws the particle on the canvas with fade-out and sparkle effects.
   * @param ctx - The 2D rendering context of the canvas.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
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
   * Draws connections between explosion particles with sparkle effects.
   * @param ctx - The 2D rendering context of the canvas.
   * @param particles - Array of ParticleAtCollision instances to connect.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  static drawConnections(
    ctx: CanvasRenderingContext2D,
    particles: ParticleAtCollision[],
    width: number,
    height: number
  ) {
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

        const dx = particleA.x - particleB.x;
        const dy = particleA.y - particleB.y;
        const dz = particleA.z - particleB.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < MAX_DISTANCE) {
          const posB = project(
            particleB.x,
            particleB.y,
            particleB.z,
            width,
            height
          );

          const opacity =
            (1 - distance / MAX_DISTANCE) *
            Math.min(particleA.opacity, particleB.opacity);
          ctx.strokeStyle = `rgba(255, 0, 255, ${opacity * 0.5})`;
          ctx.lineWidth = 1;

          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();

          // Add sparkle effect to connections (reduced probability)
          if (Math.random() < 0.05) {
            const sparklePos = {
              x: posA.x + (posB.x - posA.x) * Math.random(),
              y: posA.y + (posB.y - posA.y) * Math.random(),
            };
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(sparklePos.x, sparklePos.y, 1, 0, Math.PI * 2);
            ctx.fill();
          }

          connectionsForParticle++;
          totalConnections++;

          if (totalConnections >= MAX_TOTAL_CONNECTIONS) break;
        }
      }
    }
  }

  /**
   * Sets the fade-out duration for the particle.
   * @param duration - The duration of the fade-out effect in milliseconds.
   */
  public setFadeOutDuration(duration: number): void {
    this.fadeOutDuration = duration;
  }
}
