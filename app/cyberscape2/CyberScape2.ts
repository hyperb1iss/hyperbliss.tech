import { CyberScape2Config } from "./CyberScape2Config";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Canvas2DRenderer } from "./renderers/Canvas2DRenderer";
import { HeaderSystem } from "./header/HeaderSystem";
import { PerformanceManager } from "./core/PerformanceManager";
import { InputManager } from "./core/InputManager";
import { ParticleSystem } from "./particles/ParticleSystem";

/**
 * CyberScape 2.0 - The Next Generation
 * 
 * A WebGL-first, header-focused, intelligent particle ecosystem that transforms
 * the hyperbliss.tech header into a living digital experience.
 * 
 * Key features:
 * - WebGL rendering with Canvas2D fallback
 * - Header-centric particle behaviors
 * - Interactive navigation elements
 * - Smart performance scaling
 * - Signature "Bliss Particle" effects
 */

export interface CyberScape2Options {
  canvas: HTMLCanvasElement;
  headerElement: HTMLElement;
  logoElement: HTMLAnchorElement;
  navElement: HTMLElement;
  forceFallback?: boolean; // Force Canvas2D for testing
}

export interface Renderer {
  initialize(): Promise<boolean>;
  render(deltaTime: number): void;
  resize(width: number, height: number): void;
  destroy(): void;
  getCapabilities(): RendererCapabilities;
}

export interface RendererCapabilities {
  type: 'webgl' | 'canvas2d';
  maxParticles: number;
  supportsBloom: boolean;
  supportsShaders: boolean;
  performanceLevel: 'high' | 'medium' | 'low';
}

/**
 * Main CyberScape 2.0 controller class
 */
export class CyberScape2 {
  private config: CyberScape2Config;
  private renderer: Renderer | null = null;
  private headerSystem: HeaderSystem | null = null;
  private performanceManager: PerformanceManager;
  private inputManager: InputManager;
  private particleSystem: ParticleSystem | null = null;
  
  private canvas: HTMLCanvasElement;
  private headerElement: HTMLElement;
  private logoElement: HTMLAnchorElement;
  private navElement: HTMLElement;
  
  private animationFrameId: number = 0;
  private lastFrameTime: number = 0;
  private isInitialized: boolean = false;
  private isDestroyed: boolean = false;

  constructor(options: CyberScape2Options) {
    this.config = CyberScape2Config.getInstance();
    this.canvas = options.canvas;
    this.headerElement = options.headerElement;
    this.logoElement = options.logoElement;
    this.navElement = options.navElement;
    
    this.performanceManager = new PerformanceManager();
    this.inputManager = new InputManager(this.canvas, this.headerElement);
    
    // Store fallback preference
    if (options.forceFallback) {
      this.config.setForceFallback(true);
    }
  }

  /**
   * Initialize CyberScape 2.0
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.warn('CyberScape 2.0 is already initialized');
      return true;
    }

    try {
      // 1. Detect rendering capabilities and initialize renderer
      const rendererType = await this.detectRenderingCapabilities();
      console.log(`🚀 CyberScape 2.0 initializing with ${rendererType} renderer`);
      
      this.renderer = this.createRenderer(rendererType);
      const rendererInitialized = await this.renderer.initialize();
      
      if (!rendererInitialized) {
        throw new Error('Failed to initialize renderer');
      }

      // 2. Initialize core systems
      await this.initializeCoreSystem();
      
      // 3. Start the render loop
      this.startRenderLoop();
      
      this.isInitialized = true;
      console.log('✨ CyberScape 2.0 successfully initialized!');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize CyberScape 2.0:', error);
      return false;
    }
  }

  /**
   * Detect the best rendering approach for this device
   */
  private async detectRenderingCapabilities(): Promise<'webgl' | 'canvas2d'> {
    // Check if fallback is forced
    if (this.config.getForceFallback()) {
      return 'canvas2d';
    }

    // Test WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    
    if (!gl) {
      console.log('📱 WebGL not supported, using Canvas2D fallback');
      return 'canvas2d';
    }

    // Check WebGL capabilities
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const maxVertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    
    // Basic WebGL capability check
    if (maxTextureSize < 1024 || maxVertexAttribs < 8) {
      console.log('📱 Limited WebGL capabilities, using Canvas2D fallback');
      return 'canvas2d';
    }

    console.log(`🔥 WebGL detected! Max texture: ${maxTextureSize}px, Vertex attribs: ${maxVertexAttribs}`);
    return 'webgl';
  }

