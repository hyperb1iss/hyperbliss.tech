// app/cyberscape2/header/HeaderSystem.ts

import type { RendererCapabilities } from "../CyberScape2";
import type { ParticleSystem } from "../particles/ParticleSystem";
import type { InputManager } from "../core/InputManager";

/**
 * Header System for CyberScape 2.0
 * 
 * Orchestrates header-specific particle behaviors including:
 * - Interactive logo particles
 * - Navigation element signatures
 * - Header mood indicators
 * - Mouse magnetism effects
 */

export interface HeaderZone {
  element: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
  particles: string[];
  isActive: boolean;
}

export class HeaderSystem {
  private headerElement: HTMLElement;
  private logoElement: HTMLAnchorElement;
  private navElement: HTMLElement;
  private particleSystem: ParticleSystem;
  private capabilities: RendererCapabilities;
  
  private width = 0;
  private height = 0;
  private isInitialized = false;
  
  // Header zones for interaction
  private logoZone: HeaderZone | null = null;
  private navZones: HeaderZone[] = [];
  
  // Animation states
  private logoAnimationState = 'idle';
  private lastLogoAnimation = 0;
  private navHoverStates = new Map<string, number>();
  
  // Special effects
  private bloomEnabled = true;
  private lastSpecialAnimation = 0;
  
  // Mouse magnetism
  private magnetismStrength = 0.3;
  private magnetismRadius = 100;

  constructor(
    headerElement: HTMLElement,
    logoElement: HTMLAnchorElement,
    navElement: HTMLElement,
    particleSystem: ParticleSystem,
    capabilities: RendererCapabilities
  ) {
    this.headerElement = headerElement;
    this.logoElement = logoElement;
    this.navElement = navElement;
    this.particleSystem = particleSystem;
    this.capabilities = capabilities;
  }

  /**
   * Initialize header system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Setup header zones
    this.setupHeaderZones();
    
    // Setup event listeners
    this.setupHeaderEvents();
    
    // Initial particle spawn
    this.spawnInitialParticles();
    
    this.isInitialized = true;
    console.log('🎯 Header system initialized');
  }

  /**
   * Setup interactive header zones
   */
  private setupHeaderZones(): void {
    // Logo zone
    const logoRect = this.logoElement.getBoundingClientRect();
    const headerRect = this.headerElement.getBoundingClientRect();
    
    this.logoZone = {
      element: this.logoElement,
      x: logoRect.left - headerRect.left,
      y: logoRect.top - headerRect.top,
      width: logoRect.width,
      height: logoRect.height,
      particles: [],
      isActive: false
    };

    // Navigation zones
    this.navZones = [];
    const navItems = this.navElement.querySelectorAll('a');
    
         for (let i = 0; i < navItems.length; i++) {
       const navItem = navItems[i];
       const navRect = navItem.getBoundingClientRect();
       const zone: HeaderZone = {
         element: navItem as HTMLElement,
         x: navRect.left - headerRect.left,
         y: navRect.top - headerRect.top,
         width: navRect.width,
         height: navRect.height,
         particles: [],
         isActive: false
       };
       
       this.navZones.push(zone);
     }
  }

  /**
   * Setup header event listeners
   */
  private setupHeaderEvents(): void {
    // Logo interactions
    this.logoElement.addEventListener('mouseenter', () => {
      this.triggerLogoAnimation('hover');
    });
    
    this.logoElement.addEventListener('mouseleave', () => {
      this.triggerLogoAnimation('idle');
    });
    
    this.logoElement.addEventListener('click', (event) => {
      this.triggerLogoAnimation('click');
      this.triggerSpecialAnimation(event.clientX, event.clientY);
    });

         // Navigation interactions
     for (let i = 0; i < this.navZones.length; i++) {
       const zone = this.navZones[i];
       const navItem = zone.element;
       const navSignature = this.getNavSignature(navItem);
       
       navItem.addEventListener('mouseenter', () => {
         this.triggerNavAnimation(i, 'hover', navSignature);
       });
       
       navItem.addEventListener('mouseleave', () => {
         this.triggerNavAnimation(i, 'idle', navSignature);
       });
       
       navItem.addEventListener('click', (event) => {
         this.triggerNavAnimation(i, 'click', navSignature);
         this.triggerSpecialAnimation(event.clientX, event.clientY);
       });
     }
  }

