import { VectorShape } from "./VectorShape";
import { Particle, ParticleAtCollision } from "./Particle";
import {
  CYBERPUNK_HUE_RANGES,
  getRandomCyberpunkHue,
  project,
} from "./CyberScapeUtils";
import {
  applyGlitchEffect,
  applyChromaticAberration,
  applyCRTEffect,
} from "./glitchEffects";

/**
 * Initializes the CyberScape animation on the canvas.
 * @param canvas - The HTML canvas element to draw on.
 * @param logoElement - The logo element for potential interactions.
 * @param navElement - The navigation element for mouse interaction detection.
 * @returns A cleanup function to remove event listeners and cancel animations.
 */
export const initializeCyberScape = (
  canvas: HTMLCanvasElement,
  logoElement: HTMLAnchorElement,
  navElement: HTMLElement
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const updateCanvasSize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width || canvas.height !== height) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
  };

  updateCanvasSize();

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  // Animation frame ID for cancellation
  let animationFrameId: number;

  // Variables for cursor interaction
  let isCursorOverCyberScape = false;
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

  /**
   * Handles window resize events to keep canvas dimensions updated.
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
   * Handles pointer enter events for the CyberScape.
   */
  const handlePointerEnter = () => {
    isCursorOverCyberScape = true;
  };

  /**
   * Handles pointer leave events for the CyberScape.
   */
  const handlePointerLeave = () => {
    isCursorOverCyberScape = false;
  };

  // Attach pointerenter and pointerleave events to the nav element
  navElement.addEventListener("pointerenter", handlePointerEnter);
  navElement.addEventListener("pointerleave", handlePointerLeave);

  /**
   * Throttles a function to limit how often it can be called.
   * @param func - The function to throttle.
   * @param limit - The time limit (in milliseconds) between function calls.
   */
  const throttle = <T extends unknown[]>(
    func: (...args: T) => void,
    limit: number
  ) => {
    let inThrottle: boolean;
    return (...args: T) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * Handles mouse move events to track cursor position when over the CyberScape.
   * @param event - The MouseEvent object containing cursor position information.
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverCyberScape) return;
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

    numberOfShapes = isMobile ? 4 : 8;

    const existingPositions = new Set<string>();

    // Adjust particles
    while (particlesArray.length < numberOfParticles) {
      particlesArray.push(new Particle(existingPositions, width, height));
    }
    particlesArray.length = numberOfParticles;

    // Adjust shapes
    while (shapesArray.length < numberOfShapes) {
      const shapeType = [
        "cube",
        "pyramid",
        "tetrahedron",
        "octahedron",
        "dodecahedron",
      ][shapesArray.length % 5] as
        | "cube"
        | "pyramid"
        | "tetrahedron"
        | "octahedron"
        | "dodecahedron";
      shapesArray.push(
        new VectorShape(shapeType, existingPositions, width, height)
      );
    }
    shapesArray.length = numberOfShapes;
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

        if (distance < 150) {
          const alpha = (1 - distance / 150) * 0.7;
          ctx.strokeStyle = `rgba(200, 100, 255, ${alpha})`;

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
   * @param particles - Array of particles to update.
   */
  const updateParticleConnections = (particles: Particle[]) => {
    particles.forEach((particle) => {
      if (Math.random() < 0.05) {
        particle.velocityX += (Math.random() - 0.5) * 0.2;
        particle.velocityY += (Math.random() - 0.5) * 0.2;
        particle.velocityZ += (Math.random() - 0.5) * 0.2;

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
   * Callback function to handle additional effects upon shape collisions.
   * @param shapeA - The first shape involved in the collision.
   * @param shapeB - The second shape involved in the collision.
   */
  const handleShapeCollision = (shapeA: VectorShape, shapeB: VectorShape) => {
    // Emit particles at the collision point
    const collisionX = (shapeA.position.x + shapeB.position.x) / 2;
    const collisionY = (shapeA.position.y + shapeB.position.y) / 2;
    const collisionZ = (shapeA.position.z + shapeB.position.z) / 2;

    // Number of particles to emit
    const particlesToEmit = 20; // Increased from 10 to 20 for more spread

    // Limit the number of particles to prevent excessive emissions
    const MAX_PARTICLES = 1000; // Adjust based on performance testing
    if (particlesArray.length + particlesToEmit <= MAX_PARTICLES) {
      for (let i = 0; i < particlesToEmit; i++) {
        particlesArray.push(
          new ParticleAtCollision(collisionX, collisionY, collisionZ)
        );
      }
    }

    // Handle shape respawning with random delay
    shapeA.explodeAndRespawn();
    shapeB.explodeAndRespawn();
  };

  /**
   * The main animation loop for CyberScape.
   */
  const animateCyberScape = () => {
    updateCanvasSize();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateHue();
    updateParticleConnections(particlesArray);

    for (const particle of particlesArray) {
      particle.update(isCursorOverCyberScape, mouseX, mouseY, width, height);
      particle.draw(ctx, mouseX, mouseY, width, height);
    }

    const existingPositions = new Set<string>();
    for (const shape of shapesArray) {
      shape.update(isCursorOverCyberScape, mouseX, mouseY, width, height);
      if (shape.opacity > 0 && !shape.isExploded) {
        // Only render if not exploded
        existingPositions.add(shape.getPositionKey());
        shape.draw(ctx, width, height);
      }
      if (shape.isFadedOut()) {
        shape.reset(existingPositions, width, height);
      }
    }

    // Handle interactions with enhanced collision handling
    VectorShape.handleCollisions(shapesArray, handleShapeCollision);
    VectorShape.handleColorBlending(shapesArray);
    VectorShape.handleAttractionRepulsion(shapesArray);

    // Draw connections between shapes
    VectorShape.drawConnections(ctx, shapesArray, width, height);

    connectParticles(particlesArray, ctx);

    // Cleanup expired particles to prevent CPU overload
    // Iterate backwards to safely remove items while iterating
    for (let i = particlesArray.length - 1; i >= 0; i--) {
      if (particlesArray[i].opacity <= 0) {
        particlesArray.splice(i, 1);
      }
    }

    // Apply glitch effects
    const currentTime = Date.now();
    if (!isGlitching && currentTime - lastGlitchTime > glitchInterval) {
      isGlitching = true;
      glitchIntensity = Math.random() * 0.7 + 0.3;
      glitchDuration = Math.random() * 300 + 100;
      lastGlitchTime = currentTime;
      glitchInterval = Math.random() * 5000 + 5000;
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
    animationFrameId = requestAnimationFrame(animateCyberScape);
  };

  // Start the animation
  animateCyberScape();

  /**
   * Cleanup function to remove event listeners and cancel animations.
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
