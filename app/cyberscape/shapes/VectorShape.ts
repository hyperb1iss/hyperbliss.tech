// app/cyberscape/shapes/VectorShape.ts

/**
 * The `VectorShape` abstract class represents a 3D shape in the CyberScape animation.
 * It provides common properties and methods shared among different shapes like cubes,
 * pyramids, tetrahedrons, etc.
 */

import {
  CYBERPUNK_COLORS,
  hexToRgb,
  project,
  rgbToHex,
  rotateVertex,
} from "../CyberScapeUtils";
import { Particle } from "../particles/Particle";
export abstract class VectorShape {
  vertices: { x: number; y: number; z: number }[] = [];
  edges: [number, number][] = [];
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  velocity: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  rotationSpeed: { x: number; y: number; z: number };
  color: string;
  targetColor: string;
  colorTransitionSpeed: number;
  maxSpeed: number;
  minSpeed: number;
  lifespan: number;
  age: number;
  fadeOutDuration: number;
  isFadingOut: boolean;
  opacity: number = 0;
  glowIntensity: number = Math.random() * 10 + 15;
  radius: number = 0; // Represents the size of the shape for interactions
  scale: number = 1; // Current scale of the shape
  scaleTarget: number = 1; // Target scale for morphing
  scaleSpeed: number = 0.02; // Speed at which the shape scales

  isExploded: boolean; // Flag to indicate if the shape has exploded
  respawnTimer: number | null; // Timer ID for respawning

  // Reusable objects for calculations
  private tempVector: { x: number; y: number; z: number };
  temporaryDistortion: { x: number; y: number; z: number };

  constructor() {
    // Initialize shared properties
    this.maxSpeed = 0.3;
    this.minSpeed = 0.05;

    this.rotation = { x: 0, y: 0, z: 0 };
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    };

    this.color = this.getRandomCyberpunkColor();
    this.targetColor = this.getRandomCyberpunkColor();
    this.colorTransitionSpeed = 0.01;

    this.lifespan = Math.random() * 15000 + 10000; // Random lifespan between 10-25 seconds
    this.age = 0;
    this.fadeOutDuration = 3000; // 3 seconds fade out
    this.isFadingOut = false;
    this.opacity = 0; // Start fully transparent

    this.glowIntensity = Math.random() * 10 + 15; // Random intensity between 15 and 25

    this.scale = 1;
    this.scaleTarget = 1;
    this.scaleSpeed = 0.02;

    this.isExploded = false;
    this.respawnTimer = null;

    this.tempVector = { x: 0, y: 0, z: 0 };
    this.temporaryDistortion = { x: 0, y: 0, z: 0 };

