'use client'

import { NAV_ITEMS } from '@/lib/navigation'
import {
  type Broadcast,
  type ContentKind,
  type Manifest,
  type ManifestEntry,
  PUBLIC_CONTENT_KINDS,
} from '@/lib/terminal/types'
import { TERMINAL_THEMES, type TerminalTheme } from './commands/meta'
import type { FsBodies } from './fsClient'
import type { ExecShell } from './shell'
import type { TerminalHandle } from './Terminal'

const READ_BODY_LIMIT = 8000
const MAX_QUERY_LENGTH = 120
const MAX_PATH_LENGTH = 256
const MAX_HREF_LENGTH = 256
const MAX_SHELL_LINE_LENGTH = 300
const MAX_SHELL_OUTPUT_LENGTH = 12000
const SHELL_TIMEOUT_MS = 8000
const SEARCHABLE_KINDS = new Set<ContentKind>(PUBLIC_CONTENT_KINDS)
const LISTABLE_KINDS = new Set<ContentKind>(['project', 'post', 'lab'])

type PublicEntry = Pick<
  ManifestEntry,
  'date' | 'emoji' | 'href' | 'kind' | 'latestVersion' | 'path' | 'status' | 'summary' | 'tags' | 'title'
>

type ToolResult = Record<string, unknown>
type PublicEnv = Record<string, string | undefined>

export interface AgentToolDeps {
  manifest: Manifest
  broadcast: Broadcast
  fetchBodies: (paths?: readonly string[], signal?: AbortSignal) => Promise<FsBodies>
  navigate: (href: string) => void
  setTheme: (name: TerminalTheme) => void
  execShell?: ExecShell
  handleRef?: { current: TerminalHandle | null }
  onToolCall?: (toolName: string) => void
}

export function isWebMcpEnabled(env?: PublicEnv): boolean {
  return (
    (env?.NEXT_PUBLIC_TERMINAL_HERO ?? process.env.NEXT_PUBLIC_TERMINAL_HERO) === 'true' &&
    (env?.NEXT_PUBLIC_WEBMCP ?? process.env.NEXT_PUBLIC_WEBMCP) === 'true'
  )
}

export function isWebMcpShellEnabled(env?: PublicEnv): boolean {
  return isWebMcpEnabled(env) && (env?.NEXT_PUBLIC_WEBMCP_SHELL ?? process.env.NEXT_PUBLIC_WEBMCP_SHELL) === 'true'
}

export function getModelContext(): ModelContext | null {
  if (typeof document !== 'undefined' && document.modelContext) return document.modelContext
  if (typeof navigator !== 'undefined' && navigator.modelContext) return navigator.modelContext
  return null
}

export async function getRegisteredAgentToolNames(modelContext = getModelContext()): Promise<string[] | null> {
  if (!modelContext?.getTools) return null
  const tools = await modelContext.getTools()
  return tools.map((tool) => tool.name).sort()
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function inputString(input: unknown, key: string, maxLength: number): string | null {
  if (!isRecord(input)) return null
  const value = input[key]
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > maxLength) return null
  return trimmed
}

function inputOptionalKind(input: unknown): ContentKind | null | undefined {
  if (!isRecord(input) || input.kind === undefined) return undefined
  if (typeof input.kind !== 'string') return null
  return SEARCHABLE_KINDS.has(input.kind as ContentKind) ? (input.kind as ContentKind) : null
}

function publicEntry(entry: ManifestEntry): PublicEntry {
  return {
    date: entry.date,
    emoji: entry.emoji,
    href: entry.href,
    kind: entry.kind,
    latestVersion: entry.latestVersion,
    path: entry.path,
    status: entry.status,
    summary: entry.summary,
    tags: entry.tags,
    title: entry.title,
  }
}

function publicEntries(manifest: Manifest): PublicEntry[] {
  return manifest.entries.filter((entry) => SEARCHABLE_KINDS.has(entry.kind)).map(publicEntry)
}

function error(message: string): ToolResult {
  return { error: message }
}

function capText(value: string, limit: number): { text: string; truncated: boolean } {
  if (value.length <= limit) return { text: value, truncated: false }
  return { text: value.slice(0, Math.max(0, limit)), truncated: true }
}

function capShellOutput(result: Awaited<ReturnType<ExecShell>>): ToolResult {
  const stdout = capText(result.stdout, MAX_SHELL_OUTPUT_LENGTH)
  const stderrLimit = Math.max(0, MAX_SHELL_OUTPUT_LENGTH - stdout.text.length)
  const stderr = capText(result.stderr, stderrLimit)
  return {
    exitCode: result.exitCode,
    stderr: stderr.text,
    stdout: stdout.text,
    truncated: stdout.truncated || stderr.truncated,
  }
}

