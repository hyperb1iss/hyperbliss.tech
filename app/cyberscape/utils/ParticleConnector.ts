import { CyberScapeConfig } from "../CyberScapeConfig";
import { Particle } from "../particles/Particle";
import { ColorManager } from "./ColorManager";
import { Connection } from "./Connection";
import { VectorMath } from "./VectorMath";

export class ParticleConnector {
  private connections: Connection[] = [];
  private config: CyberScapeConfig;

  constructor() {
    this.config = CyberScapeConfig.getInstance();
  }

  /**
   * Connects particles by drawing lines between those that are within a certain distance.
   * Animates the connection lines smoothly.
   */
  public connectParticles(
    particles: Particle[],
    ctx: CanvasRenderingContext2D,
    timestamp: number,
    width: number,
    height: number
  ) {
    const newConnections: Connection[] = [];
    const visibleParticles = particles.filter((p) => p.isVisible);

    for (let a = 0; a < visibleParticles.length; a++) {
      const particleA = visibleParticles[a];
      for (let b = a + 1; b < visibleParticles.length; b++) {
        const particleB = visibleParticles[b];

        const posA = VectorMath.project(particleA.position, width, height);
        const posB = VectorMath.project(particleB.position, width, height);

        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const distance = Math.hypot(dx, dy);

        if (distance > this.config.particleConnectionDistance) {
          continue;
        }

        const existingConnection = this.connections.find(
          (conn) =>
            (conn.particleA === particleA && conn.particleB === particleB) ||
            (conn.particleA === particleB && conn.particleB === particleA)
        );

        if (existingConnection) {
          const elapsed = timestamp - existingConnection.createdAt;
          existingConnection.opacity = Math.min(
            elapsed / existingConnection.duration,
            1
          );
          newConnections.push(existingConnection);
        } else if (
          particleA.canCreateNewConnection(timestamp) &&
          particleB.canCreateNewConnection(timestamp)
        ) {
          newConnections.push({
            particleA: particleA,
            particleB: particleB,
            createdAt: timestamp,
            duration: this.config.connectionAnimationDuration,
            opacity: 0,
          });
          particleA.incrementConnectionCount();
          particleB.incrementConnectionCount();
        }
      }
    }

    this.handleObsoleteConnections(newConnections);
    this.connections = newConnections;
    this.drawConnections(ctx, width, height);
  }

  private handleObsoleteConnections(newConnections: Connection[]) {
    const obsoleteConnections = this.connections.filter((conn) => {
      const stillExists = newConnections.some(
        (newConn) =>
          (newConn.particleA === conn.particleA &&
            newConn.particleB === conn.particleB) ||
          (newConn.particleA === conn.particleB &&
            newConn.particleB === conn.particleA)
      );
      return !stillExists;
    });

    obsoleteConnections.forEach((conn: Connection) => {
      if (conn.opacity > 0) {
        conn.opacity = Math.max(conn.opacity - 0.01, 0);
        if (conn.opacity > 0) {
          newConnections.push(conn);
        } else {
          conn.particleA.decrementConnectionCount();
          conn.particleB.decrementConnectionCount();
        }
      }
    });
  }

  private drawConnections(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    this.connections.forEach((conn: Connection) => {
      const { particleA, particleB, opacity } = conn;
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
          connectionColor = `rgba(${blendedR}, ${blendedG}, ${blendedB}, ${
            opacity * 0.7
          })`;
        }

        ctx.strokeStyle = connectionColor;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);
        ctx.stroke();
      }
    });
  }
}
