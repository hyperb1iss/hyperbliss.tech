// app/cyberscape2/particles/ParticleSystem.ts

import type { RendererCapabilities } from "../CyberScape2";
import type { InputManager } from "../core/InputManager";

/**
 * Particle System for CyberScape 2.0
 * 
 * Header-focused particle system with intelligent behaviors,
 * WebGL optimization, and responsive scaling.
 */

export interface Particle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  life: number;
  maxLife: number;
  color: { r: number; g: number; b: number; a: number };
  type: 'normal' | 'logo' | 'nav' | 'bliss' | 'trail';
  behavior: string;
  target?: { x: number; y: number; z: number };
  isActive: boolean;
}

export class ParticleSystem {
  private capabilities: RendererCapabilities;
  private particles: Particle[] = [];
  private particlePool: Particle[] = [];
  private nextId = 0;
  
  private maxParticles = 250;
  private activeParticleCount = 0;
  
  // Header-specific settings
  private width = 0;
  private height = 0;
  private headerHeight = 100;
  
  // Performance settings
  private frameSkip = 0;
  private currentFrame = 0;
  private connectionsEnabled = true;
  
  // Particle behaviors
  private spawnRate = 0.1;
  private lastSpawnTime = 0;

  constructor(capabilities: RendererCapabilities) {
    this.capabilities = capabilities;
    this.maxParticles = capabilities.maxParticles;
  }

  /**
   * Initialize particle system
   */
  async initialize(): Promise<void> {
    // Pre-allocate particle pool for performance
    this.createParticlePool();
    
    console.log(`⭐ Particle system initialized with ${this.maxParticles} max particles`);
  }

  /**
   * Create particle pool for object reuse
   */
  private createParticlePool(): void {
    for (let i = 0; i < this.maxParticles * 2; i++) {
      this.particlePool.push(this.createEmptyParticle());
    }
  }

  /**
   * Create empty particle template
   */
  private createEmptyParticle(): Particle {
    return {
      id: 0,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      size: 2,
      life: 0,
      maxLife: 5000,
      color: { r: 0, g: 1, b: 1, a: 1 }, // Cyan default
      type: 'normal',
      behavior: 'float',
      isActive: false
    };
  }

  /**
   * Get particle from pool or create new one
   */
  private getParticle(): Particle | null {
    if (this.activeParticleCount >= this.maxParticles) {
      return null;
    }

    let particle = this.particlePool.pop();
    if (!particle) {
      particle = this.createEmptyParticle();
    }

    particle.id = this.nextId++;
    particle.isActive = true;
    this.activeParticleCount++;
    
    return particle;
  }

  /**
   * Return particle to pool
   */
  private returnParticle(particle: Particle): void {
    particle.isActive = false;
    this.particlePool.push(particle);
    this.activeParticleCount--;
  }

  /**
   * Spawn header logo particles
   */
  spawnLogoParticles(x: number, y: number, count: number = 20): void {
    for (let i = 0; i < count; i++) {
      const particle = this.getParticle();
      if (!particle) break;

      // Position around logo center
      const angle = (Math.PI * 2 * i) / count;
      const radius = 20 + Math.random() * 30;
      
      particle.x = x + Math.cos(angle) * radius;
      particle.y = y + Math.sin(angle) * radius;
      particle.z = Math.random() * 10;
      
      // Orbital velocity
      particle.vx = -Math.sin(angle) * 0.05;
      particle.vy = Math.cos(angle) * 0.05;
      particle.vz = (Math.random() - 0.5) * 0.02;
      
      particle.size = 1 + Math.random() * 2;
      particle.life = 0;
      particle.maxLife = 3000 + Math.random() * 2000;
      particle.type = 'logo';
      particle.behavior = 'orbit';
      particle.target = { x, y, z: 0 };
      
      // Logo particle colors (bright cyan)
      particle.color = {
        r: 0,
        g: 0.8 + Math.random() * 0.2,
        b: 1,
        a: 0.8
      };

      this.particles.push(particle);
    }
  }

