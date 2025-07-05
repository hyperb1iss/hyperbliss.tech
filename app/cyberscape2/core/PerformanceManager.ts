/**
 * Performance Manager for CyberScape 2.0
 * 
 * Monitors performance metrics and automatically adjusts system settings
 * to maintain target FPS across different devices and conditions.
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFrameTime: number;
  droppedFrames: number;
  particleCount: number;
  renderTime: number;
}

interface PerformanceAdjustment {
  reduceParticles: boolean;
  disableBloom: boolean;
  disableConnections: boolean;
  increaseFrameSkip: boolean;
  simplifyShaders: boolean;
}

// Interface for particle system performance adjustments
interface PerformanceParticleSystem {
  setConnectionsEnabled?(enabled: boolean): void;
  scaleParticleCount?(scale: number): void;
  setFrameSkip?(skip: number): void;
}

// Interface for header system performance adjustments
interface PerformanceHeaderSystem {
  setBloomEnabled?(enabled: boolean): void;
}

export class PerformanceManager {
  private isInitialized = false;
  private targetFPS = 60;
  private minFPS = 45;
  
  // Frame timing
  private frameTimeSamples: number[] = [];
  private maxSamples = 60; // 1 second at 60fps
  private lastFrameTime = 0;
  private droppedFrames = 0;
  private performanceLevel: 'high' | 'medium' | 'low' = 'high';
  
  // Adjustment system
  private lastAdjustmentTime = 0;
  private adjustmentCooldown = 5000; // 5 seconds between adjustments (more conservative)
  private consecutiveBadFrames = 0;
  private adjustmentsMade: PerformanceAdjustment = {
    reduceParticles: false,
    disableBloom: false,
    disableConnections: false,
    increaseFrameSkip: false,
    simplifyShaders: false
  };

  // Grace period to prevent adjustments during initialization
  private initializationTime = 0;
  private gracePeriod = 10000; // 10 seconds grace period

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    this.isInitialized = true;
    this.lastFrameTime = 0; // Reset to trigger first-frame skip
    this.initializationTime = performance.now(); // Track when we started
    this.frameTimeSamples = [];
    this.droppedFrames = 0;
    this.consecutiveBadFrames = 0;
    
    // Reset adjustments
    this.resetAdjustments();
    
    console.log('📊 Performance manager initialized');
  }

  /**
   * Update performance metrics
   */
  update(timestamp: number, _deltaTime: number): void {
    if (!this.isInitialized) return;

    // Skip the first few frames to avoid initialization spike
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
      return;
    }

    // Calculate current FPS
    const frameTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Ignore very large frame times (likely from tab switching or initialization)
    if (frameTime > 100 || frameTime <= 0) {
      console.log(`⏸️ Skipping invalid frame time: ${frameTime}ms`);
      return;
    }
    
    // Add to sample buffer
    this.frameTimeSamples.push(frameTime);
    if (this.frameTimeSamples.length > this.maxSamples) {
      this.frameTimeSamples.shift();
    }
    
    // Only start tracking dropped frames after we have some samples
    if (this.frameTimeSamples.length < 10) {
      return; // Don't track performance issues until we have enough data
    }
    
    // Track dropped frames (be more lenient)
    if (frameTime > (1000 / this.minFPS) * 1.5) { // 1.5x threshold
      this.droppedFrames++;
      this.consecutiveBadFrames++;
    } else {
      this.consecutiveBadFrames = 0;
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    if (this.frameTimeSamples.length === 0) {
      // Return default values during initialization
      return {
        fps: 60,
        frameTime: 16.67,
        averageFrameTime: 16.67,
        droppedFrames: 0,
        particleCount: 0,
        renderTime: 16.67
      };
    }

    const averageFrameTime = this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length;
    const fps = Math.max(1, Math.min(120, 1000 / averageFrameTime)); // Clamp FPS between 1-120
    const currentFrameTime = this.frameTimeSamples[this.frameTimeSamples.length - 1] || 16.67;

    return {
      fps: Math.round(fps),
      frameTime: currentFrameTime,
      averageFrameTime,
      droppedFrames: this.droppedFrames,
      particleCount: 0, // Will be updated by external systems
      renderTime: currentFrameTime
    };
  }

  /**
   * Check if performance adjustments are needed
   */
  needsAdjustment(): boolean {
    // TEMPORARILY DISABLED: Prevent all performance adjustments during development
    // This stops the restart loop while we work on the implementation
    return false;
    
    // Original logic (commented out for now):
    // // Don't adjust during grace period
    // const now = performance.now();
    // if (now - this.initializationTime < this.gracePeriod) {
    //   return false;
    // }

    // // Don't adjust if we don't have enough data
    // if (this.frameTimeSamples.length < 30) {
    //   return false;
    // }

    // const metrics = this.getMetrics();
    
    // // Don't adjust too frequently
    // if (now - this.lastAdjustmentTime < this.adjustmentCooldown) {
    //   return false;
    // }
    
    // // Check for sustained poor performance (be much more conservative)
    // const isBelowTarget = metrics.fps < this.targetFPS * 0.7; // Only adjust if 30% below target
    // const isBelowMinimum = metrics.fps < this.minFPS * 0.5; // Only critical adjustments
    // const hasSustainedIssues = this.consecutiveBadFrames > 30; // Need more bad frames
    
    // return (isBelowMinimum || (isBelowTarget && hasSustainedIssues));
  }

  /**
   * Apply performance adjustments to systems
   */
  adjustPerformance(particleSystem: PerformanceParticleSystem, headerSystem: PerformanceHeaderSystem): void {
    if (!this.needsAdjustment()) return;
    
    const metrics = this.getMetrics();
    const now = performance.now();
    
    console.log(`⚡ Adjusting performance - FPS: ${metrics.fps}, Target: ${this.targetFPS}`);
    
    // Determine adjustment strategy based on severity
    if (metrics.fps < this.minFPS * 0.8) {
      // Severe performance issues - aggressive adjustments
      this.applyAggressiveAdjustments(particleSystem, headerSystem);
    } else if (metrics.fps < this.minFPS) {
      // Moderate performance issues - moderate adjustments
      this.applyModerateAdjustments(particleSystem, headerSystem);
    } else {
      // Minor performance issues - minor adjustments
      this.applyMinorAdjustments(particleSystem, headerSystem);
    }
    
    this.lastAdjustmentTime = now;
    this.consecutiveBadFrames = 0;
  }

  /**
   * Apply minor performance adjustments
   */
  private applyMinorAdjustments(particleSystem: PerformanceParticleSystem, _headerSystem: PerformanceHeaderSystem): void {
    if (!this.adjustmentsMade.disableConnections) {
      // Disable particle connections first
      particleSystem?.setConnectionsEnabled?.(false);
      this.adjustmentsMade.disableConnections = true;
      console.log('🔧 Disabled particle connections');
    }
  }

  /**
   * Apply moderate performance adjustments
   */
  private applyModerateAdjustments(particleSystem: PerformanceParticleSystem, headerSystem: PerformanceHeaderSystem): void {
    this.applyMinorAdjustments(particleSystem, headerSystem);
    
    if (!this.adjustmentsMade.reduceParticles) {
      // Reduce particle count by 25%
      particleSystem?.scaleParticleCount?.(0.75);
      this.adjustmentsMade.reduceParticles = true;
      console.log('🔧 Reduced particle count by 25%');
    }
    
    if (!this.adjustmentsMade.disableBloom) {
      // Disable bloom effects
      headerSystem?.setBloomEnabled?.(false);
      this.adjustmentsMade.disableBloom = true;
      console.log('🔧 Disabled bloom effects');
    }
  }

  /**
   * Apply aggressive performance adjustments
   */
  private applyAggressiveAdjustments(particleSystem: PerformanceParticleSystem, headerSystem: PerformanceHeaderSystem): void {
    this.applyModerateAdjustments(particleSystem, headerSystem);
    
    if (!this.adjustmentsMade.increaseFrameSkip) {
      // Increase frame skip
      particleSystem?.setFrameSkip?.(2);
      this.adjustmentsMade.increaseFrameSkip = true;
      console.log('🔧 Increased frame skip to 2');
    }
    
    // Reduce particle count further
    particleSystem?.scaleParticleCount?.(0.5);
    console.log('🔧 Aggressively reduced particle count by 50%');
    
    // Switch to low performance mode
    this.performanceLevel = 'low';
  }

  /**
   * Get current performance level
   */
  getPerformanceLevel(): 'high' | 'medium' | 'low' {
    return this.performanceLevel;
  }

  /**
   * Reset all performance adjustments
   */
  resetAdjustments(): void {
    this.adjustmentsMade = {
      reduceParticles: false,
      disableBloom: false,
      disableConnections: false,
      increaseFrameSkip: false,
      simplifyShaders: false
    };
    
    this.performanceLevel = 'high';
    this.droppedFrames = 0;
    this.consecutiveBadFrames = 0;
    
    console.log('🔄 Performance adjustments reset');
  }

  /**
   * Set target FPS
   */
  setTargetFPS(fps: number): void {
    this.targetFPS = fps;
    this.minFPS = fps * 0.75; // 75% of target is minimum
  }

  /**
   * Get debug information
   */
  getDebugInfo(): string {
    const metrics = this.getMetrics();
    const adjustments = Object.entries(this.adjustmentsMade)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key)
      .join(', ');
    
    return `FPS: ${metrics.fps} | Target: ${this.targetFPS} | Level: ${this.performanceLevel} | Adjustments: ${adjustments || 'none'}`;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.frameTimeSamples = [];
    this.isInitialized = false;
    
    console.log('📊 Performance manager destroyed');
  }
} 