// The Unix staples a visitor types out of habit, answered with real numbers
// from this page and this browser instead of "command not found" (registry
// commands win over the shell). Nothing here is invented: dmesg is the page's
// own load timeline, free is the tab's heap, df is the content tree.
// Self-registers on import.

import { styled } from '../../../../styled-system/jsx'
import { registry } from '../registry'
import { text } from '../render'
import StatusBoard from '../StatusBoard'
import { Accent, Muted } from './ui'

const Pre = styled.pre`
  margin: 0;
  /* Opt out of the global boxed code block: this is plain console output. */
  font-size: inherit;
  line-height: inherit;
  background: none;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  font-family: var(--font-mono);
  white-space: pre;
  overflow-x: auto;
  color: var(--term-ink);
  padding: var(--space-1) 0;
`

const pad2 = (n: number) => n.toString().padStart(2, '0')
const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? '' : 's'}`

/** How long this page has been open, as uptime prints it. */
function sessionAge(): string {
  const mins = Math.floor((typeof performance === 'undefined' ? 0 : performance.now()) / 60000)
  if (mins < 1) return 'less than a minute'
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}:${pad2(mins % 60)}`
}

registry.register({
  group: 'fun',
  name: 'uptime',
  run: (_args, ctx) => {
    const now = new Date()
    const b = ctx.broadcast
    return text(
      ` ${pad2(now.getHours())}:${pad2(now.getMinutes())} up ${sessionAge()},  1 guest,  ${count(b.projectCount, 'project')}, ${count(b.postCount, 'essay')}, ${count(b.labCount, 'experiment')}`,
    )
  },
  summary: 'how long you have been here, and what is on the box',
})

registry.register({
  aliases: ['top', 'htop'],
  group: 'fun',
  name: 'ps',
  run: (_args, ctx) => {
    // The real projects, listed as if each were running here.
    const projects = ctx.manifest.entries.filter((e) => e.kind === 'project').slice(0, 8)
    const rows = [
      ['1', '?', 'init'],
      ...projects.map((p, i) => [String(42 + i * 61), 'tty1', p.path.replace(/^.*\//, '').replace(/\.md$/, '')]),
      [String(42 + projects.length * 61), 'pts/0', 'ps'],
    ]
    const header = `${'PID'.padEnd(6)} ${'TTY'.padEnd(7)} CMD`
    return (
      <Pre>{[header, ...rows.map(([pid, tty, cmd]) => `${pid.padEnd(6)} ${tty.padEnd(7)} ${cmd}`)].join('\n')}</Pre>
    )
  },
  summary: 'the projects, as running processes',
})

registry.register({
  group: 'fun',
  name: 'whoami',
  run: () => text('guest'),
  summary: 'who you are right now',
})

registry.register({
  group: 'fun',
  name: 'date',
  run: () => text(new Date().toString()),
  summary: 'the current date and time',
})

// ── dmesg: this page's real load timeline ────────────────────────────────────

const stamp = (ms: number) => `[${(Math.max(0, ms) / 1000).toFixed(6).padStart(11)}]`

/** The browser engine and version, read from the user agent. */
function engine(): string {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent
  const hit =
    ua.match(/(Firefox)\/([\d.]+)/) ??
    ua.match(/(Edg)\/([\d.]+)/) ??
    ua.match(/(Chrome)\/([\d.]+)/) ??
    ua.match(/Version\/([\d.]+).*(Safari)/)
  if (!hit) return 'browser'
  const [name, version] = hit[2] === 'Safari' ? [hit[2], hit[1]] : [hit[1], hit[2]]
  return `${name === 'Edg' ? 'Edge' : name}/${version.split('.')[0]}`
}

const platform = () => (typeof navigator === 'undefined' ? 'web' : navigator.platform || 'web')

registry.register({
  group: 'fun',
  name: 'dmesg',
  run: (_args, ctx) => {
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined
    const files = ctx.manifest.entries
    const bytes = files.reduce((sum, e) => sum + e.bytes, 0)
    const loaded = nav?.loadEventEnd || nav?.domContentLoadedEventEnd || 0
    const lines: Array<[number, string]> = [[0, `hyperbliss console booting on ${engine()} (${platform()})`]]
    if (nav) {
      lines.push([nav.responseStart, 'net: first byte'])
      lines.push([nav.domInteractive, 'dom: interactive'])
      if (nav.loadEventEnd) {
        const kb = nav.transferSize ? `, ${Math.round(nav.transferSize / 1024)} kB document` : ''
        lines.push([nav.loadEventEnd, `page: load complete${kb}`])
      }
    }
    lines.push([loaded, `display: ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`])
    if (navigator.hardwareConcurrency) lines.push([loaded, `cpu: ${navigator.hardwareConcurrency} logical cores`])
    if (document.fonts) lines.push([loaded, `fonts: ${document.fonts.size} faces`])
    lines.push([loaded, `vfs: mounted ${files.length} files (${Math.round(bytes / 1024)} kB) at /`])
    lines.push([loaded, `theme: ${document.documentElement.getAttribute('data-terminal-theme') ?? 'silk'}`])
    lines.push([performance.now(), 'console: you ran dmesg'])
    return <Pre>{lines.map(([ms, line]) => `${stamp(ms)} ${line}`).join('\n')}</Pre>
  },
  summary: "this page's real boot log",
})

// ── free: the tab's JavaScript heap ─────────────────────────────────────────

interface HeapInfo {
  jsHeapSizeLimit: number
  usedJSHeapSize: number
}

registry.register({
  group: 'fun',
  name: 'free',
  run: () => {
    const heap = (performance as Performance & { memory?: HeapInfo }).memory
    const device = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
    if (!heap) {
      return text(
        device
          ? `this browser keeps its heap private; the device reports about ${device} GB of memory`
          : 'this browser keeps its memory numbers private',
      )
    }
    const mb = (n: number) => String(Math.round(n / 1048576)).padStart(8)
    const rows = [
      `${''.padEnd(7)}${'total'.padStart(8)}${'used'.padStart(8)}${'free'.padStart(8)}`,
      `${'Heap:'.padEnd(7)}${mb(heap.jsHeapSizeLimit)}${mb(heap.usedJSHeapSize)}${mb(heap.jsHeapSizeLimit - heap.usedJSHeapSize)}`,
    ]
    if (device) rows.push(`${'Device:'.padEnd(7)}${String(device * 1024).padStart(8)}`)
    return <Pre>{`${rows.join('\n')}\n(MB, this tab's JavaScript heap)`}</Pre>
  },
  summary: "this tab's memory",
})

// ── df: the content tree ────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'df',
  run: (_args, ctx) => {
    const mounts = new Map<string, { bytes: number; files: number }>()
    for (const e of ctx.manifest.entries) {
      const dir = e.path.split('/').length > 2 ? `/${e.path.split('/')[1]}` : '/'
      const m = mounts.get(dir) ?? { bytes: 0, files: 0 }
      m.bytes += e.bytes
      m.files += 1
      mounts.set(dir, m)
    }
    const kb = (n: number) => `${(n / 1024).toFixed(1)}K`.padStart(9)
    const rows = [...mounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dir, m]) => `${'content'.padEnd(11)}${kb(m.bytes)}${String(m.files).padStart(7)}  ${dir}`)
    return (
      <Pre>
        {[`${'Filesystem'.padEnd(11)}${'Size'.padStart(9)}${'Files'.padStart(7)}  Mounted on`, ...rows].join('\n')}
      </Pre>
    )
  },
  summary: 'how big the content tree is',
})

