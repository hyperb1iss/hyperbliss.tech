/**
 * WebGL Bloom Post-Processing Effect for CyberScape 2.0
 * 
 * Multi-pass bloom effect with gaussian blur and threshold filtering
 * to create glowing particle halos and neon-like visual effects.
 */

import type { ShaderManager } from './ShaderManager';

export class BloomEffect {
  private gl: WebGL2RenderingContext | WebGLRenderingContext;
  private shaderManager: ShaderManager;
  
  // Frame buffers for multi-pass rendering
  private sceneFramebuffer: WebGLFramebuffer | null = null;
  private brightFramebuffer: WebGLFramebuffer | null = null;
  private blurFramebuffers: WebGLFramebuffer[] = [];
  
  // Textures for frame buffers
  private sceneTexture: WebGLTexture | null = null;
  private brightTexture: WebGLTexture | null = null;
  private blurTextures: WebGLTexture[] = [];
  
  // Bloom settings
  private threshold = 0.7;
  private intensity = 1.2;
  private radius = 0.8;
  private passes = 3;
  
  private width = 0;
  private height = 0;
  private isInitialized = false;

  constructor(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    shaderManager: ShaderManager
  ) {
    this.gl = gl;
    this.shaderManager = shaderManager;
  }

  /**
   * Initialize bloom effect with frame buffers and textures
   */
  async initialize(width: number, height: number): Promise<void> {
    this.width = width;
    this.height = height;

    try {
      // Create main scene framebuffer
      await this.createSceneFramebuffer();
      
      // Create bright pass framebuffer  
      await this.createBrightFramebuffer();
      
      // Create blur framebuffers for multiple passes
      await this.createBlurFramebuffers();
      
      this.isInitialized = true;
      console.log('🌟 Bloom effect initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize bloom effect:', error);
      throw error;
    }
  }

  /**
   * Create framebuffer for main scene rendering
   */
  private async createSceneFramebuffer(): Promise<void> {
    const gl = this.gl;

    // Create framebuffer
    this.sceneFramebuffer = gl.createFramebuffer();
    if (!this.sceneFramebuffer) {
      throw new Error('Failed to create scene framebuffer');
    }

    // Create texture
    this.sceneTexture = gl.createTexture();
    if (!this.sceneTexture) {
      throw new Error('Failed to create scene texture');
    }

    // Setup texture
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Attach texture to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.sceneTexture, 0);

