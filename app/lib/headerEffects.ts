// app/lib/headerEffects.ts

/**
 * Initializes the canvas effects for the header, including particles and moving 3D vector shapes.
 * @param canvas - The HTMLCanvasElement to draw on.
 * @param logoElement - The HTMLAnchorElement of the logo for interaction.
 * @returns A cleanup function to remove event listeners and cancel animations.
 */
export const initializeCanvas = (
  canvas: HTMLCanvasElement,
  logoElement: HTMLAnchorElement
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

  // Handle window resize to keep canvas dimensions updated
  const handleResize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  };
  window.addEventListener("resize", handleResize);

  // Mouse move handler to track cursor position and detect if it's over the header
  const handleMouseMove = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    // Convert mouse position to canvas coordinate system centered at (0,0)
    mouseX = event.clientX - rect.left - width / 2;
    mouseY = event.clientY - rect.top - height / 2;

    // Determine if cursor is within the header area
    isCursorOverHeader =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
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
   * Particle class representing a single star in the background.
   */
  class Particle {
    x: number;
    y: number;
    z: number;
    size: number;
    speedX: number;
    speedY: number;
    speedZ: number;

    constructor() {
      // Initial positions spread across the entire canvas
      this.x = Math.random() * width - width / 2;
      this.y = Math.random() * height - height / 2;
      this.z = Math.random() * 600 - 300; // Depth range to keep particles visible
      this.size = Math.random() * 1.5 + 0.5;
      // Assign independent random speeds for varied movement
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
      this.speedZ = Math.random() * 0.4 - 0.2;
    }

    /**
     * Updates the particle's position and applies interaction forces if necessary.
     */
    update() {
      if (isCursorOverHeader) {
        // Calculate attraction towards the cursor
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 200; // Maximum distance to apply attraction
        const force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
          // Apply a force proportional to proximity
          this.speedX += forceDirectionX * force * 0.5;
          this.speedY += forceDirectionY * force * 0.5;
        }
      }

      // Update positions based on speed
      this.x += this.speedX;
      this.y += this.speedY;
      this.z += this.speedZ;

      // Apply friction to slow down over time
      this.speedX *= 0.95;
      this.speedY *= 0.95;
      this.speedZ *= 0.95;

      // Wrap around edges to create a continuous effect
      if (this.x < -width / 2) this.x = width / 2;
      if (this.x > width / 2) this.x = -width / 2;
      if (this.y < -height / 2) this.y = height / 2;
      if (this.y > height / 2) this.y = -height / 2;
      if (this.z < -300) this.z = 300;
      if (this.z > 300) this.z = -300;
    }

    /**
     * Draws the particle on the canvas.
     * @param ctx - Canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
      const pos = project(this.x, this.y, this.z);
      ctx.fillStyle = "#00fff0";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.size * pos.scale, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * VectorShape class representing a 3D shape (cube or pyramid) in the background.
   */
  class VectorShape {
    vertices: { x: number; y: number; z: number }[];
    edges: [number, number][];
    rotation: { x: number; y: number; z: number };
    rotationSpeed: { x: number; y: number; z: number };
    position: { x: number; y: number; z: number };
    velocity: { x: number; y: number; z: number };
    color: string;

    constructor(shapeType: "cube" | "pyramid") {
      // Define smaller vertices to prevent large projections
      const size = 30; // Reduced size for shapes
      if (shapeType === "cube") {
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
      } else {
        // Pyramid
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
      }

      this.rotation = { x: 0, y: 0, z: 0 };
      // Increase rotation speed for more dynamic animation
      this.rotationSpeed = {
        x: Math.random() * 0.01 - 0.005,
        y: Math.random() * 0.01 - 0.005,
        z: Math.random() * 0.01 - 0.005,
      };
      this.color = shapeType === "cube" ? "#ff75d8" : "#a259ff";

      // Initial random position spread across the canvas
      this.position = {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * 600 - 300, // Depth range to keep shapes visible
      };

      // Random velocity for movement
      // Ensure that velocities are balanced to allow horizontal movement in both directions
      this.velocity = {
        x: Math.random() * 0.6 - 0.3, // Increased range for faster horizontal movement
        y: Math.random() * 0.6 - 0.3,
        z: Math.random() * 0.4 - 0.2,
      };
    }

    /**
     * Updates the shape's position and rotation. Applies interaction forces if necessary.
     */
    update() {
      if (isCursorOverHeader) {
        // Calculate attraction towards the cursor
        const dx = mouseX - this.position.x;
        const dy = mouseY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 300; // Maximum distance to apply attraction
        const force = (maxDistance - distance) / maxDistance;

        if (distance < maxDistance) {
          // Apply a force proportional to proximity
          this.velocity.x += forceDirectionX * force * 0.3;
          this.velocity.y += forceDirectionY * force * 0.3;
        }
      }

      // Update rotation
      this.rotation.x += this.rotationSpeed.x;
      this.rotation.y += this.rotationSpeed.y;
      this.rotation.z += this.rotationSpeed.z;

      // Update position based on velocity
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.position.z += this.velocity.z;

      // Apply friction to slow down over time
      this.velocity.x *= 0.98;
      this.velocity.y *= 0.98;
      this.velocity.z *= 0.98;

      // Wrap around edges to create a continuous effect
      if (this.position.x < -width / 2 - 100) this.position.x = width / 2 + 100;
      if (this.position.x > width / 2 + 100) this.position.x = -width / 2 - 100;
      if (this.position.y < -height / 2 - 100)
        this.position.y = height / 2 + 100;
      if (this.position.y > height / 2 + 100)
        this.position.y = -height / 2 - 100;
      if (this.position.z < -300) this.position.z = 300;
      if (this.position.z > 300) this.position.z = -300;
    }

    /**
     * Draws the vector shape on the canvas.
     * @param ctx - Canvas rendering context.
     */
    draw(ctx: CanvasRenderingContext2D) {
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
      ctx.stroke();
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
      let y = vertex.y * Math.cos(rotation.x) - vertex.z * Math.sin(rotation.x);
      let z = vertex.y * Math.sin(rotation.x) + vertex.z * Math.cos(rotation.x);

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
  }

  // Initialize particles and shapes
  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  const numberOfParticles = Math.floor((width * height) / 2500); // Increased particle count for density
  const numberOfShapes = 6; // Balanced number of shapes

  // Populate particles array
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }

  // Populate shapes array with alternating cubes and pyramids
  const shapeTypes: ("cube" | "pyramid")[] = ["cube", "pyramid"];
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
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dz = particles[a].z - particles[b].z;
        const distance = dx * dx + dy * dy + dz * dz;
        if (distance < 10000) {
          // Adjusted distance threshold for new ranges
          const posA = project(particles[a].x, particles[a].y, particles[a].z);
          const posB = project(particles[b].x, particles[b].y, particles[b].z);
          ctx.strokeStyle = "rgba(0, 255, 240, 0.1)";
          ctx.lineWidth = 1;
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
    ctx.clearRect(0, 0, width, height);

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
    window.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };

  return cleanup;
};
