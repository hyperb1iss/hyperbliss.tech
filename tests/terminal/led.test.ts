// The LED wall's text handling: what the 5x7 face can draw, and how it wraps.

import { describe, expect, it } from 'vitest'
import { ledLines, ledText } from '@/components/terminal/LedSign'

describe('ledText', () => {
  it('uppercases, turns <3 into the heart, and drops what the face cannot draw', () => {
    expect(ledText('hello world <3')).toBe('HELLO WORLD ♥')
    expect(ledText('hi  @#  there')).toBe('HI THERE')
  })

  it('caps the length', () => {
    expect(ledText('a'.repeat(200))).toHaveLength(48)
  })
})

describe('ledLines', () => {
  it('wraps on words to the line width', () => {
    expect(ledLines('HELLO WORLD ♥')).toEqual(['HELLO WORLD', '♥'])
  })

  it('cuts a word longer than a line', () => {
    expect(ledLines('ABCDEFGHIJKLMNOP')).toEqual(['ABCDEFGHIJKL', 'MNOP'])
  })

  it('returns no lines for empty text', () => {
    expect(ledLines('')).toEqual([])
  })
})
