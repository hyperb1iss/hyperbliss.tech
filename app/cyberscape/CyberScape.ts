// app/cyberscape/CyberScape.ts

import { mat4, vec3 } from 'gl-matrix'
import { CyberScapeConfig } from './CyberScapeConfig'
import { DatastreamEffect } from './effects/DatastreamEffect'
import { GlitchManager } from './effects/GlitchManager'
import { CollisionHandler } from './handlers/CollisionHandler'
import { ColorBlender } from './handlers/ColorBlender'
import { ForceHandler } from './handlers/ForceHandler'
import { Particle } from './particles/Particle'
import { ParticleAtCollision } from './particles/ParticleAtCollision'
import { ShapeFactory } from './shapes/ShapeFactory'
import { VectorShape } from './shapes/VectorShape'
import { ColorManager } from './utils/ColorManager'
import { FrustumCuller } from './utils/FrustumCuller'
import { Octree, OctreeObject } from './utils/Octree'
import { ParticleConnector } from './utils/ParticleConnector'
import { ParticlePool } from './utils/ParticlePool'
import { PerformanceMonitor } from './utils/PerformanceMonitor'
import { ScreenSizeManager } from './utils/ScreenSizeManager'
import { VectorMath } from './utils/VectorMath'

declare global {
  interface Window {
    cyberScapePerformance?: (command: string) => void
  }
}

/**
 * Function to trigger the CyberScape animation at specific coordinates.
 * This is set up in the initialization and can be called externally.
 */
let triggerAnimation: ((x: number, y: number) => void) | null = null

/**
 * Triggers the CyberScape animation at the specified coordinates.
 * @param x - The x-coordinate of the animation trigger point.
 * @param y - The y-coordinate of the animation trigger point.
 */
