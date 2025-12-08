// app/cyberscape/utils/Octree.ts

import { vec3 } from 'gl-matrix'

/**
 * Represents the bounds of an octree node or query area.
 */
export interface Bounds {
  min: vec3
  max: vec3
}

/**
 * Represents an object that can be inserted into the octree.
 */
export interface OctreeObject {
  position: vec3
  radius: number
}

/**
 * Represents a node in the octree.
 */
class OctreeNode {
  bounds: Bounds
  objects: OctreeObject[]
  children: OctreeNode[]
  isLeaf: boolean

  constructor(bounds: Bounds) {
    this.bounds = bounds
    this.objects = []
    this.children = []
    this.isLeaf = true
  }
}

/**
 * Octree class for efficient spatial partitioning and querying.
 */
export class Octree {
  private root: OctreeNode
  private maxObjects: number
  private maxDepth: number

  // Pre-allocated vectors to avoid GC pressure in hot paths
  private readonly tempVec: vec3 = vec3.create()
  private readonly midpoint: vec3 = vec3.create()

  /**
   * Creates a new Octree instance.
   * @param bounds - The bounds of the entire octree.
   * @param maxObjects - Maximum number of objects per node before splitting.
   * @param maxDepth - Maximum depth of the octree.
   */
  constructor(bounds: Bounds, maxObjects = 8, maxDepth = 8) {
    this.root = new OctreeNode(bounds)
    this.maxObjects = maxObjects
    this.maxDepth = maxDepth
  }

  /**
   * Clears all objects from the octree.
   */
  clear(): void {
    this.root = new OctreeNode(this.root.bounds)
  }

  /**
   * Updates the bounds of the entire octree.
   * @param bounds - The new bounds for the octree.
   */
  public updateBounds(bounds: Bounds): void {
    this.root.bounds = bounds
  }

  /**
   * Gets the current bounds of the octree.
   * @returns The current bounds of the octree.
   */
  public getBounds(): Bounds {
    return this.root.bounds
  }

  /**
   * Inserts an object into the octree.
   * @param object - The object to insert.
   */
  insert(object: OctreeObject): void {
    this.insertObject(object, this.root, 0)
  }

  /**
   * Recursively inserts an object into the appropriate octree node.
   * @param object - The object to insert.
   * @param node - The current octree node.
   * @param depth - The current depth in the octree.
   */
  private insertObject(object: OctreeObject, node: OctreeNode, depth: number): void {
    if (!this.isInBounds(object.position, node.bounds)) {
      return
    }

    if (node.isLeaf && node.objects.length < this.maxObjects) {
      node.objects.push(object)
      return
    }

    if (node.isLeaf && depth < this.maxDepth) {
      this.split(node)
    }

    if (!node.isLeaf) {
      const childIndex = this.getChildIndex(object.position, node.bounds)
      this.insertObject(object, node.children[childIndex], depth + 1)
    } else {
      node.objects.push(object)
    }
  }

  /**
   * Splits a leaf node into eight child nodes.
   * @param node - The node to split.
   */
  private split(node: OctreeNode): void {
    const { min, max } = node.bounds
    // Reuse pre-allocated vectors for midpoint calculation
    vec3.add(this.tempVec, min, max)
    vec3.scale(this.midpoint, this.tempVec, 0.5)
    const mid = this.midpoint

    node.children = [
      new OctreeNode({
        max: [mid[0], mid[1], mid[2]],
        min: [min[0], min[1], min[2]],
      }),
      new OctreeNode({
        max: [max[0], mid[1], mid[2]],
        min: [mid[0], min[1], min[2]],
      }),
      new OctreeNode({
        max: [mid[0], max[1], mid[2]],
        min: [min[0], mid[1], min[2]],
      }),
      new OctreeNode({
        max: [max[0], max[1], mid[2]],
        min: [mid[0], mid[1], min[2]],
      }),
      new OctreeNode({
        max: [mid[0], mid[1], max[2]],
        min: [min[0], min[1], mid[2]],
      }),
      new OctreeNode({
        max: [max[0], mid[1], max[2]],
        min: [mid[0], min[1], mid[2]],
      }),
      new OctreeNode({
        max: [mid[0], max[1], max[2]],
        min: [min[0], mid[1], mid[2]],
      }),
      new OctreeNode({
        max: [max[0], max[1], max[2]],
        min: [mid[0], mid[1], mid[2]],
      }),
    ]

    node.isLeaf = false

    for (const object of node.objects) {
      const childIndex = this.getChildIndex(object.position, node.bounds)
      node.children[childIndex].objects.push(object)
    }

    node.objects = []
  }

  /**
   * Determines the child index for a given position within a node's bounds.
   * @param position - The position to check.
   * @param bounds - The bounds of the current node.
   * @returns The index of the child node (0-7).
   */
  private getChildIndex(position: vec3, bounds: Bounds): number {
    // Reuse pre-allocated vectors for midpoint calculation
    vec3.add(this.tempVec, bounds.min, bounds.max)
    vec3.scale(this.midpoint, this.tempVec, 0.5)
    let index = 0
    if (position[0] > this.midpoint[0]) index |= 1
    if (position[1] > this.midpoint[1]) index |= 2
    if (position[2] > this.midpoint[2]) index |= 4
    return index
  }

  /**
   * Checks if a position is within the given bounds.
   * @param position - The position to check.
   * @param bounds - The bounds to check against.
   * @returns True if the position is within the bounds, false otherwise.
   */
  private isInBounds(position: vec3, bounds: Bounds): boolean {
    return (
      position[0] >= bounds.min[0] &&
      position[0] <= bounds.max[0] &&
      position[1] >= bounds.min[1] &&
      position[1] <= bounds.max[1] &&
      position[2] >= bounds.min[2] &&
      position[2] <= bounds.max[2]
    )
  }

  /**
   * Queries the octree for objects within the given bounds.
   * @param bounds - The bounds to query.
   * @returns An array of objects within the query bounds.
   */
  query(bounds: Bounds): OctreeObject[] {
    const result: OctreeObject[] = []
    this.queryNode(this.root, bounds, result)
    return result
  }

  /**
   * Recursively queries a node and its children for objects within the given bounds.
   * @param node - The current node to query.
   * @param queryBounds - The bounds to query.
   * @param result - The array to store the resulting objects.
   */
  private queryNode(node: OctreeNode, queryBounds: Bounds, result: OctreeObject[]): void {
    if (!this.intersectsBounds(node.bounds, queryBounds)) {
      return
    }

    if (node.isLeaf) {
      result.push(...node.objects.filter((obj) => this.isInBounds(obj.position, queryBounds)))
    } else {
      for (const child of node.children) {
        this.queryNode(child, queryBounds, result)
      }
    }
  }

  /**
   * Checks if two bounds intersect.
   * @param a - The first bounds.
   * @param b - The second bounds.
   * @returns True if the bounds intersect, false otherwise.
   */
  private intersectsBounds(a: Bounds, b: Bounds): boolean {
    return (
      a.min[0] <= b.max[0] &&
      a.max[0] >= b.min[0] &&
      a.min[1] <= b.max[1] &&
      a.max[1] >= b.min[1] &&
      a.min[2] <= b.max[2] &&
      a.max[2] >= b.min[2]
    )
  }
}
