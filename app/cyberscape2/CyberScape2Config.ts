/**
 * CyberScape 2.0 Configuration
 * 
 * Centralized configuration system for CyberScape 2.0 with header-focused
 * settings, adaptive performance scaling, and intelligent defaults.
 */

export interface HeaderConfig {
  // Logo particle settings
  logoParticleCount: number;
  logoAnimationDuration: number;
  logoHoverIntensity: number;
  
  // Navigation particle signatures
  navParticleSignatures: {
    home: ParticleSignature;
    about: ParticleSignature;
    projects: ParticleSignature;
    blog: ParticleSignature;
    contact: ParticleSignature;
  };
  
  // Header interaction zones
  mouseAttraction: {
    enabled: boolean;
    radius: number;
    strength: number;
  };
  
  // Header mood indicators
  statusIndicators: {
    enabled: boolean;
    availabilityColor: string;
    busyColor: string;
    focusColor: string;
  };
}

export interface ParticleSignature {
  color: string;
  behavior: 'orbit' | 'trail' | 'pulse' | 'spiral' | 'explode';
  intensity: number;
  count: number;
}

export interface PerformanceConfig {
  targetFPS: number;
  adaptiveScaling: boolean;
  performanceLevels: {
    high: PerformanceLevel;
    medium: PerformanceLevel;
    low: PerformanceLevel;
  };
  
  // Device detection
  mobileThreshold: number;
  highEndThreshold: number;
}

export interface PerformanceLevel {
  maxParticles: number;
  bloomEnabled: boolean;
  shadersEnabled: boolean;
  connectionLines: boolean;
  glitchEffects: boolean;
  frameSkip: number;
}

export interface BlissParticleConfig {
  enabled: boolean;
  trailColors: string[]; // Rainbow trail colors
  trailLength: number;
  sparkleIntensity: number;
  magneticStrength: number;
  specialBehaviors: string[];
}

/**
 * Main configuration class for CyberScape 2.0
 */
export class CyberScape2Config {
  private static instance: CyberScape2Config;
  private forceFallback: boolean = false;

  // ===== HEADER CONFIGURATION =====
  public header: HeaderConfig = {
    logoParticleCount: 150,
    logoAnimationDuration: 2000,
    logoHoverIntensity: 1.5,
    
    navParticleSignatures: {
      home: {
        color: '#00FFFF',
        behavior: 'orbit',
        intensity: 1.0,
        count: 20
      },
      about: {
        color: '#FF00FF',
        behavior: 'pulse',
        intensity: 0.8,
        count: 15
      },
      projects: {
        color: '#00FF00',
        behavior: 'spiral',
        intensity: 1.2,
        count: 25
      },
      blog: {
        color: '#FFFF00',
        behavior: 'trail',
        intensity: 0.9,
        count: 18
      },
      contact: {
        color: '#FF0080',
        behavior: 'explode',
        intensity: 1.1,
        count: 22
      }
    },
    
    mouseAttraction: {
      enabled: true,
      radius: 100,
      strength: 0.3
    },
    
    statusIndicators: {
      enabled: true,
      availabilityColor: '#00FF00',
      busyColor: '#FF6600',
      focusColor: '#0066FF'
    }
  };

  // ===== PERFORMANCE CONFIGURATION =====
  public performance: PerformanceConfig = {
    targetFPS: 60,
    adaptiveScaling: true,
    mobileThreshold: 768,
    highEndThreshold: 1920,
    
    performanceLevels: {
      high: {
        maxParticles: 500,
        bloomEnabled: true,
        shadersEnabled: true,
        connectionLines: true,
        glitchEffects: true,
        frameSkip: 0
      },
      medium: {
        maxParticles: 250,
        bloomEnabled: true,
        shadersEnabled: true,
        connectionLines: true,
        glitchEffects: false,
        frameSkip: 1
      },
      low: {
        maxParticles: 100,
        bloomEnabled: false,
        shadersEnabled: false,
        connectionLines: false,
        glitchEffects: false,
        frameSkip: 2
      }
    }
  };

  // ===== BLISS PARTICLE CONFIGURATION =====
  public blissParticle: BlissParticleConfig = {
    enabled: true,
    trailColors: [
      '#FF0080', '#FF0040', '#FF4000', '#FF8000', 
      '#FFFF00', '#80FF00', '#00FF40', '#00FF80',
      '#00FFFF', '#0080FF', '#4000FF', '#8000FF'
    ],
    trailLength: 20,
    sparkleIntensity: 0.8,
    magneticStrength: 1.5,
    specialBehaviors: ['rainbow-trail', 'magnetic', 'sparkle', 'time-sync']
  };

