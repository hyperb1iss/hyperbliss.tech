import { describe, expect, it } from 'vitest'
import { ColorManager } from '@/cyberscape/utils/ColorManager'

describe('ColorManager.toRgb', () => {
  it('parses palette hex', () => {
    expect(ColorManager.toRgb('#ff75d8')).toEqual({ b: 216, g: 117, r: 255 })
  })

  it('parses the hsl strings particles carry', () => {
    expect(ColorManager.toRgb('hsl(180, 100%, 50%)')).toEqual({ b: 255, g: 255, r: 0 })
    expect(ColorManager.toRgb('hsl(300, 100%, 50%)')).toEqual({ b: 255, g: 0, r: 255 })
  })

  it('parses rgb and rgba', () => {
    expect(ColorManager.toRgb('rgba(1, 2, 3, 0.5)')).toEqual({ b: 3, g: 2, r: 1 })
  })

  it('returns null for junk', () => {
    expect(ColorManager.toRgb('plaid')).toBeNull()
  })
})
