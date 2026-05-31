// Boot state machine (§5.6). One source of truth for whether the terminal
// plays the full cinematic boot, skips straight to the ready state, or is still
// resolving (pre-hydration). `pending` is the SSR/skeleton state; the client
// resolves it after reading storage + prefers-reduced-motion, so there's no
// hydration flash and we never animate before reduced-motion is known.

import { useEffect, useState } from 'react'
import { safeLocalGet, safeLocalSet } from './storage'

export type BootPhase = 'pending' | 'full-boot' | 'skip-to-end'

const VISIT_KEY = 'hb:term:v1'

export interface BootInputs {
  firstVisit: boolean
  reducedMotion: boolean
}

/** Reduced motion or a repeat visit ⇒ skip; otherwise the full boot plays. */
export function resolveBootPhase(inputs: BootInputs): Exclude<BootPhase, 'pending'> {
  if (inputs.reducedMotion) return 'skip-to-end'
  if (!inputs.firstVisit) return 'skip-to-end'
  return 'full-boot'
}

export function readBootInputs(): BootInputs {
  const reducedMotion =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const firstVisit = safeLocalGet(VISIT_KEY) !== '1'
  return { firstVisit, reducedMotion }
}

export function markVisited(): void {
  safeLocalSet(VISIT_KEY, '1')
}

/**
 * Resolve the boot phase on the client. Starts `pending` (matching SSR) and
 * settles once, after reading storage + reduced-motion. Visited is marked when
 * the boot actually runs (not here), so strict-mode's double effect-invoke
 * can't race the first-visit read.
 */
export function useBootPhase(): BootPhase {
  const [phase, setPhase] = useState<BootPhase>('pending')
  useEffect(() => {
    setPhase(resolveBootPhase(readBootInputs()))
  }, [])
  return phase
}
