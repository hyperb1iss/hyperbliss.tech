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

// Frame rate control
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

// Particle pool configuration
const PARTICLE_POOL_SIZE = 1000;
const particlePool: Particle[] = [];

// Initialize particle pool
for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
  particlePool.push(new Particle(new Set<string>(), 0, 0));
}

/**
 * Retrieves a particle from the pool or creates a new one if the pool is empty.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param isCollision - Whether the particle is for a collision effect.
 * @returns A Particle or ParticleAtCollision instance.
 */
function getParticleFromPool(
  width: number,
  height: number,
  isCollision: boolean = false
): Particle | ParticleAtCollision {
  if (particlePool.length > 0) {
    const particle = particlePool.pop()!;
    if (isCollision) {
      return new ParticleAtCollision(0, 0, 0, () => {});
    }
    particle.reset(new Set<string>(), width, height);
    return particle;
  }
  return isCollision
    ? new ParticleAtCollision(0, 0, 0, () => {})
    : new Particle(new Set<string>(), width, height);
}

/**
 * Returns a particle to the pool if there's space.
 * @param particle - The particle to return to the pool.
 */
function returnParticleToPool(particle: Particle) {
  if (particlePool.length < PARTICLE_POOL_SIZE) {
    particlePool.push(particle);
  }
}

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

  let animationFrameId: number;
  let lastFrameTime = 0;

  let isCursorOverCyberScape = false;
  let mouseX = 0;
  let mouseY = 0;

  let hue = 210;

  const updateHue = () => {
    hue = (hue + 0.2) % 360;
    if (
      !CYBERPUNK_HUE_RANGES.some(
        (range) => hue >= range.start && hue <= range.end
      )
    ) {
      hue = getRandomCyberpunkHue();
    }
  };

  const handleResize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    adjustShapeCounts();
  };
  window.addEventListener("resize", handleResize);

  const handlePointerEnter = () => {
    isCursorOverCyberScape = true;
  };

  const handlePointerLeave = () => {
    isCursorOverCyberScape = false;
  };

  navElement.addEventListener("pointerenter", handlePointerEnter);
  navElement.addEventListener("pointerleave", handlePointerLeave);

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

  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverCyberScape) return;
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left - width / 2;
    mouseY = event.clientY - rect.top - height / 2;
  };
  const throttledHandleMouseMove = throttle(handleMouseMove, 16);
  window.addEventListener("mousemove", throttledHandleMouseMove);

  const particlesArray: Particle[] = [];
  const shapesArray: VectorShape[] = [];
  let numberOfParticles = Math.floor((width * height) / 2500);
  let numberOfShapes = 6;

  let activeParticles = 0;

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

  adjustShapeCounts();

  /**
   * Connects particles by drawing lines between those that are within a certain distance.
   * Explosion particles (`ParticleAtCollision`) are excluded to prevent blob formations.
   */
  const connectParticles = (
    particles: Particle[],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.lineWidth = 1;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        // Skip connection if either particle is a ParticleAtCollision to avoid blob formation
        if (
          particles[a] instanceof ParticleAtCollision ||
          particles[b] instanceof ParticleAtCollision
        ) {
          continue;
        }

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

  let isGlitching = false;
  let lastGlitchTime = 0;
  let glitchIntensity = 0;
  let glitchInterval = 5000;
  let glitchDuration = 200;

  /**
   * Maximum number of explosion particles allowed at any given time.
   */
  const MAX_EXPLOSION_PARTICLES = 200;

  /**
   * Current count of active explosion particles.
   */
  let explosionParticlesCount = 0;

  /**
   * Maximum number of simultaneous explosions allowed.
   */
  const MAX_SIMULTANEOUS_EXPLOSIONS = 3;

  /**
   * Cooldown period (in milliseconds) between explosions.
   */
  const EXPLOSION_COOLDOWN = 2000;

  /**
   * Timestamp of the last explosion.
   */
  let lastExplosionTime = 0;

  /**
   * Current count of active explosions.
   */
  let currentExplosions = 0;

  /**
   * Handles shape collisions and creates explosion particles.
   * @param shapeA - The first shape involved in the collision.
   * @param shapeB - The second shape involved in the collision.
   */
  const handleShapeCollision = (shapeA: VectorShape, shapeB: VectorShape) => {
    const now = Date.now();
    if (
      currentExplosions >= MAX_SIMULTANEOUS_EXPLOSIONS ||
      now - lastExplosionTime < EXPLOSION_COOLDOWN
    ) {
      return; // Skip explosion if too many are active or if in cooldown
    }

    const collisionX = (shapeA.position.x + shapeB.position.x) / 2;
    const collisionY = (shapeA.position.y + shapeB.position.y) / 2;
    const collisionZ = (shapeA.position.z + shapeB.position.z) / 2;

    const particlesToEmit = 10;

    if (
      particlesArray.length + particlesToEmit <= PARTICLE_POOL_SIZE &&
      explosionParticlesCount + particlesToEmit <= MAX_EXPLOSION_PARTICLES
    ) {
      for (let i = 0; i < particlesToEmit; i++) {
        const particle = getParticleFromPool(
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

  let isAnimationTriggered = false;
  let animationProgress = 0;
  let animationCenterX = 0;
  let animationCenterY = 0;

  /**
   * Triggers a special animation effect at the specified coordinates.
   * @param x - The x-coordinate of the animation center.
   * @param y - The y-coordinate of the animation center.
   */
  const triggerSpecialAnimation = (x: number, y: number) => {
    isAnimationTriggered = true;
    animationProgress = 0;
    animationCenterX = x;
    animationCenterY = y;
  };

  triggerAnimation = triggerSpecialAnimation;

  // Add these new constants at the top of the file
  const MAX_DATASTREAM_PARTICLES = 100;
  const DATASTREAM_PARTICLE_LIFESPAN = 2000; // 2 seconds
  const DATASTREAM_FADE_OUT_DURATION = 500; // 0.5 seconds

  /**
   * The main animation loop for CyberScape.
   * @param timestamp - The current timestamp of the animation frame.
   */
  const animateCyberScape = (timestamp: number) => {
    const deltaTime = timestamp - lastFrameTime;
    if (deltaTime < FRAME_TIME) {
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
      const newParticle = getParticleFromPool(width, height);
      newParticle.setDelayedAppearance();
      particlesArray.push(newParticle);
      activeParticles++;
    }

    // Update particles
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

    // Update shapes
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
        const emittedParticle = shape.emitSmallParticle();
        particlesArray.push(emittedParticle);
      }
    }

    VectorShape.handleCollisions(shapesArray, handleShapeCollision);
    VectorShape.handleColorBlending(shapesArray);
    VectorShape.handleAttractionRepulsion(shapesArray);

    VectorShape.drawConnections(ctx, shapesArray, width, height);

    connectParticles(particlesArray, ctx);

    for (let i = particlesArray.length - 1; i >= 0; i--) {
      if (particlesArray[i].opacity <= 0) {
        returnParticleToPool(particlesArray[i]);
        particlesArray.splice(i, 1);
      }
    }

    const now = Date.now();
    if (!isGlitching && now - lastGlitchTime > glitchInterval) {
      isGlitching = true;
      glitchIntensity = Math.random() * 0.7 + 0.3;
      glitchDuration = Math.random() * 300 + 100;
      lastGlitchTime = now;
      glitchInterval = Math.random() * 5000 + 5000;
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
          hue,
          width,
          height
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
   * Draws the datastream effect.
   * @param ctx - The 2D rendering context of the canvas.
   * @param centerX - The x-coordinate of the effect center.
   * @param centerY - The y-coordinate of the effect center.
   * @param intensity - The intensity of the effect (0-1).
   * @param hue - The base hue for the effect colors.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   */
  const drawDatastreamEffect = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    width: number,
    height: number
  ) => {
    // Draw expanding circles
    drawExpandingCircles(ctx, centerX, centerY, intensity, hue, width, height);

    // Draw noise effect
    drawNoiseEffect(ctx, centerX, centerY, intensity, hue, width, height);

    // Emit particles
    emitDatastreamParticles(centerX, centerY /*, intensity*/);

    // Affect nearby shapes
    affectNearbyShapes(centerX, centerY, intensity);

    // Apply glitch effects
    applyGlitchEffects(ctx, intensity, width, height);

    // Draw energy lines
    drawEnergyLines(ctx, centerX, centerY, intensity, hue, width, height);
  };

  const drawExpandingCircles = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    width: number,
    height: number
  ) => {
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
  };

  const drawNoiseEffect = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    width: number,
    height: number
  ) => {
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
          Math.hypot(x - centerX, y - centerY) <= noiseRadius
        ) {
          ctx.fillStyle = `hsl(${hue}, 100%, ${Math.random() * 50 + 50}%)`;
          ctx.fillRect(x, y, noiseSize, noiseSize);
        }
      }
    }
    ctx.restore();
  };

  const emitDatastreamParticles = (centerX: number, centerY: number) => {
    if (animationProgress < 0.1) {
      const particlesToEmit = Math.min(
        10,
        MAX_DATASTREAM_PARTICLES - explosionParticlesCount
      );
      for (let i = 0; i < particlesToEmit; i++) {
        const particle = getParticleFromPool(
          width,
          height,
          true
        ) as ParticleAtCollision;
        particle.init(centerX, centerY, 0, () => {
          explosionParticlesCount--;
        });
        particle.lifespan = DATASTREAM_PARTICLE_LIFESPAN;
        particle.setFadeOutDuration(DATASTREAM_FADE_OUT_DURATION);
        particlesArray.push(particle);
        explosionParticlesCount++;
      }
    }
  };

  const affectNearbyShapes = (
    centerX: number,
    centerY: number,
    intensity: number
  ) => {
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
  };

  const applyGlitchEffects = (
    ctx: CanvasRenderingContext2D,
    intensity: number,
    width: number,
    height: number
  ) => {
    if (Math.random() < intensity * 0.4) {
      applyGlitchEffect(ctx, width, height, intensity * 0.7);
      applyChromaticAberration(ctx, width, height, intensity * 15);
    }
  };

  const drawEnergyLines = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    intensity: number,
    hue: number,
    width: number,
    height: number
  ) => {
    ctx.save();
    ctx.globalAlpha = intensity * 0.7;
    ctx.strokeStyle = `hsl(${(hue + 180) % 360}, 100%, 50%)`;
    ctx.lineWidth = 1;
    const maxRadius = Math.max(width, height) * 0.4;
    ctx.beginPath();
    for (let i = 0; i < 20; i++) {
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
    navElement.removeEventListener("pointerenter", handlePointerEnter);
    navElement.removeEventListener("pointerleave", handlePointerLeave);
    window.removeEventListener("mousemove", throttledHandleMouseMove);
    cancelAnimationFrame(animationFrameId);
  };

  return cleanup;
};