  /**
   * Spawn navigation particles
   */
  spawnNavParticles(x: number, y: number, signature: string, count: number = 15): void {
    const colors = this.getSignatureColor(signature);
    
    for (let i = 0; i < count; i++) {
      const particle = this.getParticle();
      if (!particle) break;

      particle.x = x + (Math.random() - 0.5) * 40;
      particle.y = y + (Math.random() - 0.5) * 20;
      particle.z = Math.random() * 5;
      
      particle.vx = (Math.random() - 0.5) * 0.1;
      particle.vy = (Math.random() - 0.5) * 0.05;
      particle.vz = (Math.random() - 0.5) * 0.02;
      
      particle.size = 1 + Math.random() * 1.5;
      particle.life = 0;
      particle.maxLife = 2000 + Math.random() * 1000;
      particle.type = 'nav';
      particle.behavior = signature;
      
      particle.color = colors;

      this.particles.push(particle);
    }
  }

  /**
   * Get color for navigation signature
   */
  private getSignatureColor(signature: string): { r: number; g: number; b: number; a: number } {
    const signatures: Record<string, { r: number; g: number; b: number; a: number }> = {
      home: { r: 0, g: 1, b: 1, a: 0.8 },     // Cyan
      about: { r: 1, g: 0, b: 1, a: 0.8 },    // Magenta
      projects: { r: 0, g: 1, b: 0, a: 0.8 }, // Green
      blog: { r: 1, g: 1, b: 0, a: 0.8 },     // Yellow
      contact: { r: 1, g: 0, b: 0.5, a: 0.8 } // Pink
    };
    
    return signatures[signature] || { r: 1, g: 1, b: 1, a: 0.8 };
  }

  /**
   * Spawn ambient header particles
   */
  spawnAmbientParticles(): void {
    if (performance.now() - this.lastSpawnTime < (1000 / this.spawnRate)) {
      return;
    }

    const particle = this.getParticle();
    if (!particle) return;

    // Spawn from edges of header
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
      case 0: // Top
        particle.x = Math.random() * this.width;
        particle.y = 0;
        break;
      case 1: // Right
        particle.x = this.width;
        particle.y = Math.random() * this.headerHeight;
        break;
      case 2: // Bottom
        particle.x = Math.random() * this.width;
        particle.y = this.headerHeight;
        break;
      case 3: // Left
        particle.x = 0;
        particle.y = Math.random() * this.headerHeight;
        break;
    }

    particle.z = Math.random() * 20;
    particle.vx = (Math.random() - 0.5) * 0.1;
    particle.vy = (Math.random() - 0.5) * 0.1;
    particle.vz = (Math.random() - 0.5) * 0.05;
    
    particle.size = 1 + Math.random() * 2;
    particle.life = 0;
    particle.maxLife = 8000 + Math.random() * 4000;
    particle.type = 'normal';
    particle.behavior = 'float';
    
    // Ambient particle colors (various cyberspace colors)
    const hue = Math.random();
    particle.color = {
      r: hue < 0.33 ? 0 : hue < 0.66 ? 1 : 0.5,
      g: hue < 0.33 ? 1 : hue < 0.66 ? 0 : 1,
      b: hue < 0.33 ? 1 : hue < 0.66 ? 1 : 0,
      a: 0.6
    };