  /**
   * Create the appropriate renderer
   */
  private createRenderer(type: 'webgl' | 'canvas2d'): Renderer {
    if (type === 'webgl') {
      return new WebGLRenderer(this.canvas, this.config);
    } else {
      return new Canvas2DRenderer(this.canvas, this.config);
    }
  }

  /**
   * Initialize core systems
   */
  private async initializeCoreSystem(): Promise<void> {
    if (!this.renderer) {
      throw new Error('Renderer not initialized');
    }

    // Initialize performance monitoring
    this.performanceManager.initialize();
    
    // Initialize input handling
    this.inputManager.initialize();
    
    // Initialize particle system
    const capabilities = this.renderer.getCapabilities();
    this.particleSystem = new ParticleSystem(capabilities);
    await this.particleSystem.initialize();
    
    // Initialize header system (the star of the show!)
    this.headerSystem = new HeaderSystem(
      this.headerElement,
      this.logoElement,
      this.navElement,
      this.particleSystem,
      capabilities
    );
    await this.headerSystem.initialize();
    
    // Set up resize handling
    this.setupResizeHandling();
  }

  /**
   * Setup responsive canvas and header scaling
   */
  private setupResizeHandling(): void {
    const handleResize = () => {
      const rect = this.headerElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Update canvas size
      this.canvas.width = width * window.devicePixelRatio;
      this.canvas.height = height * window.devicePixelRatio;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      
      // Notify renderer and systems
      this.renderer?.resize(width, height);
      this.headerSystem?.resize(width, height);
      this.particleSystem?.resize(width, height);
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(this.headerElement);
    
    // Initial resize
    handleResize();
  }

  /**
   * Start the main render loop
   */
  private startRenderLoop(): void {
    const renderFrame = (timestamp: number) => {
      if (this.isDestroyed) return;
      
      const deltaTime = timestamp - this.lastFrameTime;
      this.lastFrameTime = timestamp;
      
      // Update performance metrics
      this.performanceManager.update(timestamp, deltaTime);
      
      // Update input state
      this.inputManager.update();
      
      // Update header system
      this.headerSystem?.update(deltaTime, this.inputManager);
      
      // Update particle system
      this.particleSystem?.update(deltaTime, this.inputManager);
      
      // Render everything
      this.renderer?.render(deltaTime);
      
      // Check for performance adjustments
      this.performanceManager.adjustPerformance(this.particleSystem, this.headerSystem);
      
      this.animationFrameId = requestAnimationFrame(renderFrame);
    };

    this.animationFrameId = requestAnimationFrame(renderFrame);
  }

  /**
   * Trigger special header animation (for external calls)
   */
  triggerAnimation(x: number, y: number): void {
    this.headerSystem?.triggerSpecialAnimation(x, y);
  }

  /**
   * Create test particles (for demo purposes)
   */
  createTestParticles(): void {
    if (this.renderer && 'createTestParticles' in this.renderer) {
      (this.renderer as any).createTestParticles();
    }
  }

  /**
   * Get renderer capabilities
   */
  getCapabilities(): RendererCapabilities | null {
    return this.renderer ? this.renderer.getCapabilities() : null;
  }

  /**
   * Destroy CyberScape 2.0 and cleanup resources
   */
  destroy(): void {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    // Cleanup systems
    this.renderer?.destroy();
    this.headerSystem?.destroy();
    this.particleSystem?.destroy();
    this.inputManager.destroy();
    this.performanceManager.destroy();
    
    console.log('🔥 CyberScape 2.0 destroyed');
  }
}

/**
 * Initialize CyberScape 2.0 (main entry point)
 */
export async function initializeCyberScape2(options: CyberScape2Options): Promise<() => void> {
  const cyberscape = new CyberScape2(options);
  const initialized = await cyberscape.initialize();
  
  if (!initialized) {
    throw new Error('Failed to initialize CyberScape 2.0');
  }
  
  // Return cleanup function
  return () => cyberscape.destroy();
}

/**
 * Trigger CyberScape 2.0 animation (external API)
 */
let globalCyberScape2Instance: CyberScape2 | null = null;

export function setCyberScape2Instance(instance: CyberScape2): void {
  globalCyberScape2Instance = instance;
}

export function triggerCyberScape2Animation(x: number, y: number): void {
  globalCyberScape2Instance?.triggerAnimation(x, y);
} 