// Command history with ↑/↓ navigation, persisted to localStorage. The cursor
// sits at `list.length` when the user is editing a fresh line; the in-progress
// draft is stashed on the first ↑ so ↓ can restore it.

import { safeLocalGet, safeLocalSet } from './storage'
import type { HistoryAPI } from './types'

const KEY = 'hb:term:history:v1'
const MAX = 100

export function loadHistory(): string[] {
  const raw = safeLocalGet(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(-MAX) : []
  } catch {
    return []
  }
}

export class History implements HistoryAPI {
  private list: string[]
  private cursor: number
  private draft = ''
  private persist: boolean

  constructor(initial: string[] = [], opts: { persist?: boolean } = {}) {
    this.list = initial.slice(-MAX)
    this.cursor = this.list.length
    this.persist = opts.persist ?? false
  }

  get entries(): readonly string[] {
    return this.list
  }

  add(line: string): void {
    const trimmed = line.trim()
    if (trimmed.length > 0 && this.list[this.list.length - 1] !== trimmed) {
      this.list.push(trimmed)
      if (this.list.length > MAX) this.list.shift()
      if (this.persist) safeLocalSet(KEY, JSON.stringify(this.list))
    }
    this.reset()
  }

  prev(draft: string): string | null {
    if (this.list.length === 0) return null
    if (this.cursor === this.list.length) this.draft = draft
    if (this.cursor > 0) this.cursor -= 1
    return this.list[this.cursor] ?? null
  }

  next(): string | null {
    if (this.cursor < this.list.length) this.cursor += 1
    if (this.cursor >= this.list.length) return this.draft
    return this.list[this.cursor] ?? null
  }

  reset(): void {
    this.cursor = this.list.length
    this.draft = ''
  }
}
