import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { Renderer, RendererCapabilities } from '../CyberScape2';
import type { CyberScape2Config } from '../CyberScape2Config';

/**
 * Three.js-based renderer for CyberScape 2.0
 * Provides high-performance particle rendering with post-processing effects
 */

export class WebGLRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private config: CyberScape2Config;
  
  // Three.js core objects
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  
  // Post-processing
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  
  // Particle systems
  private particleGroup: THREE.Group;
  private particleMaterials: Map<string, THREE.PointsMaterial> = new Map();
  private particleGeometries: Map<string, THREE.BufferGeometry> = new Map();
  
  // State
  private width = 0;
  private height = 0;
  private capabilities: RendererCapabilities;
  private isInitialized = false;

  constructor(canvas: HTMLCanvasElement, config: CyberScape2Config) {
    this.canvas = canvas;
    this.config = config;
    
    // Initialize Three.js objects
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);
    
    // Set initial capabilities
    this.capabilities = {
      type: 'webgl',
      maxParticles: 10000,
      supportsBloom: true,
      supportsShaders: true,
      performanceLevel: 'high'
    };
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('🎮 Initializing Three.js renderer...');
      
      // Setup renderer
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1;
      
      // Setup camera
      this.camera.position.z = 5;
      
      // Initialize post-processing
      await this.initializePostProcessing();
      
      // Create initial particle materials
      this.createParticleMaterials();
      
      // Setup resize handling
      this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
      
      this.isInitialized = true;
      console.log('✨ Three.js renderer initialized successfully!');
      
      return true;
      
    } catch (error) {
      console.error('❌ Three.js renderer initialization failed:', error);
      return false;
    }
  }

  private async initializePostProcessing(): Promise<void> {
    this.composer = new EffectComposer(this.renderer);
    
    // Main render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Bloom pass
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,  // strength
      0.4,  // radius  
      0.85  // threshold
    );
    this.composer.addPass(this.bloomPass);
    
    console.log('🌟 Post-processing initialized with bloom effects');
  }

  private createParticleMaterials(): void {
    // Default particle material
    const defaultMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.particleMaterials.set('default', defaultMaterial);
    
    // Logo particle material
    const logoMaterial = new THREE.PointsMaterial({
      color: 0xff00ff,
      size: 3,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });
    this.particleMaterials.set('logo', logoMaterial);
    
    // Navigation particle material
    const navMaterial = new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 1.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    this.particleMaterials.set('nav', navMaterial);
    
    console.log('🎨 Particle materials created');
  }

  /**
   * Main render function
   */
  render(deltaTime: number): void {
    if (!this.isInitialized) return;
    
    // Update particle animations (placeholder for now)
    this.updateParticles(deltaTime);
    
    // Render with post-processing
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private updateParticles(deltaTime: number): void {
    // Rotate particle group for some movement
    this.particleGroup.rotation.y += deltaTime * 0.0001;
    
    // Update particle materials (add some shimmer)
    const time = Date.now() * 0.001;
    for (const [, material] of this.particleMaterials) {
      if (material.opacity) {
        const baseOpacity = material.userData?.baseOpacity || material.opacity;
        material.opacity = baseOpacity + Math.sin(time * 2) * 0.1;
      }
    }
  }

  /**
   * Handle canvas resize
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    
    // Update camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(width, height);
    
    // Update post-processing
    if (this.composer) {
      this.composer.setSize(width, height);
    }
    
    if (this.bloomPass) {
      this.bloomPass.resolution = new THREE.Vector2(width, height);
    }
    
    console.log(`📐 Three.js renderer resized to ${width}x${height}`);
  }

  /**
   * Get renderer capabilities
   */
  getCapabilities(): RendererCapabilities {
    return { ...this.capabilities };
  }

  /**
   * Add particle system to the scene
   */
  addParticleSystem(name: string, positions: Float32Array, colors: Float32Array): void {
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Get or create material
    const material = this.particleMaterials.get(name) || this.particleMaterials.get('default');
    if (!material) {
      console.error(`No material found for particle system: ${name}`);
      return;
    }
    material.vertexColors = true;
    
    // Create points object
    const points = new THREE.Points(geometry, material);
    points.name = name;
    
    // Remove existing system with same name
    const existing = this.particleGroup.getObjectByName(name);
    if (existing) {
      this.particleGroup.remove(existing);
    }
    
    // Add to scene
    this.particleGroup.add(points);
    this.particleGeometries.set(name, geometry);
    
    console.log(`✨ Added particle system: ${name} (${positions.length / 3} particles)`);
  }

  /**
   * Update particle system positions
   */
  updateParticleSystem(name: string, positions: Float32Array): void {
    const geometry = this.particleGeometries.get(name);
    if (geometry) {
      const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
      positionAttribute.set(positions);
      positionAttribute.needsUpdate = true;
    }
  }

  /**
   * Create some test particles to show it's working
   */
  createTestParticles(): void {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Positions in a sphere
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Random colors
      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();
    }
    
    this.addParticleSystem('test', positions, colors);
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    // Dispose of geometries
    for (const [, geometry] of this.particleGeometries) {
      geometry.dispose();
    }
    this.particleGeometries.clear();
    
    // Dispose of materials
    for (const [, material] of this.particleMaterials) {
      material.dispose();
    }
    this.particleMaterials.clear();
    
    // Dispose of composer
    if (this.composer) {
      this.composer.dispose();
    }
    
    // Dispose of renderer
    this.renderer.dispose();
    
    console.log('🔥 Three.js renderer destroyed');
  }
} 