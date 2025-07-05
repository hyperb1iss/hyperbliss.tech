import type { Renderer, RendererCapabilities } from "../CyberScape2";
import type { CyberScape2Config } from "../CyberScape2Config";

/**
 * Canvas2D Fallback Renderer for CyberScape 2.0
 * 
 * High-performance Canvas2D rendering for devices without WebGL support
 * or when WebGL fallback is forced. Maintains visual quality while
 * optimizing for lower-end devices.
 */
export class Canvas2DRenderer implements Renderer {
  private canvas: HTMLCanvasElement;
  private config: CyberScape2Config;
  private ctx: CanvasRenderingContext2D | null = null;
  
  private width = 0;
  private height = 0;
  private capabilities: RendererCapabilities | null = null;
  
  // Canvas2D specific optimizations
  private imageData: ImageData | null = null;
  private gradientCache = new Map<string, CanvasGradient>();

  constructor(canvas: HTMLCanvasElement, config: CyberScape2Config) {
    this.canvas = canvas;
    this.config = config;
  }

  /**
   * Initialize Canvas2D renderer
   */
  async initialize(): Promise<boolean> {
    try {
      this.ctx = this.canvas.getContext('2d', { 
        willReadFrequently: true,
        alpha: true 
      });
      
      if (!this.ctx) {
        console.error('❌ Failed to get Canvas2D context');
        return false;
      }

      console.log('🎨 Canvas2D context acquired');

      // Setup Canvas2D state
      this.setupCanvas2DState();

      // Determine capabilities
      this.capabilities = this.determineCapabilities();

      console.log('✨ Canvas2D renderer initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ Canvas2D renderer initialization failed:', error);
      return false;
    }
  }

  /**
   * Setup Canvas2D rendering state
   */
  private setupCanvas2DState(): void {
    if (!this.ctx) return;

    const config = this.config.canvas2d;
    
    this.ctx.globalCompositeOperation = config.compositeOperation;
    this.ctx.imageSmoothingEnabled = config.imageSmoothingEnabled;
    this.ctx.lineCap = config.lineCap;
    this.ctx.lineJoin = config.lineJoin;
  }

  /**
   * Determine renderer capabilities
   */
  private determineCapabilities(): RendererCapabilities {
    // Canvas2D is always available but with limitations
    const isMobile = this.width <= this.config.performance.mobileThreshold;
    const performanceLevel = isMobile ? 'low' : 'medium';
    const maxParticles = isMobile ? 100 : 250;

    if (this.config.debug.showRenderer) {
      console.log(`🎨 Canvas2D Capabilities:
        - Performance Level: ${performanceLevel}
        - Max Particles: ${maxParticles}
        - Mobile Device: ${isMobile}`);
    }

    return {
      type: 'canvas2d',
      maxParticles,
      supportsBloom: false, // No post-processing in Canvas2D
      supportsShaders: false, // No shaders in Canvas2D
      performanceLevel
    };
  }

  /**
   * Main render function
   */
  render(deltaTime: number): void {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Note: Actual particle rendering will be handled by the ParticleSystem
    // This renderer provides the context and basic setup
  }

  /**
   * Handle canvas resize
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    if (!this.ctx) return;

    // Clear gradient cache on resize
    this.gradientCache.clear();

    // Update image data for optimizations
    this.imageData = this.ctx.createImageData(width, height);

    // Re-setup Canvas2D state
    this.setupCanvas2DState();
  }

  /**
   * Get renderer capabilities
   */
  getCapabilities(): RendererCapabilities {
    return this.capabilities || {
      type: 'canvas2d',
      maxParticles: 100,
      supportsBloom: false,
      supportsShaders: false,
      performanceLevel: 'low'
    };
  }

  /**
   * Get rendering context for external use
   */
  getContext(): CanvasRenderingContext2D | null {
    return this.ctx;
  }

  /**
   * Create or get cached gradient
   */
  getCachedGradient(key: string, creator: () => CanvasGradient): CanvasGradient {
    if (!this.gradientCache.has(key)) {
      this.gradientCache.set(key, creator());
    }
    return this.gradientCache.get(key)!;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.gradientCache.clear();
    this.imageData = null;
    
    console.log('🎨 Canvas2D renderer destroyed');
  }
} 