// app/cyberscape/effects/GlitchEffect.ts

/**
 * GlitchEffect class
 *
 * Applies a glitch effect to the canvas.
 * This effect includes RGB shift, random pixel displacement, and color inversion.
 */

import { CyberScapeConfig } from "../CyberScapeConfig";

export class GlitchEffect {
  private config: CyberScapeConfig;

  constructor() {
    this.config = CyberScapeConfig.getInstance();
  }

  /**
   * Applies the glitch effect to the canvas.
   *
   * @param ctx - The 2D rendering context of the canvas.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param intensity - The intensity of the glitch effect (0-1).
   */
  public apply(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Optimization: Precalculate values
    const amount = Math.floor(intensity * this.config.glitchEffectMaxAmount);
    const dataLength = data.length;
    const maxOffset = 200 << 2; // Precalculate max offset for pixel displacement

    // RGB shift with color distortion
    for (let i = 0; i < dataLength; i += 4) {
      data[i] = data[i + amount] || data[i];
      data[i + 1] = data[i + 1 - amount] || data[i + 1];
      data[i + 2] = data[i + 2 + amount] || data[i + 2];
    }

    // Random pixel displacement with color inversion
    const displacementThreshold = intensity * this.config.glitchEffectDisplacementThresholdFactor;
    for (let i = 0; i < dataLength; i += 4) {
      if (Math.random() < displacementThreshold) {
        const offset = (Math.random() * maxOffset) & ~3; // Ensure offset is multiple of 4
        data[i] = 255 - (data[i + offset] || data[i]);
        data[i + 1] = 255 - (data[i + offset + 1] || data[i + 1]);
        data[i + 2] = 255 - (data[i + offset + 2] || data[i + 2]);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add random vertical lines with gradient colors
    const numLines = Math.floor(intensity * this.config.glitchEffectMaxNumLines);
    ctx.globalAlpha = intensity * 0.8;
    for (let i = 0; i < numLines; i++) {
      const x = Math.random() * width;
      const gradient = ctx.createLinearGradient(x, 0, x, height);
      gradient.addColorStop(0, `hsl(${Math.random() * 360}, 100%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${Math.random() * 360}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${Math.random() * 360}, 100%, 50%)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.random() * 5 + 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Add random horizontal slices with color inversion
    const numSlices = Math.floor(intensity * this.config.glitchEffectMaxNumSlices);
    for (let i = 0; i < numSlices; i++) {
      const y = Math.random() * height;
      const sliceHeight = Math.random() * 20 + 2;
      const sliceShift = (Math.random() - 0.5) * 40 * intensity;
      const sliceImage = ctx.getImageData(0, y, width, sliceHeight);
      const sliceData = sliceImage.data;
      for (let j = 0; j < sliceData.length; j += 4) {
        sliceData[j] = 255 - sliceData[j];
        sliceData[j + 1] = 255 - sliceData[j + 1];
        sliceData[j + 2] = 255 - sliceData[j + 2];
      }
      ctx.putImageData(sliceImage, sliceShift, y);
    }

    // Add random color blocks
    const numBlocks = Math.floor(intensity * this.config.glitchEffectMaxNumBlocks);
    for (let i = 0; i < numBlocks; i++) {
      const blockWidth = Math.random() * 100 + 20;
      const blockHeight = Math.random() * 100 + 20;
      const x = Math.random() * (width - blockWidth);
      const y = Math.random() * (height - blockHeight);
      ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.5 + 0.2})`;
      ctx.fillRect(x, y, blockWidth, blockHeight);
    }

    // Add digital noise
    const noiseIntensity = intensity * this.config.glitchEffectNoiseIntensityFactor;
    for (let i = 0; i < dataLength; i += 4) {
      if (Math.random() < noiseIntensity) {
        const noise = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = noise;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Add scanlines
    ctx.globalAlpha = intensity * 0.1;
    for (let y = 0; y < height; y += 2) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, y, width, 1);
    }
  }
}
