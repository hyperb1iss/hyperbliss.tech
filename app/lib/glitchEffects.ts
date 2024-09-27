/**
 * Applies a glitch effect to the canvas.
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

  // RGB shift with color distortion
  const amount = Math.floor(intensity * 15);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i + amount] || data[i];
    data[i + 1] = data[i + 1 - amount] || data[i + 1];
    data[i + 2] = data[i + 2 + amount] || data[i + 2];
  }

  // Random pixel displacement with color inversion
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < intensity * 0.2) {
      const offset = Math.floor(Math.random() * 200) * 4;
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
    ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.5 + 0.2})`;
    ctx.fillRect(x, y, blockWidth, blockHeight);
  }

  ctx.globalAlpha = 1;
};

/**
 * Applies a chromatic aberration effect to the canvas.
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
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const redX = Math.max(0, Math.min(width - 1, x - offset * (1 + Math.sin(y * 0.1) * 0.5)));
      const greenX = x;
      const blueX = Math.max(0, Math.min(width - 1, x + offset * (1 + Math.cos(y * 0.1) * 0.5)));
      const redI = (y * width + redX) * 4;
      const greenI = (y * width + greenX) * 4;
      const blueI = (y * width + blueX) * 4;

      newData[i] = data[redI];
      newData[i + 1] = data[greenI + 1];
      newData[i + 2] = data[blueI + 2];
      newData[i + 3] = data[i + 3];
    }
  }

  ctx.putImageData(newImageData, 0, 0);
};