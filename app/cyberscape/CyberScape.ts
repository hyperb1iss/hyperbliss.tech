// app/cyberscape/CyberScape.ts

import { vec3 } from "gl-matrix";
import { CyberScapeConfig } from "./CyberScapeConfig";
import { DatastreamEffect } from "./effects/DatastreamEffect";
import { GlitchManager } from "./effects/GlitchManager";
import { CollisionHandler } from "./handlers/CollisionHandler";
import { ColorBlender } from "./handlers/ColorBlender";
import { ForceHandler } from "./handlers/ForceHandler";
import { Particle } from "./particles/Particle";
import { ParticleAtCollision } from "./particles/ParticleAtCollision";
import { ShapeFactory } from "./shapes/ShapeFactory";
import { VectorShape } from "./shapes/VectorShape";
import { ColorManager } from "./utils/ColorManager";
import { ParticlePool } from "./utils/ParticlePool";
import { VectorMath } from "./utils/VectorMath";
import { Connection } from "./utils/Connection"; // Import Connection interface

/**
 * Function to trigger the CyberScape animation at specific coordinates.
 * This is set up in the initialization and can be called externally.
 */
let triggerAnimation: ((x: number, y: number) => void) | null = null;

/**
 * Triggers the CyberScape animation at the specified coordinates.
 * @param x - The x-coordinate of the animation trigger point.
 * @param y - The y-coordinate of the animation trigger point.
 */