    this.particles.push(particle);
    this.lastSpawnTime = performance.now();
  }

  /**
   * Update particle system
   */
  update(deltaTime: number, inputManager: InputManager): void {
    // Frame skipping for performance
    if (this.frameSkip > 0 && this.currentFrame % (this.frameSkip + 1) !== 0) {
      this.currentFrame++;
      return;
    }
    this.currentFrame++;

    // Spawn ambient particles
    this.spawnAmbientParticles();

    // Update all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      if (!particle.isActive) {
        this.particles.splice(i, 1);
        continue;
      }

      this.updateParticle(particle, deltaTime, inputManager);
      
      // Remove dead particles
      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
        this.returnParticle(particle);
      }
    }
  }

  /**
   * Update individual particle
   */
  private updateParticle(particle: Particle, deltaTime: number, inputManager: InputManager): void {
    // Age particle
    particle.life += deltaTime;
    
    // Apply behavior
    this.applyParticleBehavior(particle, deltaTime, inputManager);
    
    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.z += particle.vz * deltaTime;
    
    // Apply damping
    particle.vx *= 0.998;
    particle.vy *= 0.998;
    particle.vz *= 0.998;
    
    // Update alpha based on life
    const lifeRatio = particle.life / particle.maxLife;
    if (lifeRatio < 0.1) {
      // Fade in
      particle.color.a = lifeRatio * 10;
    } else if (lifeRatio > 0.9) {
      // Fade out
      particle.color.a = (1 - lifeRatio) * 10;
    }
    
    // Boundary checking for header area
    this.checkBoundaries(particle);
  }

  /**
   * Apply particle behavior patterns
   */
  private applyParticleBehavior(particle: Particle, deltaTime: number, inputManager: InputManager): void {
    const input = inputManager.getPrimaryPosition();
    
    switch (particle.behavior) {
      case 'orbit':
        if (particle.target) {
          const dx = particle.target.x - particle.x;
          const dy = particle.target.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist > 0) {
            // Orbital force
            const force = 0.0001;
            particle.vx += -dy * force;
            particle.vy += dx * force;
            
            // Attractive force to maintain orbit
            particle.vx += dx * 0.00001;
            particle.vy += dy * 0.00001;
          }
        }
        break;
        
      case 'float':
        // Gentle floating motion
        particle.vx += (Math.random() - 0.5) * 0.0001;
        particle.vy += (Math.random() - 0.5) * 0.0001;
        break;
        
      case 'trail':
        // Follow input with trail effect
        const dx = input.x - particle.x;
        const dy = input.y - particle.y;
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
        break;
    }
    
    // Mouse attraction for all particles
    if (inputManager.getState().interaction.isActive) {
      const dx = input.x - particle.x;
      const dy = input.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 100 && dist > 0) {
        const force = (100 - dist) / 10000;
        particle.vx += (dx / dist) * force;
        particle.vy += (dy / dist) * force;
      }
    }
  }

  /**
   * Check particle boundaries and wrap/bounce
   */
  private checkBoundaries(particle: Particle): void {
    const margin = 50;
    
    // Horizontal wrapping
    if (particle.x < -margin) {
      particle.x = this.width + margin;
    } else if (particle.x > this.width + margin) {
      particle.x = -margin;
    }
    
    // Vertical boundaries (header area)
    if (particle.y < -margin) {
      particle.y = -margin;
      particle.vy = Math.abs(particle.vy);
    } else if (particle.y > this.headerHeight + margin) {
      particle.y = this.headerHeight + margin;
      particle.vy = -Math.abs(particle.vy);
    }
  }

  /**
   * Get all active particles for rendering
   */
  getParticles(): Particle[] {
    return this.particles.filter(p => p.isActive);
  }

  /**
   * Scale particle count for performance
   */
  scaleParticleCount(factor: number): void {
    this.maxParticles = Math.floor(this.capabilities.maxParticles * factor);
    console.log(`🔧 Scaled particle count to ${this.maxParticles}`);
  }

  /**
   * Enable/disable particle connections
   */
  setConnectionsEnabled(enabled: boolean): void {
    this.connectionsEnabled = enabled;
  }

  /**
   * Set frame skip for performance
   */
  setFrameSkip(skip: number): void {
    this.frameSkip = skip;
  }

  /**
   * Handle resize
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.headerHeight = Math.min(height, 120); // Max header height
  }

  /**
   * Get particle system stats
   */
  getStats(): { active: number; max: number; poolSize: number } {
    return {
      active: this.activeParticleCount,
      max: this.maxParticles,
      poolSize: this.particlePool.length
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.particles = [];
    this.particlePool = [];
    this.activeParticleCount = 0;
    
    console.log('⭐ Particle system destroyed');
  }
} 