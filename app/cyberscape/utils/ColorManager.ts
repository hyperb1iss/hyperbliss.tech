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
    { end: 220, start: 180 }, // Electric Cyan to Neon Blue
    { end: 330, start: 270 }, // Neon Purple to Bright Magenta
  ]

  /**
   * Predefined Cyberpunk colors.
   */
  private static readonly CYBERPUNK_COLORS = [
    '#00fff0', // Cyan
    '#ff00ff', // Magenta
    '#a259ff', // Purple
    '#ff75d8', // Pink
    '#00ffff', // Electric Blue
    '#4b0082', // Indigo
    '#8a2be2', // Blue Violet
    '#483d8b', // Dark Slate Blue
  ]

  /**
   * Generates a random hue value within the defined cyberpunk color ranges.
   * @returns A random hue value between 0 and 360.
   */
  public static getRandomCyberpunkHue(): number {
    const range =
      ColorManager.CYBERPUNK_HUE_RANGES[Math.floor(Math.random() * ColorManager.CYBERPUNK_HUE_RANGES.length)]
    return Math.random() * (range.end - range.start) + range.start
  }

  /**
   * Checks if a given hue is within the valid cyberpunk ranges.
   * @param hue - The hue value to check.
   * @returns True if the hue is valid, false otherwise.
   */
  public static isValidCyberpunkHue(hue: number): boolean {
    return ColorManager.CYBERPUNK_HUE_RANGES.some((range) => hue >= range.start && hue <= range.end)
  }

  /**
   * Returns a random color from the predefined Cyberpunk colors.
   * @returns A random Cyberpunk color.
   */
  public static getRandomCyberpunkColor(): string {
    return ColorManager.CYBERPUNK_COLORS[Math.floor(Math.random() * ColorManager.CYBERPUNK_COLORS.length)]
  }

  /**
   * Converts a hexadecimal color string to RGB values.
   * @param hex - The hexadecimal color string.
   * @returns An object containing r, g, b values, or null if invalid input.
   */
  public static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          b: Number.parseInt(result[3], 16),
          g: Number.parseInt(result[2], 16),
          r: Number.parseInt(result[1], 16),
        }
      : null
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
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }

  /**
   * Calculates the average color from an array of colors.
   * @param colors - Array of color strings in hex format.
   * @returns The average color in hex format.
   */
  public static averageColors(colors: string[]): string {
    const rgbColors = colors
      .map((color) => ColorManager.hexToRgb(color))
      .filter((color): color is { r: number; g: number; b: number } => color !== null)
    const avgColor = rgbColors.reduce(
      (acc, color) => ({
        b: acc.b + color.b / rgbColors.length,
        g: acc.g + color.g / rgbColors.length,
        r: acc.r + color.r / rgbColors.length,
      }),
      { b: 0, g: 0, r: 0 },
    )
    return ColorManager.rgbToHex(Math.round(avgColor.r), Math.round(avgColor.g), Math.round(avgColor.b))
  }

  /**
   * Blends two colors with a given ratio.
   * @param color1 - First color in hex format.
   * @param color2 - Second color in hex format.
   * @param ratio - Blending ratio (0 to 1), where 0 is fully color1 and 1 is fully color2.
   * @returns The blended color in hex format.
   */
  public static blendColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = ColorManager.hexToRgb(color1)
    const rgb2 = ColorManager.hexToRgb(color2)
    if (!rgb1 || !rgb2) return color1

    const blendedColor = {
      b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
      g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
      r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
    }
    return ColorManager.rgbToHex(blendedColor.r, blendedColor.g, blendedColor.b)
  }

  /**
   * Adjusts the opacity of a color.
   * @param color - The color string in hex format.
   * @param opacity - The opacity value (0 to 1).
   * @returns The color string with adjusted opacity.
   */
  public static adjustColorOpacity(color: string, opacity: number): string {
    const rgb = ColorManager.hexToRgb(color)
    if (!rgb) return color
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
  }

  /**
   * Shifts the hue of a given RGB color.
   * @param color - The RGB color object.
   * @param shift - The amount to shift the hue (0-360).
   * @returns The shifted RGB color object.
   */
  public static shiftHue(
    color: { r: number; g: number; b: number },
    shift: number,
  ): { r: number; g: number; b: number } {
    const [h, s, l] = ColorManager.rgbToHsl(color.r, color.g, color.b)
    const newHue = (h + shift / 360) % 1
    return ColorManager.hslToRgb(newHue, s, l)
  }

  /**
   * Converts RGB to HSL color space.
   * @param r - Red component (0-255).
   * @param g - Green component (0-255).
   * @param b - Blue component (0-255).
   * @returns An array of [hue, saturation, lightness] in the range [0, 1].
   */
  private static rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0 // Initialize h to 0
    let s: number
    const l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return [h, s, l]
  }

  /**
   * Converts HSL to RGB color space.
   * @param h - Hue (0-1).
   * @param s - Saturation (0-1).
   * @param l - Lightness (0-1).
   * @returns An object with r, g, b components (0-255).
   */
  private static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      b: Math.round(b * 255),
      g: Math.round(g * 255),
      r: Math.round(r * 255),
    }
  }
}
