// app/cyberscape/CyberScape.ts

import { CyberScapeConfig } from "./CyberScapeConfig";
import { ParticlePool } from "./utils/ParticlePool";
import { ColorManager } from "./utils/ColorManager";
import { VectorMath } from "./utils/VectorMath";
import { ShapeFactory } from "./shapes/ShapeFactory";
import { Particle } from "./particles/Particle";
import { ParticleAtCollision } from "./particles/ParticleAtCollision";
import { VectorShape } from "./shapes/VectorShape";
import {
  applyChromaticAberration,
  applyCRTEffect,
  applyGlitchEffect,
} from "./glitchEffects";

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

  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  let isCursorOverCyberScape = false;
  let mouseX = 0;
  let mouseY = 0;
  let hue = 210;
  let animationFrameId: number;
  let lastFrameTime = 0;

  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  let numberOfParticles = config.calculateParticleCount(width, height);
  let numberOfShapes = config.getShapeCount(width);

  let activeParticles = 0;
  let isGlitching = false;
  let lastGlitchTime = 0;
  let glitchIntensity = 0;
  let glitchInterval = config.glitchIntervalMin;
  let glitchDuration = config.glitchDurationMin;

  let explosionParticlesCount = 0;
  let lastExplosionTime = 0;
  let currentExplosions = 0;

  let isAnimationTriggered = false;
  let animationProgress = 0;
  let animationCenterX = 0;
  let animationCenterY = 0;

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
    shapesArray.length = numberOfShapes;
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
   * Connects particles by drawing lines between those that are within a certain distance.
   */
  const connectParticles = (
    particles: Particle[],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.lineWidth = 1;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        if (
          particles[a] instanceof ParticleAtCollision ||
          particles[b] instanceof ParticleAtCollision
        ) {
          continue;
        }

        const distance = VectorMath.distance(
          { x: particles[a].x, y: particles[a].y, z: particles[a].z },
          { x: particles[b].x, y: particles[b].y, z: particles[b].z }
        );

        if (distance < config.particleConnectionDistance) {
          const alpha =
            (1 - distance / config.particleConnectionDistance) * 0.7;
          ctx.strokeStyle = `rgba(200, 100, 255, ${alpha})`;

          const posA = VectorMath.project(
            particles[a].x,
            particles[a].y,
            particles[a].z,
            width,
            height
          );
          const posB = VectorMath.project(
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
   * Updates particle connections by applying small random velocity changes.
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

  /**
   * Handles shape collisions and creates explosion particles.
   */
  const handleShapeCollision = (shapeA: VectorShape, shapeB: VectorShape) => {
    const now = Date.now();
    if (
      currentExplosions >= config.maxSimultaneousExplosions ||
      now - lastExplosionTime < config.explosionCooldown
    ) {
      return;
    }

    const collisionX = (shapeA.position.x + shapeB.position.x) / 2;
    const collisionY = (shapeA.position.y + shapeB.position.y) / 2;
    const collisionZ = (shapeA.position.z + shapeB.position.z) / 2;

    if (
      particlesArray.length + config.explosionParticlesToEmit <=
        config.particlePoolSize &&
      explosionParticlesCount + config.explosionParticlesToEmit <=
        config.maxExplosionParticles
    ) {
      for (let i = 0; i < config.explosionParticlesToEmit; i++) {
        const particle = particlePool.getParticle(
          width,
          height,
          true
        ) as ParticleAtCollision;
        particle.init(collisionX, collisionY, collisionZ, () => {
          explosionParticlesCount--;
          currentExplosions = Math.max(0, currentExplosions - 1);
        });
        particle.lifespan = 2000;
        particle.setFadeOutDuration(2000);
        particlesArray.push(particle);
        explosionParticlesCount++;
      }
      currentExplosions++;
      lastExplosionTime = now;
    }

    shapeA.explodeAndRespawn();
    shapeB.explodeAndRespawn();
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateHue();
    updateParticleConnections(particlesArray);

    if (activeParticles < numberOfParticles && Math.random() < 0.1) {
      const newParticle = particlePool.getParticle(width, height);
      newParticle.setDelayedAppearance();
      particlesArray.push(newParticle);
      activeParticles++;
    }

    // Update and draw particles
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
        emittedParticle.x = shape.position.x;
        emittedParticle.y = shape.position.y;
        emittedParticle.z = shape.position.z;
        emittedParticle.size = Math.random() * 1 + 0.5;
        emittedParticle.color = shape.color;
        emittedParticle.lifespan = 1000;
        particlesArray.push(emittedParticle);
      }
    }

    // Handle collisions, color blending, and forces
    handleCollisions();
    blendColors();
    applyForces();

    // Draw connections
    drawShapeConnections(ctx);
    connectParticles(particlesArray, ctx);

    // Remove expired particles
    for (let i = particlesArray.length - 1; i >= 0; i--) {
      if (particlesArray[i].opacity <= 0) {
        particlePool.returnParticle(particlesArray[i]);
        particlesArray.splice(i, 1);
      }
    }

    // Apply glitch effects
    handleGlitchEffects(ctx);

    // Handle triggered animations
    if (isAnimationTriggered) {
      animationProgress += 0.02;
      if (animationProgress >= 1) {
        isAnimationTriggered = false;
        animationProgress = 0;
      } else {
        const intensity = Math.sin(animationProgress * Math.PI);
        drawDatastreamEffect(
          ctx,
          animationCenterX,
          animationCenterY,
          intensity,
          hue
        );
      }
    }

    // Draw explosion particle connections
    const explosionParticles = particlesArray.filter(
      (p) => p instanceof ParticleAtCollision
    ) as ParticleAtCollision[];
    if (explosionParticles.length > 0) {
      ParticleAtCollision.drawConnections(
        ctx,
        explosionParticles,
        width,
        height,
        shapesArray
      );
    }

    animationFrameId = requestAnimationFrame(animateCyberScape);
  };

  /**
   * Handles collisions between shapes.
   */
  const handleCollisions = () => {
    for (let i = 0; i < shapesArray.length; i++) {
      for (let j = i + 1; j < shapesArray.length; j++) {
        const shapeA = shapesArray[i];
        const shapeB = shapesArray[j];
        const distance = VectorMath.distance(shapeA.position, shapeB.position);

        if (distance < shapeA.radius + shapeB.radius) {
          handleShapeCollision(shapeA, shapeB);
        }
      }
    }
  };

  /**
   * Blends colors between nearby shapes.
   */
  const blendColors = () => {
    shapesArray.forEach((shape) => {
      const nearbyShapes = shapesArray.filter(
        (otherShape) =>
          VectorMath.distance(shape.position, otherShape.position) <
          config.shapeConnectionDistance
      );
      if (nearbyShapes.length > 0) {
        const averageColor = ColorManager.averageColors(
          nearbyShapes.map((s) => s.color)
        );
        shape.color = ColorManager.blendColors(shape.color, averageColor, 0.1);
      }
    });
  };

  /**
   * Applies attraction and repulsion forces between shapes.
   */
  const applyForces = () => {
    for (let i = 0; i < shapesArray.length; i++) {
      for (let j = i + 1; j < shapesArray.length; j++) {
        const shapeA = shapesArray[i];
        const shapeB = shapesArray[j];
        const distance = VectorMath.distance(shapeA.position, shapeB.position);

        if (distance < config.shapeConnectionDistance) {
          const force =
            (config.shapeConnectionDistance - distance) /
            config.shapeConnectionDistance;
          const forceX =
            (shapeB.position.x - shapeA.position.x) * force * 0.00001;
          const forceY =
            (shapeB.position.y - shapeA.position.y) * force * 0.00001;
          const forceZ =
            (shapeB.position.z - shapeA.position.z) * force * 0.00001;

          shapeA.velocity.x += forceX;
          shapeA.velocity.y += forceY;
          shapeA.velocity.z += forceZ;
          shapeB.velocity.x -= forceX;
          shapeB.velocity.y -= forceY;
          shapeB.velocity.z -= forceZ;
        }
      }
    }
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
        const distance = VectorMath.distance(shapeA.position, shapeB.position);

        if (distance < config.shapeConnectionDistance) {
          const projectedA = VectorMath.project(
            shapeA.position.x,
            shapeA.position.y,
            shapeA.position.z,
            width,
            height
          );
          const projectedB = VectorMath.project(
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
  };

  /**
   * Handles glitch effects.
   */
  const handleGlitchEffects = (ctx: CanvasRenderingContext2D) => {
    const now = Date.now();
    if (!isGlitching && now - lastGlitchTime > glitchInterval) {
      isGlitching = true;
      glitchIntensity =
        Math.random() *
          (config.glitchIntensityMax - config.glitchIntensityMin) +
        config.glitchIntensityMin;
      glitchDuration =
        Math.random() * (config.glitchDurationMax - config.glitchDurationMin) +
        config.glitchDurationMin;
      lastGlitchTime = now;
      glitchInterval =
        Math.random() * (config.glitchIntervalMax - config.glitchIntervalMin) +
        config.glitchIntervalMin;
    }

    if (isGlitching) {
      const glitchProgress = (now - lastGlitchTime) / glitchDuration;
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
  };

  /**
   * Draws the datastream effect.
   */
  const drawDatastreamEffect = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number
  ) => {
    // Draw expanding circles
    ctx.save();
    ctx.globalAlpha = intensity * 0.5;
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = 2;
    const maxRadius = Math.max(width, height) * 0.4;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const radius = intensity * maxRadius * (1 - i * 0.2);
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();

    // Draw noise effect
    ctx.save();
    ctx.globalAlpha = intensity * 0.2;
    const noiseSize = 4;
    const noiseRadius = Math.max(width, height) * 0.2;
    for (
      let x = centerX - noiseRadius;
      x < centerX + noiseRadius;
      x += noiseSize
    ) {
      for (
        let y = centerY - noiseRadius;
        y < centerY + noiseRadius;
        y += noiseSize
      ) {
        if (
          Math.random() < 0.5 &&
          VectorMath.distance(
            { x, y, z: 0 },
            { x: centerX, y: centerY, z: 0 }
          ) <= noiseRadius
        ) {
          ctx.fillStyle = `hsl(${hue}, 100%, ${Math.random() * 50 + 50}%)`;
          ctx.fillRect(x, y, noiseSize, noiseSize);
        }
      }
    }
    ctx.restore();

    // Emit datastream particles
    if (animationProgress < 0.1) {
      const particlesToEmit = Math.min(
        10,
        config.maxDatastreamParticles - explosionParticlesCount
      );
      for (let i = 0; i < particlesToEmit; i++) {
        const particle = particlePool.getParticle(
          width,
          height,
          true
        ) as ParticleAtCollision;
        particle.init(centerX, centerY, 0, () => {
          explosionParticlesCount--;
        });
        particle.lifespan = config.datastreamParticleLifespan;
        particle.setFadeOutDuration(config.datastreamFadeOutDuration);
        particlesArray.push(particle);
        explosionParticlesCount++;
      }
    }

    // Affect nearby shapes
    shapesArray.forEach((shape) => {
      shape.rotationSpeed = {
        x: intensity * 0.1,
        y: intensity * 0.1,
        z: intensity * 0.1,
      };
      const dx = centerX - shape.position.x;
      const dy = centerY - shape.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = (intensity * 5) / (distance + 1);
      shape.velocity.x += dx * force * 0.01;
      shape.velocity.y += dy * force * 0.01;
    });

    // Draw energy lines
    ctx.save();
    ctx.globalAlpha = intensity * 0.7;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    ctx.lineWidth = 1;
    const energyLineCount = 20;
    ctx.beginPath();
    for (let i = 0; i < energyLineCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const length = Math.random() * maxRadius * 0.8;
      const startX = centerX + Math.cos(angle) * length * 0.2;
      const startY = centerY + Math.sin(angle) * length * 0.2;
      const endX = centerX + Math.cos(angle) * length;
      const endY = centerY + Math.sin(angle) * length;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
    ctx.restore();
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
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
