// Constants
export const CYBERPUNK_HUE_RANGES = [
  { start: 180, end: 220 }, // Electric Cyan to Neon Blue
  { start: 270, end: 330 }, // Neon Purple to Bright Magenta
];

export const CYBERPUNK_COLORS = [
  "#00fff0", // Cyan
  "#ff00ff", // Magenta
  "#a259ff", // Purple
  "#ff75d8", // Pink
  "#00ffff", // Electric Blue
  "#4b0082", // Indigo
  "#8a2be2", // Blue Violet
  "#483d8b", // Dark Slate Blue
];

// Utility functions

/**
 * Generates a random hue value within the defined cyberpunk color ranges.
 * @returns {number} A random hue value between 0 and 360.
 */
export const getRandomCyberpunkHue = (): number => {
  const range =
    CYBERPUNK_HUE_RANGES[
      Math.floor(Math.random() * CYBERPUNK_HUE_RANGES.length)
    ];
  return Math.random() * (range.end - range.start) + range.start;
};

/**
 * Projects a 3D point onto a 2D plane.
 * @param {number} x - The x-coordinate of the 3D point.
 * @param {number} y - The y-coordinate of the 3D point.
 * @param {number} z - The z-coordinate of the 3D point.
 * @param {number} width - The width of the 2D plane.
 * @param {number} height - The height of the 2D plane.
 * @returns {Object} An object containing the projected x, y coordinates and the scale.
 */
export const project = (
  x: number,
  y: number,
  z: number,
  width: number,
  height: number
) => {
  const fov = 500; // Field of view
  const minScale = 0.5; // Minimum scale to prevent shapes from becoming too small
  const maxScale = 1.5; // Maximum scale to prevent shapes from becoming too large
  const scale = fov / (fov + z);
  const clampedScale = Math.min(Math.max(scale, minScale), maxScale);
  return {
    x: x * clampedScale + width / 2,
    y: y * clampedScale + height / 2,
    scale: clampedScale,
  };
};

/**
 * Converts a hexadecimal color string to RGB values.
 * @param {string} hex - The hexadecimal color string.
 * @returns {Object|null} An object containing r, g, b values, or null if invalid input.
 */
export const hexToRgb = (
  hex: string
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Converts RGB values to a hexadecimal color string.
 * @param {number} r - The red value (0-255).
 * @param {number} g - The green value (0-255).
 * @param {number} b - The blue value (0-255).
 * @returns {string} The hexadecimal color string.
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

/**
 * Rotates a 3D vertex around the X, Y, and Z axes.
 * @param {Object} vertex - The vertex to rotate, containing x, y, and z properties.
 * @param {Object} rotation - The rotation angles in radians, containing x, y, and z properties.
 * @returns {Object} The rotated vertex with new x, y, and z coordinates.
 */
export const rotateVertex = (
  vertex: { x: number; y: number; z: number },
  rotation: { x: number; y: number; z: number }
) => {
  // Rotation around X axis
  const x = vertex.x;
  const y = vertex.y * Math.cos(rotation.x) - vertex.z * Math.sin(rotation.x);
  const z = vertex.y * Math.sin(rotation.x) + vertex.z * Math.cos(rotation.x);

  // Rotation around Y axis
  const x1 = x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
  const y1 = y;
  const z1 = -x * Math.sin(rotation.y) + z * Math.cos(rotation.y);

  // Rotation around Z axis
  const x2 = x1 * Math.cos(rotation.z) - y1 * Math.sin(rotation.z);
  const y2 = x1 * Math.sin(rotation.z) + y1 * Math.cos(rotation.z);
  const z2 = z1;

  return { x: x2, y: y2, z: z2 };
};
