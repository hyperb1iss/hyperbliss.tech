/**
 * WebGL Particle Renderer for CyberScape 2.0
 * 
 * Handles GPU-accelerated particle rendering with instanced drawing
 * and efficient vertex buffer management.
 */

import type { ShaderManager, ShaderProgram } from './ShaderManager';
import type { Particle } from '../../particles/ParticleSystem';

export class ParticleRenderer {
  private gl: WebGL2RenderingContext | WebGLRenderingContext;
  private shaderManager: ShaderManager;
  
  // Vertex buffers for instanced rendering
  private positionBuffer: WebGLBuffer | null = null;
  private colorBuffer: WebGLBuffer | null = null;
  private sizeBuffer: WebGLBuffer | null = null;
  private vertexArray: WebGLVertexArrayObject | null = null;
  
  // Particle data arrays (updated each frame)
  private positions: Float32Array;
  private colors: Float32Array;
  private sizes: Float32Array;
  
  private maxParticles: number;
  private currentParticleCount = 0;

  constructor(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    shaderManager: ShaderManager,
    maxParticles = 1000
  ) {
    this.gl = gl;
    this.shaderManager = shaderManager;
    this.maxParticles = maxParticles;
    
    // Pre-allocate arrays for particle data
    this.positions = new Float32Array(maxParticles * 3); // x, y, z
    this.colors = new Float32Array(maxParticles * 4);    // r, g, b, a
    this.sizes = new Float32Array(maxParticles);         // size
  }

  /**
   * Initialize particle renderer with vertex buffers
   */
  async initialize(): Promise<void> {
    // Create vertex buffers
    this.positionBuffer = this.gl.createBuffer();
    this.colorBuffer = this.gl.createBuffer();
    this.sizeBuffer = this.gl.createBuffer();

    if (!this.positionBuffer || !this.colorBuffer || !this.sizeBuffer) {
      throw new Error('Failed to create particle vertex buffers');
    }

    // Create vertex array object (WebGL2) or manage manually (WebGL1)
    if (this.gl instanceof WebGL2RenderingContext) {
      this.vertexArray = this.gl.createVertexArray();
      if (!this.vertexArray) {
        throw new Error('Failed to create vertex array object');
      }
    }

    // Initialize buffers with empty data
    this.setupBuffers();

    console.log('🎨 Particle renderer initialized with', this.maxParticles, 'max particles');
  }

  /**
   * Setup vertex buffers and attributes
   */
  private setupBuffers(): void {
    const gl = this.gl;

    // Bind vertex array if using WebGL2
    if (this.vertexArray && gl instanceof WebGL2RenderingContext) {
      (gl as WebGL2RenderingContext).bindVertexArray(this.vertexArray);
    }

    // Position buffer (x, y, z)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);

    // Color buffer (r, g, b, a)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.DYNAMIC_DRAW);

    // Size buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.sizes, gl.DYNAMIC_DRAW);

    // Unbind
    if (this.vertexArray && gl instanceof WebGL2RenderingContext) {
      (gl as WebGL2RenderingContext).bindVertexArray(null);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  /**
   * Update particle data and render
   */
  render(particles: Particle[], deltaTime: number): void {
    if (particles.length === 0) return;

    // Update particle data arrays
    this.updateParticleData(particles);

    // Get particle shader program
    const program = this.shaderManager.getProgram('particle');
    if (!program) {
      console.warn('Particle shader program not found');
      return;
    }

    // Use shader program
    this.shaderManager.useProgram('particle');

    // Update uniforms
    this.updateUniforms(program, deltaTime);

    // Setup vertex attributes
    this.setupVertexAttributes(program);

    // Render particles
    this.drawParticles();
  }

  /**
   * Update particle data arrays from particle list
   */
  private updateParticleData(particles: Particle[]): void {
    this.currentParticleCount = Math.min(particles.length, this.maxParticles);

    for (let i = 0; i < this.currentParticleCount; i++) {
      const particle = particles[i];
      const pos = i * 3;
      const col = i * 4;

      // Update position
      this.positions[pos] = particle.x;
      this.positions[pos + 1] = particle.y;
      this.positions[pos + 2] = particle.z;

      // Update color
      this.colors[col] = particle.color.r;
      this.colors[col + 1] = particle.color.g;
      this.colors[col + 2] = particle.color.b;
      this.colors[col + 3] = particle.color.a;

      // Update size
      this.sizes[i] = particle.size;
    }
  }

  /**
   * Update shader uniforms
   */
  private updateUniforms(program: ShaderProgram, deltaTime: number): void {
    // Time uniform for animations
    this.shaderManager.setUniform(program, 'u_time', performance.now() / 1000);
    this.shaderManager.setUniform(program, 'u_deltaTime', deltaTime);

    // View/projection matrices would go here
    // For now, we'll use simple 2D projection
    const projection = this.create2DProjectionMatrix();
    this.shaderManager.setUniform(program, 'u_projection', projection);
  }

  /**
   * Create simple 2D projection matrix
   */
  private create2DProjectionMatrix(): number[] {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const width = canvas.width;
    const height = canvas.height;

    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ];
  }

  /**
   * Setup vertex attributes for rendering
   */
  private setupVertexAttributes(program: ShaderProgram): void {
    const gl = this.gl;

    // Bind vertex array if using WebGL2
    if (this.vertexArray && gl instanceof WebGL2RenderingContext) {
      (gl as WebGL2RenderingContext).bindVertexArray(this.vertexArray);
    } else {
      // Manual attribute setup for WebGL1
      this.setupAttributesManually(program);
    }

    // Update buffer data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.sizes);
  }

  /**
   * Setup vertex attributes manually (WebGL1 compatibility)
   */
  private setupAttributesManually(program: ShaderProgram): void {
    const gl = this.gl;

    // Position attribute
    const positionLoc = program.attributes.a_position;
    if (positionLoc !== undefined) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    }

    // Color attribute
    const colorLoc = program.attributes.a_color;
    if (colorLoc !== undefined) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    }

    // Size attribute
    const sizeLoc = program.attributes.a_size;
    if (sizeLoc !== undefined) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer);
      gl.enableVertexAttribArray(sizeLoc);
      gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0);
    }
  }

  /**
   * Draw particles using point sprites
   */
  private drawParticles(): void {
    const gl = this.gl;

    // Enable blending for particle effects
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Draw points
    gl.drawArrays(gl.POINTS, 0, this.currentParticleCount);

    // Cleanup
    gl.disable(gl.BLEND);
    
    if (this.vertexArray && gl instanceof WebGL2RenderingContext) {
      (gl as WebGL2RenderingContext).bindVertexArray(null);
    }
  }

  /**
   * Resize renderer for canvas size changes
   */
  resize(_width: number, _height: number): void {
    // Update projection matrix for new canvas size
    // This will be called by the main renderer
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    const gl = this.gl;

    if (this.positionBuffer) {
      gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }

    if (this.colorBuffer) {
      gl.deleteBuffer(this.colorBuffer);
      this.colorBuffer = null;
    }

    if (this.sizeBuffer) {
      gl.deleteBuffer(this.sizeBuffer);
      this.sizeBuffer = null;
    }

    if (this.vertexArray && gl instanceof WebGL2RenderingContext) {
      gl.deleteVertexArray(this.vertexArray);
      this.vertexArray = null;
    }

    console.log('🧹 Particle renderer destroyed');
  }
} 