// ── uname ───────────────────────────────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'uname',
  run: (_args, ctx) => text(`Hyperbliss console ${ctx.broadcast.generatedAt.slice(0, 10)} ${engine()} ${platform()}`),
  summary: 'what this console is running on',
})

// ── cal: this month, today marked ───────────────────────────────────────────

registry.register({
  group: 'fun',
  name: 'cal',
  run: () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const title = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const first = new Date(year, month, 1).getDay()
    const days = new Date(year, month + 1, 0).getDate()
    const cells: Array<number | null> = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
    const weeks: Array<Array<number | null>> = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
    return (
      <Pre>
        {`${title.padStart(Math.floor((20 + title.length) / 2))}\n`}
        <Muted>{'Su Mo Tu We Th Fr Sa\n'}</Muted>
        {weeks.map((week) => (
          <span key={`week-${week.find((d) => d !== null)}`}>
            {week.map((day, i) => {
              const cell = day === null ? '  ' : String(day).padStart(2)
              const gap = i < week.length - 1 ? ' ' : ''
              return day === now.getDate() ? (
                <span key="today">
                  <Accent>{cell}</Accent>
                  {gap}
                </span>
              ) : (
                cell + gap
              )
            })}
            {'\n'}
          </span>
        ))}
      </Pre>
    )
  },
  summary: 'this month, with today lit',
})

// ── reboot / exit ───────────────────────────────────────────────────────────

registry.register({
  aliases: ['restart'],
  group: 'fun',
  name: 'reboot',
  run: (_args, ctx) => {
    ctx.clear()
    return <StatusBoard />
  },
  summary: 'clear the screen and light the sign again',
})

registry.register({
  aliases: ['quit', 'logout'],
  group: 'fun',
  name: 'exit',
  run: () => {
    // The console closes on Escape; exit presses it.
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
  },
  summary: 'close the console',
})
