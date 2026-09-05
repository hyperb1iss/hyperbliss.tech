// Date and label helpers for the front page. Dates arrive as YYYY-MM-DD and are
// split by hand so a build in one timezone never shifts a day in another.

import type { FeedKind } from '@/lib/feed'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function parts(iso: string): { year: number; month: number; day: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { day: d, month: m, year: y }
}

/** "July 20, 2026" */
export function longDate(iso: string): string {
  const { year, month, day } = parts(iso)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

/** { day: "20", month: "jul 26" } for the feed's numeral column. */
export function numeralDate(iso: string): { day: string; month: string } {
  const { year, month, day } = parts(iso)
  return {
    day: String(day).padStart(2, '0'),
    month: `${MONTHS[month - 1].slice(0, 3).toLowerCase()} ${String(year).slice(2)}`,
  }
}

export const KIND_LABEL: Record<FeedKind, string> = {
  essay: 'Essay',
  lab: 'Lab',
  launch: 'Launch',
  release: 'Release',
}

export const KIND_VERB: Record<FeedKind, string> = {
  essay: 'Read the essay',
  lab: 'Open the experiment',
  launch: 'See the project',
  release: 'See the release',
}
