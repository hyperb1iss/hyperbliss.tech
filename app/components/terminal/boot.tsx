// Boot sequence (T3.1/T3.2). Full visit plays a staggered BIOS/POST sequence;
// repeat or reduced-motion visits print a compact banner. Both end by calling
// the finale (the living status console). The full boot is skippable.

import type { ReactNode } from 'react'
import type { Broadcast } from '@/lib/terminal/types'
import { text } from './render'
import type { OutputStream } from './types'

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function postLines(b: Broadcast): Array<{ text: string; stream: OutputStream }> {
  return [
    { stream: 'system', text: 'HYPERBLISS TERMINAL — POST' },
    { stream: 'ok', text: '[OK] mounting /content' },
    {
      stream: 'ok',
      text: `[OK] indexing projects (${b.projectCount}) · posts (${b.postCount}) · lab (${b.labCount})`,
    },
    { stream: 'ok', text: '[OK] loading broadcast' },
    { stream: 'ok', text: '[OK] rendering neon' },
    { stream: 'system', text: 'ready ✦' },
  ]
}

export interface BootSequenceOptions {
  phase: 'full-boot' | 'skip-to-end'
  broadcast: Broadcast
  print: (node: ReactNode, stream?: OutputStream) => void
  /** What runs after the POST lines — auto-neofetch, or a shared-session replay. */
  finale: () => Promise<void>
  isCancelled: () => boolean
  shouldSkip: () => boolean
  /** Per-line stagger; overridable for tests. */
  stepMs?: number
}

export async function runBootSequence(opts: BootSequenceOptions): Promise<void> {
  const { phase, broadcast, print, finale, isCancelled, shouldSkip, stepMs = 120 } = opts

  // Yield once before the first paint so React strict-mode's double effect-
  // invoke (dev) cancels the first run before it prints anything — no
  // duplicated first line.
  await Promise.resolve()
  if (isCancelled()) return

  if (phase === 'skip-to-end') {
    print(text('hyperbliss terminal ✦  —  type `help`, or tap a command below', 'system'), 'system')
    if (!isCancelled()) await finale()
    return
  }

  for (const line of postLines(broadcast)) {
    if (isCancelled()) return
    print(text(line.text, line.stream), line.stream)
    if (!shouldSkip()) await delay(stepMs)
  }
  if (!isCancelled()) await finale()
}