  /**
   * Get navigation signature from element
   */
  private getNavSignature(element: HTMLElement): string {
    const text = element.textContent?.toLowerCase() || '';
    
    // Map common navigation text to signatures
    if (text.includes('home')) return 'home';
    if (text.includes('about')) return 'about';
    if (text.includes('project')) return 'projects';
    if (text.includes('blog')) return 'blog';
    if (text.includes('contact')) return 'contact';
    
    return 'default';
  }

  /**
   * Spawn initial header particles
   */
  private spawnInitialParticles(): void {
    if (!this.logoZone) return;

    // Spawn logo particles
    const logoCenterX = this.logoZone.x + this.logoZone.width / 2;
    const logoCenterY = this.logoZone.y + this.logoZone.height / 2;
    
    this.particleSystem.spawnLogoParticles(logoCenterX, logoCenterY, 30);
  }

  /**
   * Trigger logo animation
   */
  private triggerLogoAnimation(state: 'idle' | 'hover' | 'click'): void {
    this.logoAnimationState = state;
    this.lastLogoAnimation = performance.now();
    
    if (!this.logoZone) return;
    
    const logoCenterX = this.logoZone.x + this.logoZone.width / 2;
    const logoCenterY = this.logoZone.y + this.logoZone.height / 2;
    
    switch (state) {
      case 'hover':
        // Increase particle density
        this.particleSystem.spawnLogoParticles(logoCenterX, logoCenterY, 20);
        this.logoZone.isActive = true;
        break;
        
      case 'click':
        // Burst effect
        this.particleSystem.spawnLogoParticles(logoCenterX, logoCenterY, 50);
        break;
        
      case 'idle':
        this.logoZone.isActive = false;
        break;
    }
  }

  /**
   * Trigger navigation animation
   */
  private triggerNavAnimation(index: number, state: 'idle' | 'hover' | 'click', signature: string): void {
    const zone = this.navZones[index];
    if (!zone) return;
    
    const centerX = zone.x + zone.width / 2;
    const centerY = zone.y + zone.height / 2;
    
    switch (state) {
      case 'hover':
        this.particleSystem.spawnNavParticles(centerX, centerY, signature, 15);
        zone.isActive = true;
        this.navHoverStates.set(`nav-${index}`, performance.now());
        break;
        
      case 'click':
        this.particleSystem.spawnNavParticles(centerX, centerY, signature, 25);
        break;
        
      case 'idle':
        zone.isActive = false;
        this.navHoverStates.delete(`nav-${index}`);
        break;
    }
  }

  /**
   * Trigger special header animation
   */
  triggerSpecialAnimation(x: number, y: number): void {
    const now = performance.now();
    
    // Cooldown to prevent spam
    if (now - this.lastSpecialAnimation < 500) return;
    
    this.lastSpecialAnimation = now;
    
    // Convert screen coordinates to header relative coordinates
    const headerRect = this.headerElement.getBoundingClientRect();
    const relativeX = x - headerRect.left;
    const relativeY = y - headerRect.top;
    
    // Create explosion effect
    this.particleSystem.spawnNavParticles(relativeX, relativeY, 'explode', 30);
    
    console.log(`✨ Special animation triggered at (${relativeX}, ${relativeY})`);
  }

  /**
   * Update header system
   */
  update(deltaTime: number, inputManager: InputManager): void {
    if (!this.isInitialized) return;
    
    // Update zone positions (in case of layout changes)
    this.updateZonePositions();
    
    // Update interactive behaviors
    this.updateInteractiveBehaviors(inputManager);
    
    // Update animations
    this.updateAnimations(deltaTime);
  }

  /**
   * Update zone positions for responsive layouts
   */
  private updateZonePositions(): void {
    const headerRect = this.headerElement.getBoundingClientRect();
    
    // Update logo zone
    if (this.logoZone) {
      const logoRect = this.logoElement.getBoundingClientRect();
      this.logoZone.x = logoRect.left - headerRect.left;
      this.logoZone.y = logoRect.top - headerRect.top;
      this.logoZone.width = logoRect.width;
      this.logoZone.height = logoRect.height;
    }
    
         // Update nav zones
     for (const zone of this.navZones) {
       const navRect = zone.element.getBoundingClientRect();
       zone.x = navRect.left - headerRect.left;
       zone.y = navRect.top - headerRect.top;
       zone.width = navRect.width;
       zone.height = navRect.height;
     }
  }