  // ===== PARTICLE SYSTEM =====
  public particles = {
    poolSize: 1000,
    baseLifespan: 5000,
    fadeInDuration: 200,
    fadeOutDuration: 1000,
    
    // Physics
    gravity: 0.0001,
    damping: 0.99,
    collisionRadius: 2,
    
    // Visuals
    minSize: 1,
    maxSize: 4,
    glowIntensity: 0.5,
    connectionDistance: 80,
    
    // Spawn settings
    spawnRate: 0.1,
    burstCount: 10,
    edgeSpawn: true
  };

  // ===== WEBGL SETTINGS =====
  public webgl = {
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    
    // Shader settings
    vertexShaderPrecision: 'mediump',
    fragmentShaderPrecision: 'mediump',
    
    // Bloom effect
    bloom: {
      threshold: 0.7,
      intensity: 1.2,
      radius: 0.8,
      passes: 3
    }
  };

  // ===== CANVAS2D FALLBACK =====
  public canvas2d = {
    compositeOperation: 'lighter' as GlobalCompositeOperation,
    imageSmoothingEnabled: true,
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
    
    // Shadow settings
    shadowEnabled: true,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0
  };

  // ===== COLOR SYSTEM =====
  public colors = {
    primary: '#00FFFF',
    secondary: '#FF00FF',
    accent: '#FFFF00',
    background: '#000011',
    
    palette: {
      neon: ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF0080'],
      cosmic: ['#4A00E0', '#8E2DE2', '#FA709A', '#FEE140', '#24FE41'],
      matrix: ['#00FF00', '#00AA00', '#008800', '#006600', '#004400'],
      sunset: ['#FF8A80', '#FF5722', '#FF9800', '#FFC107', '#FFEB3B']
    },
    
    // Dynamic color shifting
    hueShift: {
      enabled: true,
      speed: 0.001,
      range: 30
    }
  };

  // ===== TIMING & ANIMATION =====
  public timing = {
    frameTime: 1000 / 60, // 60 FPS target
    deltaTimeMax: 100,    // Prevent large jumps
    
    // Animation curves
    easing: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)'
    }
  };

  // ===== DEBUG & DEVELOPMENT =====
  public debug = {
    enabled: false,
    showFPS: false,
    showParticleCount: false,
    showRenderer: false,
    showPerformanceLevel: false,
    wireframe: false,
    
    // Console logging
    verbose: false,
    logPerformance: false,
    logParticles: false
  };

  private constructor() {
    // Auto-detect development mode
    this.debug.enabled = process.env.NODE_ENV === 'development';
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): CyberScape2Config {
    if (!CyberScape2Config.instance) {
      CyberScape2Config.instance = new CyberScape2Config();
    }
    return CyberScape2Config.instance;
  }

  /**
   * Force Canvas2D fallback (for testing or compatibility)
   */
  public setForceFallback(force: boolean): void {
    this.forceFallback = force;
  }

  public getForceFallback(): boolean {
    return this.forceFallback;
  }

  /**
   * Get performance level based on device capabilities
   */
  public getPerformanceLevel(width: number, height: number, isWebGL: boolean): PerformanceLevel {
    const pixelCount = width * height;
    const isMobile = width <= this.performance.mobileThreshold;
    
    if (isMobile || pixelCount < 500000 || !isWebGL) {
      return this.performance.performanceLevels.low;
    } else if (width >= this.performance.highEndThreshold && isWebGL) {
      return this.performance.performanceLevels.high;
    } else {
      return this.performance.performanceLevels.medium;
    }
  }

  /**
   * Calculate optimal particle count for header
   */
  public calculateHeaderParticleCount(width: number, height: number, performanceLevel: PerformanceLevel): number {
    const area = width * height;
    const density = performanceLevel.maxParticles / (1920 * 100); // Normalize to header size
    const baseCount = Math.floor(area * density);
    
    // Header-specific adjustments
    const headerHeight = Math.min(height, 100); // Typical header height
    const headerFactor = headerHeight / 100;
    
    return Math.max(50, Math.min(baseCount * headerFactor, performanceLevel.maxParticles));
  }

  /**
   * Update configuration at runtime
   */
  public updateConfig(path: string, value: any): void {
    const keys = path.split('.');
    let current: any = this;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    
    if (this.debug.verbose) {
      console.log(`🔧 Config updated: ${path} = `, value);
    }
  }

  /**
   * Reset configuration to defaults
   */
  public reset(): void {
    const newInstance = new CyberScape2Config();
    Object.assign(this, newInstance);
    
    if (this.debug.verbose) {
      console.log('🔄 Configuration reset to defaults');
    }
  }
} 