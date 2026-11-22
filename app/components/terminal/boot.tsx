// Boot (T3.1/T3.2). The console opens straight onto its welcome: the finale
// prints it, or replays a shared session. No preamble lines, so a first visit
// and a repeat visit look the same; the phase only matters to the caller.

export interface BootSequenceOptions {
  phase: 'full-boot' | 'skip-to-end'
  /** What runs once the console is up: the welcome, or a shared-session replay. */
  finale: () => Promise<void>
  isCancelled: () => boolean
}

export async function runBootSequence(opts: BootSequenceOptions): Promise<void> {
  // Yield once before the first paint so React strict-mode's double effect-
  // invoke (dev) cancels the first run before it prints anything.
  await Promise.resolve()
  if (opts.isCancelled()) return
  await opts.finale()
}
