// T4.2 — shareable session URL encode/decode.

import { describe, expect, it } from 'vitest'
import { buildShareUrl, decodeSession, encodeSession } from '@/components/terminal/share'

describe('encodeSession', () => {
  it('joins commands with semicolons and URL-encodes them', () => {
    expect(encodeSession(['neofetch', 'projects'])).toBe('neofetch;projects')
    expect(encodeSession(['cat now.md'])).toBe('cat%20now.md')
  })
  it('drops blank and meta commands (clear, share)', () => {
    expect(encodeSession(['neofetch', 'clear', '  ', 'share', 'blog'])).toBe('neofetch;blog')
  })
})

describe('decodeSession', () => {
  it('parses a hash into commands', () => {
    expect(decodeSession('#neofetch;projects')).toEqual(['neofetch', 'projects'])
    expect(decodeSession('cat%20now.md')).toEqual(['cat now.md'])
  })
  it('returns empty for an empty hash and tolerates bad encoding', () => {
    expect(decodeSession('')).toEqual([])
    expect(decodeSession('#')).toEqual([])
  })
})

describe('buildShareUrl + roundtrip', () => {
  it('builds a replayable URL', () => {
    expect(buildShareUrl('https://hyperbliss.tech', ['neofetch', 'now'])).toBe('https://hyperbliss.tech/#neofetch;now')
  })
  it('falls back to the bare origin with no commands', () => {
    expect(buildShareUrl('https://hyperbliss.tech', ['clear'])).toBe('https://hyperbliss.tech/')
  })
  it('round-trips through encode/decode', () => {
    const cmds = ['neofetch', 'ls projects | grep rust', 'cat /now.md']
    expect(decodeSession(`#${encodeSession(cmds)}`)).toEqual(cmds)
  })
})