    // Check framebuffer completeness
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Scene framebuffer is not complete');
    }

    // Cleanup
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Create framebuffer for bright pass filtering
   */
  private async createBrightFramebuffer(): Promise<void> {
    const gl = this.gl;

    // Create framebuffer
    this.brightFramebuffer = gl.createFramebuffer();
    if (!this.brightFramebuffer) {
      throw new Error('Failed to create bright framebuffer');
    }

    // Create texture (half resolution for performance)
    this.brightTexture = gl.createTexture();
    if (!this.brightTexture) {
      throw new Error('Failed to create bright texture');
    }

    const halfWidth = Math.floor(this.width / 2);
    const halfHeight = Math.floor(this.height / 2);

    // Setup texture
    gl.bindTexture(gl.TEXTURE_2D, this.brightTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, halfWidth, halfHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Attach to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.brightFramebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.brightTexture, 0);

    // Check completeness
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Bright framebuffer is not complete');
    }

    // Cleanup
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Create framebuffers for blur passes
   */
  private async createBlurFramebuffers(): Promise<void> {
    const gl = this.gl;

    for (let i = 0; i < this.passes; i++) {
      // Create framebuffer
      const framebuffer = gl.createFramebuffer();
      if (!framebuffer) {
        throw new Error(`Failed to create blur framebuffer ${i}`);
      }

      // Create texture
      const texture = gl.createTexture();
      if (!texture) {
        throw new Error(`Failed to create blur texture ${i}`);
      }

      // Progressively smaller resolutions
      const scale = 0.5 ** (i + 1);
      const width = Math.floor(this.width * scale);
      const height = Math.floor(this.height * scale);

      // Setup texture
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // Attach to framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

      // Check completeness
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Blur framebuffer ${i} is not complete`);
      }

      this.blurFramebuffers.push(framebuffer);
      this.blurTextures.push(texture);
    }

    // Cleanup
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  /**
   * Begin bloom effect rendering (bind scene framebuffer)
   */
  beginRender(): void {
    if (!this.isInitialized) return;

    const gl = this.gl;
    
    // Bind scene framebuffer for main rendering
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFramebuffer);
    gl.viewport(0, 0, this.width, this.height);
    
    // Clear with transparent black
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * Apply bloom effect and render to screen
   */
  endRender(): void {
    if (!this.isInitialized) return;

    // Step 1: Extract bright areas
    this.extractBrightAreas();
    
    // Step 2: Apply gaussian blur
    this.applyBlur();
    
    // Step 3: Composite everything to screen
    this.compositeToScreen();
  }

  /**
   * Extract bright areas using threshold
   */
  private extractBrightAreas(): void {
    const gl = this.gl;
    const program = this.shaderManager.getProgram('bright');
    
    if (!program) {
      console.warn('Bright pass shader not available');
      return;
    }

    // Bind bright framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.brightFramebuffer);
    gl.viewport(0, 0, Math.floor(this.width / 2), Math.floor(this.height / 2));

    // Use bright pass shader
    this.shaderManager.useProgram('bright');
    
    // Set uniforms
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    this.shaderManager.setUniform(program, 'u_scene', 0);
    this.shaderManager.setUniform(program, 'u_threshold', this.threshold);

    // Render fullscreen quad
    this.renderFullscreenQuad();
  }

  /**
   * Apply gaussian blur to bright areas
   */
  private applyBlur(): void {
    const gl = this.gl;
    const blurProgram = this.shaderManager.getProgram('blur');
    
    if (!blurProgram) {
      console.warn('Blur shader not available');
      return;
    }

    this.shaderManager.useProgram('blur');

    // Blur each mip level
    for (let i = 0; i < this.passes; i++) {
      const framebuffer = this.blurFramebuffers[i];
      const texture = i === 0 ? this.brightTexture : this.blurTextures[i - 1];
      
      const scale = 0.5 ** (i + 1);
      const width = Math.floor(this.width * scale);
      const height = Math.floor(this.height * scale);

      // Bind framebuffer
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.viewport(0, 0, width, height);

      // Set texture and uniforms
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      this.shaderManager.setUniform(blurProgram, 'u_texture', 0);
      this.shaderManager.setUniform(blurProgram, 'u_texelSize', [1.0 / width, 1.0 / height]);
      this.shaderManager.setUniform(blurProgram, 'u_radius', this.radius * (i + 1));

      // Render
      this.renderFullscreenQuad();
    }
  }

  /**
   * Composite bloom effect to screen
   */
  private compositeToScreen(): void {
    const gl = this.gl;
    const compositeProgram = this.shaderManager.getProgram('bloom-composite');
    
    if (!compositeProgram) {
      console.warn('Bloom composite shader not available');
      return;
    }

    // Bind default framebuffer (screen)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.width, this.height);

    // Use composite shader
    this.shaderManager.useProgram('bloom-composite');

    // Set scene texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.sceneTexture);
    this.shaderManager.setUniform(compositeProgram, 'u_scene', 0);

    // Set bloom textures
    for (let i = 0; i < this.passes; i++) {
      gl.activeTexture(gl.TEXTURE1 + i);
      gl.bindTexture(gl.TEXTURE_2D, this.blurTextures[i]);
      this.shaderManager.setUniform(compositeProgram, `u_bloom${i}`, 1 + i);
    }

    // Set bloom intensity
    this.shaderManager.setUniform(compositeProgram, 'u_intensity', this.intensity);

    // Enable additive blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    // Render final composite
    this.renderFullscreenQuad();

    // Cleanup
    gl.disable(gl.BLEND);
  }

  /**
   * Render a fullscreen quad for post-processing
   */
  private renderFullscreenQuad(): void {
    // This would typically use a quad vertex buffer
    // For now, we'll use a simple implementation
    // In practice, you'd have a dedicated quad mesh
    
    // Mock implementation - in real code this would draw a quad
    console.log('🔳 Rendering fullscreen quad (mock)');
  }

  /**
   * Update bloom settings
   */
  updateSettings(settings: Partial<{
    threshold: number;
    intensity: number;
    radius: number;
    passes: number;
  }>): void {
    if (settings.threshold !== undefined) this.threshold = settings.threshold;
    if (settings.intensity !== undefined) this.intensity = settings.intensity;
    if (settings.radius !== undefined) this.radius = settings.radius;
    if (settings.passes !== undefined) this.passes = settings.passes;
  }

  /**
   * Resize bloom effect for canvas changes
   */
  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;

    // Destroy existing resources
    this.destroy();

    // Reinitialize with new size
    this.initialize(width, height);
  }

  /**
   * Cleanup bloom effect resources
   */
  destroy(): void {
    const gl = this.gl;

    // Cleanup framebuffers
    if (this.sceneFramebuffer) {
      gl.deleteFramebuffer(this.sceneFramebuffer);
      this.sceneFramebuffer = null;
    }

    if (this.brightFramebuffer) {
      gl.deleteFramebuffer(this.brightFramebuffer);
      this.brightFramebuffer = null;
    }

    for (const framebuffer of this.blurFramebuffers) {
      gl.deleteFramebuffer(framebuffer);
    }
    this.blurFramebuffers = [];

    // Cleanup textures
    if (this.sceneTexture) {
      gl.deleteTexture(this.sceneTexture);
      this.sceneTexture = null;
    }

    if (this.brightTexture) {
      gl.deleteTexture(this.brightTexture);
      this.brightTexture = null;
    }

    for (const texture of this.blurTextures) {
      gl.deleteTexture(texture);
    }
    this.blurTextures = [];

    this.isInitialized = false;
    console.log('🧹 Bloom effect destroyed');
  }
} 