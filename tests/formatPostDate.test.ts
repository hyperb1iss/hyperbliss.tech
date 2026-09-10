import { formatPostDate } from '@/lib/formatPostDate'

it.each(['2026-07-21', '2026-07-21T00:00:00.000Z'])('keeps the publication date for %s', (value) => {
  expect(formatPostDate(value)).toBe('7/21/2026')
})

it.each([
  ['2024-02-29', '2/29/2024'],
  ['2026-12-31', '12/31/2026'],
  ['2027-01-01', '1/1/2027'],
])('keeps the publication date for calendar edge %s', (value, expected) => {
  expect(formatPostDate(value)).toBe(expected)
})

it('preserves an unparseable date without throwing', () => {
  expect(formatPostDate('Coming soon')).toBe('Coming soon')
})

it('preserves empty input without throwing', () => {
  expect(formatPostDate('')).toBe('')
})
