// Unicode bar sparkline, auto-scaled to the series max so the tallest value
// always reaches the top bar. Shared by the status console and the `gh` command.

const BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const

export function sparkline(values: readonly number[]): string {
  if (values.length === 0) return ''
  const max = Math.max(...values, 0)
  if (max <= 0) return BARS[0].repeat(values.length)
  const top = BARS.length - 1
  return values.map((v) => BARS[Math.max(0, Math.min(top, Math.round((v / max) * top)))]).join('')
}
