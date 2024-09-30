// app/cyberscape/utils/ColorManager.ts

/**
 * ColorManager class
 *
 * This class manages color-related operations and constants for the CyberScape animation.
 */
export class ColorManager {
  /**
   * Cyberpunk color hue ranges.
   */
  private static readonly CYBERPUNK_HUE_RANGES = [
    { start: 180, end: 220 }, // Electric Cyan to Neon Blue
    { start: 270, end: 330 }, // Neon Purple to Bright Magenta
  ];

  /**
   * Predefined Cyberpunk colors.
   */
  private static readonly CYBERPUNK_COLORS = [
    "#00fff0", // Cyan
    "#ff00ff", // Magenta
    "#a259ff", // Purple
    "#ff75d8", // Pink
    "#00ffff", // Electric Blue
    "#4b0082", // Indigo
    "#8a2be2", // Blue Violet
    "#483d8b", // Dark Slate Blue
  ];

  /**
   * Generates a random hue value within the defined cyberpunk color ranges.
   * @returns A random hue value between 0 and 360.
   */
  public static getRandomCyberpunkHue(): number {
    const range =
      this.CYBERPUNK_HUE_RANGES[
        Math.floor(Math.random() * this.CYBERPUNK_HUE_RANGES.length)
      ];
    return Math.random() * (range.end - range.start) + range.start;
  }

  /**
   * Checks if a given hue is within the valid cyberpunk ranges.
   * @param hue - The hue value to check.
   * @returns True if the hue is valid, false otherwise.
   */
  public static isValidCyberpunkHue(hue: number): boolean {
    return this.CYBERPUNK_HUE_RANGES.some(
      (range) => hue >= range.start && hue <= range.end
    );
  }

  /**
   * Returns a random color from the predefined Cyberpunk colors.
   * @returns A random Cyberpunk color.
   */
  public static getRandomCyberpunkColor(): string {
    return this.CYBERPUNK_COLORS[
      Math.floor(Math.random() * this.CYBERPUNK_COLORS.length)
    ];
  }

  /**
   * Converts a hexadecimal color string to RGB values.
   * @param hex - The hexadecimal color string.
   * @returns An object containing r, g, b values, or null if invalid input.
   */
  public static hexToRgb(
    hex: string
  ): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Converts RGB values to a hexadecimal color string.
   * @param r - The red value (0-255).
   * @param g - The green value (0-255).
   * @param b - The blue value (0-255).
   * @returns The hexadecimal color string.
   */
  public static rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  /**
   * Calculates the average color from an array of colors.
   * @param colors - Array of color strings in hex format.
   * @returns The average color in hex format.
   */
  public static averageColors(colors: string[]): string {
    const rgbColors = colors
      .map((color) => this.hexToRgb(color))
      .filter(
        (color): color is { r: number; g: number; b: number } => color !== null
      );
    const avgColor = rgbColors.reduce(
      (acc, color) => ({
        r: acc.r + color.r / rgbColors.length,
        g: acc.g + color.g / rgbColors.length,
        b: acc.b + color.b / rgbColors.length,
      }),
      { r: 0, g: 0, b: 0 }
    );
    return this.rgbToHex(
      Math.round(avgColor.r),
      Math.round(avgColor.g),
      Math.round(avgColor.b)
    );
  }

  /**
   * Blends two colors with a given ratio.
   * @param color1 - First color in hex format.
   * @param color2 - Second color in hex format.
   * @param ratio - Blending ratio (0 to 1), where 0 is fully color1 and 1 is fully color2.
   * @returns The blended color in hex format.
   */
  public static blendColors(
    color1: string,
    color2: string,
    ratio: number
  ): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const blendedColor = {
      r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
      g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
      b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
    };
    return this.rgbToHex(blendedColor.r, blendedColor.g, blendedColor.b);
  }

  /**
   * Adjusts the opacity of a color.
   * @param color - The color string in hex format.
   * @param opacity - The opacity value (0 to 1).
   * @returns The color string with adjusted opacity.
   */
  public static adjustColorOpacity(color: string, opacity: number): string {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  }
}
