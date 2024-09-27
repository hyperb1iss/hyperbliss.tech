import { VectorShape } from "./VectorShape";
import { Particle } from "./Particle";
import {
  CYBERPUNK_HUE_RANGES,
  getRandomCyberpunkHue,
  project,
} from "./headerEffectsUtils";

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
        particlesArray.push(new Particle(existingPositions, width, height));
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
        shapesArray.push(
          new VectorShape(shapeType, existingPositions, width, height)
        );
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
          const posA = project(
            particles[a].x,
            particles[a].y,
            particles[a].z,
            width,
            height
          );
          const posB = project(
            particles[b].x,
            particles[b].y,
            particles[b].z,
            width,
            height
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
      particle.update(isCursorOverHeader, mouseX, mouseY, width, height);
      particle.draw(ctx, mouseX, mouseY, width, height);
    });

    // Update and draw shapes
    const existingPositions = new Set<string>();
    shapesArray.forEach((shape) => {
      shape.update(isCursorOverHeader, mouseX, mouseY, width, height);

      if (shape.opacity > 0) {
        existingPositions.add(shape.getPositionKey());
        shape.draw(ctx, width, height);
      }

      // If a shape has completely faded out, reset it
      if (shape.opacity <= 0 && shape.isFadingOut) {
        shape.reset(existingPositions, width, height);
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