  /**
   * Update interactive behaviors based on input
   */
  private updateInteractiveBehaviors(inputManager: InputManager): void {
    const input = inputManager.getState();
    
    // Mouse magnetism effect
    if (input.interaction.isActive && input.mouse.isOverHeader) {
      this.applyMouseMagnetism(inputManager);
    }
    
    // Zone activation based on mouse position
    this.updateZoneActivation(inputManager);
  }

  /**
   * Apply mouse magnetism to particles
   */
  private applyMouseMagnetism(inputManager: InputManager): void {
    const input = inputManager.getPrimaryPosition();
    const particles = this.particleSystem.getParticles();
    
    particles.forEach(particle => {
      const dx = input.x - particle.x;
      const dy = input.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.magnetismRadius && distance > 0) {
        const force = (this.magnetismRadius - distance) / this.magnetismRadius * this.magnetismStrength;
        const normalizedDx = dx / distance;
        const normalizedDy = dy / distance;
        
        particle.vx += normalizedDx * force * 0.01;
        particle.vy += normalizedDy * force * 0.01;
      }
    });
  }

  /**
   * Update zone activation states
   */
  private updateZoneActivation(inputManager: InputManager): void {
    const input = inputManager.getPrimaryPosition();
    
    // Check logo zone
    if (this.logoZone) {
      const inZone = this.isPointInZone(input.x, input.y, this.logoZone);
      if (inZone && !this.logoZone.isActive) {
        this.triggerLogoAnimation('hover');
      } else if (!inZone && this.logoZone.isActive) {
        this.triggerLogoAnimation('idle');
      }
    }
    
         // Check nav zones
     for (let i = 0; i < this.navZones.length; i++) {
       const zone = this.navZones[i];
       const inZone = this.isPointInZone(input.x, input.y, zone);
       const navSignature = this.getNavSignature(zone.element);
       
       if (inZone && !zone.isActive) {
         this.triggerNavAnimation(i, 'hover', navSignature);
       } else if (!inZone && zone.isActive) {
         this.triggerNavAnimation(i, 'idle', navSignature);
       }
     }
  }

  /**
   * Check if point is within zone
   */
  private isPointInZone(x: number, y: number, zone: HeaderZone): boolean {
    return x >= zone.x && 
           x <= zone.x + zone.width && 
           y >= zone.y && 
           y <= zone.y + zone.height;
  }

     /**
    * Update ongoing animations
    */
   private updateAnimations(_deltaTime: number): void {
    const now = performance.now();
    
    // Logo animation updates
    if (this.logoAnimationState === 'hover' && now - this.lastLogoAnimation > 100) {
      // Continuous hover effect
      if (this.logoZone) {
        const logoCenterX = this.logoZone.x + this.logoZone.width / 2;
        const logoCenterY = this.logoZone.y + this.logoZone.height / 2;
        this.particleSystem.spawnLogoParticles(logoCenterX, logoCenterY, 5);
      }
      this.lastLogoAnimation = now;
    }
    
    // Nav hover effects
    this.navHoverStates.forEach((startTime, key) => {
      if (now - startTime > 150) {
                 const index = Number.parseInt(key.split('-')[1], 10);
         const zone = this.navZones[index];
         if (zone?.isActive) {
          const centerX = zone.x + zone.width / 2;
          const centerY = zone.y + zone.height / 2;
          const signature = this.getNavSignature(zone.element);
          this.particleSystem.spawnNavParticles(centerX, centerY, signature, 3);
          this.navHoverStates.set(key, now);
        }
      }
    });
  }

  /**
   * Enable/disable bloom effects
   */
  setBloomEnabled(enabled: boolean): void {
    this.bloomEnabled = enabled;
    console.log(`🌟 Header bloom effects ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Handle resize
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    
    // Update zones after resize
    setTimeout(() => {
      this.setupHeaderZones();
    }, 100);
  }

  /**
   * Get header system stats
   */
  getStats(): { logoActive: boolean; navActiveCount: number; bloomEnabled: boolean } {
    return {
      logoActive: this.logoZone?.isActive || false,
      navActiveCount: this.navZones.filter(z => z.isActive).length,
      bloomEnabled: this.bloomEnabled
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Remove event listeners (if we stored references)
    this.navHoverStates.clear();
    this.logoZone = null;
    this.navZones = [];
    
    console.log('🎯 Header system destroyed');
  }
} 