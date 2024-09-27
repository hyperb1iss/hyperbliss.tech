// VectorShape.ts

import {
  CYBERPUNK_COLORS,
  hexToRgb,
  rgbToHex,
  project,
  rotateVertex,
} from "./CyberScapeUtils";

/**
 * VectorShape class representing a 3D shape (cube, pyramid, tetrahedron, octahedron, or dodecahedron) in the background.
 * Each shape moves independently, interacts with other shapes, reacts to user interaction, and maintains constant motion.
 */
export class VectorShape {
  vertices: { x: number; y: number; z: number }[];
  edges: [number, number][];
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
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
  opacity: number;
  glowIntensity: number;
  radius: number; // Represents the size of the shape for interactions
  scale: number; // Current scale of the shape
  scaleTarget: number; // Target scale for morphing
  scaleSpeed: number; // Speed at which the shape scales

  // New Properties for Explosion and Respawning
  isExploded: boolean; // Flag to indicate if the shape has exploded
  respawnTimer: number | null; // Timer ID for respawning

  // Reusable objects for calculations
  private tempVector: { x: number; y: number; z: number };

  /**
   * Creates a new VectorShape instance.
   * @param shapeType - The type of shape to create ("cube", "pyramid", "tetrahedron", "octahedron", or "dodecahedron").
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  constructor(
    shapeType:
      | "cube"
      | "pyramid"
      | "tetrahedron"
      | "octahedron"
      | "dodecahedron",
    existingPositions: Set<string>,
    width: number,
    height: number
  ) {
    const size = 30; // Reduced size for shapes
    this.radius = size; // Initialize radius based on size
    this.scale = 1; // Default scale
    this.scaleTarget = 1; // Default target scale
    this.scaleSpeed = 0.02; // Default scale speed

    switch (shapeType) {
      case "cube":
        this.vertices = [
          { x: -size, y: -size, z: -size },
          { x: size, y: -size, z: -size },
          { x: size, y: size, z: -size },
          { x: -size, y: size, z: -size },
          { x: -size, y: -size, z: size },
          { x: size, y: -size, z: size },
          { x: size, y: size, z: size },
          { x: -size, y: size, z: size },
        ];
        this.edges = [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 0],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4],
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ];
        break;
      case "pyramid":
        this.vertices = [
          { x: 0, y: -size * 1.5, z: 0 },
          { x: -size, y: size, z: -size },
          { x: size, y: size, z: -size },
          { x: size, y: size, z: size },
          { x: -size, y: size, z: size },
        ];
        this.edges = [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 1],
        ];
        break;
      case "tetrahedron":
        this.vertices = [
          { x: size, y: size, z: size },
          { x: -size, y: -size, z: size },
          { x: -size, y: size, z: -size },
          { x: size, y: -size, z: -size },
        ];
        this.edges = [
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 2],
          [1, 3],
          [2, 3],
        ];
        break;
      case "octahedron":
        this.vertices = [
          { x: 0, y: size, z: 0 },
          { x: size, y: 0, z: 0 },
          { x: 0, y: 0, z: size },
          { x: -size, y: 0, z: 0 },
          { x: 0, y: 0, z: -size },
          { x: 0, y: -size, z: 0 },
        ];
        this.edges = [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [5, 1],
          [5, 2],
          [5, 3],
          [5, 4],
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 1],
        ];
        break;
      case "dodecahedron":
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
        const a = size / 2;
        const b = size / (2 * phi);
        this.vertices = [
          { x: a, y: a, z: a },
          { x: a, y: a, z: -a },
          { x: a, y: -a, z: a },
          { x: a, y: -a, z: -a },
          { x: -a, y: a, z: a },
          { x: -a, y: a, z: -a },
          { x: -a, y: -a, z: a },
          { x: -a, y: -a, z: -a },
          { x: 0, y: b, z: phi * a },
          { x: 0, y: b, z: -phi * a },
          { x: 0, y: -b, z: phi * a },
          { x: 0, y: -b, z: -phi * a },
          { x: b, y: phi * a, z: 0 },
          { x: b, y: -phi * a, z: 0 },
          { x: -b, y: phi * a, z: 0 },
          { x: -b, y: -phi * a, z: 0 },
          { x: phi * a, y: 0, z: b },
          { x: phi * a, y: 0, z: -b },
          { x: -phi * a, y: 0, z: b },
          { x: -phi * a, y: 0, z: -b },
        ];
        this.edges = [
          [0, 8],
          [0, 12],
          [0, 16],
          [1, 9],
          [1, 12],
          [1, 17],
          [2, 10],
          [2, 13],
          [2, 16],
          [3, 11],
          [3, 13],
          [3, 17],
          [4, 8],
          [4, 14],
          [4, 18],
          [5, 9],
          [5, 14],
          [5, 19],
          [6, 10],
          [6, 15],
          [6, 18],
          [7, 11],
          [7, 15],
          [7, 19],
          [8, 10],
          [9, 11],
          [12, 14],
          [13, 15],
          [16, 17],
          [18, 19],
        ];
        break;
      default:
        throw new Error(`Unknown shape type: ${shapeType}`);
    }

    // Ensure unique positions
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

    this.maxSpeed = 0.3;
    this.minSpeed = 0.05;

    // Initialize with a random velocity within speed limits
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

    this.rotation = { x: 0, y: 0, z: 0 };
    this.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    };

    // Assign a random color from the CYBERPUNK_COLORS array
    this.color = this.getRandomCyberpunkColor();
    this.targetColor = this.getRandomCyberpunkColor();
    this.colorTransitionSpeed = 0.01;

    // Initialize lifecycle properties
    this.lifespan = Math.random() * 15000 + 10000; // Random lifespan between 10-25 seconds
    this.age = 0;
    this.fadeOutDuration = 3000; // 3 seconds fade out
    this.isFadingOut = false;
    this.opacity = 0; // Start fully transparent

    // Initialize glow intensity
    this.glowIntensity = Math.random() * 10 + 15; // Random intensity between 15 and 25

    // Initialize scaling properties for morphing effect
    this.scale = 1;
    this.scaleTarget = 1;
    this.scaleSpeed = 0.02;

    // Initialize new properties for explosion and respawning
    this.isExploded = false;
    this.respawnTimer = null;

    // Initialize reusable objects
    this.tempVector = { x: 0, y: 0, z: 0 };
  }

  /**
   * Gets a random color from the CYBERPUNK_COLORS array.
   * @returns A string representing a color from the cyberpunk palette.
   */
  private getRandomCyberpunkColor(): string {
    return CYBERPUNK_COLORS[
      Math.floor(Math.random() * CYBERPUNK_COLORS.length)
    ];
  }

