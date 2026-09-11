import { formatPostDate } from '@/lib/formatPostDate'

it.each(['2026-07-21', '2026-07-21T00:00:00.000Z'])('keeps the publication date for %s', (value) => {
  expect(formatPostDate(value)).toBe('7/21/2026')
})

it.each([
  ['2027-12-31', '12/31/2027'],
  ['2028-01-01', '1/1/2028'],
])('keeps the publication date at the year boundary for %s', (value, expected) => {
  expect(formatPostDate(value)).toBe(expected)
})

it('preserves an unparseable date without throwing', () => {
  expect(formatPostDate('Coming soon')).toBe('Coming soon')
})
