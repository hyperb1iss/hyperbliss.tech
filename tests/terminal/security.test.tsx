// T-SEC: hostile content must render inert. Output is React text, never live
// DOM, and control/ANSI bytes are stripped at the boundary.

import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OutputText, sanitizeTerminalText } from '@/components/terminal/render'

describe('sanitizeTerminalText', () => {
  it('strips ESC and other C0 control characters', () => {
    expect(sanitizeTerminalText('\x1b[31mred\x1b[0m')).toBe('[31mred[0m')
    expect(sanitizeTerminalText('bell\x07 here')).toBe('bell here')
    expect(sanitizeTerminalText('del\x7f x')).toBe('del x')
  })

  it('preserves newlines and tabs', () => {
    expect(sanitizeTerminalText('a\nb\tc')).toBe('a\nb\tc')
  })

  it('leaves ordinary text untouched', () => {
    expect(sanitizeTerminalText('hello, world 🌊')).toBe('hello, world 🌊')
  })
})

describe('OutputText renders hostile input inert', () => {
  it('renders an <img onerror> payload as literal text, not an element', () => {
    const payload = '<img src=x onerror=alert(1)>'
    const { container } = render(<OutputText>{payload}</OutputText>)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toBe(payload)
  })

  it('renders a <script> payload as literal text', () => {
    const payload = '<script>alert(document.cookie)</script>'
    const { container } = render(<OutputText>{payload}</OutputText>)
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toBe(payload)
  })

  it('neutralizes ANSI escape injection (no ESC reaches the DOM)', () => {
    const { container } = render(<OutputText>{'\x1b]0;pwned\x07evil'}</OutputText>)
    expect(container.textContent).not.toContain('\x1b')
    expect(container.textContent).toContain('evil')
  })

  it('renders markdown-with-html as text (mirrors `cat` of a hostile body)', () => {
    const body = '# Title\n<iframe src="javascript:alert(1)"></iframe>\n<a href="javascript:void(0)">x</a>'
    const { container } = render(<OutputText>{body}</OutputText>)
    expect(container.querySelector('iframe')).toBeNull()
    expect(container.querySelector('a')).toBeNull()
    expect(container.textContent).toContain('<iframe')
  })
})
