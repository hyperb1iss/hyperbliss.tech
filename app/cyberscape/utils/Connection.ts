// app/cyberscape/utils/Connection.ts

/**
 * Connection Interface
 *
 * Represents a connection between two particles, including its animation state.
 */
import { Particle } from "../particles/Particle";

/**
 * Interface representing a connection between two particles with animation properties.
 */
export interface Connection {
  /**
   * The first particle in the connection.
   */
  particleA: Particle;

  /**
   * The second particle in the connection.
   */
  particleB: Particle;

  /**
   * Timestamp when the connection was created.
   */
  createdAt: number;

  /**
   * Total duration of the connection's fade-in animation in milliseconds.
   */
  duration: number;

  /**
   * Current opacity of the connection line (0 to 1).
   */
  opacity: number;
}
