/**
 * This module contains functions for applying various glitch effects to a canvas.
 * These effects include RGB shift, pixel displacement, chromatic aberration, and CRT screen simulation.
 */

/**
 * Applies a glitch effect to the canvas.
 * This effect includes RGB shift, random pixel displacement, and color inversion.
 *
 * @param ctx - The 2D rendering context of the canvas.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param intensity - The intensity of the glitch effect (0-1).
 */
export const applyGlitchEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Optimization: Precalculate values
  const amount = Math.floor(intensity * 15);
  const dataLength = data.length;
  const maxOffset = 200 << 2; // Precalculate max offset for pixel displacement

  // RGB shift with color distortion
  for (let i = 0; i < dataLength; i += 4) {
    data[i] = data[i + amount] || data[i];
    data[i + 1] = data[i + 1 - amount] || data[i + 1];
    data[i + 2] = data[i + 2 + amount] || data[i + 2];
  }

  // Random pixel displacement with color inversion
  const displacementThreshold = intensity * 0.2;
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
  const numLines = Math.floor(intensity * 30);
  ctx.globalAlpha = intensity * 0.8;
  for (let i = 0; i < numLines; i++) {
    const x = Math.random() * width;
    const gradient = ctx.createLinearGradient(x, 0, x, height);
    gradient.addColorStop(0, `hsl(${Math.random() * 360}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${Math.random() * 360}, 100%, 50%)`);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.random() * 5 + 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Add random horizontal slices with color inversion
  const numSlices = Math.floor(intensity * 8);
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
  const numBlocks = Math.floor(intensity * 5);
  for (let i = 0; i < numBlocks; i++) {
    const blockWidth = Math.random() * 100 + 20;
    const blockHeight = Math.random() * 100 + 20;
    const x = Math.random() * (width - blockWidth);
    const y = Math.random() * (height - blockHeight);
    ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${
      Math.random() * 0.5 + 0.2
    })`;
    ctx.fillRect(x, y, blockWidth, blockHeight);
  }

  // Add digital noise
  const noiseIntensity = intensity * 0.2;
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

  // Add glowing text effect
  const glitchText = "CYBERPUNK";
  ctx.font = `bold ${Math.floor(height / 10)}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
  gradient.addColorStop(0.5, "rgba(255, 0, 255, 0.8)");
  gradient.addColorStop(1, "rgba(0, 255, 255, 0.8)");

  ctx.fillStyle = gradient;
  ctx.globalAlpha = intensity * 0.7;
  ctx.fillText(glitchText, width / 2, height / 2);

  // Add glow effect
  ctx.shadowColor = "rgba(0, 255, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText(glitchText, width / 2, height / 2);

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
};

/**
 * Applies a chromatic aberration effect to the canvas.
 * This effect separates the color channels, creating a 'glitchy' look.
 *
 * @param ctx - The 2D rendering context of the canvas.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param offset - The pixel offset for the color channels.
 */
export const applyChromaticAberration = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  offset: number
) => {
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
};

/**
 * Applies a CRT screen effect to the canvas.
 * This effect simulates the appearance of an old CRT monitor, including screen curvature and scanlines.
 *
 * @param ctx - The 2D rendering context of the canvas.
 * @param width - The width of the canvas.
 * @param height - The height of the canvas.
 * @param intensity - The intensity of the effect (0-1).
 */
export const applyCRTEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) => {
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
};
