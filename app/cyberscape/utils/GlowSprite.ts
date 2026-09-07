// app/cyberscape/utils/GlowSprite.ts

/**
 * GlowSprite
 *
 * Canvas2D `shadowBlur` re-runs a gaussian blur for every filled path, which is
 * what pinned CyberScape to 30fps. A pre-rendered radial glow drawn with
 * `drawImage` in additive mode gives the same halo for the cost of one blit.
 * Sprites are cached per colour string, so callers should hand in quantised
 * colours (integer hues, palette hexes) rather than free floats.
 */
export class GlowSprite {
  private static readonly SIZE = 64
  private static readonly MAX_CACHE = 256
  private static readonly cache = new Map<string, HTMLCanvasElement>()

  /**
   * Returns a cached glow sprite for the given colour, rendering it on first use.
   */
  public static get(color: string): HTMLCanvasElement {
    const cached = GlowSprite.cache.get(color)
    if (cached) return cached

    if (GlowSprite.cache.size >= GlowSprite.MAX_CACHE) {
      GlowSprite.cache.clear()
    }

    const size = GlowSprite.SIZE
    const sprite = document.createElement('canvas')
    sprite.width = size
    sprite.height = size
    const sctx = sprite.getContext('2d')
    if (sctx) {
      const half = size / 2
      const gradient = sctx.createRadialGradient(half, half, 0, half, half, half)
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.2, color)
      gradient.addColorStop(0.45, GlowSprite.withAlpha(color, 0.3))
      gradient.addColorStop(0.75, GlowSprite.withAlpha(color, 0.08))
      gradient.addColorStop(1, GlowSprite.withAlpha(color, 0))
      sctx.fillStyle = gradient
      sctx.fillRect(0, 0, size, size)
    }

    GlowSprite.cache.set(color, sprite)
    return sprite
  }

  /**
   * Blits a glow centred on (x, y) with the given halo radius.
   * The caller owns globalAlpha and composite mode.
   */
  public static draw(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, radius: number): void {
    const sprite = GlowSprite.get(color)
    const d = radius * 2
    ctx.drawImage(sprite, x - radius, y - radius, d, d)
  }

  /**
   * Rewrites a colour string with the given alpha, for hex and hsl inputs.
   */
  private static withAlpha(color: string, alpha: number): string {
    if (color.startsWith('#')) {
      const hex = color.length === 4 ? color.replace(/[^#]/g, (c) => c + c) : color
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    const hsl = /^hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)$/.exec(color)
    if (hsl) {
      return `hsla(${hsl[1]}, ${hsl[2]}%, ${hsl[3]}%, ${alpha})`
    }
    const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(color)
    if (rgb) {
      return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`
    }
    return color
  }
}