function isAbortError(value: unknown): boolean {
  return value instanceof DOMException
    ? value.name === 'AbortError'
    : value instanceof Error && value.name === 'AbortError'
}

function isShellUnavailable(value: unknown): boolean {
  return value instanceof Error && value.name === 'ShellUnavailableError'
}

function isShellTimeout(value: unknown): boolean {
  return value instanceof Error && value.name === 'ShellTimeoutError'
}

function manifestPathSet(manifest: Manifest): Set<string> {
  return new Set(manifest.entries.filter((entry) => SEARCHABLE_KINDS.has(entry.kind)).map((entry) => entry.path))
}

function allowedHrefSet(manifest: Manifest): Set<string> {
  const routeHrefs = NAV_ITEMS.map((label) => `/${label.toLowerCase()}/`)
  return new Set(['/', ...routeHrefs, ...manifest.entries.flatMap((entry) => (entry.href ? [entry.href] : []))])
}

function hasControlChars(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index)
    if (code < 32 || code === 127) return true
  }
  return false
}

function normalizeHref(input: unknown, manifest: Manifest): string | null {
  const href = inputString(input, 'href', MAX_HREF_LENGTH)
  if (!href) return null
  if (!href.startsWith('/') || href.startsWith('//') || href.includes('#') || href.includes('?')) return null
  if (hasControlChars(href)) return null
  const normalized = href === '/' ? '/' : `${href.replace(/\/+$/, '')}/`
  return allowedHrefSet(manifest).has(normalized) ? normalized : null
}

function filterEntries(manifest: Manifest, kind: ContentKind): PublicEntry[] {
  if (!LISTABLE_KINDS.has(kind)) return []
  return manifest.entries.filter((entry) => entry.kind === kind).map(publicEntry)
}

function searchEntries(manifest: Manifest, query: string, kind?: ContentKind): PublicEntry[] {
  const needle = query.toLowerCase()
  return publicEntries(manifest).filter((entry) => {
    if (kind && entry.kind !== kind) return false
    const haystack = [entry.title, entry.summary, entry.path, entry.tags.join(' ')].join(' ').toLowerCase()
    return haystack.includes(needle)
  })
}

function tool(input: Omit<ModelContextRegisteredTool, 'execute'> & { execute: ModelContextToolExecute }) {
  return input
}

