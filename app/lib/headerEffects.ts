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

  // Define a constant color for particle connections
  const PARTICLE_CONNECTION_COLOR = "rgba(160, 32, 240, 0.1)"; // Semi-transparent purple

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

    constructor() {
      this.x = Math.random() * width - width / 2;
      this.y = Math.random() * height - height / 2;
      this.z = Math.random() * 600 - 300;

      this.size = Math.random() * 1.5 + 0.5;

      this.maxSpeed = 0.5;
      this.minSpeed = 0.1;

      // Initialize with a random velocity within speed limits
      const angle = Math.random() * Math.PI * 2;
      const speed =
        Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
      this.velocityX = Math.cos(angle) * speed;
      this.velocityY = Math.sin(angle) * speed;
      this.velocityZ = (Math.random() - 0.5) * speed;

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

      // Wrap around edges
      this.x = ((this.x + width / 2) % width) - width / 2;
      this.y = ((this.y + height / 2) % height) - height / 2;
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
     * Draws the particle on the canvas with a glow effect.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D) {
      const pos = project(this.x, this.y, this.z);

      // Set the particle's color and prepare for glow effect
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;

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

    constructor(shapeType: "cube" | "pyramid" | "star") {
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

      this.position = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 600 - 300,
      };

      this.maxSpeed = 0.3;
      this.minSpeed = 0.05;

      // Initialize with a random velocity within speed limits
      const angle = Math.random() * Math.PI * 2;
      const speed =
        Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed;
      this.velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
        z: (Math.random() - 0.5) * speed,
      };

      this.rotation = { x: 0, y: 0, z: 0 };
      this.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      };

      this.color = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;
      this.targetColor = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;
      this.colorTransitionSpeed = 0.01;
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

      // Implement smooth wrapping
      const buffer = 50; // Buffer zone for smooth transition
      if (this.position.x < -width / 2 - buffer) {
        this.position.x = width / 2 + buffer;
      } else if (this.position.x > width / 2 + buffer) {
        this.position.x = -width / 2 - buffer;
      }
      if (this.position.y < -height / 2 - buffer) {
        this.position.y = height / 2 + buffer;
      } else if (this.position.y > height / 2 + buffer) {
        this.position.y = -height / 2 - buffer;
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

      // Update rotation
      this.rotation.x += this.rotationSpeed.x;
      this.rotation.y += this.rotationSpeed.y;
      this.rotation.z += this.rotationSpeed.z;

      // Update color
      const currentHue = parseInt(this.color.match(/\d+/)![0]);
      const targetHue = parseInt(this.targetColor.match(/\d+/)![0]);

      if (Math.abs(currentHue - targetHue) < 1) {
        this.targetColor = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;
      } else {
        const newHue =
          currentHue + (targetHue - currentHue) * this.colorTransitionSpeed;
        this.color = `hsl(${newHue}, 100%, 50%)`;
      }
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
     * Draws the vector shape on the canvas with glow effect and symmetry.
     * @param ctx - Canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      const drawShape = () => {
        ctx.beginPath();
        this.edges.forEach(([start, end]) => {
          const v1 = this.vertices[start];
          const v2 = this.vertices[end];

          // Apply rotation to vertices
          const rotatedV1 = this.rotateVertex(v1, this.rotation);
          const rotatedV2 = this.rotateVertex(v2, this.rotation);

          // Apply position offset and projection
          const projectedV1 = project(
            rotatedV1.x + this.position.x,
            rotatedV1.y + this.position.y,
            rotatedV1.z + this.position.z
          );
          const projectedV2 = project(
            rotatedV2.x + this.position.x,
            rotatedV2.y + this.position.y,
            rotatedV2.z + this.position.z
          );

          ctx.moveTo(projectedV1.x, projectedV1.y);
          ctx.lineTo(projectedV2.x, projectedV2.y);
        });
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      // Draw original shape
      drawShape();

      // Handle wrapping visual continuity
      const buffer = 50;
      if (Math.abs(this.position.x) > width / 2 - buffer) {
        ctx.save();
        ctx.translate(this.position.x > 0 ? -width : width, 0);
        drawShape();
        ctx.restore();
      }
      if (Math.abs(this.position.y) > height / 2 - buffer) {
        ctx.save();
        ctx.translate(0, this.position.y > 0 ? -height : height);
        drawShape();
        ctx.restore();
      }
    }
  }

  // Initialize particles and shapes
  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  const numberOfParticles = Math.floor((width * height) / 2500); // Adjusted particle count for density
  const numberOfShapes = 6; // Balanced number of shapes

  // Populate particles array
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }

  // Populate shapes array with alternating cubes, pyramids, and stars
  const shapeTypes: ("cube" | "pyramid" | "star")[] = [
    "cube",
    "pyramid",
    "star",
  ];
  for (let i = 0; i < numberOfShapes; i++) {
    const shapeType = shapeTypes[i % shapeTypes.length];
    shapesArray.push(new VectorShape(shapeType));
  }

  /**
   * Connects nearby particles with lines to create a network effect.
   * @param particles - Array of particles to connect.
   * @param ctx - Canvas rendering context.
   */
  const connectParticles = (
    particles: Particle[],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.strokeStyle = PARTICLE_CONNECTION_COLOR;
    ctx.lineWidth = 1;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dz = particles[a].z - particles[b].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 100) {
          // Reduced distance threshold for more dynamic connections
          const alpha = 1 - distance / 100; // Fade out connections as distance increases
          ctx.strokeStyle = `rgba(160, 32, 240, ${alpha * 0.2})`; // Adjust alpha for visibility

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

  /**
   * The main animation loop that updates and draws particles and shapes.
   */
  const animate = () => {
    // Draw a semi-transparent rectangle to create trails
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Adjust alpha for trail length
    ctx.fillRect(0, 0, width, height);

    // Update global hue
    updateHue();

    // Update and draw particles
    particlesArray.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    // Update and draw shapes
    shapesArray.forEach((shape) => {
      shape.update();
      shape.draw(ctx);
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
