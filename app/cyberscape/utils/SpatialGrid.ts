// app/cyberscape/utils/SpatialGrid.ts

import { vec3 } from "gl-matrix";
import { Particle } from "../particles/Particle";
import { VectorShape } from "../shapes/VectorShape";

/**
 * SpatialGrid class
 *
 * This class implements a spatial partitioning system to optimize
 * collision detection and proximity-based interactions in the CyberScape animation.
 */
export class SpatialGrid {
  private grid: Map<string, (Particle | VectorShape)[]>;
  private cellSize: number;

  /**
   * Creates a new SpatialGrid instance.
   * @param cellSize - The size of each grid cell.
   */
  constructor(cellSize: number) {
    this.grid = new Map();
    this.cellSize = cellSize;
  }

  /**
   * Clears all objects from the grid.
   */
  clear(): void {
    this.grid.clear();
  }

  /**
   * Adds a particle to the grid.
   * @param particle - The particle to add.
   */
  addParticle(particle: Particle): void {
    const key = this.getCellKey(particle.position);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(particle);
  }

  /**
   * Adds a shape to the grid.
   * @param shape - The shape to add.
   */
  addShape(shape: VectorShape): void {
    const key = this.getCellKey(shape.position);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(shape);
  }

  /**
   * Retrieves all objects in the cells surrounding a given position.
   * @param position - The position to check around.
   * @returns An array of particles and shapes in the surrounding cells.
   */
  getNearbyObjects(position: vec3): (Particle | VectorShape)[] {
    const cellKey = this.getCellKey(position);
    const [x, y, z] = cellKey.split(",").map(Number);

    const nearbyObjects: (Particle | VectorShape)[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const key = `${x + dx},${y + dy},${z + dz}`;
          const cellObjects = this.grid.get(key);
          if (cellObjects) {
            nearbyObjects.push(...cellObjects);
          }
        }
      }
    }

    return nearbyObjects;
  }

  /**
   * Generates a cell key for a given position.
   * @param position - The position to generate a key for.
   * @returns A string key representing the cell containing the position.
   */
  private getCellKey(position: vec3): string {
    const x = Math.floor(position[0] / this.cellSize);
    const y = Math.floor(position[1] / this.cellSize);
    const z = Math.floor(position[2] / this.cellSize);
    return `${x},${y},${z}`;
  }
}
