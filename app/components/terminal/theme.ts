// Console color themes. A theme is a data attribute on <html>; globals.css
// maps each one to the --term-* and --led-* custom properties every console
// surface reads. The choice persists across visits.

import { safeLocalGet, safeLocalSet } from './storage'

export const TERMINAL_THEMES = ['silk', 'matrix', 'amber', 'ice'] as const
export type TerminalTheme = (typeof TERMINAL_THEMES)[number]

const KEY = 'hb:term:theme'

export const isTerminalTheme = (name: string): name is TerminalTheme =>
  (TERMINAL_THEMES as readonly string[]).includes(name)

export function applyTerminalTheme(name: string): void {
  if (typeof document === 'undefined' || !isTerminalTheme(name)) return
  document.documentElement.setAttribute('data-terminal-theme', name)
  safeLocalSet(KEY, name)
}

/** Re-apply the saved theme, if any. Call once on the client. */
export function restoreTerminalTheme(): void {
  const saved = safeLocalGet(KEY)
  if (saved && saved !== 'silk') applyTerminalTheme(saved)
}
