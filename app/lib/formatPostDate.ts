/** Publication dates use UTC so cards and articles agree across server and browser timezones. */
export function formatPostDate(value: string): string {
  const date = new Date(value.trim())
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { timeZone: 'UTC' })
}
