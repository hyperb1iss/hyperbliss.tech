// app/cyberscape/particles/Particle.ts

import { CyberScapeConfig } from "../CyberScapeConfig";
import { VectorShape } from "../shapes/VectorShape";
import { ColorManager } from "../utils/ColorManager";
import { VectorMath } from "../utils/VectorMath";

/**
 * The `Particle` class represents a single interactive star in the background.
 * Each particle moves independently, reacts to user interaction, and maintains constant motion across the canvas.
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
  hue: number;

  // Optimization: Reuse vector for calculations
  private tempVector: { x: number; y: number; z: number };

  protected config: CyberScapeConfig;

  /**
   * Creates a new Particle instance.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  constructor(existingPositions: Set<string>, width: number, height: number) {
    this.config = CyberScapeConfig.getInstance();

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

    this.size =
      Math.random() *
        (this.config.particleSizeMax - this.config.particleSizeMin) +
      this.config.particleSizeMin;

    this.maxSpeed = this.config.particleMaxSpeed;
    this.minSpeed = this.config.particleMinSpeed;

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

    this.hue = ColorManager.getRandomCyberpunkHue();
    this.color = `hsl(${this.hue}, 100%, 50%)`;

    // Initialize lifecycle properties
    this.lifespan = this.config.particleLifespan;
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
  public setDelayedAppearance(): void {
    this.appearanceDelay = Math.random() * 5000; // Random delay up to 5 seconds
    this.isVisible = false;
  }

  /**
   * Updates the delay for the particle's appearance.
   */
  public updateDelay(): void {
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
  public isReady(): boolean {
    return this.isVisible;
  }

  /**
   * Updates the particle's position and velocity based on current state and interactions.
   * This method is called every frame to animate the particle.
   * @param isCursorOverCyberScape - Boolean indicating if the cursor is over the header area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   * @param shapes - Array of VectorShape instances for interaction.
   */
  public update(
    isCursorOverCyberScape: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    shapes: VectorShape[]
  ): void {
    if (!this.isVisible) return;
    if (isCursorOverCyberScape) {
      this.tempVector.x = mouseX - this.x;
      this.tempVector.y = mouseY - this.y;
      const distance = Math.hypot(this.tempVector.x, this.tempVector.y);

      if (distance > 0 && distance < this.config.cursorInfluenceRadius) {
        const force =
          ((this.config.cursorInfluenceRadius - distance) /
            this.config.cursorInfluenceRadius) *
          this.config.cursorForce;
        this.velocityX += (this.tempVector.x / distance) * force;
        this.velocityY += (this.tempVector.y / distance) * force;
      }
    }

    // Apply slight attraction to center
    this.velocityX +=
      (-this.x / (width * 10)) * this.config.centerAttractionForce;
    this.velocityY +=
      (-this.y / (height * 10)) * this.config.centerAttractionForce;

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

    // Ensure minimum and maximum speed
    const speed = Math.hypot(this.velocityX, this.velocityY, this.velocityZ);
    if (speed < this.minSpeed) {
      const scale = this.minSpeed / speed;
      this.velocityX *= scale;
      this.velocityY *= scale;
      this.velocityZ *= scale;
    } else if (speed > this.maxSpeed) {
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

    // Interact with nearby shapes
    this.interactWithShapes(shapes);
  }

  /**
   * Interacts with nearby shapes, applying forces and influencing rotations.
   * @param shapes - Array of VectorShape instances.
   */
  protected interactWithShapes(shapes: VectorShape[]): void {
    const INTERACTION_RADIUS = 100;
    shapes.forEach((shape) => {
      const dx = shape.position.x - this.x;
      const dy = shape.position.y - this.y;
      const dz = shape.position.z - this.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < INTERACTION_RADIUS) {
        const force = 0.01 * (1 - distance / INTERACTION_RADIUS);
        this.velocityX += dx * force;
        this.velocityY += dy * force;
        this.velocityZ += dz * force;

        // Influence shape's rotation
        shape.rotationSpeed.x += (Math.random() - 0.5) * 0.001;
        shape.rotationSpeed.y += (Math.random() - 0.5) * 0.001;
        shape.rotationSpeed.z += (Math.random() - 0.5) * 0.001;
      }
    });
  }

  /**
   * Draws the particle on the canvas with a dynamic glow effect.
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
    if (!this.isVisible) return;
    const pos = VectorMath.project(this.x, this.y, this.z, width, height);

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
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public reset(
    existingPositions: Set<string>,
    width: number,
    height: number
  ): void {
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
    this.hue = ColorManager.getRandomCyberpunkHue();
    this.color = `hsl(${this.hue}, 100%, 50%)`;

    // Reset lifecycle properties
    this.lifespan = this.config.particleLifespan;
    this.age = 0;
    this.opacity = 1;
  }
}
