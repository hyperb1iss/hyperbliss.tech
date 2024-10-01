// app/cyberscape/effects/CRTEffect.ts

/**
 * CRTEffect class
 *
 * Applies a CRT screen effect to the canvas.
 * This effect simulates the appearance of an old CRT monitor, including screen curvature and scanlines.
 */

import { CyberScapeConfig } from "../CyberScapeConfig";

export class CRTEffect {
  private config: CyberScapeConfig;

  constructor() {
    this.config = CyberScapeConfig.getInstance();
  }

  /**
   * Applies the CRT effect to the canvas.
   *
   * @param ctx - The 2D rendering context of the canvas.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param intensity - The intensity of the effect (0-1).
   */
  public apply(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number
  ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Precalculate values for efficiency
    const maxDistance = Math.sqrt(
      halfWidth * halfWidth + halfHeight * halfHeight
    );
    const bendFactor = 0.1 * intensity;

    // Add CRT screen curvature
    for (let y = 0; y < height; y++) {
      const dy = y - halfHeight;
      const yOffset = y * width;
      for (let x = 0; x < width; x++) {
        const dx = x - halfWidth;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalizedDistance = distance / maxDistance;

        const bendX = x + dx * normalizedDistance * bendFactor;
        const bendY = y + dy * normalizedDistance * bendFactor;

        if (bendX >= 0 && bendX < width && bendY >= 0 && bendY < height) {
          const sourceIndex = ((bendY | 0) * width + (bendX | 0)) << 2;
          const targetIndex = (yOffset + x) << 2;

          data[targetIndex] = data[sourceIndex];
          data[targetIndex + 1] = data[sourceIndex + 1];
          data[targetIndex + 2] = data[sourceIndex + 2];
        }
      }
    }

    // Add scanlines
    for (let y = 0; y < height; y += 2) {
      const yOffset = y * width;
      for (let x = 0; x < width; x++) {
        const index = (yOffset + x) << 2;
        data[index] = (data[index] * 0.8) | 0;
        data[index + 1] = (data[index + 1] * 0.8) | 0;
        data[index + 2] = (data[index + 2] * 0.8) | 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add vignette effect
    const gradient = ctx.createRadialGradient(
      halfWidth,
      halfHeight,
      0,
      halfWidth,
      halfHeight,
      Math.max(width, height) / 2
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${0.7 * intensity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}