export const triggerCyberScapeAnimation = (x: number, y: number) => {
  if (triggerAnimation) {
    triggerAnimation(x, y)
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
  _logoElement: HTMLAnchorElement,
  navElement: HTMLElement,
) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return () => {}

  const config = CyberScapeConfig.getInstance()
  const particlePool = new ParticlePool(config.particlePoolSize)
  CollisionHandler.initialize(particlePool)

  let width = canvas.offsetWidth
  let height = canvas.offsetHeight
  let isCursorOverCyberScape = false
  let mouseX = 0
  let mouseY = 0
  let hue = 210
  let animationFrameId: number
  let lastFrameTime = performance.now()

  const shapesArray: VectorShape[] = []
  const particlesArray: Particle[] = []
  const collisionParticlesArray: ParticleAtCollision[] = []
  let numberOfParticles = config.calculateParticleCount(width, height)
  let numberOfShapes = config.getShapeCount(width)

  let activeParticles = 0
  let explosionParticlesCount = 0
  let lastExplosionTime = 0
  let currentExplosions = 0

  let isAnimationTriggered = false
  let animationProgress = 0
  let animationCenterX = 0
  let animationCenterY = 0

  const glitchManager = new GlitchManager()
  const datastreamEffect = new DatastreamEffect(particlePool, particlesArray, shapesArray)

  const particleConnector = new ParticleConnector()

  const performanceMonitor = new PerformanceMonitor()

  const octree = new Octree({
    max: [width / 2, height / 2, 300],
    min: [-width / 2, -height / 2, -300],
  })

  // Pre-allocated objects for particle grid distribution (avoid per-frame allocations)
  const GRID_SIZE = 4
  const particleGrid: number[][] = Array(GRID_SIZE)
    .fill(0)
    .map(() => Array(GRID_SIZE).fill(0))
  const cellsWithCounts: Array<{ count: number; x: number; y: number }> = []
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cellsWithCounts.push({ count: 0, x, y })
    }
  }

  // Pre-allocated vectors for anti-clustering (avoid per-particle allocations)
  const clusterQueryMin: vec3 = vec3.create()
  const clusterQueryMax: vec3 = vec3.create()
  const clusterAvgPosition: vec3 = vec3.create()
  const clusterAwayVector: vec3 = vec3.create()
  const frustumCuller = new FrustumCuller()

  let recentlyExpiredParticles = 0

  /**
   * Updates the canvas size based on the navigation element's dimensions and scales it for performance.
   */
  const updateCanvasSize = () => {
    const { width: newWidth, height: newHeight } = navElement.getBoundingClientRect()

    const screenSize = ScreenSizeManager.getScreenSize(newWidth, newHeight)

    let canvasScaleFactor = 1

    if (screenSize === 'mobile') {
      canvasScaleFactor = window.devicePixelRatio || 1
    } else if (screenSize === 'widescreen') {
      canvasScaleFactor = 1.5 // Increase scale factor for widescreen
    }

    const scaledWidth = newWidth * canvasScaleFactor
    const scaledHeight = newHeight * canvasScaleFactor

    if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
      canvas.width = scaledWidth
      canvas.height = scaledHeight
      canvas.style.width = `${newWidth}px`
      canvas.style.height = `${newHeight}px`
      ctx.resetTransform()
      ctx.scale(canvasScaleFactor, canvasScaleFactor)
      width = newWidth
      height = newHeight
    }
  }

  /**
   * Handles window resize events and updates canvas and shape counts.
   */
  const handleResize = () => {
    const oldWidth = width
    const oldHeight = height

    updateCanvasSize()
    adjustShapeCounts()
    adjustParticleCounts()

    // Update octree bounds
    octree.updateBounds({
      max: [width / 2, height / 2, 300],
      min: [-width / 2, -height / 2, -300],
    })

    // Update config canvas size
    config.updateCanvasSize(width, height)

    // Adjust particle positions if the canvas size has changed
    if (width !== oldWidth || height !== oldHeight) {
      const widthRatio = width / oldWidth
      const heightRatio = height / oldHeight
      particlesArray.forEach((particle) => {
        particle.position[0] *= widthRatio
        particle.position[1] *= heightRatio
      })
    }
  }

  window.addEventListener('resize', handleResize)
  const resizeObserver = new ResizeObserver(handleResize)
  resizeObserver.observe(navElement)

  const handlePointerEnter = () => {
    isCursorOverCyberScape = true
  }
  const handlePointerLeave = () => {
    isCursorOverCyberScape = false
  }
  navElement.addEventListener('pointerenter', handlePointerEnter)
  navElement.addEventListener('pointerleave', handlePointerLeave)

  /**
   * Handles mouse movement and updates cursor position.
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isCursorOverCyberScape) return
    const rect = canvas.getBoundingClientRect()
    mouseX = event.clientX - rect.left - width / 2
    mouseY = event.clientY - rect.top - height / 2
  }
  const throttledHandleMouseMove = throttle(handleMouseMove, 16)
  window.addEventListener('mousemove', throttledHandleMouseMove)

  /**
   * Adjusts the number of shapes based on the current configuration and screen size.
   */
  const adjustShapeCounts = () => {
    const screenSize = ScreenSizeManager.getScreenSize(width, height)
    let shapeFactor = 1

    switch (screenSize) {
      case 'mobile':
        shapeFactor = 0.5
        break
      case 'desktop':
        shapeFactor = 1
        break
      case 'widescreen':
        shapeFactor = 1.5
        break
    }

    numberOfShapes = Math.floor(config.getShapeCount(width) * shapeFactor)

    const existingPositions = new Set<string>()
    while (shapesArray.length < numberOfShapes) {
      const shapeType = ['cube', 'pyramid', 'tetrahedron', 'octahedron', 'dodecahedron'][shapesArray.length % 5]
      const newShape = ShapeFactory.createShape(shapeType, existingPositions, width, height)

      // Ensure shapes are initialized on-screen for all devices
      newShape.position[0] = Math.random() * width - width / 2
      newShape.position[1] = Math.random() * height - height / 2
      newShape.position[2] = Math.random() * 200 - 100

      // Adjust the position to ensure it's within the visible area
      newShape.position[0] = Math.max(Math.min(newShape.position[0], width / 2 - 50), -width / 2 + 50)
      newShape.position[1] = Math.max(Math.min(newShape.position[1], height / 2 - 50), -height / 2 + 50)

      shapesArray.push(newShape)
    }
    // If there are more shapes than needed, remove the excess
    if (shapesArray.length > numberOfShapes) {
      shapesArray.length = numberOfShapes
    }
  }

  // Add this new function
  const adjustParticleCounts = () => {
    const screenSize = ScreenSizeManager.getScreenSize(width, height)
    let particleFactor = 1

    switch (screenSize) {
      case 'mobile':
        particleFactor = 0.3
        break
      case 'desktop':
        particleFactor = 0.7
        break
      case 'widescreen':
        particleFactor = 1
        break
    }

    const newParticleCount = Math.floor(config.calculateParticleCount(width, height) * particleFactor)

    // Adjust the minimum and maximum number of particles
    numberOfParticles = Math.max(
      Math.min(newParticleCount, screenSize === 'mobile' ? 50 : screenSize === 'desktop' ? 100 : 150),
      20,
    )

    // Adjust the current particle count
    if (activeParticles > numberOfParticles) {
      // Instead of removing particles, just mark them as invisible
      for (let i = numberOfParticles; i < particlesArray.length; i++) {
        particlesArray[i].isVisible = false
      }
      activeParticles = numberOfParticles
    } else if (activeParticles < numberOfParticles) {
      // Add new particles only if needed
      const particlesToAdd = numberOfParticles - activeParticles
      for (let i = 0; i < particlesToAdd; i++) {
        const newParticle = particlePool.getParticle(width, height)
        newParticle.setDelayedAppearance()
        particlesArray.push(newParticle)
        activeParticles++
      }
    }

    // Ensure all active particles are set to visible
    for (let i = 0; i < Math.min(numberOfParticles, particlesArray.length); i++) {
      particlesArray[i].isVisible = true
    }
  }

  adjustShapeCounts()

  /**
   * Updates the hue for color transitions.
   */
  const updateHue = () => {
    hue = (hue + 0.2) % 360
    if (!ColorManager.isValidCyberpunkHue(hue)) {
      hue = ColorManager.getRandomCyberpunkHue()
    }
  }

  /**
   * Updates particle connections by applying small random velocity changes.
   */
  const updateParticleConnections = (particles: Particle[]) => {
    particles.forEach((particle) => {
      if (Math.random() < 0.05) {
        vec3.add(
          particle.velocity,
          particle.velocity,
          vec3.fromValues((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2),
        )

        const speed = vec3.length(particle.velocity)
        if (speed > 0) {
          vec3.scale(particle.velocity, particle.velocity, 1 / speed)
        }
      }
    })
  }

  /**
   * Triggers a special animation effect at the specified coordinates.
   */
  const triggerSpecialAnimation = (x: number, y: number) => {
    isAnimationTriggered = true
    animationProgress = 0
    const isMobile = width <= config.mobileWidthThreshold
    if (isMobile) {
      // Adjust coordinates for mobile devices
      const rect = canvas.getBoundingClientRect()
      animationCenterX = (x / rect.width) * width
      animationCenterY = (y / rect.height) * height
    } else {
      animationCenterX = x
      animationCenterY = y
    }
  }

  triggerAnimation = triggerSpecialAnimation

  // Add this function to check if a position is within the viewport
  const isWithinViewport = (x: number, y: number, z: number): boolean => {
    const projectedPoint = VectorMath.project([x, y, z], width, height)
    return projectedPoint.x >= 0 && projectedPoint.x <= width && projectedPoint.y >= 0 && projectedPoint.y <= height
  }

  /**
   * The main animation loop for CyberScape.
   */
  const animateCyberScape = (timestamp: number) => {
    const now = performance.now()
    const deltaTime = now - lastFrameTime

    if (deltaTime >= config.frameTime) {
      lastFrameTime = now - (deltaTime % config.frameTime)

      updateCanvasSize()
      ctx.clearRect(0, 0, width, height)

      updateHue()
      updateParticleConnections(particlesArray)
      updateParticleConnections(collisionParticlesArray)

      // Clear the octree before adding new objects
      octree.clear()

      // Update frustum culling
      const projectionMatrix = mat4.perspective(mat4.create(), Math.PI / 4, width / height, 0.1, 1000)
      const viewMatrix = mat4.lookAt(mat4.create(), [0, 0, 500], [0, 0, 0], [0, 1, 0])
      frustumCuller.updateFrustum(projectionMatrix, viewMatrix)

      // Adjust particle creation logic
      const baseCreationChance = 0.1
      const additionalChance = Math.min(recentlyExpiredParticles * 0.02, 0.2)
      const totalCreationChance = baseCreationChance + additionalChance

      // Replace the existing particle creation logic with this new implementation
      if (activeParticles < numberOfParticles && Math.random() < totalCreationChance) {
        const particlesToAdd = Math.min(
          2 + Math.floor(recentlyExpiredParticles / 5),
          numberOfParticles - activeParticles,
        )

        // Divide the screen into a grid (reuse pre-allocated arrays)
        const cellWidth = width / GRID_SIZE
        const cellHeight = height / GRID_SIZE

        // Reset and count particles in each cell (reuse pre-allocated grid)
        for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
            particleGrid[y][x] = 0
          }
        }
        particlesArray.forEach((particle) => {
          const cellX = Math.floor((particle.position[0] + width / 2) / cellWidth)
          const cellY = Math.floor((particle.position[1] + height / 2) / cellHeight)
          if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
            particleGrid[cellY][cellX]++
          }
        })

        // Update pre-allocated cellsWithCounts and sort
        for (let i = 0; i < cellsWithCounts.length; i++) {
          const cell = cellsWithCounts[i]
          cell.count = particleGrid[cell.y][cell.x]
        }
        cellsWithCounts.sort((a, b) => a.count - b.count)

        for (let i = 0; i < particlesToAdd; i++) {
          const cell = cellsWithCounts[i % cellsWithCounts.length]
          const newParticle = particlePool.getParticle(width, height)

          // Set position within the chosen cell
          newParticle.position[0] = cell.x * cellWidth + Math.random() * cellWidth - width / 2
          newParticle.position[1] = cell.y * cellHeight + Math.random() * cellHeight - height / 2
          newParticle.position[2] = Math.random() * 200 - 100

          newParticle.setDelayedAppearance()
          particlesArray.push(newParticle)
          activeParticles++
          cell.count++ // Update the count for this cell
        }

        recentlyExpiredParticles = Math.max(0, recentlyExpiredParticles - particlesToAdd)
      }

      // Prevent particle clustering (reuse pre-allocated vectors)
      const preventClustering = (particle: Particle) => {
        // Build query bounds using pre-allocated vectors
        vec3.set(clusterQueryMin, particle.position[0] - 20, particle.position[1] - 20, particle.position[2] - 20)
        vec3.set(clusterQueryMax, particle.position[0] + 20, particle.position[1] + 20, particle.position[2] + 20)

        const nearbyObjects = octree.query({
          max: clusterQueryMax,
          min: clusterQueryMin,
        })

        const nearbyParticles = nearbyObjects.filter((obj) => obj instanceof Particle) as Particle[]

        if (nearbyParticles.length > 20) {
          // Calculate the average position using pre-allocated vector
          vec3.set(clusterAvgPosition, 0, 0, 0)
          nearbyParticles.forEach((p) => {
            vec3.add(clusterAvgPosition, clusterAvgPosition, p.position)
          })
          vec3.scale(clusterAvgPosition, clusterAvgPosition, 1 / nearbyParticles.length)

          // Move the particle away from the cluster using pre-allocated vector
          vec3.sub(clusterAwayVector, particle.position, clusterAvgPosition)
          vec3.normalize(clusterAwayVector, clusterAwayVector)
          vec3.scale(clusterAwayVector, clusterAwayVector, 0.5)

          vec3.add(particle.velocity, particle.velocity, clusterAwayVector)
          vec3.normalize(particle.velocity, particle.velocity)
        }
      }

      // Update and draw regular particles
      for (let i = particlesArray.length - 1; i >= 0; i--) {
        const particle = particlesArray[i]
        if (particle.isReady()) {
          particle.update(isCursorOverCyberScape, mouseX, mouseY, width, height, shapesArray)
          preventClustering(particle) // Add this line to prevent clustering
          if (particle.isOutOfBounds(width, height)) {
            // Remove the particle if it's out of the viewport
            particle.setOffScreen() // Set the off-screen time
            particlePool.returnParticle(particle)
            particlesArray.splice(i, 1)
            activeParticles--
            recentlyExpiredParticles++
          } else {
            octree.insert(particle as unknown as OctreeObject)
            particle.draw(ctx, mouseX, mouseY, width, height)
          }
        } else {
          particle.updateDelay()
        }
      }

      // Update and draw collision particles
      for (let i = collisionParticlesArray.length - 1; i >= 0; i--) {
        const particle = collisionParticlesArray[i]
        if (particle.isReady()) {
          particle.update()
          if (!isWithinViewport(particle.position[0], particle.position[1], particle.position[2])) {
            // Remove the collision particle if it's out of the viewport
            particlePool.returnCollisionParticle(particle)
            collisionParticlesArray.splice(i, 1)
          } else {
            octree.insert(particle as unknown as OctreeObject)
            particle.draw(ctx, mouseX, mouseY, width, height)
          }
        } else {
          particle.updateDelay()
        }
      }

      // Update and draw shapes
      const existingPositions = new Set<string>()
      for (let i = shapesArray.length - 1; i >= 0; i--) {
        const shape = shapesArray[i]
        shape.update(isCursorOverCyberScape, mouseX, mouseY, width, height, particlesArray)
        if (shape.opacity > 0 && !shape.isExploded) {
          if (!isWithinViewport(shape.position[0], shape.position[1], shape.position[2])) {
            // Reset the shape if it's out of the viewport
            shape.reset(existingPositions, width, height)
          } else {
            existingPositions.add(shape.getPositionKey())
            octree.insert(shape as unknown as OctreeObject)
            shape.draw(ctx, width, height)
          }
        }
        if (shape.isFadedOut()) {
          shape.reset(existingPositions, width, height)
        }
        // Emit small particles from shapes
        if (Math.random() < 0.01) {
          const emittedParticle = particlePool.getParticle(width, height)
          vec3.copy(emittedParticle.position, shape.position)
          vec3.copy(emittedParticle.velocity, shape.velocity)
          emittedParticle.size = Math.random() * 1 + 0.5
          emittedParticle.color = shape.color
          emittedParticle.lifespan = 1000
          emittedParticle.setDelayedAppearance()
          particlesArray.push(emittedParticle)
          activeParticles++
        }
      }

      // Handle collisions using octree
      const handleCollisions = () => {
        const bounds = octree.getBounds()
        const allObjects = octree.query(bounds)
        CollisionHandler.handleCollisions(
          allObjects.filter((obj): obj is VectorShape => obj instanceof VectorShape),
          (shapeA: VectorShape, shapeB: VectorShape) => {
            const now = Date.now()
            if (
              currentExplosions >= config.maxSimultaneousExplosions ||
              now - lastExplosionTime < config.explosionCooldown
            ) {
              return
            }

            const collisionPos = vec3.create()
            vec3.add(collisionPos, shapeA.position, shapeB.position)
            vec3.scale(collisionPos, collisionPos, 0.5)

            if (
              collisionParticlesArray.length + config.explosionParticlesToEmit <= config.maxExplosionParticles &&
              explosionParticlesCount + config.explosionParticlesToEmit <= config.maxExplosionParticles
            ) {
              for (let i = 0; i < config.explosionParticlesToEmit; i++) {
                const particle = particlePool.getCollisionParticle(vec3.clone(collisionPos), () => {
                  explosionParticlesCount--
                  currentExplosions = Math.max(0, currentExplosions - 1)
                  particlePool.returnCollisionParticle(particle)
                }) as ParticleAtCollision
                particle.lifespan = config.particleAtCollisionLifespan
                particle.setFadeOutDuration(config.particleAtCollisionFadeOutDuration)
                collisionParticlesArray.push(particle)
                explosionParticlesCount++
              }
              currentExplosions++
              lastExplosionTime = now
            }

            shapeA.explodeAndRespawn()
            shapeB.explodeAndRespawn()
          },
          collisionParticlesArray,
        )
      }

      handleCollisions()

      ColorBlender.blendColors(shapesArray)
      ForceHandler.applyForces(shapesArray)

      // Draw connections between shapes
      drawShapeConnections(ctx)

      // Connect regular particles with animation
      particleConnector.connectParticles(particlesArray, ctx, timestamp, width, height)

      // Remove expired regular particles
      for (let i = particlesArray.length - 1; i >= 0; i--) {
        if (particlesArray[i].opacity <= 0) {
          particlePool.returnParticle(particlesArray[i])
          particlesArray.splice(i, 1)
        }
      }

      // Remove expired collision particles
      for (let i = collisionParticlesArray.length - 1; i >= 0; i--) {
        if (collisionParticlesArray[i].opacity <= 0) {
          // The callback in ParticleAtCollision.handleExpire will handle the removal
          collisionParticlesArray.splice(i, 1)
        }
      }

      // Apply glitch effects
      glitchManager.handleGlitchEffects(ctx, width, height, timestamp)

      // Handle triggered animations
      if (isAnimationTriggered) {
        animationProgress += 0.02
        if (animationProgress >= 1) {
          isAnimationTriggered = false
          animationProgress = 0
        } else {
          const intensity = Math.sin(animationProgress * Math.PI)
          datastreamEffect.draw(
            ctx,
            width,
            height,
            animationCenterX,
            animationCenterY,
            intensity,
            hue,
            animationProgress,
          )
        }
      }

      // Update the performance monitor
      performanceMonitor.update(timestamp, deltaTime)
    }

    // Decay the recentlyExpiredParticles counter over time
    recentlyExpiredParticles = Math.max(0, recentlyExpiredParticles - 0.1)

    // Schedule the next frame
    animationFrameId = requestAnimationFrame(animateCyberScape)
  }

  /**
   * Draws connections between shapes.
   * @param ctx - The canvas rendering context.
   */
  const drawShapeConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    for (let i = 0; i < shapesArray.length; i++) {
      for (let j = i + 1; j < shapesArray.length; j++) {
        const shapeA = shapesArray[i]
        const shapeB = shapesArray[j]
        const distance = vec3.distance(shapeA.position, shapeB.position)

        if (distance < config.shapeConnectionDistance) {
          const projectedA = VectorMath.project(shapeA.position, width, height)
          const projectedB = VectorMath.project(shapeB.position, width, height)

          ctx.beginPath()
          ctx.moveTo(projectedA.x, projectedA.y)
          ctx.lineTo(projectedB.x, projectedB.y)
          ctx.stroke()
        }
      }
    }
  }

  animateCyberScape(0)

  // Handle performance monitoring commands
  const handlePerformanceCommand = (command: string) => {
    switch (command) {
      case 'start':
        performanceMonitor.enable()
        console.log('Performance monitoring started')
        break
      case 'stop':
        performanceMonitor.disable()
        console.log('Performance monitoring stopped')
        break
      default:
        console.log('Unknown performance command')
    }
  }

  // Expose the handlePerformanceCommand function
  window.cyberScapePerformance = handlePerformanceCommand

  /**
   * Cleanup function to remove event listeners and cancel animations.
   */
  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
    resizeObserver.disconnect()
    navElement.removeEventListener('pointerenter', handlePointerEnter)
    navElement.removeEventListener('pointerleave', handlePointerLeave)
    window.removeEventListener('mousemove', throttledHandleMouseMove)
    cancelAnimationFrame(animationFrameId)
  }

  return cleanup
}

/**
 * Helper function for throttling function calls.
 * @param func - The function to throttle.
 * @param limit - The time limit in milliseconds.
 * @returns A throttled version of the input function.
 */
function throttle<T extends unknown[]>(func: (...args: T) => void, limit: number) {
  let inThrottle: boolean
  return (...args: T) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
