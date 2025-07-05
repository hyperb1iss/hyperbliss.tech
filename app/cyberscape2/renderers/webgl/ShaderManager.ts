/**
 * Shader Manager for CyberScape 2.0 WebGL Renderer
 * 
 * Handles shader compilation, linking, and management for
 * particle effects and post-processing.
 */

export interface ShaderProgram {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation>;
  attributes: Record<string, number>;
}

export class ShaderManager {
  private gl: WebGL2RenderingContext | WebGLRenderingContext;
  private programs = new Map<string, ShaderProgram>();
  private currentProgram: WebGLProgram | null = null;

  constructor(gl: WebGL2RenderingContext | WebGLRenderingContext) {
    this.gl = gl;
  }

  /**
   * Initialize shader manager with default shaders
   */
  async initialize(): Promise<void> {
    // Create basic particle shader
    await this.createParticleShader();
    
    // Create post-processing shaders
    await this.createBloomShader();
    
    console.log('🎨 Shader manager initialized');
  }

  /**
   * Create particle rendering shader
   */
  private async createParticleShader(): Promise<void> {
    const vertexShader = `
      attribute vec3 a_position;
      attribute vec4 a_color;
      attribute float a_size;
      
      uniform mat4 u_projection;
      uniform mat4 u_view;
      uniform float u_pointScale;
      
      varying vec4 v_color;
      
      void main() {
        gl_Position = u_projection * u_view * vec4(a_position, 1.0);
        gl_PointSize = a_size * u_pointScale;
        v_color = a_color;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      
      varying vec4 v_color;
      uniform float u_time;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Circular particle with glow
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        alpha *= v_color.a;
        
        // Add subtle animation
        alpha *= 0.8 + 0.2 * sin(u_time * 0.001);
        
        gl_FragColor = vec4(v_color.rgb, alpha);
      }
    `;

    const program = this.createShaderProgram('particle', vertexShader, fragmentShader);
    if (program) {
      this.programs.set('particle', program);
    }
  }

  /**
   * Create bloom post-processing shader
   */
  private async createBloomShader(): Promise<void> {
    const vertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      
      uniform sampler2D u_texture;
      uniform vec2 u_resolution;
      uniform float u_threshold;
      uniform float u_intensity;
      
      varying vec2 v_texCoord;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        
        // Extract bright areas
        float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        if (brightness > u_threshold) {
          gl_FragColor = color * u_intensity;
        } else {
          gl_FragColor = vec4(0.0);
        }
      }
    `;

    const program = this.createShaderProgram('bloom', vertexShader, fragmentShader);
    if (program) {
      this.programs.set('bloom', program);
    }
  }

  /**
   * Create and compile shader program
   */
  private createShaderProgram(name: string, vertexSource: string, fragmentSource: string): ShaderProgram | null {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
      console.error(`Failed to compile shaders for program: ${name}`);
      return null;
    }

    const program = this.gl.createProgram();
    if (!program) {
      console.error(`Failed to create program: ${name}`);
      return null;
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    // Clean up shaders (they're now part of the program)
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      console.error(`Failed to link program ${name}:`, error);
      this.gl.deleteProgram(program);
      return null;
    }

    // Get uniform and attribute locations
    const uniforms: Record<string, WebGLUniformLocation> = {};
    const attributes: Record<string, number> = {};

    // Get all active uniforms
    const uniformCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformInfo = this.gl.getActiveUniform(program, i);
      if (uniformInfo) {
        const location = this.gl.getUniformLocation(program, uniformInfo.name);
        if (location) {
          uniforms[uniformInfo.name] = location;
        }
      }
    }

    // Get all active attributes
    const attributeCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attributeCount; i++) {
      const attributeInfo = this.gl.getActiveAttrib(program, i);
      if (attributeInfo) {
        const location = this.gl.getAttribLocation(program, attributeInfo.name);
        attributes[attributeInfo.name] = location;
      }
    }

    console.log(`✅ Shader program '${name}' created successfully`);
    return { program, uniforms, attributes };
  }

  /**
   * Compile individual shader
   */
  private compileShader(type: number, source: string): WebGLShader | null {
    // Validate WebGL context first
    if (!this.gl || this.gl.isContextLost()) {
      console.error('WebGL context is invalid or lost');
      return null;
    }

    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader object');
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      const shaderType = type === this.gl.VERTEX_SHADER ? 'vertex' : 'fragment';
      
      console.error(`❌ ${shaderType} shader compilation failed:`);
      console.error('Error:', error || 'Unknown compilation error');
      console.error('Shader source:');
      console.error(source);
      
      // Check for specific WebGL errors
      const glError = this.gl.getError();
      if (glError !== this.gl.NO_ERROR) {
        console.error('WebGL Error Code:', glError);
      }
      
      this.gl.deleteShader(shader);
      return null;
    }

    console.log(`✅ ${type === this.gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader compiled successfully`);
    return shader;
  }

  /**
   * Use shader program
   */
  useProgram(name: string): ShaderProgram | null {
    const shaderProgram = this.programs.get(name);
    if (!shaderProgram) {
      console.error(`Shader program '${name}' not found`);
      return null;
    }

    if (this.currentProgram !== shaderProgram.program) {
      this.gl.useProgram(shaderProgram.program);
      this.currentProgram = shaderProgram.program;
    }

    return shaderProgram;
  }

  /**
   * Get shader program
   */
  getProgram(name: string): ShaderProgram | null {
    return this.programs.get(name) || null;
  }

  /**
   * Set uniform value
   */
     setUniform(program: ShaderProgram, name: string, value: number | number[]): void {
    const location = program.uniforms[name];
    if (!location) {
      console.warn(`Uniform '${name}' not found in program`);
      return;
    }

    // Determine uniform type and set accordingly
    if (typeof value === 'number') {
      this.gl.uniform1f(location, value);
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 2:
          this.gl.uniform2fv(location, value);
          break;
        case 3:
          this.gl.uniform3fv(location, value);
          break;
        case 4:
          this.gl.uniform4fv(location, value);
          break;
        case 16:
          this.gl.uniformMatrix4fv(location, false, value);
          break;
        default:
          console.warn(`Unsupported uniform array length: ${value.length}`);
      }
    }
  }

  /**
   * Enable vertex attribute
   */
  enableAttribute(program: ShaderProgram, name: string): void {
    const location = program.attributes[name];
    if (location !== undefined && location >= 0) {
      this.gl.enableVertexAttribArray(location);
    }
  }

  /**
   * Set vertex attribute pointer
   */
  setAttributePointer(program: ShaderProgram, name: string, size: number, type: number, normalized: boolean, stride: number, offset: number): void {
    const location = program.attributes[name];
    if (location !== undefined && location >= 0) {
      this.gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
    }
  }

  /**
   * Get list of available programs
   */
  getAvailablePrograms(): string[] {
    return Array.from(this.programs.keys());
  }

  /**
   * Cleanup resources
   */
     destroy(): void {
     for (const [, program] of this.programs) {
       this.gl.deleteProgram(program.program);
     }
     this.programs.clear();
     this.currentProgram = null;
     
     console.log('🎨 Shader manager destroyed');
   }
} 