export const triggerCyberScapeAnimation = (x: number, y: number) => {
  if (triggerAnimation) {
    triggerAnimation(x, y);
  }
};

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

  const config = CyberScapeConfig.getInstance();
  const particlePool = new ParticlePool(config.particlePoolSize);
  CollisionHandler.initialize(particlePool);

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let isCursorOverCyberScape = false;
  let mouseX = 0;
  let mouseY = 0;
  let hue = 210;
  let animationFrameId: number;
  let lastFrameTime = 0;

  const shapesArray: VectorShape[] = [];
  const particlesArray: Particle[] = [];
  const collisionParticlesArray: ParticleAtCollision[] = [];
  let numberOfParticles = config.calculateParticleCount(width, height);
  let numberOfShapes = config.getShapeCount(width);

  let activeParticles = 0;
  let explosionParticlesCount = 0;
  let lastExplosionTime = 0;
  let currentExplosions = 0;

  let isAnimationTriggered = false;
  let animationProgress = 0;
  let animationCenterX = 0;
  let animationCenterY = 0;

  const glitchManager = new GlitchManager();
  const datastreamEffect = new DatastreamEffect(
    particlePool,
    particlesArray,
    shapesArray
  );

  /**
   * Updates the canvas size based on the navigation element's dimensions.
   */
  const updateCanvasSize = () => {
    const { width: newWidth, height: newHeight } =
      navElement.getBoundingClientRect();
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = newWidth * dpr;
      canvas.height = newHeight * dpr;
      ctx.scale(dpr, dpr);
      width = newWidth;
      height = newHeight;
    }
  };

  /**
   * Handles window resize events and updates canvas and shape counts.
   */
  const handleResize = () => {
    updateCanvasSize();
    numberOfParticles = config.calculateParticleCount(width, height);
    numberOfShapes = config.getShapeCount(width);
    adjustShapeCounts();
  };

  window.addEventListener("resize", handleResize);
  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(navElement);

  const handlePointerEnter = () => {
    isCursorOverCyberScape = true;
  };
  const handlePointerLeave = () => {
    isCursorOverCyberScape = false;
  };
  navElement.addEventListener("pointerenter", handlePointerEnter);
  navElement.addEventListener("pointerleave", handlePointerLeave);

  /**
   * Handles mouse movement and updates cursor position.
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverCyberScape) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left - width / 2;
    mouseY = event.clientY - rect.top - height / 2;
  };
  const throttledHandleMouseMove = throttle(handleMouseMove, 16);
  window.addEventListener("mousemove", throttledHandleMouseMove);

  /**
   * Adjusts the number of shapes based on the current configuration.
   */
  const adjustShapeCounts = () => {
    const existingPositions = new Set<string>();
    while (shapesArray.length < numberOfShapes) {
      const shapeType = [
        "cube",
        "pyramid",
        "tetrahedron",
        "octahedron",
        "dodecahedron",
      ][shapesArray.length % 5];
      shapesArray.push(
        ShapeFactory.createShape(shapeType, existingPositions, width, height)
      );
    }
    // If there are more shapes than needed, remove the excess
    if (shapesArray.length > numberOfShapes) {
      shapesArray.length = numberOfShapes;
    }
  };

  adjustShapeCounts();

  /**
   * Updates the hue for color transitions.
   */
  const updateHue = () => {
    hue = (hue + 0.2) % 360;
    if (!ColorManager.isValidCyberpunkHue(hue)) {
      hue = ColorManager.getRandomCyberpunkHue();
    }
  };

  /**
   * The list of active connections between particles.
   */
  const connections: Connection[] = [];
  const CONNECTION_ANIMATION_DURATION = 1000; // Increased duration from 500 to 1000 ms

  // New: Maximum number of connections per particle
  const MAX_CONNECTIONS_PER_PARTICLE = 5; // You can adjust this value as needed

  // New: Maximum connection distance relative to canvas size (e.g., 10% of canvas diagonal)
  const MAX_CONNECTION_DISTANCE = config.particleConnectionDistance;

  /**
   * Connects particles by drawing lines between those that are within a certain distance.
   * Animates the connection lines smoothly.
   */
  const connectParticles = (
    particles: Particle[],
    ctx: CanvasRenderingContext2D,
    timestamp: number
  ) => {
    const newConnections: Connection[] = [];

    // Filter particles to only those visible
    const visibleParticles = particles.filter(p => p.isVisible);

    for (let a = 0; a < visibleParticles.length; a++) {
      const particleA = visibleParticles[a];
      if (particleA instanceof ParticleAtCollision) continue;

      for (let b = a + 1; b < visibleParticles.length; b++) {
        const particleB = visibleParticles[b];
        if (particleB instanceof ParticleAtCollision) continue;

        const posA = VectorMath.project(particleA.position, width, height);
        const posB = VectorMath.project(particleB.position, width, height);

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.hypot(dx, dy);

        if (distance > MAX_CONNECTION_DISTANCE || distance >= config.particleConnectionDistance) {
          continue;
        }

        // Check if this connection already exists
        const existingConnection = connections.find(
          (conn) =>
            (conn.particleA === particleA && conn.particleB === particleB) ||
            (conn.particleA === particleB && conn.particleB === particleA)
        );

        if (existingConnection) {
          // Update existing connection
          const elapsed = timestamp - existingConnection.createdAt;
          existingConnection.opacity = Math.min(elapsed / existingConnection.duration, 1);
          newConnections.push(existingConnection);
        } else if (particleA.canCreateNewConnection(timestamp) && particleB.canCreateNewConnection(timestamp)) {
          // Create a new connection only if both particles are ready
          newConnections.push({
            particleA: particleA,
            particleB: particleB,
            createdAt: timestamp,
            duration: CONNECTION_ANIMATION_DURATION,
            opacity: 0, // Start fully transparent
          });
          particleA.incrementConnectionCount();
          particleB.incrementConnectionCount();
        }
      }
    }

    // Handle fade-out for obsolete connections
    const obsoleteConnections = connections.filter((conn) => {
      const stillExists = newConnections.some(
        (newConn) =>
          (newConn.particleA === conn.particleA && newConn.particleB === conn.particleB) ||
          (newConn.particleA === conn.particleB && newConn.particleB === conn.particleA)
      );
      return !stillExists;
    });

    obsoleteConnections.forEach((conn: Connection) => {
      if (conn.opacity > 0) {
        // Start fade-out
        conn.opacity = Math.max(conn.opacity - 0.01, 0);
        if (conn.opacity > 0) {
          newConnections.push(conn);
        } else {
          // Connection is fully faded out, decrement connection counts
          conn.particleA.decrementConnectionCount();
          conn.particleB.decrementConnectionCount();
        }
      }
    });

    // Replace the old connections with the new ones
    connections.length = 0;
    connections.push(...newConnections);

    // Draw connections
    connections.forEach((conn: Connection) => {
      const { particleA, particleB, opacity } = conn;

      // Only draw if opacity is greater than 0
      if (opacity > 0) {
        const posA = VectorMath.project(particleA.position, width, height);
        const posB = VectorMath.project(particleB.position, width, height);

        const rgbA = ColorManager.hexToRgb(particleA.color);
        const rgbB = ColorManager.hexToRgb(particleB.color);
        let connectionColor = `rgba(200, 100, 255, ${opacity * 0.7})`;

        if (rgbA && rgbB) {
          const blendedR = Math.floor((rgbA.r + rgbB.r) / 2);
          const blendedG = Math.floor((rgbA.g + rgbB.g) / 2);
          const blendedB = Math.floor((rgbA.b + rgbB.b) / 2);
          connectionColor = `rgba(${blendedR}, ${blendedG}, ${blendedB}, ${opacity * 0.7})`;
        }

        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
      }
    });
  };

  /**
   * Updates particle connections by applying small random velocity changes.
   */
  const updateParticleConnections = (particles: Particle[]) => {
    particles.forEach((particle) => {
      if (Math.random() < 0.05) {
        vec3.add(
          particle.velocity,
          particle.velocity,
          vec3.fromValues(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
          )
        );

        const speed = vec3.length(particle.velocity);
        if (speed > 0) {
          vec3.scale(particle.velocity, particle.velocity, 1 / speed);
        }
      }
    });
  };

  /**
   * Triggers a special animation effect at the specified coordinates.
   */
  const triggerSpecialAnimation = (x: number, y: number) => {
    isAnimationTriggered = true;
    animationProgress = 0;
    animationCenterX = x;
    animationCenterY = y;
  };

  triggerAnimation = triggerSpecialAnimation;

  /**
   * The main animation loop for CyberScape.
   */
  const animateCyberScape = (timestamp: number) => {
    const deltaTime = timestamp - lastFrameTime;
    if (deltaTime < config.frameTime) {
      animationFrameId = requestAnimationFrame(animateCyberScape);
      return;
    }
    lastFrameTime = timestamp;

    updateCanvasSize();
    ctx.clearRect(0, 0, width, height);

    updateHue();
    updateParticleConnections(particlesArray);
    updateParticleConnections(collisionParticlesArray);

    if (activeParticles < numberOfParticles && Math.random() < 0.1) {
      const newParticle = particlePool.getParticle(width, height);
      newParticle.setDelayedAppearance();
      particlesArray.push(newParticle);
      activeParticles++;
    }

    // Update and draw regular particles
    for (const particle of particlesArray) {
      if (particle.isReady()) {
        particle.update(
          isCursorOverCyberScape,
          mouseX,
          mouseY,
          width,
          height,
          shapesArray
        );
        particle.draw(ctx, mouseX, mouseY, width, height);
      } else {
        particle.updateDelay();
      }
    }

    // Update and draw collision particles
    for (const particle of collisionParticlesArray) {
      if (particle.isReady()) {
        particle.update();
        particle.draw(ctx, mouseX, mouseY, width, height);
      } else {
        particle.updateDelay();
      }
    }

    // Update and draw shapes
    const existingPositions = new Set<string>();
    for (const shape of shapesArray) {
      shape.update(
        isCursorOverCyberScape,
        mouseX,
        mouseY,
        width,
        height,
        particlesArray
      );
      if (shape.opacity > 0 && !shape.isExploded) {
        existingPositions.add(shape.getPositionKey());
        shape.draw(ctx, width, height);
      }
      if (shape.isFadedOut()) {
        shape.reset(existingPositions, width, height);
      }
      // Emit small particles from shapes
      if (Math.random() < 0.01) {
        const emittedParticle = particlePool.getParticle(width, height);
        vec3.copy(emittedParticle.position, shape.position);
        vec3.copy(emittedParticle.velocity, shape.velocity); // Ensure emitted particle's velocity matches shape
        emittedParticle.size = Math.random() * 1 + 0.5;
        emittedParticle.color = shape.color;
        emittedParticle.lifespan = 1000;
        emittedParticle.setDelayedAppearance();
        particlesArray.push(emittedParticle);
        activeParticles++;
      }
    }

    // Handle collisions, color blending, and forces using handler classes
    CollisionHandler.handleCollisions(
      shapesArray, // First argument: VectorShape[]
      (shapeA: VectorShape, shapeB: VectorShape) => {
        const now = Date.now();
        if (
          currentExplosions >= config.maxSimultaneousExplosions ||
          now - lastExplosionTime < config.explosionCooldown
        ) {
          return;
        }

        const collisionPos = vec3.create();
        vec3.add(collisionPos, shapeA.position, shapeB.position);
        vec3.scale(collisionPos, collisionPos, 0.5);

        if (
          collisionParticlesArray.length + config.explosionParticlesToEmit <=
            config.maxExplosionParticles &&
          explosionParticlesCount + config.explosionParticlesToEmit <=
            config.maxExplosionParticles
        ) {
          for (let i = 0; i < config.explosionParticlesToEmit; i++) {
            const particle = particlePool.getCollisionParticle(
              vec3.clone(collisionPos),
              () => {
                explosionParticlesCount--;
                currentExplosions = Math.max(0, currentExplosions - 1);
                particlePool.returnCollisionParticle(particle);
              }
            ) as ParticleAtCollision;
            particle.lifespan = config.particleAtCollisionLifespan;
            particle.setFadeOutDuration(
              config.particleAtCollisionFadeOutDuration
            );
            collisionParticlesArray.push(particle);
            explosionParticlesCount++;
          }
          currentExplosions++;
          lastExplosionTime = now;
        }

        shapeA.explodeAndRespawn();
        shapeB.explodeAndRespawn();
      },
      collisionParticlesArray // Third argument: ParticleAtCollision[]
    );

    ColorBlender.blendColors(shapesArray);
    ForceHandler.applyForces(shapesArray);

    // Draw connections between shapes
    drawShapeConnections(ctx);

    // Connect regular particles with animation
    connectParticles(particlesArray, ctx, timestamp);

    // Remove expired regular particles
    for (let i = particlesArray.length - 1; i >= 0; i--) {
      if (particlesArray[i].opacity <= 0) {
        particlePool.returnParticle(particlesArray[i]);
        particlesArray.splice(i, 1);
      }
    }

    // Remove expired collision particles
    for (let i = collisionParticlesArray.length - 1; i >= 0; i--) {
      if (collisionParticlesArray[i].opacity <= 0) {
        // The callback in ParticleAtCollision.handleExpire will handle the removal
        collisionParticlesArray.splice(i, 1);
      }
    }

    // Apply glitch effects
    glitchManager.handleGlitchEffects(ctx, width, height, timestamp);

    // Handle triggered animations
    if (isAnimationTriggered) {
      animationProgress += 0.02;
      if (animationProgress >= 1) {
        isAnimationTriggered = false;
        animationProgress = 0;
      } else {
        const intensity = Math.sin(animationProgress * Math.PI);
        datastreamEffect.draw(
          ctx,
          width,
          height,
          animationCenterX,
          animationCenterY,
          intensity,
          hue,
          animationProgress
        );
      }
    }

    animationFrameId = requestAnimationFrame(animateCyberScape);
  };

  /**
   * Draws connections between shapes.
   */
  const drawShapeConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;

    for (let i = 0; i < shapesArray.length; i++) {
      for (let j = i + 1; j < shapesArray.length; j++) {
        const shapeA = shapesArray[i];
        const shapeB = shapesArray[j];
        const distance = vec3.distance(shapeA.position, shapeB.position);

        if (distance < config.shapeConnectionDistance) {
          const projectedA = VectorMath.project(shapeA.position, width, height);
          const projectedB = VectorMath.project(shapeB.position, width, height);

          ctx.beginPath();
          ctx.moveTo(projectedA.x, projectedA.y);
          ctx.lineTo(projectedB.x, projectedB.y);
          ctx.stroke();
        }
      }
    }
  };

  animateCyberScape(0);

  /**
   * Cleanup function to remove event listeners and cancel animations.
   */
  const cleanup = () => {
    window.removeEventListener("resize", handleResize);
    resizeObserver.disconnect();
    navElement.removeEventListener("pointerenter", handlePointerEnter);
    navElement.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("mousemove", throttledHandleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };

  return cleanup;
};

/**
 * Helper function for throttling function calls.
 * @param func - The function to throttle.
 * @param limit - The time limit in milliseconds.
 * @returns A throttled version of the input function.
 */
function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number
) {
  let inThrottle: boolean;
  return (...args: T) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}