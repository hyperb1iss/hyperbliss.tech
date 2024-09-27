import {
  CYBERPUNK_COLORS,
  hexToRgb,
  rgbToHex,
  project,
  rotateVertex,
} from "./headerEffectsUtils";

/**
 * VectorShape class representing a 3D shape (cube, pyramid, or star) in the background.
 * Each shape moves independently, reacts to user interaction, and maintains constant motion.
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

  constructor(
    shapeType: "cube" | "pyramid" | "star",
    existingPositions: Set<string>,
    width: number,
    height: number
  ) {
    const size = 30; // Reduced size for shapes
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
      case "star":
        // Define a 5-pointed star
        this.vertices = [];
        const angle = Math.PI / 2;
        const outerRadius = size;
        const innerRadius = size / 2;
        for (let i = 0; i < 5; i++) {
          const outerX = Math.cos(angle + (i * 2 * Math.PI) / 5) * outerRadius;
          const outerY = Math.sin(angle + (i * 2 * Math.PI) / 5) * outerRadius;
          this.vertices.push({ x: outerX, y: outerY, z: 0 });
          const innerX =
            Math.cos(angle + ((i * 2 + 1) * Math.PI) / 5) * innerRadius;
          const innerY =
            Math.sin(angle + ((i * 2 + 1) * Math.PI) / 5) * innerRadius;
          this.vertices.push({ x: innerX, y: innerY, z: 0 });
        }
        this.edges = [];
        for (let i = 0; i < 10; i++) {
          this.edges.push([i, (i + 2) % 10]);
        }
        break;
      default:
        throw new Error(`Unknown shape type: ${shapeType}`);
    }

    // Ensure unique positions
    let positionKey: string;
    do {
      this.position = {
        x: Math.random() * width - width / 2,
        y:
          (Math.random() * height - height / 2) *
          (Math.random() < 0.5 ? 1 : -1), // Ensure non-mirrored randomness
        z: Math.random() * 600 - 300,
      };
      positionKey = `${this.position.x.toFixed(2)},${this.position.y.toFixed(
        2
      )},${this.position.z.toFixed(2)}`;
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

    this.reset(existingPositions, width, height);
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
   */
  update(
    isCursorOverHeader: boolean,
    mouseX: number,
    mouseY: number,
    width: number,
    height: number
  ) {
    if (isCursorOverHeader) {
      const dx = mouseX - this.position.x;
      const dy = mouseY - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < 300) {
        const force = ((300 - distance) / 300) * 0.01;
        this.velocity.x += (dx / distance) * force;
        this.velocity.y += (dy / distance) * force;
      }
    }

    // Apply very slight attraction to center to keep shapes from straying too far
    this.velocity.x += (-this.position.x / (width * 10)) * 0.005;
    this.velocity.y += (-this.position.y / (height * 10)) * 0.005;

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
    const speed = Math.sqrt(
      this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2
    );
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

    // Update color
    if (this.color !== this.targetColor) {
      // Smoothly transition to the target color
      const currentColor = hexToRgb(this.color);
      const targetColor = hexToRgb(this.targetColor);

      if (currentColor && targetColor) {
        const newR = Math.round(
          currentColor.r + (targetColor.r - currentColor.r) * 0.05
        );
        const newG = Math.round(
          currentColor.g + (targetColor.g - currentColor.g) * 0.05
        );
        const newB = Math.round(
          currentColor.b + (targetColor.b - currentColor.b) * 0.05
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

    // If the shape has completely faded out, reset it
    if (this.opacity <= 0 && this.isFadingOut) {
      this.reset();
    }
  }

  /**
   * Draws the vector shape on the canvas with dynamic glow effect and symmetry.
   * @param ctx - Canvas rendering context.
   */
  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // Only draw if the shape has some opacity
    if (this.opacity > 0) {
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
            v1.x + this.position.x,
            v1.y + this.position.y,
            v1.z + this.position.z,
            width,
            height
          );
          const projectedV2 = project(
            v2.x + this.position.x,
            v2.y + this.position.y,
            v2.z + this.position.z,
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

  reset(existingPositions?: Set<string>, width?: number, height?: number) {
    if (!width || !height) {
      console.error("Width or height not provided for VectorShape reset");
      return;
    }

    // Reset position
    do {
      this.position = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 600 - 300,
      };
    } while (existingPositions && existingPositions.has(this.getPositionKey()));

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
  }

  getPositionKey(): string {
    return `${this.position.x.toFixed(2)},${this.position.y.toFixed(
      2
    )},${this.position.z.toFixed(2)}`;
  }
}
