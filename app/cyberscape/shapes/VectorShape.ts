// app/cyberscape/shapes/VectorShape.ts

import { vec3 } from "gl-matrix";
import { CyberScapeConfig } from "../CyberScapeConfig";
import { Particle } from "../particles/Particle";
import { ColorManager } from "../utils/ColorManager";
import { VectorMath } from "../utils/VectorMath";

/**
 * The `VectorShape` abstract class represents a 3D shape in the CyberScape animation.
 * It provides common properties and methods shared among different shapes like cubes,
 * pyramids, tetrahedrons, etc.
 */
export abstract class VectorShape {
  vertices: vec3[] = [];
  edges: [number, number][] = [];
  position: vec3 = vec3.create();
  velocity: vec3 = vec3.create();
  rotation: vec3 = vec3.create();
  rotationSpeed: vec3 = vec3.create();
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
  private tempVector: vec3;
  temporaryDistortion: vec3;

  private config: CyberScapeConfig;

  constructor() {
    this.config = CyberScapeConfig.getInstance();

    // Initialize shared properties
    this.maxSpeed = this.config.shapeMaxSpeed;
    this.minSpeed = this.config.shapeMinSpeed;

    this.rotation = vec3.create();
    this.rotationSpeed = vec3.fromValues(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    );

    this.color = ColorManager.getRandomCyberpunkColor();
    this.targetColor = ColorManager.getRandomCyberpunkColor();
    this.colorTransitionSpeed = 0.01;

    this.lifespan =
      Math.random() *
        (this.config.shapeLifespanMax - this.config.shapeLifespanMin) +
      this.config.shapeLifespanMin;
    this.age = 0;
    this.fadeOutDuration = this.config.shapeFadeOutDuration;
    this.isFadingOut = false;
    this.opacity = 0; // Start fully transparent

    this.glowIntensity =
      Math.random() *
        (this.config.shapeGlowIntensityMax -
          this.config.shapeGlowIntensityMin) +
      this.config.shapeGlowIntensityMin;

    this.scale = 1;
    this.scaleTarget = 1;
    this.scaleSpeed = 0.02;

    this.isExploded = false;
    this.respawnTimer = null;

    this.tempVector = vec3.create();
    this.temporaryDistortion = vec3.create();

    // Initialize position and radius in derived classes
  }

