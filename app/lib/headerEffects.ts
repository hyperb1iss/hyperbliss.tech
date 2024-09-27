import { VectorShape } from "./VectorShape";
import { Particle } from "./Particle";
import {
  CYBERPUNK_HUE_RANGES,
  getRandomCyberpunkHue,
  project,
} from "./headerEffectsUtils";
import {
  applyGlitchEffect,
  applyChromaticAberration,
  applyCRTEffect,
} from "./glitchEffects";

/**
 * Initializes the canvas and sets up the header animation effects.
 * This function is responsible for creating and managing the entire animation
 * system, including particle and shape generation, user interaction handling,
 * and applying visual effects.
 *
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

  // Animation frame ID for cancellation
  let animationFrameId: number;

  // Variables for cursor interaction
  let isCursorOverHeader = false;
  let mouseX = 0;
  let mouseY = 0;

  // Initialize a global hue value within cyberpunk range
  let hue = 210; // Starting with Neon Blue

  /**
   * Updates global hue to cycle through cyberpunk colors smoothly.
   * This function ensures that the color scheme remains within the defined cyberpunk ranges.
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

  /**
   * Handles window resize events to keep canvas dimensions updated.
   * This function ensures that the canvas size matches the container and
   * adjusts the number of particles and shapes accordingly.
   */
  const handleResize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Adjust the number of particles and shapes based on new size
    adjustShapeCounts();
  };
  window.addEventListener("resize", handleResize);

  /**
   * Handles pointer enter events for the header.
   * Sets a flag to indicate that the cursor is over the header area.
   */
  const handlePointerEnter = () => {
    isCursorOverHeader = true;
  };

  /**
   * Handles pointer leave events for the header.
   * Resets the flag to indicate that the cursor has left the header area.
   */
  const handlePointerLeave = () => {
    isCursorOverHeader = false;
  };

  // Attach pointerenter and pointerleave events to the nav element
  navElement.addEventListener("pointerenter", handlePointerEnter);
  navElement.addEventListener("pointerleave", handlePointerLeave);

  /**
   * Throttles a function to limit how often it can be called.
   * This is useful for performance optimization, especially for frequently triggered events.
   *
   * @param func - The function to throttle.
   * @param limit - The time limit (in milliseconds) between function calls.
   * @returns A throttled version of the input function.
   */
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * Handles mouse move events to track cursor position when over the header.
   * This function updates the mouseX and mouseY variables used for particle interactions.
   *
   * @param event - The MouseEvent object containing cursor position information.
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverHeader) return;
    const rect = canvas.getBoundingClientRect();
    // Convert mouse position to canvas coordinate system centered at (0,0)
    mouseX = event.clientX - rect.left - width / 2;
    mouseY = event.clientY - rect.top - height / 2;
  };
  const throttledHandleMouseMove = throttle(handleMouseMove, 16); // Throttle to about 60fps
  window.addEventListener("mousemove", throttledHandleMouseMove);

  // Initialize particles and shapes
  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  let numberOfParticles = Math.floor((width * height) / 2500); // Adjusted particle count for density
  let numberOfShapes = 6; // Balanced number of shapes

  /**
   * Adjusts the number of particles and shapes based on the current screen size.
   * This function ensures optimal performance by scaling the number of elements
   * according to the canvas dimensions and device capabilities.
   */
  const adjustShapeCounts = () => {
    const isMobile = width <= 768;
    const baseParticleCount = 70;
    const particlesPerPixel = 1 / 2000;

    numberOfParticles = Math.max(
      baseParticleCount,
      Math.floor(width * height * particlesPerPixel)
    );

    if (isMobile) {
      numberOfParticles = Math.floor(numberOfParticles * 1.2);
    }

    numberOfShapes = isMobile ? 3 : 6;

    const existingPositions = new Set<string>();

    // Adjust particles
    while (particlesArray.length < numberOfParticles) {
      particlesArray.push(new Particle(existingPositions, width, height));
    }
    particlesArray.length = numberOfParticles;

    // Adjust shapes
    while (shapesArray.length < numberOfShapes) {
      const shapeType = ["cube", "pyramid", "star"][shapesArray.length % 3] as
        | "cube"
        | "pyramid"
        | "star";
      shapesArray.push(
        new VectorShape(shapeType, existingPositions, width, height)
      );
    }
    shapesArray.length = numberOfShapes;
  };

  // Object pools for efficient particle and shape management
  const particlePool: Particle[] = [];
  const shapePool: VectorShape[] = [];

  /**
   * Retrieves a Particle object from the pool or creates a new one if the pool is empty.
   * This function helps in reducing garbage collection and improving performance.
   *
   * @returns A Particle object ready for use.
   */
  const getParticleFromPool = () => {
    return particlePool.pop() || new Particle(new Set(), width, height);
  };

  /**
   * Retrieves a VectorShape object from the pool or creates a new one if the pool is empty.
   * This function helps in reducing garbage collection and improving performance.
   *
   * @param type - The type of shape to retrieve or create.
   * @returns A VectorShape object ready for use.
   */
  const getShapeFromPool = (type: "cube" | "pyramid" | "star") => {
    return shapePool.pop() || new VectorShape(type, new Set(), width, height);
  };

  // Initial adjustment based on current size
  adjustShapeCounts();

  /**
   * Connects nearby particles with lines to create a network effect.
   * This function is responsible for drawing the interconnecting lines between particles,
   * creating a dynamic, web-like visual effect.
   *
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

  /**
   * Updates particle connections by slightly changing their velocities.
   * This function adds a subtle, organic movement to the particle system.
   *
   * @param particles - Array of particles to update.
   */
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

  // Initialize glitch effect variables
  let isGlitching = false;
  let lastGlitchTime = 0;
  let glitchIntensity = 0;
  let glitchInterval = 5000; // 5 seconds between glitch effects
  let glitchDuration = 200; // 0.2 seconds duration for each glitch effect

  /**
   * The main animation loop that updates and draws particles and shapes.
   * This function is called recursively to create a smooth animation.
   */
  const animate = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);

    updateHue();
    updateParticleConnections(particlesArray);

    for (let particle of particlesArray) {
      particle.update(isCursorOverHeader, mouseX, mouseY, width, height);
      particle.draw(ctx, mouseX, mouseY, width, height);
    }

    const existingPositions = new Set<string>();
    for (let shape of shapesArray) {
      shape.update(isCursorOverHeader, mouseX, mouseY, width, height);
      if (shape.opacity > 0) {
        existingPositions.add(shape.getPositionKey());
        shape.draw(ctx, width, height);
      }
      if (shape.opacity <= 0 && shape.isFadingOut) {
        shape.reset(existingPositions, width, height);
      }
    }

    connectParticles(particlesArray, ctx);

    // Apply glitch effects
    const currentTime = Date.now();
    if (!isGlitching && currentTime - lastGlitchTime > glitchInterval) {
      isGlitching = true;
      glitchIntensity = Math.random() * 0.7 + 0.3; // Random intensity between 0.3 and 1
      glitchDuration = Math.random() * 300 + 100; // Random duration between 100ms and 400ms
      lastGlitchTime = currentTime;

      // Randomly adjust the next glitch interval
      glitchInterval = Math.random() * 5000 + 5000; // Random interval between 5s and 10s
    }

    if (isGlitching) {
      const glitchProgress = (currentTime - lastGlitchTime) / glitchDuration;
      if (glitchProgress >= 1) {
        isGlitching = false;
      } else {
        const fadeIntensity =
          Math.sin(glitchProgress * Math.PI) * glitchIntensity;
        applyGlitchEffect(ctx, width, height, fadeIntensity);
        applyChromaticAberration(ctx, width, height, fadeIntensity * 15);
        applyCRTEffect(ctx, width, height, fadeIntensity * 0.5);
      }
    }

    // Continue the animation loop
    animationFrameId = requestAnimationFrame(animate);
  };

  // Start the animation
  animate();

  /**
   * Cleanup function to remove event listeners and cancel animations.
   * This function should be called when the component unmounts or the effect needs to be cleaned up.
   */
  const cleanup = () => {
    window.removeEventListener("resize", handleResize);
    navElement.removeEventListener("pointerenter", handlePointerEnter);
    navElement.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("mousemove", throttledHandleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };

  return cleanup;
};
