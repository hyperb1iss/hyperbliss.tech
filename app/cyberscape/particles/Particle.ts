// app/cyberscape/particles/Particle.ts

import { CyberScapeConfig } from "../CyberScapeConfig";
import { VectorShape } from "../shapes/VectorShape";
import { ColorManager } from "../utils/ColorManager";
import { vec3 } from "gl-matrix";
import { VectorMath } from "../utils/VectorMath";

/**
 * The `Particle` class represents a single interactive star in the background.
 * Each particle moves independently, reacts to user interaction, and maintains constant motion across the canvas.
 */
export class Particle {
  position: vec3;
  velocity: vec3;
  size: number;
  color: string;
  maxSpeed: number;
  minSpeed: number;
  lifespan: number;
  age: number;
  opacity: number;
  private appearanceDelay: number;
  public isVisible: boolean;
  hue: number;

  // Optimization: Reuse vector for calculations
  private tempVector: vec3;

  protected config: CyberScapeConfig;

  // Add these new properties
  public connectionCount: number = 0;
  public lastConnectionTime: number = 0;
  public connectionDelay: number = 0;

  /**
   * Creates a new Particle instance.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  constructor(existingPositions: Set<string>, width: number, height: number) {
    this.config = CyberScapeConfig.getInstance();

    // Initialize position
    this.position = vec3.create();
    let positionKey: string;
    do {
      vec3.set(
        this.position,
        Math.random() * width - width / 2,
        Math.random() * height - height / 2,
        Math.random() * 600 - 300
      );
      positionKey = `${this.position[0].toFixed(2)},${this.position[1].toFixed(
        2
      )},${this.position[2].toFixed(2)}`;
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    this.size =
      Math.random() *
        (this.config.particleSizeMax - this.config.particleSizeMin) +
      this.config.particleSizeMin;

    this.maxSpeed = this.config.particleMaxSpeed;
    this.minSpeed = this.config.particleMinSpeed;

    // Initialize with a random velocity within speed limits
    this.velocity = vec3.create();
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI * 2;
    const speedXY =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    const speedZ =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    vec3.set(
      this.velocity,
      Math.cos(angleXY) * speedXY,
      Math.sin(angleXY) * speedXY,
      Math.cos(angleZ) * speedZ
    );

    this.hue = ColorManager.getRandomCyberpunkHue();
    this.color = `hsl(${this.hue}, 100%, 50%)`;

    // Initialize lifecycle properties
    this.lifespan = this.config.particleLifespan;
    this.age = 0;
    this.opacity = 1;

    // Initialize tempVector for reuse in calculations
    this.tempVector = vec3.create();
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
      vec3.set(
        this.tempVector,
        mouseX - this.position[0],
        mouseY - this.position[1],
        0
      );
      const distance = vec3.length(this.tempVector);

      if (distance > 0 && distance < this.config.cursorInfluenceRadius) {
        const force =
          ((this.config.cursorInfluenceRadius - distance) /
            this.config.cursorInfluenceRadius) *
          this.config.cursorForce;
        vec3.scale(this.tempVector, this.tempVector, (1 / distance) * force);
        vec3.add(this.velocity, this.velocity, this.tempVector);
      }
    }

    // Apply slight attraction to center
    vec3.add(
      this.velocity,
      this.velocity,
      vec3.fromValues(
        (-this.position[0] / (width * 10)) * this.config.centerAttractionForce,
        (-this.position[1] / (height * 10)) * this.config.centerAttractionForce,
        0
      )
    );

    // Update position
    vec3.add(this.position, this.position, this.velocity);

    // Wrap around edges smoothly
    const buffer = 200; // Ensure objects are fully offscreen before wrapping
    if (this.position[0] < -width / 2 - buffer) {
      this.position[0] += width + buffer * 2;
    } else if (this.position[0] > width / 2 + buffer) {
      this.position[0] -= width + buffer * 2;
    }
    if (this.position[1] < -height / 2 - buffer) {
      this.position[1] += height + buffer * 2;
    } else if (this.position[1] > height / 2 + buffer) {
      this.position[1] -= height + buffer * 2;
    }
    this.position[2] = ((this.position[2] + 300) % 600) - 300;

    // Ensure minimum and maximum speed
    const speed = vec3.length(this.velocity);
    if (speed < this.minSpeed) {
      vec3.scale(this.velocity, this.velocity, this.minSpeed / speed);
    } else if (speed > this.maxSpeed) {
      vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
    }

    // Add small random changes to velocity for more natural movement
    vec3.add(
      this.velocity,
      this.velocity,
      vec3.fromValues(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      )
    );

    // Update lifecycle if lifespan is finite
    if (this.lifespan !== Infinity) {
      this.age += 16; // Assuming 60 FPS
      this.opacity = Math.max(0, 1 - this.age / this.lifespan);
    }

    // Interact with nearby shapes
    this.interactWithShapes(shapes);

    // Update visibility
    const pos = VectorMath.project(this.position, width, height);
    this.isVisible = pos.x >= 0 && pos.x <= width && pos.y >= 0 && pos.y <= height;
  }

  /**
   * Interacts with nearby shapes, applying forces and influencing rotations.
   * @param shapes - Array of VectorShape instances.
   */
  protected interactWithShapes(shapes: VectorShape[]): void {
    const INTERACTION_RADIUS = this.config.particleInteractionRadius;
    const INTERACTION_FORCE = this.config.particleInteractionForce;
    shapes.forEach((shape) => {
      vec3.subtract(this.tempVector, shape.position, this.position);
      const distance = vec3.length(this.tempVector);

      if (distance > 0 && distance < INTERACTION_RADIUS) {
        const force = INTERACTION_FORCE * (1 - distance / INTERACTION_RADIUS);
        vec3.scale(this.tempVector, this.tempVector, (1 / distance) * force);
        vec3.add(this.velocity, this.velocity, this.tempVector);

        // Influence shape's rotation
        const rotationInfluence = vec3.fromValues(
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001,
          (Math.random() - 0.5) * 0.001
        );
        vec3.add(shape.rotationSpeed, shape.rotationSpeed, rotationInfluence);
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
    const pos = VectorMath.project(this.position, width, height);

    // Calculate dynamic shadow blur based on position and proximity to cursor
    const distanceToCursor = Math.hypot(
      mouseX - this.position[0],
      mouseY - this.position[1]
    );
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
      vec3.set(
        this.position,
        Math.random() * width - width / 2,
        Math.random() * height - height / 2,
        Math.random() * 600 - 300
      );
      positionKey = `${this.position[0].toFixed(2)},${this.position[1].toFixed(
        2
      )},${this.position[2].toFixed(2)}`;
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    // Reset velocity
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI * 2;
    const speedXY =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    const speedZ =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    vec3.set(
      this.velocity,
      Math.cos(angleXY) * speedXY,
      Math.sin(angleXY) * speedXY,
      Math.cos(angleZ) * speedZ
    );

    // Optionally reset color for variety
    this.hue = ColorManager.getRandomCyberpunkHue();
    this.color = `hsl(${this.hue}, 100%, 50%)`;

    // Reset lifecycle properties
    this.lifespan = this.config.particleLifespan;
    this.age = 0;
    this.opacity = 1;
  }

  public canCreateNewConnection(currentTime: number): boolean {
    const config = CyberScapeConfig.getInstance();
    if (this.lastConnectionTime === 0) {
      this.lastConnectionTime = currentTime;
      this.connectionDelay = Math.random() * config.maxConnectionDelay + config.minConnectionDelay;
      return true;
    }

    if (currentTime - this.lastConnectionTime < this.connectionDelay) {
      return false;
    }
    this.lastConnectionTime = currentTime;
    this.connectionDelay = Math.random() * config.maxConnectionDelay + config.minConnectionDelay;
    return true;
  }

  public incrementConnectionCount(): void {
    this.connectionCount++;
  }

  public decrementConnectionCount(): void {
    this.connectionCount = Math.max(0, this.connectionCount - 1);
  }
}