// Analytics policy (§5.11). We record COARSE command categories and chip
// clicks only — NEVER the raw typed string, which can contain anything a
// visitor types. categoryOf maps a line to a safe bucket; unknown tokens
// collapse to a generic bucket so nothing user-authored ever escapes.

import { parseLine } from './parser'

const NATIVE_COMMANDS = new Set([
  'about',
  'blog',
  'clear',
  'contact',
  'help',
  'history',
  'lab',
  'matrix',
  'neofetch',
  'now',
  'projects',
  'resume',
  'share',
  'social',
  'ssh',
  'sudo',
  'theme',
])

const SHELL_COMMANDS = new Set([
  'awk',
  'cat',
  'cd',
  'echo',
  'env',
  'find',
  'grep',
  'head',
  'ls',
  'pwd',
  'sed',
  'sort',
  'tail',
  'uniq',
  'wc',
  'which',
])

/** A safe analytics bucket for a typed line. Never includes raw arguments. */
export function categoryOf(raw: string): string {
  const { name, force, empty } = parseLine(raw)
  if (empty || !name) return 'cmd:empty'
  if (force === 'shell') return SHELL_COMMANDS.has(name) ? `shell:${name}` : 'shell:other'
  if (NATIVE_COMMANDS.has(name)) return `cmd:${name}`
  if (SHELL_COMMANDS.has(name)) return `shell:${name}`
  return 'cmd:other'
}

/** A safe bucket for a chip click. */
export function chipCategory(command: string): string {
  return `chip:${parseLine(command).name || 'unknown'}`
}
