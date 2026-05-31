// Output rendering + the security boundary (T-SEC).
//
// Policy: every byte of dynamic/shell output is rendered as a React TEXT node.
// React escapes text children, so markup in command output or in `cat`-ed
// content can never become live DOM. We NEVER use dangerouslySetInnerHTML for
// terminal output. As defense-in-depth we also strip C0 control characters
// (including ESC, the lead byte of ANSI sequences) so escape-sequence injection
// renders inert even though the engine emits none today (U2 negative).

import type { ReactNode } from 'react'
import { styled } from '../../../styled-system/jsx'
import type { OutputStream } from './types'

// Strip C0 controls and DEL, keeping tab (\x09) and newline (\x0a). ESC (\x1b)
// is included, so ANSI/OSC sequences are neutralized at the render boundary.
// biome-ignore lint/suspicious/noControlCharactersInRegex: neutralizing control chars is the explicit purpose
const CONTROL_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g

export function sanitizeTerminalText(text: string): string {
  return text.replace(CONTROL_CHARS, '')
}

const OutputSpan = styled.span`
  font-family: var(--font-mono);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  color: var(--text-primary);

  &[data-stream='stderr'] {
    color: var(--silk-error);
  }
  &[data-stream='ok'] {
    color: var(--silk-success);
  }
  &[data-stream='system'] {
    color: var(--silk-circuit-cyan);
  }
  &[data-stream='input'] {
    color: var(--text-muted);
  }
`

/**
 * Render plain text as a safe, stream-styled block. Whitespace and newlines are
 * preserved via `pre-wrap`; the string is sanitized and escaped by React.
 */
export function OutputText({ children, stream = 'stdout' }: { children: string; stream?: OutputStream }): ReactNode {
  return <OutputSpan data-stream={stream}>{sanitizeTerminalText(children)}</OutputSpan>
}

/** Convenience for handlers that emit a plain-text line. */
export function text(content: string, stream: OutputStream = 'stdout'): ReactNode {
  return <OutputText stream={stream}>{content}</OutputText>
}
