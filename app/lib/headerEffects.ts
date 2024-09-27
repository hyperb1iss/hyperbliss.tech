// app/lib/headerEffects.ts

/**
 * Initializes the canvas and sets up the header animation effects.
 * @param canvas - The HTML canvas element to draw on.
 * @param logoElement - The logo element for potential interactions.
 * @param navElement - The navigation element for mouse interaction detection.
 * @returns A cleanup function to remove event listeners and cancel animations.
 */
export const initializeCanvas = (
  canvas: HTMLCanvasElement,
  logoElement: HTMLAnchorElement,
  navElement: HTMLElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  let animationFrameId: number;

  // Variables for cursor interaction
  let isCursorOverHeader = false;
  let mouseX = 0;
  let mouseY = 0;

  // Initialize a global hue value within cyberpunk range
  let hue = 210; // Starting with Neon Blue

  // Define cyberpunk hue ranges
  const CYBERPUNK_HUE_RANGES = [
    { start: 180, end: 220 }, // Electric Cyan to Neon Blue
    { start: 270, end: 330 }, // Neon Purple to Bright Magenta
  ];

  // Define a constant array of cyberpunk colors (including darker blues and violets)
  const CYBERPUNK_COLORS = [
    "#00fff0", // Cyan
    "#ff00ff", // Magenta
    "#a259ff", // Purple
    "#ff75d8", // Pink
    "#00ffff", // Electric Blue
    "#4b0082", // Indigo
    "#8a2be2", // Blue Violet
    "#483d8b", // Dark Slate Blue
  ];

  /**
   * Generates a random hue within the defined cyberpunk ranges.
   * @returns A hue value between 180-220 or 270-330 degrees.
   */
  const getRandomCyberpunkHue = (): number => {
    const range =
      CYBERPUNK_HUE_RANGES[
        Math.floor(Math.random() * CYBERPUNK_HUE_RANGES.length)
      ];
    return Math.random() * (range.end - range.start) + range.start;
  };

  /**
   * Updates global hue to cycle through cyberpunk colors smoothly.
   */
  const updateHue = () => {
    hue = (hue + 0.2) % 360; // Slower hue shift for reduced breathing effect
    // Ensure hue stays within cyberpunk ranges
    if (
      !CYBERPUNK_HUE_RANGES.some(
        (range) => hue >= range.start && hue <= range.end
      )
    ) {
      // Reset to a random cyberpunk hue if outside ranges
      hue = getRandomCyberpunkHue();
    }
  };

  // Handle window resize to keep canvas dimensions updated
  const handleResize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust the number of particles and shapes based on new size
    adjustShapeCounts();
  };
  window.addEventListener("resize", handleResize);

  // Pointer enter handler to detect when cursor enters the header
  const handlePointerEnter = () => {
    isCursorOverHeader = true;
  };

  // Pointer leave handler to detect when cursor exits the header
  const handlePointerLeave = () => {
    isCursorOverHeader = false;
  };

  // Attach pointerenter and pointerleave events to the nav element
  navElement.addEventListener("pointerenter", handlePointerEnter);
  navElement.addEventListener("pointerleave", handlePointerLeave);

  // Mouse move handler to track cursor position when over the header
  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverHeader) return;
    const rect = canvas.getBoundingClientRect();
    // Convert mouse position to canvas coordinate system centered at (0,0)
    mouseX = event.clientX - rect.left - width / 2;
    mouseY = event.clientY - rect.top - height / 2;
  };
  window.addEventListener("mousemove", handleMouseMove);

  /**
   * Projects 3D coordinates into 2D canvas space with clamped scaling to prevent stretching.
   * @param x - X-coordinate in 3D space.
   * @param y - Y-coordinate in 3D space.
   * @param z - Z-coordinate in 3D space.
   * @returns An object containing the 2D projected coordinates and scale factor.
   */
  const project = (x: number, y: number, z: number) => {
    const fov = 500; // Field of view
    const minScale = 0.5; // Minimum scale to prevent shapes from becoming too small
    const maxScale = 1.5; // Maximum scale to prevent shapes from becoming too large
    const scale = fov / (fov + z);
    const clampedScale = Math.min(Math.max(scale, minScale), maxScale);
    return {
      x: x * clampedScale + width / 2,
      y: y * clampedScale + height / 2,
      scale: clampedScale,
    };
  };

  /**
   * Particle class representing a single interactive star in the background.
   * Each particle moves independently, reacts to user interaction, and
   * maintains constant motion across the canvas.
   */
  class Particle {
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

    constructor(existingPositions: Set<string>) {
      // Ensure unique positions by checking existingPositions
      let positionKey: string;
      do {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * 600 - 300;
        positionKey = `${this.x.toFixed(2)},${this.y.toFixed(
          2
        )},${this.z.toFixed(2)}`;
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
    }

    /**
     * Updates the particle's position and velocity based on current state and interactions.
     * This method is called every frame to animate the particle.
     */
    update() {
      if (isCursorOverHeader) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < 200) {
          const force = ((200 - distance) / 200) * 0.02;
          this.velocityX += (dx / distance) * force;
          this.velocityY += (dy / distance) * force;
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
      const speed = Math.sqrt(
        this.velocityX ** 2 + this.velocityY ** 2 + this.velocityZ ** 2
      );
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
    }

    /**
     * Draws the particle on the canvas with a dynamic glow effect.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      const pos = project(this.x, this.y, this.z);

      // Calculate dynamic shadow blur based on position and proximity to cursor
      const distanceToCursor = Math.sqrt(mouseX ** 2 + mouseY ** 2);
      const dynamicShadowBlur =
        10 + (200 - Math.min(distanceToCursor, 200)) / 20;

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
  }

  /**
   * VectorShape class representing a 3D shape (cube, pyramid, or star) in the background.
   * Each shape moves independently, reacts to user interaction, and maintains constant motion.
   */
  class VectorShape {
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
      existingPositions: Set<string>
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
            const outerX =
              Math.cos(angle + (i * 2 * Math.PI) / 5) * outerRadius;
            const outerY =
              Math.sin(angle + (i * 2 * Math.PI) / 5) * outerRadius;
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

      this.reset(existingPositions);
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
    update() {
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
        const currentColor = this.hexToRgb(this.color);
        const targetColor = this.hexToRgb(this.targetColor);

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

          this.color = this.rgbToHex(newR, newG, newB);

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

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }

    private rgbToHex(r: number, g: number, b: number): string {
      return (
        "#" +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("")
      );
    }

    /**
     * Rotates a vertex based on the current rotation angles.
     * @param vertex - The vertex to rotate.
     * @param rotation - The current rotation angles.
     * @returns The rotated vertex coordinates.
     */
    rotateVertex(
      vertex: { x: number; y: number; z: number },
      rotation: { x: number; y: number; z: number }
    ) {
      // Rotation around X axis
      const x = vertex.x;
      const y =
        vertex.y * Math.cos(rotation.x) - vertex.z * Math.sin(rotation.x);
      const z =
        vertex.y * Math.sin(rotation.x) + vertex.z * Math.cos(rotation.x);

      // Rotation around Y axis
      const x1 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
      const y1 = y;
      const z1 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);

      // Rotation around Z axis
      const x2 = x1 * Math.cos(rotation.z) - y1 * Math.sin(rotation.z);
      const y2 = x1 * Math.sin(rotation.z) + y1 * Math.cos(rotation.z);
      const z2 = z1;

      return { x: x2, y: y2, z: z2 };
    }

    /**
     * Draws the vector shape on the canvas with dynamic glow effect and symmetry.
     * @param ctx - Canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      // Only draw if the shape has some opacity
      if (this.opacity > 0) {
        const rgbColor = this.hexToRgb(this.color);
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
            const v1 = this.rotateVertex(this.vertices[start], this.rotation);
            const v2 = this.rotateVertex(this.vertices[end], this.rotation);
            const projectedV1 = project(
              v1.x + this.position.x,
              v1.y + this.position.y,
              v1.z + this.position.z
            );
            const projectedV2 = project(
              v2.x + this.position.x,
              v2.y + this.position.y,
              v2.z + this.position.z
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

    reset(existingPositions?: Set<string>) {
      // Reset position
      do {
        this.position = {
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
          z: Math.random() * 600 - 300,
        };
      } while (
        existingPositions &&
        existingPositions.has(this.getPositionKey())
      );

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

  // Initialize particles and shapes
  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  let numberOfParticles = Math.floor((width * height) / 2500); // Adjusted particle count for density
  let numberOfShapes = 6; // Balanced number of shapes

  /**
   * Adjusts the number of particles and shapes based on the current screen size.
   * Reduces the number on smaller screens to prevent clutter.
   */
  const adjustShapeCounts = () => {
    const isMobile = width <= 768; // Define mobile threshold
    const baseParticleCount = 70; // Reduced from 100
    const particlesPerPixel = 1 / 2000;

    // Calculate the number of particles based on screen size
    numberOfParticles = Math.max(
      baseParticleCount,
      Math.floor(width * height * particlesPerPixel)
    );

    // Slightly increase the number of particles for mobile devices
    if (isMobile) {
      numberOfParticles = Math.floor(numberOfParticles * 1.2);
    }

    numberOfShapes = isMobile ? 3 : 6;

    const existingPositions = new Set<string>();

    // Adjust particles
    if (particlesArray.length < numberOfParticles) {
      const additionalParticles = numberOfParticles - particlesArray.length;
      for (let i = 0; i < additionalParticles; i++) {
        particlesArray.push(new Particle(existingPositions));
      }
    } else if (particlesArray.length > numberOfParticles) {
      particlesArray.splice(numberOfParticles);
    }

    // Adjust shapes
    if (shapesArray.length < numberOfShapes) {
      const shapeTypes: ("cube" | "pyramid" | "star")[] = [
        "cube",
        "pyramid",
        "star",
      ];
      const additionalShapes = numberOfShapes - shapesArray.length;
      for (let i = 0; i < additionalShapes; i++) {
        const shapeType = shapeTypes[i % shapeTypes.length];
        shapesArray.push(new VectorShape(shapeType, existingPositions));
      }
    } else if (shapesArray.length > numberOfShapes) {
      shapesArray.splice(numberOfShapes);
    }
  };

  // Initial adjustment based on current size
  adjustShapeCounts();

  /**
   * Connects nearby particles with lines to create a network effect.
   * @param particles - Array of particles to connect.
   * @param ctx - Canvas rendering context.
   */
  const connectParticles = (
    particles: Particle[],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.lineWidth = 1;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dz = particles[a].z - particles[b].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Increase the distance threshold to 150
        if (distance < 150) {
          // Adjust the alpha calculation for more visibility
          const alpha = (1 - distance / 150) * 0.7;
          // Use a brighter color for connections
          ctx.strokeStyle = `rgba(200, 100, 255, ${alpha})`;

          // Project positions
          const posA = project(particles[a].x, particles[a].y, particles[a].z);
          const posB = project(particles[b].x, particles[b].y, particles[b].z);

          // Draw the line
          ctx.beginPath();
          ctx.moveTo(posA.x, posA.y);
          ctx.lineTo(posB.x, posB.y);
          ctx.stroke();
        }
      }
    }
  };

  // Add a new function to update particle connections
  const updateParticleConnections = (particles: Particle[]) => {
    particles.forEach((particle) => {
      // Randomly change particle velocity slightly
      if (Math.random() < 0.05) {
        // 5% chance to change direction each frame
        particle.velocityX += (Math.random() - 0.5) * 0.2;
        particle.velocityY += (Math.random() - 0.5) * 0.2;
        particle.velocityZ += (Math.random() - 0.5) * 0.2;

        // Normalize velocity to maintain consistent speed
        const speed = Math.sqrt(
          particle.velocityX ** 2 +
            particle.velocityY ** 2 +
            particle.velocityZ ** 2
        );
        particle.velocityX /= speed;
        particle.velocityY /= speed;
        particle.velocityZ /= speed;
      }
    });
  };

  /**
   * The main animation loop that updates and draws particles and shapes.
   */
  const animate = () => {
    // Clear the entire canvas
    ctx.clearRect(0, 0, width, height);

    // Draw a semi-transparent rectangle to create trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    // Update global hue
    updateHue();

    // Update particle connections
    updateParticleConnections(particlesArray);

    // Update and draw particles
    particlesArray.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    // Update and draw shapes
    const existingPositions = new Set<string>();
    shapesArray.forEach((shape) => {
      shape.update();

      if (shape.opacity > 0) {
        existingPositions.add(shape.getPositionKey());
        shape.draw(ctx);
      }

      // If a shape has reset, ensure it doesn't overlap with existing shapes
      if (shape.age === 0) {
        while (existingPositions.has(shape.getPositionKey())) {
          shape.reset(existingPositions);
        }
        existingPositions.add(shape.getPositionKey());
      }
    });

    // Connect particles with lines
    connectParticles(particlesArray, ctx);

    // Continue the animation loop
    animationFrameId = requestAnimationFrame(animate);
  };

  // Start the animation
  animate();

  /**
   * Cleanup function to remove event listeners and cancel animations.
   */
  const cleanup = () => {
    window.removeEventListener("resize", handleResize);
    navElement.removeEventListener("pointerenter", handlePointerEnter);
    navElement.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };

  return cleanup;
};