  /**
   * Updates the shape's position, rotation, and color based on current state and interactions.
   * This method is called every frame to animate the shape.
   * @param isCursorOverHeader - Boolean indicating if the cursor is over the header area.
   * @param mouseX - X coordinate of the mouse cursor.
   * @param mouseY - Y coordinate of the mouse cursor.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  update(
    isCursorOverHeader: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
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

    // Apply very slight attraction to center to keep shapes from straying too far
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
    if (this.position.x < -width / 2 - buffer) {
      this.position.x += width + buffer * 2;
    } else if (this.position.x > width / 2 + buffer) {
      this.position.x -= width + buffer * 2;
    }
    if (this.position.y < -height / 2 - buffer) {
      this.position.y += height + buffer * 2;
    } else if (this.position.y > height / 2 + buffer) {
      this.position.y -= height + buffer * 2;
    }
    this.position.z = ((this.position.z + 300) % 600) - 300;

    // Ensure minimum speed
    const speed = Math.hypot(this.velocity.x, this.velocity.y, this.velocity.z);
    if (speed < this.minSpeed) {
      const scale = this.minSpeed / speed;
      this.velocity.x *= scale;
      this.velocity.y *= scale;
      this.velocity.z *= scale;
    }

    // Limit maximum speed
    if (speed > this.maxSpeed) {
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
      this.scale += this.scaleSpeed;
      if (this.scale > this.scaleTarget) this.scale = this.scaleTarget;
    } else if (this.scale > this.scaleTarget) {
      this.scale -= this.scaleSpeed;
      if (this.scale < this.scaleTarget) this.scale = this.scaleTarget;
    }

    // Update color
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

    // Update lifecycle
    this.age += 16; // Assuming 60 FPS, each frame is about 16ms

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
  }

  /**
   * Draws the vector shape on the canvas with dynamic glow effect.
   * @param ctx - Canvas rendering context.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Only draw if the shape has some opacity and is not exploded
    if (this.opacity > 0 && !this.isExploded) {
      const rgbColor = hexToRgb(this.color);
      if (rgbColor) {
        const { r, g, b } = rgbColor;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.lineWidth = 2; // Increased line width for better visibility

        // Apply dynamic glow based on opacity and glow intensity
        const glowEffect = this.opacity * this.glowIntensity * 1.5; // Increased glow effect
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
   * Resets the shape's properties for reuse.
   * @param existingPositions - Set of existing position keys to avoid overlap.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  reset(existingPositions: Set<string>, width: number, height: number) {
    // Reset position
    do {
      this.position = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 600 - 300,
      };
    } while (existingPositions.has(this.getPositionKey()));
    existingPositions.add(this.getPositionKey());

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
  getPositionKey(): string {
    return `${this.position.x.toFixed(2)},${this.position.y.toFixed(
      2
    )},${this.position.z.toFixed(2)}`;
  }

  /**
   * Calculates the distance between this shape and a point.
   * @param x - X coordinate of the point.
   * @param y - Y coordinate of the point.
   * @returns The distance between the shape and the point.
   */
  distanceTo(x: number, y: number): number {
    return Math.hypot(this.position.x - x, this.position.y - y);
  }

