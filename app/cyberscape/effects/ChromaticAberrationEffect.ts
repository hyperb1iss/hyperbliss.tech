// app/cyberscape/effects/ChromaticAberrationEffect.ts

/**
 * ChromaticAberrationEffect class
 *
 * Applies a chromatic aberration effect to the canvas.
 * This effect separates the color channels, creating a 'glitchy' look.
 */

import { CyberScapeConfig } from "../CyberScapeConfig";

export class ChromaticAberrationEffect {
  private config: CyberScapeConfig;

  constructor() {
    this.config = CyberScapeConfig.getInstance();
  }

  /**
   * Applies the chromatic aberration effect to the canvas.
   *
   * @param ctx - The 2D rendering context of the canvas.
   * @param width - The width of the canvas.
   * @param height - The height of the canvas.
   * @param offset - The pixel offset for the color channels.
   */
  public apply(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    offset: number
  ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const newImageData = ctx.createImageData(width, height);
    const newData = newImageData.data;

    for (let y = 0; y < height; y++) {
      const yOffset = y * width;
      for (let x = 0; x < width; x++) {
        const i = (yOffset + x) << 2;
        const redX = Math.max(
          0,
          Math.min(width - 1, x - offset * (1 + Math.sin(y * 0.1) * 0.5))
        );
        const blueX = Math.max(
          0,
          Math.min(width - 1, x + offset * (1 + Math.cos(y * 0.1) * 0.5))
        );
        const redI = (yOffset + redX) << 2;
        const blueI = (yOffset + blueX) << 2;

        newData[i] = data[redI];
        newData[i + 1] = data[i + 1];
        newData[i + 2] = data[blueI + 2];
        newData[i + 3] = data[i + 3];
      }
    }

    ctx.putImageData(newImageData, 0, 0);
  }
}