    // Initialize position and radius in derived classes
  }

  /**
   * Abstract method to initialize the shape's vertices and edges.
   * Must be implemented by derived classes.
   */
  protected abstract initializeShape(): void;

  /**
   * Gets a random color from the CYBERPUNK_COLORS array.
   * @returns A string representing a color from the cyberpunk palette.
   */
  public getRandomCyberpunkColor(): string {
    return CYBERPUNK_COLORS[
      Math.floor(Math.random() * CYBERPUNK_COLORS.length)
    ];
  }

  /**
   * Initializes or resets the shape's position and other properties.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public reset(
    existingPositions: Set<string>,
    width: number,
    height: number
  ): void {
    // Reset position
    let positionKey: string;
    do {
      this.position = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 600 - 300,
      };
      positionKey = this.getPositionKey();
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    // Reset lifecycle
    this.age = 0;
    this.lifespan = Math.random() * 15000 + 10000; // Random lifespan between 10-25 seconds
    this.isFadingOut = false;
    this.opacity = 0; // Start fully transparent

    // Reset color
    this.color = this.getRandomCyberpunkColor();
    this.targetColor = this.getRandomCyberpunkColor();

    // Reset velocity
    const angleXY = Math.random() * Math.PI * 2;
    const angleZ = Math.random() * Math.PI * 2;
    const speedXY =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    const speedZ =
      Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
    this.velocity = {
      x: Math.cos(angleXY) * speedXY,
      y: Math.sin(angleXY) * speedXY,
      z: Math.cos(angleZ) * speedZ,
    };

    // Reset rotation
    this.rotation = { x: 0, y: 0, z: 0 };
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    };

    // Reset glow intensity
    this.glowIntensity = Math.random() * 10 + 15; // Random intensity between 15 and 25

    // Reset scaling properties
    this.scale = 1;
    this.scaleTarget = 1;
    this.scaleSpeed = 0.02;

    // Reset explosion and respawn properties
    this.isExploded = false;
    this.respawnTimer = null;
  }

  /**
   * Generates a unique position key for the shape.
   * @returns A string representing the shape's position.
   */
  public getPositionKey(): string {
    return `${this.position.x.toFixed(2)},${this.position.y.toFixed(
      2
    )},${this.position.z.toFixed(2)}`;
  }

  /**
   * Updates the shape's position, rotation, and color based on current state and interactions.
   * This method is called every frame to animate the shape.
   * @param isCursorOverHeader - Boolean indicating if the cursor is over the header area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   * @param particles - Array of Particle instances for interaction.
   */
  public update(
    isCursorOverHeader: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
    particles: Particle[]
  ): void {
    if (this.isExploded) return; // Do not update if exploded

    if (isCursorOverHeader) {
      this.tempVector.x = mouseX - this.position.x;
      this.tempVector.y = mouseY - this.position.y;
      const distance = Math.hypot(this.tempVector.x, this.tempVector.y);

      if (distance > 0 && distance < 300) {
        const force = ((300 - distance) / 300) * 0.01;
        this.velocity.x += (this.tempVector.x / distance) * force;
        this.velocity.y += (this.tempVector.y / distance) * force;
      }
    }

    // Apply slight attraction to center
    this.velocity.x += (-this.position.x / (width * 10)) * 0.005;
    this.velocity.y += (-this.position.y / (height * 10)) * 0.005;

    // Introduce Z-Drift Over Time
    this.velocity.z += (Math.random() - 0.5) * 0.005; // Small random drift

    // Update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;

    // Wrap around edges smoothly
    const buffer = 200; // Ensure objects are fully offscreen before wrapping
    const wrapWidth = width + buffer * 2;
    const wrapHeight = height + buffer * 2;

    this.position.x =
      ((this.position.x + width / 2 + buffer) % wrapWidth) - width / 2 - buffer;
    this.position.y =
      ((this.position.y + height / 2 + buffer) % wrapHeight) -
      height / 2 -
      buffer;
    this.position.z = ((this.position.z + 300) % 600) - 300;

    // Ensure minimum and maximum speed
    const speed = Math.hypot(this.velocity.x, this.velocity.y, this.velocity.z);
    if (speed < this.minSpeed) {
      const scale = this.minSpeed / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
      this.velocity.z *= scale;
    } else if (speed > this.maxSpeed) {
      const scale = this.maxSpeed / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
      this.velocity.z *= scale;
    }

    // Add small random changes to velocity for more natural movement
    this.velocity.x += (Math.random() - 0.5) * 0.005;
    this.velocity.y += (Math.random() - 0.5) * 0.005;
    this.velocity.z += (Math.random() - 0.5) * 0.005;

    // Update rotation on all axes
    this.rotation.x += this.rotationSpeed.x;
    this.rotation.y += this.rotationSpeed.y;
    this.rotation.z += this.rotationSpeed.z;

    // Update scale towards target scale for morphing effect
    if (this.scale < this.scaleTarget) {
      this.scale = Math.min(this.scale + this.scaleSpeed, this.scaleTarget);
    } else if (this.scale > this.scaleTarget) {
      this.scale = Math.max(this.scale - this.scaleSpeed, this.scaleTarget);
    }

    // Update color
    this.updateColor();

    // Update lifecycle
    this.age += 16; // Assuming 60 FPS

    if (this.age >= this.lifespan && !this.isFadingOut) {
      this.isFadingOut = true;
      // Initiate morphing effect upon fading out
      this.scaleTarget = 0.8; // Scale down slightly
    }

    if (this.isFadingOut) {
      this.opacity = Math.max(
        0,
        1 - (this.age - this.lifespan) / this.fadeOutDuration
      );
    } else {
      // Fade in effect
      this.opacity = Math.min(1, this.age / 1000); // Fade in over 1 second
    }

    // Handle scaling reset after morphing
    if (this.scale === this.scaleTarget && this.scale !== 1) {
      this.scaleTarget = 1; // Reset scale target to normal
    }

    // Interact with nearby particles
    this.interactWithParticles(particles);

    // Apply temporary distortion
    this.position.x += this.temporaryDistortion.x;
    this.position.y += this.temporaryDistortion.y;
    this.position.z += this.temporaryDistortion.z;

    // Reset temporary distortion
    this.temporaryDistortion = { x: 0, y: 0, z: 0 };
  }

  /**
   * Updates the shape's color smoothly towards the target color.
   */
  private updateColor(): void {
    if (this.color !== this.targetColor) {
      // Smoothly transition to the target color
      const currentColor = hexToRgb(this.color);
      const targetColor = hexToRgb(this.targetColor);

      if (currentColor && targetColor) {
        const newR = Math.round(
          currentColor.r +
            (targetColor.r - currentColor.r) * this.colorTransitionSpeed
        );
        const newG = Math.round(
          currentColor.g +
            (targetColor.g - currentColor.g) * this.colorTransitionSpeed
        );
        const newB = Math.round(
          currentColor.b +
            (targetColor.b - currentColor.b) * this.colorTransitionSpeed
        );

        this.color = rgbToHex(newR, newG, newB);

        if (this.color === this.targetColor) {
          // When we reach the target color, set a new target
          this.targetColor = this.getRandomCyberpunkColor();
        }
      }
    }
  }

  /**
   * Interacts with nearby particles, applying forces and potentially emitting particles.
   * @param particles - Array of Particle instances.
   */
  private interactWithParticles(particles: Particle[]): void {
    const INTERACTION_RADIUS = 100;
    particles.forEach((particle) => {
      const dx = particle.x - this.position.x;
      const dy = particle.y - this.position.y;
      const dz = particle.z - this.position.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < INTERACTION_RADIUS) {
        const force = 0.005 * (1 - distance / INTERACTION_RADIUS);
        this.velocity.x += dx * force;
        this.velocity.y += dy * force;
        this.velocity.z += dz * force;

        // Emit small particles
        if (Math.random() < 0.05) {
          // Emitting is handled externally
        }
      }
    });
  }

  /**
   * Draws the vector shape on the canvas with dynamic glow effect.
   * @param ctx - Canvas rendering context.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    if (this.opacity > 0 && !this.isExploded) {
      const rgbColor = hexToRgb(this.color);
      if (rgbColor) {
        const { r, g, b } = rgbColor;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.lineWidth = 2;

        // Apply dynamic glow based on opacity and glow intensity
        const glowEffect = this.opacity * this.glowIntensity * 1.5;
        ctx.shadowBlur = glowEffect;
        ctx.shadowColor = this.color;

        // Draw the shape
        ctx.beginPath();
        this.edges.forEach(([start, end]) => {
          const v1 = rotateVertex(this.vertices[start], this.rotation);
          const v2 = rotateVertex(this.vertices[end], this.rotation);
          const projectedV1 = project(
            v1.x * this.scale + this.position.x,
            v1.y * this.scale + this.position.y,
            v1.z * this.scale + this.position.z,
            width,
            height
          );
          const projectedV2 = project(
            v2.x * this.scale + this.position.x,
            v2.y * this.scale + this.position.y,
            v2.z * this.scale + this.position.z,
            width,
            height
          );
          ctx.moveTo(projectedV1.x, projectedV1.y);
          ctx.lineTo(projectedV2.x, projectedV2.y);
        });
        ctx.stroke();

        // Reset shadow properties
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }
    }
  }

  /**
   * Triggers visual enhancements upon collision, such as color flashes, temporary glow pulses, and morphing effects.
   */
  public triggerCollisionVisuals(): void {
    // Temporarily increase glow intensity for a pulse effect
    const originalGlow = this.glowIntensity;
    this.glowIntensity += 10; // Increase glow
    setTimeout(() => {
      this.glowIntensity = originalGlow; // Reset glow after pulse duration
    }, 200); // Pulse duration in milliseconds

    // Temporarily change color to a collision-specific color
    const collisionColor = "#FF00FF"; // Neon Magenta for collision
    const originalColor = this.color;
    this.color = collisionColor;
    setTimeout(() => {
      this.color = originalColor;
    }, 200); // Color flash duration

    // Trigger morphing effect by scaling up
    this.scaleTarget = 1.2; // Scale up to 120%
    // The update method will handle returning the scale back to normal
  }

  /**
   * Initiates the explosion and schedules respawning after a random delay.
   */
  public explodeAndRespawn(): void {
    if (this.isExploded) return; // Prevent multiple explosions

    this.isExploded = true;
    this.opacity = 0; // Hide the shape immediately
    this.triggerCollisionVisuals(); // Trigger visual effects

    // Schedule respawn after a random delay (up to 10 seconds)
    const delay = Math.random() * 10000; // 0 to 10,000 milliseconds
    this.respawnTimer = window.setTimeout(() => {
      this.reset(new Set<string>(), window.innerWidth, window.innerHeight);
    }, delay);
  }

  /**
   * Checks if the shape is completely faded out.
   * @returns True if the shape is faded out, false otherwise.
   */
  public isFadedOut(): boolean {
    return this.isFadingOut && this.opacity <= 0 && !this.isExploded;
  }
}
