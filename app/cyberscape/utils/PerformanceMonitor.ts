/**
 * PerformanceMonitor class for tracking and logging performance metrics.
 *
 * To use:
 * window.cyberScapePerformance('start')
 */
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private fps: number = 0;
  private frameTime: number = 0;
  private isEnabled: boolean = false;

  constructor(private updateInterval: number = 1000) {}

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  update(timestamp: number, deltaTime: number) {
    if (!this.isEnabled) return;

    this.frameCount++;
    this.frameTime = deltaTime;

    if (timestamp - this.lastFpsUpdate >= this.updateInterval) {
      this.fps = (this.frameCount / (timestamp - this.lastFpsUpdate)) * 1000;
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
      this.logStats();
    }
  }

  private logStats() {
    console.log(
      `FPS: ${this.fps.toFixed(2)}, Frame Time: ${this.frameTime.toFixed(2)}ms`
    );
  }
}
