import { describe, expect, it } from 'vitest'
import { sparkline } from '@/lib/sparkline'

describe('sparkline', () => {
  it('returns empty string for empty input', () => {
    expect(sparkline([])).toBe('')
  })

  it('renders the flat baseline when every value is zero', () => {
    expect(sparkline([0, 0, 0])).toBe('▁▁▁')
  })

  it('auto-scales so the series max reaches the top bar', () => {
    expect(sparkline([0, 10])).toBe('▁█')
  })

  it('keeps one glyph per value', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8]
    expect([...sparkline(values)]).toHaveLength(values.length)
  })

  it('places mid values between the extremes', () => {
    const out = sparkline([0, 5, 10])
    expect(out[0]).toBe('▁')
    expect(out[2]).toBe('█')
    expect(out[1] > '▁' && out[1] < '█').toBe(true)
  })
})