  /**
   * Triggers visual enhancements upon collision, such as color flashes, temporary glow pulses, and morphing effects.
   */
  triggerCollisionVisuals(): void {
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
  explodeAndRespawn(): void {
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
  isFadedOut(): boolean {
    return this.isFadingOut && this.opacity <= 0 && !this.isExploded;
  }

  /**
   * Handles collision detection and response between shapes.
   * Applies realistic physics-based collision response and triggers visual enhancements.
   * @param shapes - Array of VectorShape instances to check collisions with.
   * @param collisionCallback - Optional callback to trigger additional effects upon collision.
   */
  static handleCollisions(
    shapes: VectorShape[],
    collisionCallback?: CollisionCallback
  ): void {
    const activeShapes = shapes.filter((shape) => !shape.isExploded);
    const gridSize = 100; // Adjust based on your needs
    const grid: Map<string, VectorShape[]> = new Map();

    // Place shapes in grid cells
    for (const shape of activeShapes) {
      const cellX = Math.floor(shape.position.x / gridSize);
      const cellY = Math.floor(shape.position.y / gridSize);
      const cellZ = Math.floor(shape.position.z / gridSize);
      const cellKey = `${cellX},${cellY},${cellZ}`;

      if (!grid.has(cellKey)) {
        grid.set(cellKey, []);
      }
      grid.get(cellKey)!.push(shape);
    }

    // Check collisions only within the same cell and neighboring cells
    grid.forEach((shapesInCell, cellKey) => {
      const [cellX, cellY, cellZ] = cellKey.split(",").map(Number);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const neighborKey = `${cellX + dx},${cellY + dy},${cellZ + dz}`;
            const neighborShapes = grid.get(neighborKey) || [];

            for (const shapeA of shapesInCell) {
              for (const shapeB of neighborShapes) {
                if (shapeA === shapeB) continue;

                const dx = shapeB.position.x - shapeA.position.x;
                const dy = shapeB.position.y - shapeA.position.y;
                const dz = shapeB.position.z - shapeA.position.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < shapeA.radius + shapeB.radius) {
                  // Collision detected, handle it
                  this.handleCollisionResponse(
                    shapeA,
                    shapeB,
                    dx,
                    dy,
                    dz,
                    distance
                  );

                  if (collisionCallback) {
                    collisionCallback(shapeA, shapeB);
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  private static handleCollisionResponse(
    shapeA: VectorShape,
    shapeB: VectorShape,
    dx: number,
    dy: number,
    dz: number,
    distance: number
  ): void {
    // Normalize the collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    const nz = dz / distance;

    // Calculate relative velocity
    const dvx = shapeA.velocity.x - shapeB.velocity.x;
    const dvy = shapeA.velocity.y - shapeB.velocity.y;
    const dvz = shapeA.velocity.z - shapeB.velocity.z;

    // Calculate velocity along the normal
    const vn = dvx * nx + dvy * ny + dvz * nz;

    // If shapes are moving away from each other, skip
    if (vn > 0) return;

    // Calculate impulse scalar (assuming equal mass and perfect elasticity)
    const impulse = (-2 * vn) / 2; // mass cancels out

    // Apply impulse to the shapes' velocities
    shapeA.velocity.x += impulse * nx;
    shapeA.velocity.y += impulse * ny;
    shapeA.velocity.z += impulse * nz;

    shapeB.velocity.x -= impulse * nx;
    shapeB.velocity.y -= impulse * ny;
    shapeB.velocity.z -= impulse * nz;

    // Adjust positions to prevent overlap
    const overlap = shapeA.radius + shapeB.radius - distance;
    shapeA.position.x -= (overlap / 2) * nx;
    shapeA.position.y -= (overlap / 2) * ny;
    shapeA.position.z -= (overlap / 2) * nz;

    shapeB.position.x += (overlap / 2) * nx;
    shapeB.position.y += (overlap / 2) * ny;
    shapeB.position.z += (overlap / 2) * nz;

    // Change colors upon collision
    shapeA.color = shapeA.getRandomCyberpunkColor();
    shapeB.color = shapeB.getRandomCyberpunkColor();

    // Apply visual enhancements
    shapeA.triggerCollisionVisuals();
    shapeB.triggerCollisionVisuals();
  }

  /**
   * Handles proximity-based color blending between shapes.
   * @param shapes - Array of VectorShape instances to blend colors with.
   */
  static handleColorBlending(shapes: VectorShape[]): void {
    const INFLUENCE_RADIUS = 150; // Adjust as needed

    for (let i = 0; i < shapes.length; i++) {
      let rTotal = 0,
        gTotal = 0,
        bTotal = 0,
        count = 0;

      for (let j = 0; j < shapes.length; j++) {
        if (i === j) continue;

        const shapeA = shapes[i];
        const shapeB = shapes[j];

        const dx = shapeA.position.x - shapeB.position.x;
        const dy = shapeA.position.y - shapeB.position.y;
        const dz = shapeA.position.z - shapeB.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < INFLUENCE_RADIUS) {
          const rgb = hexToRgb(shapeB.color);
          if (rgb) {
            rTotal += rgb.r;
            gTotal += rgb.g;
            bTotal += rgb.b;
            count++;
          }
        }
      }

      if (count > 0) {
        const avgR = Math.round(rTotal / count);
        const avgG = Math.round(gTotal / count);
        const avgB = Math.round(bTotal / count);

        // Blend the current shape's color towards the average color
        const currentColor = hexToRgb(shapes[i].color);
        if (currentColor) {
          const blendedR = Math.round(
            currentColor.r + (avgR - currentColor.r) * 0.05
          );
          const blendedG = Math.round(
            currentColor.g + (avgG - currentColor.g) * 0.05
          );
          const blendedB = Math.round(
            currentColor.b + (avgB - currentColor.b) * 0.05
          );

          shapes[i].color = rgbToHex(blendedR, blendedG, blendedB);
        }
      }
    }
  }

  /**
   * Handles attraction and repulsion forces between shapes.
   * @param shapes - Array of VectorShape instances to apply forces to.
   */
  static handleAttractionRepulsion(shapes: VectorShape[]): void {
    const ATTRACTION_RADIUS = 200;
    const REPULSION_RADIUS = 80;
    const ATTRACTION_FORCE = 0.0005; // Adjust as needed
    const REPULSION_FORCE = 0.001; // Adjust as needed

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shapeA = shapes[i];
        const shapeB = shapes[j];

        const dx = shapeB.position.x - shapeA.position.x;
        const dy = shapeB.position.y - shapeA.position.y;
        const dz = shapeB.position.z - shapeA.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < ATTRACTION_RADIUS && distance > REPULSION_RADIUS) {
          // Attraction
          const forceMagnitude = ATTRACTION_FORCE;
          shapeA.velocity.x += (dx / distance) * forceMagnitude;
          shapeA.velocity.y += (dy / distance) * forceMagnitude;
          shapeA.velocity.z += (dz / distance) * forceMagnitude;

          shapeB.velocity.x -= (dx / distance) * forceMagnitude;
          shapeB.velocity.y -= (dy / distance) * forceMagnitude;
          shapeB.velocity.z -= (dz / distance) * forceMagnitude;
        } else if (distance <= REPULSION_RADIUS) {
          // Repulsion
          const forceMagnitude = REPULSION_FORCE;
          shapeA.velocity.x -= (dx / distance) * forceMagnitude;
          shapeA.velocity.y -= (dy / distance) * forceMagnitude;
          shapeA.velocity.z -= (dz / distance) * forceMagnitude;

          shapeB.velocity.x += (dx / distance) * forceMagnitude;
          shapeB.velocity.y += (dy / distance) * forceMagnitude;
          shapeB.velocity.z += (dz / distance) * forceMagnitude;
        }
      }
    }
  }

  /**
   * Draws connecting lines between shapes that are within a certain distance of each other.
   * @param ctx - Canvas rendering context.
   * @param shapes - Array of VectorShape instances to connect.
   * @param width - Width of the canvas.
   * @param height - Height of the canvas.
   */
  static drawConnections(
    ctx: CanvasRenderingContext2D,
    shapes: VectorShape[],
    width: number,
    height: number
  ): void {
    const CONNECTION_DISTANCE = 120; // Adjust as needed

    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; // Light lines
    ctx.lineWidth = 1;

    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const shapeA = shapes[i];
        const shapeB = shapes[j];

        const dx = shapeA.position.x - shapeB.position.x;
        const dy = shapeA.position.y - shapeB.position.y;
        const dz = shapeA.position.z - shapeB.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < CONNECTION_DISTANCE) {
          const projectedA = project(
            shapeA.position.x,
            shapeA.position.y,
            shapeA.position.z,
            width,
            height
          );
          const projectedB = project(
            shapeB.position.x,
            shapeB.position.y,
            shapeB.position.z,
            width,
            height
          );

          ctx.beginPath();
          ctx.moveTo(projectedA.x, projectedA.y);
          ctx.lineTo(projectedB.x, projectedB.y);
          ctx.stroke();
        }
      }
    }
  }

  /**
   * Determines if this shape is within a certain distance of another shape.
   * @param other - The other VectorShape instance to check against.
   * @param distanceThreshold - The distance threshold for proximity.
   * @returns True if within the distance, false otherwise.
   */
  isWithinDistance(other: VectorShape, distanceThreshold: number): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const dz = this.position.z - other.position.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < distanceThreshold;
  }
}

/**
 * CollisionCallback type defining the signature for collision callback functions.
 */
type CollisionCallback = (shapeA: VectorShape, shapeB: VectorShape) => void;