  /**
   * Abstract method to initialize the shape's vertices and edges.
   * Must be implemented by derived classes.
   */
  protected abstract initializeShape(): void;

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
      vec3.set(
        this.position,
        Math.random() * width - width / 2,
        Math.random() * height - height / 2,
        Math.random() * 600 - 300
      );
      positionKey = this.getPositionKey();
    } while (existingPositions.has(positionKey));
    existingPositions.add(positionKey);

    // Reset lifecycle
    this.age = 0;
    this.lifespan =
      Math.random() *
        (this.config.shapeLifespanMax - this.config.shapeLifespanMin) +
      this.config.shapeLifespanMin;
    this.isFadingOut = false;
    this.opacity = 0; // Start fully transparent

    // Reset color
    this.color = ColorManager.getRandomCyberpunkColor();
    this.targetColor = ColorManager.getRandomCyberpunkColor();

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

    // Reset rotation
    vec3.set(this.rotation, 0, 0, 0);
    vec3.set(
      this.rotationSpeed,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01
    );

    // Reset glow intensity
    this.glowIntensity =
      Math.random() *
        (this.config.shapeGlowIntensityMax -
          this.config.shapeGlowIntensityMin) +
      this.config.shapeGlowIntensityMin;

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
    return `${this.position[0].toFixed(2)},${this.position[1].toFixed(
      2
    )},${this.position[2].toFixed(2)}`;
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

    // Introduce Z-Drift Over Time
    this.velocity[2] += (Math.random() - 0.5) * 0.005; // Small random drift

    // Update position
    vec3.add(this.position, this.position, this.velocity);

    // Wrap around edges smoothly
    const buffer = 200; // Ensure objects are fully offscreen before wrapping
    const wrapWidth = width + buffer * 2;
    const wrapHeight = height + buffer * 2;

    this.position[0] =
      ((this.position[0] + width / 2 + buffer) % wrapWidth) -
      width / 2 -
      buffer;
    this.position[1] =
      ((this.position[1] + height / 2 + buffer) % wrapHeight) -
      height / 2 -
      buffer;
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
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.005
      )
    );

    // Update rotation on all axes
    vec3.add(this.rotation, this.rotation, this.rotationSpeed);

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
    vec3.add(this.position, this.position, this.temporaryDistortion);

    // Reset temporary distortion
    vec3.set(this.temporaryDistortion, 0, 0, 0);
  }

  /**
   * Updates the shape's color smoothly towards the target color.
   */
  private updateColor(): void {
    if (this.color !== this.targetColor) {
      this.color = ColorManager.blendColors(
        this.color,
        this.targetColor,
        this.colorTransitionSpeed
      );

      if (this.color === this.targetColor) {
        // When we reach the target color, set a new target
        this.targetColor = ColorManager.getRandomCyberpunkColor();
      }
    }
  }

  /**
   * Interacts with nearby particles, applying forces and potentially emitting particles.
   * @param particles - Array of Particle instances.
   */
  private interactWithParticles(particles: Particle[]): void {
    const INTERACTION_RADIUS = this.config.shapeParticleInteractionRadius;
    const INTERACTION_FORCE = this.config.shapeParticleInteractionForce;
    particles.forEach((particle) => {
      vec3.subtract(this.tempVector, particle.position, this.position);
      const distance = vec3.length(this.tempVector);

      if (distance > 0 && distance < INTERACTION_RADIUS) {
        const force = INTERACTION_FORCE * (1 - distance / INTERACTION_RADIUS);
        vec3.scale(this.tempVector, this.tempVector, (1 / distance) * force);
        vec3.add(this.velocity, this.velocity, this.tempVector);

        // Optionally, influence particle's velocity
        // vec3.scale(this.tempVector, this.tempVector, -1); // Reverse force
        // vec3.add(particle.velocity, particle.velocity, this.tempVector);
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
      const rgbColor = ColorManager.hexToRgb(this.color);
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
          const v1 = VectorMath.rotateVertex(
            this.vertices[start],
            this.rotation
          );
          const v2 = VectorMath.rotateVertex(this.vertices[end], this.rotation);

          // Apply scaling and translation to vertices
          const scaledV1 = vec3.create();
          const scaledV2 = vec3.create();
          vec3.scale(scaledV1, v1, this.scale);
          vec3.scale(scaledV2, v2, this.scale);
          vec3.add(scaledV1, scaledV1, this.position);
          vec3.add(scaledV2, scaledV2, this.position);

          const projectedV1 = VectorMath.project(scaledV1, width, height);
          const projectedV2 = VectorMath.project(scaledV2, width, height);

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
   * Checks if the shape is completely faded out.
   * @returns True if the shape is faded out, false otherwise.
   */
  public isFadedOut(): boolean {
    return this.isFadingOut && this.opacity <= 0 && !this.isExploded;
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
   * Applies a force to the shape, affecting its velocity.
   * @param force - The force vector to apply.
   */
  public applyForce(force: vec3): void {
    vec3.add(this.velocity, this.velocity, force);
  }

  /**
   * Calculates the distance to another shape.
   * @param other - The other shape to calculate distance to.
   * @returns The distance between this shape and the other shape.
   */
  public distanceTo(other: VectorShape): number {
    return vec3.distance(this.position, other.position);
  }

  /**
   * Updates the shape's color based on nearby shapes.
   * @param nearbyShapes - Array of nearby shapes to blend colors with.
   */
  public updateColorBasedOnNearby(nearbyShapes: VectorShape[]): void {
    if (nearbyShapes.length > 0) {
      const averageColor = ColorManager.averageColors(
        nearbyShapes.map((s) => s.color)
      );
      this.color = ColorManager.blendColors(this.color, averageColor, 0.1);
    }
  }

  /**
   * Applies attraction or repulsion force between this shape and another.
   * @param other - The other shape to interact with.
   * @param attractionRadius - The radius within which attraction occurs.
   * @param repulsionRadius - The radius within which repulsion occurs.
   * @param attractionForce - The strength of the attraction force.
   * @param repulsionForce - The strength of the repulsion force.
   */
  public applyInteractionForce(
    other: VectorShape,
    attractionRadius: number,
    repulsionRadius: number,
    attractionForce: number,
    repulsionForce: number
  ): void {
    const distance = this.distanceTo(other);
    if (distance < attractionRadius && distance > repulsionRadius) {
      // Attraction
      const forceMagnitude =
        attractionForce * (1 - distance / attractionRadius);
      vec3.subtract(this.tempVector, other.position, this.position);
      vec3.normalize(this.tempVector, this.tempVector);
      vec3.scale(this.tempVector, this.tempVector, forceMagnitude);
      this.applyForce(this.tempVector);
    } else if (distance <= repulsionRadius) {
      // Repulsion
      const forceMagnitude = repulsionForce * (1 - distance / repulsionRadius);
      vec3.subtract(this.tempVector, this.position, other.position);
      vec3.normalize(this.tempVector, this.tempVector);
      vec3.scale(this.tempVector, this.tempVector, forceMagnitude);
      this.applyForce(this.tempVector);
    }
  }
}
