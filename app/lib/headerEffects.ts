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
          positionKey = `${this.x.toFixed(2)},${this.y.toFixed(2)},${this.z.toFixed(2)}`;
        } while (existingPositions.has(positionKey));
        existingPositions.add(positionKey);
  
        this.size = Math.random() * 1.5 + 0.5;
  
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
  
      constructor(shapeType: "cube" | "pyramid" | "star", existingPositions: Set<string>) {
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
            y: (Math.random() * height - height / 2) * (Math.random() < 0.5 ? 1 : -1), // Ensure non-mirrored randomness
            z: Math.random() * 600 - 300,
          };
          positionKey = `${this.position.x.toFixed(2)},${this.position.y.toFixed(2)},${this.position.z.toFixed(2)}`;
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
        const currentHueMatch = this.color.match(/\d+/);
        const targetHueMatch = this.targetColor.match(/\d+/);
        if (currentHueMatch && targetHueMatch) {
          const currentHue = parseInt(currentHueMatch[0], 10);
          const targetHue = parseInt(targetHueMatch[0], 10);
  
          if (Math.abs(currentHue - targetHue) < 1) {
            this.targetColor = `hsl(${getRandomCyberpunkHue()}, 100%, 50%)`;
          } else {
            const newHue =
              currentHue + (targetHue - currentHue) * this.colorTransitionSpeed;
            this.color = `hsl(${newHue}, 100%, 50%)`;
          }
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
        let x = vertex.x;
        let y =
          vertex.y * Math.cos(rotation.x) - vertex.z * Math.sin(rotation.x);
        let z =
          vertex.y * Math.sin(rotation.x) + vertex.z * Math.cos(rotation.x);
  
        // Rotation around Y axis
        let x1 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
        let y1 = y;
        let z1 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);
  
        // Rotation around Z axis
        let x2 = x1 * Math.cos(rotation.z) - y1 * Math.sin(rotation.z);
        let y2 = x1 * Math.sin(rotation.z) + y1 * Math.cos(rotation.z);
        let z2 = z1;
  
        return { x: x2, y: y2, z: z2 };
      }
  
      /**
       * Draws the vector shape on the canvas with dynamic glow effect and symmetry.
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
  
          // Calculate dynamic shadow based on rotation speed
          const rotationSpeedMagnitude =
            Math.abs(this.rotationSpeed.x) +
            Math.abs(this.rotationSpeed.y) +
            Math.abs(this.rotationSpeed.z);
          const dynamicShadowBlur = 10 + rotationSpeedMagnitude * 100;
          ctx.shadowBlur = dynamicShadowBlur;
          ctx.shadowColor = this.color; // Ensure glow matches object color
  
          ctx.stroke();
          ctx.shadowBlur = 0;
        };
  
        // Draw original shape
        drawShape();
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
      const baseParticleCount = 30; // Reduced from 100
      const particlesPerPixel = 1 / 8000; // Reduced from 1 / 2000

      // Calculate the number of particles based on screen size
      numberOfParticles = Math.max(
        baseParticleCount,
        Math.floor(width * height * particlesPerPixel)
      );

      // Slightly increase the number of particles for mobile devices
      if (isMobile) {
        numberOfParticles = Math.floor(numberOfParticles * 1.2); // Reduced from 1.5
      }

      numberOfShapes = isMobile ? 1 : 2; // Reduced from 3 and 6

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
        const shapeTypes: ("cube" | "pyramid" | "star")[] = ["cube", "pyramid", "star"];
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
      ctx.strokeStyle = PARTICLE_CONNECTION_COLOR;
      ctx.lineWidth = 1;
  
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dz = particles[a].z - particles[b].z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
          // Reduce the distance threshold from 150 to 100
          if (distance < 100) {
            // Adjust the alpha calculation to maintain visibility
            const alpha = 1 - distance / 100;
            ctx.strokeStyle = `rgba(160, 32, 240, ${alpha * 0.2})`; // Reduced alpha from 0.3 to 0.2
  
            // Project positions
            const posA = project(
              particles[a].x,
              particles[a].y,
              particles[a].z
            );
            const posB = project(
              particles[b].x,
              particles[b].y,
              particles[b].z
            );
  
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
  