export function registerAgentTools(deps: AgentToolDeps): () => void {
  const modelContext = getModelContext()
  if (!modelContext?.registerTool) return () => {}

  const ac = new AbortController()
  const opts: ModelContextRegisterToolOptions = { signal: ac.signal }
  const track = (name: string) => deps.onToolCall?.(name)

  const tools = [
    tool({
      annotations: { readOnlyHint: true },
      description: 'List public projects, posts, or lab experiments from hyperbliss.tech.',
      execute: async (input) => {
        track('list_content')
        const kind = inputOptionalKind(input)
        if (!kind || !LISTABLE_KINDS.has(kind)) return error('kind must be one of: project, post, lab')
        return { entries: filterEntries(deps.manifest, kind) }
      },
      inputSchema: {
        additionalProperties: false,
        properties: { kind: { enum: ['project', 'post', 'lab'], type: 'string' } },
        required: ['kind'],
        type: 'object',
      },
      name: 'list_content',
      title: 'List content',
    }),
    tool({
      annotations: { readOnlyHint: true },
      description: 'Search public hyperbliss.tech content metadata.',
      execute: async (input) => {
        track('search_content')
        const query = inputString(input, 'query', MAX_QUERY_LENGTH)
        const kind = inputOptionalKind(input)
        if (!query) return error('query must be a non-empty string')
        if (kind === null) return error('kind must be a public content kind')
        return { entries: searchEntries(deps.manifest, query, kind) }
      },
      inputSchema: {
        additionalProperties: false,
        properties: {
          kind: { enum: ['about', 'now', 'resume', 'project', 'post', 'lab'], type: 'string' },
          query: { maxLength: MAX_QUERY_LENGTH, type: 'string' },
        },
        required: ['query'],
        type: 'object',
      },
      name: 'search_content',
      title: 'Search content',
    }),
    tool({
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      description: 'Read one public content file by virtual filesystem path.',
      execute: async (input) => {
        track('read_content')
        const path = inputString(input, 'path', MAX_PATH_LENGTH)
        const allowedPaths = manifestPathSet(deps.manifest)
        if (!path || !allowedPaths.has(path)) return error('path must match a public manifest entry')
        const entry = deps.manifest.entries.find((candidate) => candidate.path === path)
        try {
          const bodies = await deps.fetchBodies([path])
          const body = bodies[path]
          if (typeof body !== 'string') return error('content body was unavailable')
          const truncated = body.length > READ_BODY_LIMIT
          return {
            body: truncated ? body.slice(0, READ_BODY_LIMIT) : body,
            path,
            title: entry?.title ?? path,
            truncated,
          }
        } catch {
          return error('content body was unavailable')
        }
      },
      inputSchema: {
        additionalProperties: false,
        properties: { path: { maxLength: MAX_PATH_LENGTH, type: 'string' } },
        required: ['path'],
        type: 'object',
      },
      name: 'read_content',
      title: 'Read content',
    }),
    tool({
      annotations: { readOnlyHint: true },
      description: 'Show what Stefanie Jane is focused on right now.',
      execute: async () => {
        track('whats_now')
        const { focus, location, nowBody, nowUpdated } = deps.broadcast
        return { body: nowBody, focus, location, updated: nowUpdated }
      },
      inputSchema: { additionalProperties: false, properties: {}, type: 'object' },
      name: 'whats_now',
      title: "What's now",
    }),
    tool({
      annotations: { readOnlyHint: true },
      description: 'Get public site status counts and latest content links.',
      execute: async () => {
        track('get_site_status')
        const { focus, labCount, latestPost, latestProject, latestShip, postCount, projectCount } = deps.broadcast
        return { focus, labCount, latestPost, latestProject, latestShip, postCount, projectCount }
      },
      inputSchema: { additionalProperties: false, properties: {}, type: 'object' },
      name: 'get_site_status',
      title: 'Get site status',
    }),
    tool({
      annotations: { readOnlyHint: false },
      description: 'Navigate the live hyperbliss.tech page to a whitelisted route.',
      execute: async (input) => {
        track('navigate')
        const href = normalizeHref(input, deps.manifest)
        if (!href) return error('href is not an allowed site route')
        deps.navigate(href)
        return { href, ok: true }
      },
      inputSchema: {
        additionalProperties: false,
        properties: { href: { maxLength: MAX_HREF_LENGTH, type: 'string' } },
        required: ['href'],
        type: 'object',
      },
      name: 'navigate',
      title: 'Navigate',
    }),
    tool({
      annotations: { readOnlyHint: false },
      description: 'Set the terminal theme attribute to a known theme name.',
      execute: async (input) => {
        track('set_theme')
        const name = inputString(input, 'name', 24)
        if (!name || !TERMINAL_THEMES.includes(name as TerminalTheme))
          return error('name must be a known terminal theme')
        deps.setTheme(name as TerminalTheme)
        return { name, ok: true }
      },
      inputSchema: {
        additionalProperties: false,
        properties: { name: { enum: TERMINAL_THEMES, type: 'string' } },
        required: ['name'],
        type: 'object',
      },
      name: 'set_theme',
      title: 'Set terminal theme',
    }),
  ]

  if (isWebMcpShellEnabled()) {
    tools.push(
      tool({
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        description: 'Run one command in the shared terminal shell session.',
        execute: async (input) => {
          track('run_shell')
          const line = inputString(input, 'line', MAX_SHELL_LINE_LENGTH)
          if (!line) return error(`line must be a non-empty string up to ${MAX_SHELL_LINE_LENGTH} characters`)
          const execShell = deps.execShell
          if (!execShell) return error('shell is unavailable')
          const terminal = deps.handleRef?.current
          if (!terminal) return error('terminal session is not ready')

          terminal.printAgentInput(line)
          try {
            const result = await execShell(
              line,
              {
                manifest: deps.manifest,
                print: terminal.print,
                setCwd: terminal.setCwd,
                signal: ac.signal,
              },
              { timeoutMs: SHELL_TIMEOUT_MS },
            )
            return capShellOutput(result)
          } catch (err) {
            if (isShellTimeout(err)) return error('shell command timed out')
            if (isAbortError(err)) return error('shell command was cancelled')
            if (isShellUnavailable(err)) return error('shell is unavailable')
            return error('shell command failed')
          }
        },
        inputSchema: {
          additionalProperties: false,
          properties: { line: { maxLength: MAX_SHELL_LINE_LENGTH, type: 'string' } },
          required: ['line'],
          type: 'object',
        },
        name: 'run_shell',
        title: 'Run shell command',
      }),
    )
  }

  for (const registeredTool of tools) {
    modelContext.registerTool(registeredTool, opts)
  }

  return () => ac.abort()
}
