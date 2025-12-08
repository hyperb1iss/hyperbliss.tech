import { vec3 } from 'gl-matrix'
import { CyberScapeConfig } from '../CyberScapeConfig'
import { Particle } from '../particles/Particle'
import { ColorManager } from './ColorManager'
import { Connection } from './Connection'
import { Bounds, Octree } from './Octree'
import { ProjectionResult, VectorMath } from './VectorMath'

/**
 * Generates a unique key for a particle pair (order-independent).
 */
function getConnectionKey(a: Particle, b: Particle): string {
  // Use object identity via a unique id on each particle
  const idA = a.id
  const idB = b.id
  return idA < idB ? `${idA}:${idB}` : `${idB}:${idA}`
}

export class ParticleConnector {
  private connections: Map<string, Connection> = new Map()
  private config: CyberScapeConfig

  // Pre-allocated objects to avoid GC pressure
  private readonly projA: ProjectionResult = VectorMath.createProjectionResult()
  private readonly projB: ProjectionResult = VectorMath.createProjectionResult()
  private readonly queryMin: vec3 = vec3.create()
  private readonly queryMax: vec3 = vec3.create()
  private readonly queryBounds: Bounds = { max: this.queryMax, min: this.queryMin }

  // Internal octree for particle spatial queries
  private particleOctree: Octree

  constructor() {
    this.config = CyberScapeConfig.getInstance()
    // Initialize with default bounds - will be updated on first use
    this.particleOctree = new Octree({
      max: vec3.fromValues(1000, 1000, 300),
      min: vec3.fromValues(-1000, -1000, -300),
    })
  }

  /**
   * Connects particles by drawing lines between those that are within a certain distance.
   * Uses spatial partitioning for O(n log n) instead of O(n²) complexity.
   */
  public connectParticles(
    particles: Particle[],
    ctx: CanvasRenderingContext2D,
    timestamp: number,
    width: number,
    height: number,
  ) {
    const connectionDistance = this.config.particleConnectionDistance
    // Convert 2D screen distance to approximate 3D query radius
    // Using a slightly larger radius to account for projection variations
    const queryRadius = connectionDistance * 1.5

    // Update octree bounds based on canvas size
    vec3.set(this.particleOctree.getBounds().min, -width / 2, -height / 2, -300)
    vec3.set(this.particleOctree.getBounds().max, width / 2, height / 2, 300)

    // Rebuild octree with current particles
    this.particleOctree.clear()
    const visibleParticles: Particle[] = []

    for (const particle of particles) {
      if (particle.isVisible) {
        visibleParticles.push(particle)
        this.particleOctree.insert(particle)
      }
    }

    // Track which connections are still valid this frame
    const activeKeys = new Set<string>()

    // For each particle, query nearby particles using octree
    for (const particleA of visibleParticles) {
      // Build query bounds around this particle
      vec3.set(
        this.queryMin,
        particleA.position[0] - queryRadius,
        particleA.position[1] - queryRadius,
        particleA.position[2] - queryRadius,
      )
      vec3.set(
        this.queryMax,
        particleA.position[0] + queryRadius,
        particleA.position[1] + queryRadius,
        particleA.position[2] + queryRadius,
      )

      // Query octree for nearby particles
      const nearby = this.particleOctree.query(this.queryBounds)

      for (const obj of nearby) {
        const particleB = obj as Particle
        // Skip self and ensure we only process each pair once (A < B by id)
        if (particleB === particleA || particleB.id <= particleA.id) {
          continue
        }

        // Project both particles to 2D for actual distance check
        VectorMath.project(particleA.position, width, height, this.projA)
        VectorMath.project(particleB.position, width, height, this.projB)

        const dx = this.projA.x - this.projB.x
        const dy = this.projA.y - this.projB.y
        const distance = Math.sqrt(dx * dx + dy * dy) // Faster than Math.hypot

        if (distance > connectionDistance) {
          continue
        }

        const key = getConnectionKey(particleA, particleB)
        activeKeys.add(key)

        const existingConnection = this.connections.get(key)

        if (existingConnection) {
          // Update existing connection opacity
          const elapsed = timestamp - existingConnection.createdAt
          existingConnection.opacity = Math.min(elapsed / existingConnection.duration, 1)
        } else if (particleA.canCreateNewConnection(timestamp) && particleB.canCreateNewConnection(timestamp)) {
          // Create new connection
          this.connections.set(key, {
            createdAt: timestamp,
            duration: this.config.connectionAnimationDuration,
            opacity: 0,
            particleA,
            particleB,
          })
          particleA.incrementConnectionCount()
          particleB.incrementConnectionCount()
        }
      }
    }

    // Handle fading out obsolete connections
    this.fadeOutObsoleteConnections(activeKeys)

    // Draw all active connections
    this.drawConnections(ctx, width, height)
  }

  /**
   * Fades out connections that are no longer active, removing fully faded ones.
   */
  private fadeOutObsoleteConnections(activeKeys: Set<string>) {
    for (const [key, conn] of this.connections) {
      if (!activeKeys.has(key)) {
        // Connection is no longer active, fade it out
        conn.opacity = Math.max(conn.opacity - 0.02, 0)
        if (conn.opacity <= 0) {
          conn.particleA.decrementConnectionCount()
          conn.particleB.decrementConnectionCount()
          this.connections.delete(key)
        }
      }
    }
  }

  /**
   * Draws all connections with blended colors.
   */
  private drawConnections(ctx: CanvasRenderingContext2D, width: number, height: number) {
    for (const conn of this.connections.values()) {
      const { particleA, particleB, opacity } = conn
      if (opacity <= 0) continue

      // Reuse pre-allocated projection results
      VectorMath.project(particleA.position, width, height, this.projA)
      VectorMath.project(particleB.position, width, height, this.projB)

      // Blend particle colors
      const rgbA = ColorManager.hexToRgb(particleA.color)
      const rgbB = ColorManager.hexToRgb(particleB.color)

      let connectionColor: string
      if (rgbA && rgbB) {
        const r = (rgbA.r + rgbB.r) >> 1 // Bitwise divide by 2
        const g = (rgbA.g + rgbB.g) >> 1
        const b = (rgbA.b + rgbB.b) >> 1
        connectionColor = `rgba(${r},${g},${b},${opacity * 0.7})`
      } else {
        connectionColor = `rgba(200,100,255,${opacity * 0.7})`
      }

      ctx.strokeStyle = connectionColor
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(this.projA.x, this.projA.y)
      ctx.lineTo(this.projB.x, this.projB.y)
      ctx.stroke()
    }
  }
}
